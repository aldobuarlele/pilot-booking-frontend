"use client";

import { useEffect } from "react";
import { useAdminStore } from "../../../../store/adminStore";

export default function BookingsPage() {
  const { bookings, fetchBookings, updateBookingStatus } = useAdminStore();

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleStatusChange = async (id: string, status: string) => {
    if (confirm(`Ubah status menjadi ${status}?`)) {
      await updateBookingStatus(id, status);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 overflow-x-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Manajemen Booking</h2>
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-gray-300 bg-gray-100">
            <th className="py-3 px-4 text-gray-900 font-bold">Tgl Dibuat</th>
            <th className="py-3 px-4 text-gray-900 font-bold">Pemesan</th>
            <th className="py-3 px-4 text-gray-900 font-bold">Layanan & Tanggal</th>
            <th className="py-3 px-4 text-gray-900 font-bold">Status</th>
            <th className="py-3 px-4 text-gray-900 font-bold">Bukti TF</th>
            <th className="py-3 px-4 text-gray-900 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
              <td className="py-3 px-4 text-gray-900">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
              <td className="py-3 px-4">
                <div className="font-bold text-gray-900">{b.user?.name || b.userName || 'Data Anonim'}</div>
                <div className="text-gray-600">{b.user?.phone || b.userPhone || '-'}</div>
              </td>
              <td className="py-3 px-4">
                <div className="font-bold text-blue-700">{b.service?.name || b.serviceName || 'Layanan Dihapus'}</div>
                <div className="text-gray-800 font-medium">{b.startDate} s/d {b.endDate}</div>
              </td>
              <td className="py-3 px-4 font-bold text-gray-900">{b.status}</td>
              <td className="py-3 px-4">
                {b.payment?.proofImageUrl ? (
                  <a href={`http://localhost:8080${b.payment.proofImageUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold underline">Lihat Bukti</a>
                ) : <span className="text-gray-500">-</span>}
              </td>
              <td className="py-3 px-4 space-x-2">
                {b.status === 'PENDING_APPROVAL' && (
                  <>
                    <button onClick={() => handleStatusChange(b.id, 'HARD_BOOKED')} className="px-2 py-1 bg-green-600 text-white rounded font-bold hover:bg-green-700 shadow-sm">Approve</button>
                    <button onClick={() => handleStatusChange(b.id, 'CANCELLED')} className="px-2 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 shadow-sm">Reject</button>
                  </>
                )}
                {b.status === 'SOFT_BOOKED' && (
                  <button onClick={() => handleStatusChange(b.id, 'HARD_BOOKED')} className="px-2 py-1 bg-purple-600 text-white rounded font-bold hover:bg-purple-700 shadow-sm">Tandai Lunas</button>
                )}
                {b.status === 'HARD_BOOKED' && <span className="text-green-700 font-extrabold">✓ Selesai</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {bookings.length === 0 && (
        <div className="text-center py-10 text-gray-600 font-medium">Belum ada data pemesanan.</div>
      )}
    </div>
  );
}