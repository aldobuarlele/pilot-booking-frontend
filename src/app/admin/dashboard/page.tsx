"use client";

import { useThemeStore } from "../../../store/themeStore";

export default function DashboardPage() {
  const { companyName } = useThemeStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Selamat Datang, Komandan!</h1>
      <p className="text-gray-600 text-lg mb-10">
        Ini adalah pusat kendali untuk <strong>{companyName}</strong>. Gunakan menu di sebelah kiri untuk menyetujui pemesanan, menambah layanan, dan mengubah tema website Anda.
      </p>

      {/* Placeholder Metrics - Nanti bisa disambungkan ke API Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-blue-800 font-bold text-lg mb-2">Total Layanan Aktif</h3>
          <p className="text-5xl font-extrabold text-blue-600">--</p>
        </div>
        
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-green-800 font-bold text-lg mb-2">Booking Selesai</h3>
          <p className="text-5xl font-extrabold text-green-600">--</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-orange-800 font-bold text-lg mb-2">Butuh Persetujuan</h3>
          <p className="text-5xl font-extrabold text-orange-600">--</p>
        </div>
      </div>
    </div>
  );
}