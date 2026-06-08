FROM node:20-alpine
# 1. Tentukan folder kerja utama
WORKDIR /app

# 2. Salin file konfigurasi paket terlebih dahulu (untuk caching layer yang lebih cepat)
COPY package*.json ./

# 3. Instal dependensi langsung di WORKDIR (/app)
# Karena context build-nya sudah di folder frontend, isi folder frontend sekarang ada di /app
RUN npm install

# 4. Salin sisa file proyekmu ke dalam /app
COPY . .

# 5. Ekspos port Vite
EXPOSE 5173

# 6. Jalankan Vite (tidak perlu pindah folder lagi)
CMD ["npx", "vite", "--host"]