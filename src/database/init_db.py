# src/database/init_db.py
import os
import pandas as pd
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

def main():
    print("⚙️ Memulai sinkronisasi data ke PostgreSQL...")
    
    # Ubah baris ini:
    load_dotenv(override=True) 
    
    db_url = os.getenv("SYNC_DATABASE_URL")
    engine = create_engine(db_url)
    
    # 1. BACA DATA RAW
    raw_path = os.path.join("data", "raw", "all_locations.csv")
    if not os.path.exists(raw_path):
        print("❌ File all_locations.csv tidak ditemukan!")
        return
        
    df = pd.read_csv(raw_path)
    df['time'] = pd.to_datetime(df['time'])
    
    print(f"📥 Membaca {len(df)} baris data mentah...")

    # Data Master Lokasi LENTERA LAUT beserta Koordinatnya
    locations_data = [
        {"name": "Pacitan", "lat": -8.20, "lon": 111.10},
        {"name": "Prigi", "lat": -8.29, "lon": 111.74},
        {"name": "Popoh", "lat": -8.17, "lon": 111.89},
        {"name": "Sendang Biru", "lat": -8.43, "lon": 112.69},
        {"name": "Puger", "lat": -8.38, "lon": 113.47},
        {"name": "Pancer", "lat": -8.63, "lon": 114.02},
        {"name": "Muncar", "lat": -8.44, "lon": 114.33},
        {"name": "Grajagan", "lat": -8.66, "lon": 114.23},
        {"name": "Watu Ulo", "lat": -8.45, "lon": 113.72},
        {"name": "Blitar Selatan", "lat": -8.33, "lon": 112.19},
        {"name": "Tuban", "lat": -6.90, "lon": 112.05},
        {"name": "Brondong", "lat": -6.89, "lon": 112.27},
        {"name": "Paciran", "lat": -6.87, "lon": 112.34},
        {"name": "Gresik", "lat": -7.15, "lon": 112.65},
        {"name": "Surabaya", "lat": -7.19, "lon": 112.65},
        {"name": "Pasuruan", "lat": -7.64, "lon": 112.91},
        {"name": "Probolinggo", "lat": -7.74, "lon": 113.23},
        {"name": "Situbondo", "lat": -7.70, "lon": 114.00},
        {"name": "Banyuwangi", "lat": -8.21, "lon": 114.37},
        {"name": "Bangkalan", "lat": -6.95, "lon": 112.73},
        {"name": "Sampang", "lat": -7.19, "lon": 113.24},
        {"name": "Pamekasan", "lat": -7.16, "lon": 113.48},
        {"name": "Sumenep", "lat": -7.02, "lon": 113.86},
        {"name": "Kangean", "lat": -6.93, "lon": 115.32},
        {"name": "Selat Madura", "lat": -7.10, "lon": 113.00},
        {"name": "Selat Bali", "lat": -8.17, "lon": 114.43},
    ]

    try:
        with engine.connect() as conn:
            print("🛠️ Memperbarui skema tabel 'locations' dan 'marine_weather'...")
            
            # Hapus kedua tabel untuk mencegah konflik skema (CASCADE menghapus relasi)
            conn.execute(text("DROP TABLE IF EXISTS marine_weather CASCADE;"))
            conn.execute(text("DROP TABLE IF EXISTS locations CASCADE;"))
            
            # 2. BUAT TABEL LOCATIONS BARU (Lengkap dengan Titik Koordinat)
            conn.execute(text("""
                CREATE TABLE locations (
                    id_location SERIAL PRIMARY KEY,
                    name VARCHAR(255) UNIQUE NOT NULL,
                    latitude FLOAT NOT NULL,
                    longitude FLOAT NOT NULL
                );
            """))
            
            # Masukkan 26 lokasi beserta koordinatnya
            for loc in locations_data:
                conn.execute(
                    text("INSERT INTO locations (name, latitude, longitude) VALUES (:name, :lat, :lon)"),
                    {"name": loc["name"], "lat": loc["lat"], "lon": loc["lon"]}
                )
            conn.commit()
            
            # Ambil pemetaan id_location dari database
            loc_db = pd.read_sql("SELECT id_location, name FROM locations", conn)
            loc_map = dict(zip(loc_db['name'], loc_db['id_location']))
            
            # Ubah string location di dataframe menjadi integer id_location
            df['id_location'] = df['location'].map(loc_map)
            
            # 3. BUAT TABEL MARINE_WEATHER BARU (Sesuai kodemu)
            conn.execute(text("""
                CREATE TABLE marine_weather (
                    id_data SERIAL PRIMARY KEY,
                    id_location INT NOT NULL,
                    time TIMESTAMP NOT NULL,
                    wave_height FLOAT,
                    wind_speed_10m FLOAT,
                    ocean_current_velocity FLOAT,
                    sea_surface_temperature FLOAT,
                    precipitation FLOAT,
                    visibility FLOAT,
                    created_at TIMESTAMP DEFAULT NOW(),
                    FOREIGN KEY (id_location) REFERENCES locations(id_location)
                );
            """))
            conn.commit()

            # Filter kolom dataframe agar pas dengan tabel database
            cols_to_keep = [
                'id_location', 'time', 'wave_height', 'wind_speed_10m', 
                'ocean_current_velocity', 'sea_surface_temperature', 
                'precipitation', 'visibility'
            ]
            df = df[cols_to_keep]
            
            # 4. UNGGAH KE DATABASE
            print("🚀 Mengunggah data ke tabel 'marine_weather'... (Tunggu sebentar ya!)")
            df.to_sql('marine_weather', engine, if_exists='append', index=False)
            
            print("✅ SUKSES! Seluruh data historis masuk dengan rapi ke skema buatanmu.")
            
    except Exception as e:
        print(f"❌ Gagal mengunggah ke database. Detail error: {e}")

if __name__ == "__main__":
    main()