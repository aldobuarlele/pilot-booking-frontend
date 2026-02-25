"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "../../../../store/adminStore";

export default function ServicesPage() {
  const { services, fetchServices, saveService, deleteService } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({ name: '', description: '', basePrice: 0, imageUrl: '', isActive: true });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openModal = (service = null) => {
    if (service) {
      setFormData(service);
      setIsEdit(true);
    } else {
      setFormData({ name: '', description: '', basePrice: 0, imageUrl: '', isActive: true });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const success = await saveService(formData, isEdit);
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Layanan & Fasilitas</h2>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">+ Tambah Layanan</button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 px-4">Nama Layanan</th>
            <th className="py-3 px-4">Harga Dasar</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {services.map(s => (
            <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium">{s.name}</td>
              <td className="py-3 px-4">Rp {s.basePrice.toLocaleString('id-ID')}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.isActive ? 'AKTIF' : 'NONAKTIF'}
                </span>
              </td>
              <td className="py-3 px-4 flex gap-2">
                <button onClick={() => openModal(s)} className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => { if(confirm('Hapus layanan?')) deleteService(s.id); }} className="text-red-600 hover:underline">Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit' : 'Tambah'} Layanan</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Nama Layanan" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded" />
              <textarea placeholder="Deskripsi" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded" rows={3}></textarea>
              <input type="number" placeholder="Harga (Rp)" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})} className="w-full px-3 py-2 border rounded" />
              <input type="text" placeholder="URL Gambar" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-3 py-2 border rounded" />
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} /> Layanan Aktif
              </label>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Batal</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Simpan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}