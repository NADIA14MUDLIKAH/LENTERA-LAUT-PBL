import os
import joblib
import numpy as np
import pandas as pd
import warnings
import gc

# =====================================================================
# 1. KONFIGURASI KEAMANAN INFRASTRUKTUR
# =====================================================================
warnings.filterwarnings("ignore", category=UserWarning)

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["LOKY_MAX_CPU_COUNT"] = "1"

# =====================================================================
# 2. ATURAN AMBANG BATAS KATEGORISASI & RISIKO (DECISION RULES)
# =====================================================================
def kategori_gelombang(w: float) -> str:
    if w < 0.5:    return "Tenang"
    elif w < 1.25: return "Rendah"
    elif w < 2.5:  return "Sedang"
    elif w < 4.0:  return "Tinggi"
    elif w < 6.0:  return "Sangat Tinggi"
    else:          return "Ekstrem"

def hitung_risiko_gelombang(w: float) -> str:
    """
    Sistem Peringatan Dini Risiko Keselamatan Pelayaran Berdasarkan Jurnal & Standar WMO.
    - < 1.5 meter  : Aman bagi nelayan tradisional.
    - 1.5 - 1.9 m  : Waspada (Retika dkk.: Rentan bagi kapal kecil/pesisir).
    - >= 2.0 meter : Bahaya (WMO: Ancaman universal / Suwardjo dkk.: Kapal terbalik 45.59%).
    """
    if w < 1.5:
        return "Aman"
    elif w < 2.0:
        return "Waspada (Rentan Kapal Kecil/Pesisir)"
    else:
        return "Bahaya (Universal: Risiko Kapal Terbalik 45.59%)"

def kategori_angin(ws: float) -> str:
    if ws < 0.3:    return "Calm"
    elif ws < 1.6:  return "Light Air"
    elif ws < 3.4:  return "Light Breeze"
    elif ws < 5.5:  return "Gentle Breeze"
    elif ws < 8.0:  return "Moderate Breeze"
    elif ws < 10.8: return "Fresh Breeze"
    elif ws < 13.9: return "Strong Breeze"
    elif ws < 17.2: return "Near Gale"
    elif ws < 20.8: return "Gale"
    elif ws < 24.5: return "Strong Gale"
    elif ws < 28.5: return "Storm"
    elif ws < 32.7: return "Violent Storm"
    else:           return "Hurricane"

def kategori_hujan(p: float) -> str:
    if p < 0.1:    return "Tidak Hujan"
    elif p < 1.0:  return "Very Light"
    elif p < 5.0:  return "Light"
    elif p < 10.0: return "Moderate"
    elif p < 20.0: return "Heavy"
    else:          return "Extreme (Violent Rain)"

def kategori_visibility(v: float) -> str:
    score = min(100, (v / 24140) * 100)
    if score >= 90:   return "Excellent"
    elif score >= 70: return "Good"
    elif score >= 50: return "Fair"
    else:             return "Poor"

# =====================================================================
# 3. MANAJEMEN MODEL & LOGIKA INFERENSI
# =====================================================================
LOADED_MODELS = {}
TARGETS = ["wave_height", "wind_speed_10m", "ocean_current_velocity", "sea_surface_temperature", "precipitation", "visibility"]

def load_all_models():
    if LOADED_MODELS:
        return 

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    models_dir = os.path.join(base_dir, "models", "production_models")
    
    for target in TARGETS:
        model_path = os.path.join(models_dir, f"production_{target}.pkl")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model {target} tidak ditemukan di: {model_path}")
            
        LOADED_MODELS[target] = joblib.load(model_path)

def generate_forecast(X_live: pd.DataFrame) -> dict:
    global LOADED_MODELS
    
    LOADED_MODELS = {} 
    load_all_models()
    
    results = {}
    X_live_np = X_live.to_numpy() 
    
    for target in TARGETS:
        model = LOADED_MODELS[target]
        if hasattr(model, 'n_jobs'): 
            model.n_jobs = 1
        
        pred_val = float(model.predict(X_live_np)[0])
        
        if target in ["precipitation", "wave_height", "wind_speed_10m", "visibility"] and pred_val < 0:
            pred_val = 0.0
            
        results[target] = pred_val

    LOADED_MODELS.clear()
    gc.collect() 
    
    return {
        "warning_status": hitung_risiko_gelombang(results["wave_height"]),  # <--- Sudah disinkronkan
        "wave_height": {
            "value": round(results["wave_height"], 2),             
            "satuan": "meter",  
            "kategori": kategori_gelombang(results["wave_height"])
        },
        "wind_speed_10m": {
            "value": round(results["wind_speed_10m"], 2),          
            "satuan": "m/s",    
            "kategori": kategori_angin(results["wind_speed_10m"])
        },
        "ocean_current_velocity": {
            "value": round(results["ocean_current_velocity"], 2),  
            "satuan": "m/s"
        },
        "sea_surface_temperature": {
            "value": round(results["sea_surface_temperature"], 2), 
            "satuan": "°C"
        },
        "precipitation": {
            "value": round(results["precipitation"], 2),           
            "satuan": "mm/jam", 
            "kategori": kategori_hujan(results["precipitation"])
        },
        "visibility": {
            "value": round(results["visibility"], 0),              
            "satuan": "meter",  
            "kategori": kategori_visibility(results["visibility"])
        }
    }