import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# =====================================================================
# 1. KONFIGURASI VARIABEL LINGKUNGAN (ENVIRONMENT)
# =====================================================================
# Memuat variabel rahasia dari file .env (seperti password dan URL database)
load_dotenv(override=True)

DATABASE_URL = os.getenv("DATABASE_URL")

# Safeguard: Memastikan aplikasi tidak berjalan jika URL database kosong
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL tidak ditemukan! Pastikan file .env sudah terisi dengan benar.")

# SAFEGUARD TAMBAHAN: Memastikan driver asynchronous (asyncpg) digunakan
# Jika di .env tertulis 'postgresql://', otomatis diubah menjadi 'postgresql+asyncpg://'
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

# =====================================================================
# 2. INISIALISASI ENGINE ASYNCHRONOUS (KHUSUS SUPABASE)
# =====================================================================
# [PERBAIKAN]: Penambahan pool_pre_ping dan statement_cache_size untuk stabilitas Cloud
engine = create_async_engine(
    DATABASE_URL, 
    echo=True, # Ubah ke False saat rilis (tahap produksi) agar terminal bersih
    pool_pre_ping=True, # Otomatis mengecek apakah koneksi ke awan (cloud) terputus sebelum melakukan kueri
    connect_args={
        "statement_cache_size": 0 # Wajib ditambahkan agar asyncpg tidak bertabrakan dengan Supabase Pooler
    }
)

# =====================================================================
# 3. PEMBUATAN PABRIK SESI (SESSION FACTORY) & BASE MODEL
# =====================================================================
# Menonaktifkan expire_on_commit agar objek tetap bisa diakses setelah sesi ditutup (sangat penting di arsitektur Async)
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Kelas dasar yang akan diwarisi oleh semua model tabel di models.py
Base = declarative_base()

# =====================================================================
# 4. DEPENDENCY INJECTION UNTUK FASTAPI
# =====================================================================
async def get_db():
    """
    Fungsi generator (dependency) untuk menyediakan sesi database ke setiap request API.
    Penggunaan blok 'async with' memastikan sesi (koneksi) akan selalu ditutup secara 
    otomatis dan aman setelah request selesai diproses, meskipun terjadi error.
    """
    async with AsyncSessionLocal() as session:
        yield session