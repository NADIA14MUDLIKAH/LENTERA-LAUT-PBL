# =====================================================================
# 1. WORKAROUND WINDOWS APPLOCKER & ML DEADLOCK FIX
# =====================================================================
import os
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import sklearn
import sklearn.tree
import sklearn.ensemble
import lightgbm
import xgboost
import joblib

# =====================================================================
# 2. STANDARD LIBRARY & THIRD-PARTY IMPORTS
# =====================================================================
import pandas as pd
import numpy as np
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler # <-- Import Scheduler

# =====================================================================
# 3. LOCAL MODULE IMPORTS
# =====================================================================
from database import engine, Base, get_db, AsyncSessionLocal
from crud import (
    fetch_data,
    get_or_create_location,
    get_all_locations,
    get_location_by_name,
    save_marine_weather,
    get_marine_weather,
    save_prediction,
    get_prediction_history,
    get_prediction_by_id,
)
from inference import generate_forecast, load_all_models, hitung_risiko_gelombang
from schemas import (
    LocationOut, 
    MarineWeatherOut, 
    PredictResponse, 
    HistoryResponse, 
    PredictionOut
)

# =====================================================================
# 4. SEED DATA (MASTER LOKASI NELAYAN JAWA TIMUR)
# =====================================================================
LOCATIONS_SEED = [
    {"name": "Pacitan",        "lat": -8.20, "lon": 111.10},
    {"name": "Prigi",          "lat": -8.29, "lon": 111.74},
    {"name": "Popoh",          "lat": -8.17, "lon": 111.89},
    {"name": "Sendang Biru",   "lat": -8.43, "lon": 112.69},
    {"name": "Puger",          "lat": -8.38, "lon": 113.47},
    {"name": "Pancer",         "lat": -8.63, "lon": 114.02},
    {"name": "Muncar",         "lat": -8.44, "lon": 114.33},
    {"name": "Grajagan",       "lat": -8.66, "lon": 114.23},
    {"name": "Watu Ulo",       "lat": -8.45, "lon": 113.72},
    {"name": "Blitar Selatan", "lat": -8.33, "lon": 112.19},
    {"name": "Tuban",          "lat": -6.90, "lon": 112.05},
    {"name": "Brondong",       "lat": -6.89, "lon": 112.27},
    {"name": "Paciran",        "lat": -6.87, "lon": 112.34},
    {"name": "Gresik",         "lat": -7.15, "lon": 112.65},
    {"name": "Surabaya",       "lat": -7.19, "lon": 112.65},
    {"name": "Pasuruan",       "lat": -7.64, "lon": 112.91},
    {"name": "Probolinggo",    "lat": -7.74, "lon": 113.23},
    {"name": "Situbondo",      "lat": -7.70, "lon": 114.00},
    {"name": "Banyuwangi",     "lat": -8.21, "lon": 114.37},
    {"name": "Bangkalan",      "lat": -6.95, "lon": 112.73},
    {"name": "Sampang",        "lat": -7.19, "lon": 113.24},
    {"name": "Pamekasan",      "lat": -7.16, "lon": 113.48},
    {"name": "Sumenep",        "lat": -7.02, "lon": 113.86},
    {"name": "Kangean",        "lat": -6.93, "lon": 115.32},
    {"name": "Selat Madura",   "lat": -7.10, "lon": 113.00},
    {"name": "Selat Bali",     "lat": -8.17, "lon": 114.43},
]

# =====================================================================
# 5. FUNGSI BACKGROUND TASK (ETL OTOMATIS)
# =====================================================================
async def routine_weather_update():
    print("\n⏰ [SCHEDULER] Menjalankan pembaruan data cuaca satelit otomatis...")
    
    async with AsyncSessionLocal() as db:
        for loc_data in LOCATIONS_SEED:
            loc_name = loc_data["name"]
            lat = loc_data["lat"]
            lon = loc_data["lon"]
            
            loc = await get_location_by_name(db, loc_name)
            if loc:
                try:
                    df = await run_in_threadpool(fetch_data, lat, lon)
                    if not df.empty:
                        await save_marine_weather(db, loc.id_location, df)
                        print(f"✅ [SCHEDULER] Data {loc_name} berhasil diperbarui.")
                except Exception as e:
                    print(f"❌ [SCHEDULER] Gagal memperbarui {loc_name}: {e}")

# =====================================================================
# 6. MANAJEMEN SIKLUS HIDUP (LIFESPAN)
# =====================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 [SISTEM] Menginisialisasi sistem LENTERA LAUT...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        for loc in LOCATIONS_SEED:
            await get_or_create_location(db, loc["name"], loc["lat"], loc["lon"])
            
    # Menginisialisasi dan menyalakan Scheduler
    scheduler = AsyncIOScheduler()
    scheduler.add_job(routine_weather_update, 'cron', minute=0) # Berjalan setiap jam (menit ke-0)
    scheduler.start()
    print("⏳ [SISTEM] Scheduler ETL otomatis diaktifkan (berjalan setiap jam).")

    yield

    # Mematikan Scheduler dengan aman
    scheduler.shutdown()
    print("🛑 [SISTEM] Scheduler dimatikan dengan aman.")

