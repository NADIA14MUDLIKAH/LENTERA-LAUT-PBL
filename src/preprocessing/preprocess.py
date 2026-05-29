# src/preprocessing/preprocess.py
import os
import pandas as pd
import numpy as np

def main():
    print("⚙️ Memulai proses Data Preprocessing...")
    
    # 1. Baca data mentah
    raw_path = os.path.join("data", "raw", "all_locations.csv")
    if not os.path.exists(raw_path):
        print(f"❌ File {raw_path} tidak ditemukan! Jalankan fetch_openmeteo.py terlebih dahulu.")
        return
        
    df = pd.read_csv(raw_path)
    df['time'] = pd.to_datetime(df['time'])
    
    # 2. Penanganan Missing Values
    # Mengganti nilai NaN secara spesifik dengan nilai mean pada kolom numerik
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())
    
    # 3. Pembuatan Lag Features (t-1, t-2, t-3) untuk Time Series
    # Kita harus melakukan shift() berdasarkan masing-masing lokasi agar data lokasi satu tidak bercampur dengan lokasi lain
    print("🔄 Mengekstraksi Lag Features (1-3 jam sebelumnya)...")
    
    features_to_lag = [
        "wave_height", "wind_speed_10m", "precipitation", 
        "visibility", "ocean_current_velocity", "sea_surface_temperature"
    ]
    
    lagged_dfs = []
    
    for location, group in df.groupby('location'):
        group = group.sort_values('time').copy()
        
        for feature in features_to_lag:
            for lag in [1, 2, 3]:
                group[f"{feature}_lag{lag}"] = group[feature].shift(lag)
                
        lagged_dfs.append(group)
        
    # Gabungkan kembali data yang sudah memiliki lag features
    final_df = pd.concat(lagged_dfs, ignore_index=True)
    
    # Hapus baris awal (3 jam pertama per lokasi) yang memiliki nilai NaN karena pergeseran lag
    final_df = final_df.dropna().reset_index(drop=True)
    
    # 4. Simpan ke direktori processed
    processed_dir = os.path.join("data", "processed")
    os.makedirs(processed_dir, exist_ok=True)
    processed_path = os.path.join(processed_dir, "final_dataset.csv")
    
    final_df.to_csv(processed_path, index=False)
    
    print(f"✅ Preprocessing Selesai! Data siap dimodelkan tersimpan di: {processed_path}")
    print(f"📊 Total baris data siap pakai: {len(final_df)}")

if __name__ == "__main__":
    main()