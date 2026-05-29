from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base

# =====================================================================
# 1. TABEL MASTER LOKASI
# =====================================================================
class Location(Base):
    __tablename__ = "locations" 

    id_location = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name        = Column(String(100), nullable=False, unique=True)
    latitude    = Column(Float, nullable=False)
    longitude   = Column(Float, nullable=False)

    marine_data = relationship("MarineWeather", back_populates="location", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="location", cascade="all, delete-orphan")

# =====================================================================
# 2. TABEL DATA CUACA MENTAH
# =====================================================================
class MarineWeather(Base):
    __tablename__ = "marine_weather" 

    id_data                 = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_location             = Column(Integer, ForeignKey("locations.id_location", ondelete="CASCADE"), nullable=False)
    time                    = Column(DateTime, nullable=False) 

    wave_height             = Column(Float, nullable=True)
    wind_speed_10m          = Column(Float, nullable=True)
    precipitation           = Column(Float, nullable=True)
    visibility              = Column(Float, nullable=True)
    ocean_current_velocity  = Column(Float, nullable=True)
    sea_surface_temperature = Column(Float, nullable=True)

    location = relationship("Location", back_populates="marine_data")

    __table_args__ = (
        UniqueConstraint("id_location", "time", name="uq_location_time"),
    )

# =====================================================================
# 3. TABEL HASIL PREDIKSI
# =====================================================================
class Prediction(Base):
    __tablename__ = "predictions" 

    id_prediction                = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_location                  = Column(Integer, ForeignKey("locations.id_location", ondelete="CASCADE"), nullable=False)
    
    # [PERBAIKAN]: Menyambungkan variabel "time_prediction" ke kolom fisik "prediction_time"
    time_prediction              = Column("prediction_time", DateTime, server_default=func.now()) 

    wave_height_pred             = Column(Float, nullable=True)
    wind_speed_pred              = Column(Float, nullable=True)
    precipitation_pred           = Column(Float, nullable=True)
    visibility_pred              = Column(Float, nullable=True)
    ocean_current_velocity_pred  = Column(Float, nullable=True)
    sea_surface_temperature_pred = Column(Float, nullable=True)

    location   = relationship("Location", back_populates="predictions")
    categories = relationship("Category", back_populates="prediction", cascade="all, delete-orphan", uselist=False)

# =====================================================================
# 4. TABEL KATEGORI
# =====================================================================
class Category(Base):
    __tablename__ = "categories" 

    id_category   = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_prediction = Column(Integer, ForeignKey("predictions.id_prediction", ondelete="CASCADE"), nullable=False, unique=True)

    wave_category       = Column(String(50), nullable=True) 
    wind_category       = Column(String(50), nullable=True) 
    rain_category       = Column(String(50), nullable=True) 
    visibility_category = Column(String(50), nullable=True) 

    prediction = relationship("Prediction", back_populates="categories")