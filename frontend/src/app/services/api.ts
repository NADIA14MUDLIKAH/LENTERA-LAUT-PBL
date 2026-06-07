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

export async function fetchHistory(locationName: string, limit: number = 5) {
  const url = `http://127.0.0.1:8000/history?location=${locationName}&limit=${limit}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error(`Gagal mengambil histori`);
    return await response.json();
  } catch (error) {
    console.error("Error pada API History:", error);
    return { history: [] }; // Kembalikan array kosong jika gagal
  }
}