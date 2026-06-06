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