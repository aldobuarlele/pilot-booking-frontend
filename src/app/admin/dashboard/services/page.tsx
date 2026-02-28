"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "../../../../store/adminStore";

export default function ServicesPage() {
  const { services, fetchServices, saveService, deleteService } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({ name: '', description: '', basePrice: '', imageUrl: '', isActive: true });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openModal = (service: any = null) => {
    if (service) {
      setFormData({ ...service });
      setIsEdit(true);
    } else {
      setFormData({ name: '', description: '', basePrice: '', imageUrl: '', isActive: true });
      setIsEdit(false);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    const success = await saveService(formData, isEdit);
    if (success) setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Layanan & Fasilitas</h2>
        <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-sm">+ Tambah Layanan</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-100">
              <th className="py-3 px-4 text-gray-900 font-bold">Nama Layanan</th>
              <th className="py-3 px-4 text-gray-900 font-bold">Harga Dasar</th>
              <th className="py-3 px-4 text-gray-900 font-bold">Status</th>
              <th className="py-3 px-4 text-gray-900 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s: any) => (
              <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{s.name}</td>
                <td className="py-3 px-4 text-gray-900">Rp {Number(s.basePrice).toLocaleString('id-ID')}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {s.isActive ? 'AKTIF' : 'NONAKTIF'}
                  </span>
                </td>
                <td className="py-3 px-4 flex gap-3">
                  <button onClick={() => openModal(s)} className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Edit</button>
                  <button onClick={() => { if(confirm('Yakin ingin menghapus layanan ini?')) deleteService(s.id); }} className="text-red-600 font-semibold hover:text-red-800 transition-colors">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {services.length === 0 && (
          <div className="text-center py-10 text-gray-600 font-medium">Belum ada layanan. Klik tombol di atas untuk menambah.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">{isEdit ? 'Edit' : 'Tambah'} Layanan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Nama Layanan</label>
                <input type="text" placeholder="Contoh: Paket Wisata Bali" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Deskripsi</label>
                <textarea placeholder="Penjelasan singkat fasilitas..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" rows={3}></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Harga Dasar (Rp)</label>
                <input type="number" placeholder="Contoh: 500000" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">URL Gambar (Opsional)</label>
                <input type="text" placeholder="https://..." value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400" />
              </div>
              
              <label className="flex items-center gap-3 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer">
                <input type="checkbox" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" /> 
                <span className="text-gray-900 font-semibold">Aktifkan Layanan Ini</span>
              </label>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-100 transition-colors">Batal</button>
                <button onClick={handleSubmit} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md transition-colors">Simpan Layanan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}