app = FastAPI(
    title="API LENTERA LAUT",
    description="Sistem Prediksi Kondisi Laut Berbasis Time Series sebagai Informasi Pendukung Nelayan di Jawa Timur",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# =====================================================================
# 7. ROUTER & ENDPOINTS
# =====================================================================

@app.get("/", tags=["Sistem Utama"])
def root():
    return {"message": "Sistem API Lentera Laut v2.0 beroperasi normal."}

@app.get("/locations", tags=["Katalog Lokasi"], response_model=list[LocationOut])
async def list_locations(db: AsyncSession = Depends(get_db)):
    return await get_all_locations(db)

@app.get("/marine-weather", tags=["Observasi Meteorologi"], response_model=list[MarineWeatherOut])
async def marine_weather(
    location: str = Query(..., description="Nama lokasi spesifik (contoh: Sendang Biru)"),
    limit: int    = Query(50, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    loc = await get_location_by_name(db, location)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Lokasi '{location}' tidak terdaftar.")
    return await get_marine_weather(db, loc.id_location, limit)

@app.get("/predict", tags=["Sistem Inferensi (ML)"], response_model=PredictResponse)
async def predict(
    location: str = Query(..., description="Nama target lokasi prediksi"),
    db: AsyncSession = Depends(get_db)
):
    loc = await get_location_by_name(db, location)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Lokasi '{location}' tidak ditemukan.")

    df = await run_in_threadpool(fetch_data, loc.latitude, loc.longitude)
    if df.empty:
        raise HTTPException(status_code=500, detail="Kegagalan penarikan data satelit Open-Meteo.")

    await save_marine_weather(db, loc.id_location, df)

    FEATURES = [
        "wave_height", "wind_speed_10m", "precipitation",            
        "visibility", "ocean_current_velocity", "sea_surface_temperature"    
    ]
    
    df_processed = df.sort_values("time").copy()
    for feat in FEATURES:
        df_processed[f"{feat}_lag1"] = df_processed[feat].shift(1)
        df_processed[f"{feat}_lag2"] = df_processed[feat].shift(2)
        df_processed[f"{feat}_lag3"] = df_processed[feat].shift(3)

    df_processed = df_processed.ffill().bfill().fillna(0.0)
    last_row = df_processed.tail(1)
    
    lag_cols = [f"{feat}_lag{i}" for feat in FEATURES for i in (1, 2, 3)]
    X_live = last_row[lag_cols]
    
    try:
        pred_dict = generate_forecast(X_live)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sistem ML gagal mengeksekusi matriks: {e}")

    saved_pred = await save_prediction(db, loc.id_location, pred_dict)

    pred_dict["id_prediction"]   = saved_pred.id_prediction
    pred_dict["id_location"]     = loc.id_location
    pred_dict["time_prediction"] = saved_pred.time_prediction

    return {
        "location": {
            "id_location": loc.id_location,
            "name":        loc.name,
            "latitude":    loc.latitude,
            "longitude":   loc.longitude,
        },
        "prediction": pred_dict
    }

@app.get("/history", tags=["Sistem Inferensi (ML)"], response_model=HistoryResponse)
async def prediction_history(
    location: str = Query(..., description="Nama lokasi spesifik"),
    limit: int    = Query(10, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    loc = await get_location_by_name(db, location)
    if not loc:
        raise HTTPException(status_code=404, detail=f"Lokasi '{location}' tidak terdaftar.")

    history = await get_prediction_history(db, loc.id_location, limit)
    result = []
    
    for p in history:
        cat = p.categories
        result.append({
            "id_prediction":           p.id_prediction,
            "id_location":             p.id_location,
            "time_prediction":         p.time_prediction,
            "warning_status":          hitung_risiko_gelombang(p.wave_height_pred),
            "wave_height":             {"value": p.wave_height_pred,             "satuan": "meter",  "kategori": cat.wave_category if cat else None},
            "wind_speed_10m":          {"value": p.wind_speed_pred,              "satuan": "m/s",    "kategori": cat.wind_category if cat else None},
            "ocean_current_velocity":  {"value": p.ocean_current_velocity_pred,  "satuan": "m/s"},
            "sea_surface_temperature": {"value": p.sea_surface_temperature_pred, "satuan": "°C"},
            "precipitation":           {"value": p.precipitation_pred,           "satuan": "mm/jam", "kategori": cat.rain_category if cat else None},
            "visibility":              {"value": p.visibility_pred,              "satuan": "meter",  "kategori": cat.visibility_category if cat else None},
        })

    return {"location": loc.name, "history": result}

@app.get("/prediction/{id_prediction}", tags=["Sistem Inferensi (ML)"], response_model=PredictionOut)
async def prediction_detail(
    id_prediction: int,
    db: AsyncSession = Depends(get_db)
):
    pred = await get_prediction_by_id(db, id_prediction)
    if not pred:
        raise HTTPException(status_code=404, detail=f"Prediksi ID {id_prediction} tidak ditemukan pada sistem.")

    cat = pred.categories
    return {
        "id_prediction":             pred.id_prediction,
        "id_location":               pred.id_location,
        "time_prediction":           pred.time_prediction,
        "warning_status":            hitung_risiko_gelombang(pred.wave_height_pred),
        "wave_height":               {"value": pred.wave_height_pred,             "satuan": "meter",  "kategori": cat.wave_category if cat else None},
        "wind_speed_10m":            {"value": pred.wind_speed_pred,              "satuan": "m/s",    "kategori": cat.wind_category if cat else None},
        "ocean_current_velocity":    {"value": pred.ocean_current_velocity_pred,  "satuan": "m/s"},
        "sea_surface_temperature":   {"value": pred.sea_surface_temperature_pred, "satuan": "°C"},
        "precipitation":             {"value": pred.precipitation_pred,           "satuan": "mm/jam", "kategori": cat.rain_category if cat else None},
        "visibility":                {"value": pred.visibility_pred,              "satuan": "meter",  "kategori": cat.visibility_category if cat else None},
    }