import pandas as pd
import requests
import numpy as np

from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from .models import Location, MarineWeather, Prediction, Category

# =====================================================================
# 1. FETCH DATA OPEN-METEO
# =====================================================================
def fetch_data(lat: float, lon: float) -> pd.DataFrame:
    try:
        marine = requests.get(
            "https://marine-api.open-meteo.com/v1/marine",
            params={
                "latitude": lat,
                "longitude": lon,
                "hourly": "wave_height,ocean_current_velocity,sea_surface_temperature",
                "timezone": "Asia/Jakarta"
            },
            timeout=10
        ).json()

        weather = requests.get(
            "https://api.open-meteo.com/v1/forecast",
            params={
                "latitude": lat,
                "longitude": lon,
                "hourly": "wind_speed_10m,precipitation,visibility",
                "timezone": "Asia/Jakarta"
            },
            timeout=10
        ).json()

        if "hourly" not in marine or "hourly" not in weather:
            raise ValueError("API response tidak valid dari Open-Meteo")

        df_marine = pd.DataFrame(marine["hourly"])
        df_weather = pd.DataFrame(weather["hourly"])

        df = pd.merge(df_marine, df_weather, on="time", how="inner")
        
        # [JURUS PAMUNGKAS 1]: Ubah ke datetime lalu LUCUTI SEMUA zona waktu secara paksa
        df["time"] = pd.to_datetime(df["time"]).dt.tz_localize(None)
        
        if "visibility" not in df.columns:
            df["visibility"] = 10000.0

        df = df.replace({np.nan: None})
        return df

    except Exception as e:
        print(f"[ERROR] FETCH DATA API: {e}")
        return pd.DataFrame()


# =====================================================================
# 2. CRUD: LOKASI NELAYAN
# =====================================================================
async def get_or_create_location(db: AsyncSession, name: str, lat: float, lon: float):
    result = await db.execute(select(Location).where(Location.name == name))
    loc = result.scalar_one_or_none()

    if not loc:
        loc = Location(name=name, latitude=lat, longitude=lon)
        db.add(loc)
        await db.commit()
        await db.refresh(loc)

    return loc

async def get_all_locations(db: AsyncSession):
    result = await db.execute(select(Location).order_by(Location.name))
    return result.scalars().all()

async def get_location_by_name(db: AsyncSession, name: str):
    result = await db.execute(select(Location).where(Location.name == name))
    return result.scalar_one_or_none()


# =====================================================================
# 3. CRUD: DATA CUACA MENTAH (MARINE WEATHER)
# =====================================================================
async def save_marine_weather(db: AsyncSession, id_location: int, df: pd.DataFrame):
    if df.empty:
        return

    records = []
    for _, row in df.iterrows():
        if pd.isna(row["time"]):
            continue
            
        # [JURUS PAMUNGKAS 2]: Pastikan objek Python benar-benar buta zona waktu
        raw_time = pd.to_datetime(row["time"]).to_pydatetime()
        time_val = raw_time.replace(tzinfo=None) 
            
        records.append({
            "id_location": id_location,
            "time": time_val, 
            "wave_height": float(row["wave_height"]) if pd.notna(row.get("wave_height")) else None,
            "wind_speed_10m": float(row["wind_speed_10m"]) if pd.notna(row.get("wind_speed_10m")) else None,
            "precipitation": float(row["precipitation"]) if pd.notna(row.get("precipitation")) else None,
            "visibility": float(row["visibility"]) if pd.notna(row.get("visibility")) else None,
            "ocean_current_velocity": float(row["ocean_current_velocity"]) if pd.notna(row.get("ocean_current_velocity")) else None,
            "sea_surface_temperature": float(row["sea_surface_temperature"]) if pd.notna(row.get("sea_surface_temperature")) else None,
        })

    if not records:
        return

    # [PERBAIKAN EXECUTE BULK]: Menghapus .values(records) dari insert() 
    stmt = insert(MarineWeather)
    stmt = stmt.on_conflict_do_nothing(
        index_elements=['id_location', 'time']
    )

    # Mengeksekusi secara batch dengan memasukkan records sebagai argumen kedua
    await db.execute(stmt, records)
    await db.commit()

async def get_marine_weather(db: AsyncSession, id_location: int, limit: int = 50):
    # [PERBAIKAN]: Menyegel waktu agar tidak menarik data masa depan
    waktu_saat_ini = datetime.now()
    
    result = await db.execute(
        select(MarineWeather)
        .where(
            MarineWeather.id_location == id_location,
            MarineWeather.time <= waktu_saat_ini # <-- Segel Waktu
        )
        .order_by(desc(MarineWeather.time))
        .limit(limit)
    )
    return result.scalars().all()


# =====================================================================
# 4. CRUD: HASIL PREDIKSI MACHINE LEARNING
# =====================================================================
async def save_prediction(db: AsyncSession, id_location: int, pred_results: dict):
    
    # [JURUS PAMUNGKAS 3]: Pastikan waktu sekarang juga dilucuti zona waktunya
    waktu_masa_depan = (datetime.now() + timedelta(hours=1)).replace(tzinfo=None)

    prediction = Prediction(
        id_location=id_location,
        time_prediction=waktu_masa_depan, 
        wave_height_pred=pred_results["wave_height"]["value"],
        wind_speed_pred=pred_results["wind_speed_10m"]["value"],
        ocean_current_velocity_pred=pred_results["ocean_current_velocity"]["value"],
        sea_surface_temperature_pred=pred_results["sea_surface_temperature"]["value"],
        precipitation_pred=pred_results["precipitation"]["value"],
        visibility_pred=pred_results["visibility"]["value"],
    )

    db.add(prediction)
    await db.flush() 

    category = Category(
        id_prediction=prediction.id_prediction,
        wave_category=pred_results["wave_height"].get("kategori"),
        wind_category=pred_results["wind_speed_10m"].get("kategori"),
        rain_category=pred_results["precipitation"].get("kategori"),
        visibility_category=pred_results["visibility"].get("kategori"),
        warning_status = pred_results["warning_status"]["status"]
    )

    db.add(category)
    await db.commit()
    await db.refresh(prediction)

    return prediction

async def get_prediction_history(db: AsyncSession, id_location: int, limit: int = 10):
    # [PERBAIKAN]: Menyegel waktu prediksi agar tidak menarik riwayat masa depan
    waktu_saat_ini = datetime.now()
    
    result = await db.execute(
        select(Prediction)
        .where(
            Prediction.id_location == id_location,
            Prediction.time_prediction <= waktu_saat_ini # <-- Segel Waktu
        )
        .order_by(desc(Prediction.time_prediction))
        .options(selectinload(Prediction.categories)) 
        .limit(limit)
    )
    return result.scalars().all()

async def get_prediction_by_id(db: AsyncSession, id_prediction: int):
    result = await db.execute(
        select(Prediction)
        .where(Prediction.id_prediction == id_prediction)
        .options(selectinload(Prediction.categories))
    )
    return result.scalar_one_or_none()