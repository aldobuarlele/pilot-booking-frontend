"use client";

import { useEffect } from "react";
import { useThemeStore } from "../../../store/themeStore";
import { useAdminStore } from "../../../store/adminStore";

export default function DashboardPage() {
  const { companyName } = useThemeStore();
  const { metrics, fetchMetrics } = useAdminStore();

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Selamat Datang, Komandan!</h1>
      <p className="text-gray-600 text-lg mb-10">
        Ini adalah pusat kendali untuk <strong>{companyName}</strong>. Gunakan menu di sebelah kiri untuk menyetujui pemesanan, menambah layanan, dan mengubah tema website Anda.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-blue-800 font-bold text-lg mb-2">Total Layanan</h3>
          <p className="text-4xl font-extrabold text-blue-600">{metrics?.totalActiveServices ?? '--'}</p>
        </div>
        
        <div className="bg-green-50 border border-green-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-green-800 font-bold text-lg mb-2">Booking Selesai</h3>
          <p className="text-4xl font-extrabold text-green-600">{metrics?.totalCompletedBookings ?? '--'}</p>
        </div>
        
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-orange-800 font-bold text-lg mb-2">Perlu Persetujuan</h3>
          <p className="text-4xl font-extrabold text-orange-600">{metrics?.totalPendingApprovals ?? '--'}</p>
        </div>

        <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl transition hover:shadow-md">
          <h3 className="text-purple-800 font-bold text-lg mb-2">Tanya Dulu (Soft)</h3>
          <p className="text-4xl font-extrabold text-purple-600">{metrics?.totalSoftBookings ?? '--'}</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl transition hover:shadow-md">
        <h3 className="text-emerald-800 font-bold text-xl mb-2">Total Pendapatan (Revenue)</h3>
        <p className="text-5xl font-extrabold text-emerald-600">
          {metrics?.totalRevenue !== undefined 
            ? `Rp ${metrics.totalRevenue.toLocaleString('id-ID')}` 
            : '--'}
        </p>
      </div>

    </div>
  );
}