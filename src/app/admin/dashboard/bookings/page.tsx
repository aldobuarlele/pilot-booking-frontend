"use client";

import { useEffect } from "react";
import { useAdminStore } from "../../../../store/adminStore";

export default function BookingsPage() {
  const { bookings, fetchBookings, updateBookingStatus } = useAdminStore();

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  console.log("DATA DARI BACKEND:", bookings);

  const handleStatusChange = async (id: string, status: string) => {
    if (confirm(`Ubah status menjadi ${status}?`)) {
      await updateBookingStatus(id, status);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">Manajemen Booking</h2>
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gray-50">
            <th className="py-3 px-4">Tgl Dibuat</th>
            <th className="py-3 px-4">Pemesan</th>
            <th className="py-3 px-4">Layanan & Tanggal</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Bukti TF</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50 text-sm">
              <td className="py-3 px-4">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
              <td className="py-3 px-4">
                <div className="font-bold">{b.user?.name || b.userName || 'Data Anonim'}</div>
                <div className="text-gray-500">{b.user?.phone || b.userPhone || '-'}</div>
              </td>
              <td className="py-3 px-4">
                <div className="font-medium text-blue-600">{b.service?.name || b.serviceName || 'Layanan Dihapus'}</div>
                <div>{b.startDate} s/d {b.endDate}</div>
              </td>
              <td className="py-3 px-4 font-bold">{b.status}</td>
              <td className="py-3 px-4">
                {b.payment?.proofImageUrl ? (
                  <a href={`http://localhost:8080${b.payment.proofImageUrl}`} target="_blank" rel="noreferrer" className="text-blue-500 underline">Lihat Bukti</a>
                ) : '-'}
              </td>
              <td className="py-3 px-4 space-x-2">
                {b.status === 'PENDING_APPROVAL' && (
                  <>
                    <button onClick={() => handleStatusChange(b.id, 'HARD_BOOKED')} className="px-2 py-1 bg-green-500 text-white rounded font-bold">Approve</button>
                    <button onClick={() => handleStatusChange(b.id, 'CANCELLED')} className="px-2 py-1 bg-red-500 text-white rounded font-bold">Reject</button>
                  </>
                )}
                {b.status === 'SOFT_BOOKED' && (
                  <button onClick={() => handleStatusChange(b.id, 'HARD_BOOKED')} className="px-2 py-1 bg-purple-500 text-white rounded font-bold">Tandai Lunas</button>
                )}
                {b.status === 'HARD_BOOKED' && <span className="text-green-600 font-bold">✓ Selesai</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {bookings.length === 0 && (
        <div className="text-center py-10 text-gray-500">Belum ada data pemesanan.</div>
      )}
    </div>
  );
}