// src/app/services/api.ts

export async function fetchPrediction(locationName: string) {
  const url = `http://127.0.0.1:8000/predict?location=${locationName}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Error pada API:", error);
    throw error;
  }
}

// Tambahkan di dalam src/app/services/api.ts

export async function fetchLocations() {
  const url = `http://127.0.0.1:8000/locations`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data lokasi. Status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Mengembalikan array of objects lokasi
  } catch (error) {
    console.error("Error pada API Locations:", error);
    return []; // Kembalikan array kosong jika gagal agar map tidak crash
  }
}

// Tambahkan fungsi ini di bawah fetchLocations

export async function fetchHistory(locationName: string, limit: number = 5) {
  // Menggunakan endpoint /marine-weather sesuai dengan Swagger UI kamu
  const url = `http://127.0.0.1:8000/marine-weather?location=${locationName}&limit=${limit}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data history. Status: ${response.status}`);
    }

    const data = await response.json();
    // Karena API aslimu sepertinya mengembalikan array langsung (berdasarkan Swagger), 
    // kita bungkus ke dalam object { history: data } agar cocok dengan App.tsx
    return { history: data }; 
  } catch (error) {
    console.error("Error pada API History:", error);
    // Kembalikan struktur default jika gagal agar aplikasi tidak crash
    return { history: [] }; 
  }
}
