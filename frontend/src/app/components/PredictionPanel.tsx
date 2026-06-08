"use client";

import { useState } from "react";
import { fetchPrediction } from "../services/api"; // Sesuaikan path jika berbeda
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function PredictionPanel() {
  const [location, setLocation] = useState("");
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setIsLoading(true);
    setError("");
    setPredictionData(null);

    try {
      const data = await fetchPrediction(location);
      setPredictionData(data);
    } catch (err) {
      setError("Gagal mengambil data prediksi. Pastikan server API (FastAPI) berjalan di background.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Form Pencarian */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sistem Pendukung Keputusan Nelayan</CardTitle>
          <CardDescription>Masukkan nama lokasi untuk melihat prediksi kondisi laut.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input 
              type="text" 
              placeholder="Contoh: Grajagan, Sendang Biru..." 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Mencari..." : "Cek Prediksi"}
            </Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </CardContent>
      </Card>

      {/* Menampilkan Hasil Prediksi */}
      {predictionData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Lokasi: {predictionData.location.name}</span>
              <Badge variant={predictionData.prediction.warning_status.status === "Aman" ? "default" : "destructive"}>
                {predictionData.prediction.warning_status.status}
              </Badge>
            </CardTitle>
            <CardDescription className="text-md font-medium text-slate-700">
              {predictionData.prediction.warning_status.deskripsi}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border">
                <span className="text-slate-500 block">Tinggi Gelombang</span>
                <strong className="text-lg">
                  {predictionData.prediction.wave_height.value} {predictionData.prediction.wave_height.satuan}
                </strong>
                <span className="block text-xs text-slate-400">({predictionData.prediction.wave_height.kategori})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <span className="text-slate-500 block">Kecepatan Angin</span>
                <strong className="text-lg">
                  {predictionData.prediction.wind_speed_10m.value} {predictionData.prediction.wind_speed_10m.satuan}
                </strong>
                <span className="block text-xs text-slate-400">({predictionData.prediction.wind_speed_10m.kategori})</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <span className="text-slate-500 block">Suhu Permukaan Laut</span>
                <strong className="text-lg">
                  {predictionData.prediction.sea_surface_temperature.value} {predictionData.prediction.sea_surface_temperature.satuan}
                </strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border">
                <span className="text-slate-500 block">Visibilitas</span>
                <strong className="text-lg">
                  {predictionData.prediction.visibility.value} {predictionData.prediction.visibility.satuan}
                </strong>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}