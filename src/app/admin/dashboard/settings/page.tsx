"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "../../../../store/adminStore";
import { useThemeStore } from "../../../../store/themeStore";

export default function SettingsPage() {
  const { updateConfig } = useAdminStore();
  const { companyName, primaryColor, adminWa, paymentInfo, fetchConfigs } = useThemeStore();
  
  const [formData, setFormData] = useState({
    company_name: "",
    primary_color: "",
    admin_wa: "",
    payment_info: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  useEffect(() => {
    setFormData({
      company_name: companyName,
      primary_color: primaryColor,
      admin_wa: adminWa,
      payment_info: paymentInfo
    });
  }, [companyName, primaryColor, adminWa, paymentInfo]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateConfig("company_name", formData.company_name);
    await updateConfig("primary_color", formData.primary_color);
    await updateConfig("admin_wa", formData.admin_wa);
    await updateConfig("payment_info", formData.payment_info);
    await fetchConfigs(); 
    setIsSaving(false);
    alert("Pengaturan Berhasil Disimpan!");
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Pengaturan Website</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan / Web</label>
          <input type="text" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warna Utama (Hex Code)</label>
          <div className="flex gap-4">
            <input type="color" value={formData.primary_color} onChange={e => setFormData({...formData, primary_color: e.target.value})} className="h-10 w-10 border rounded cursor-pointer" />
            <input type="text" value={formData.primary_color} onChange={e => setFormData({...formData, primary_color: e.target.value})} className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 uppercase" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp Admin (Gunakan 62)</label>
          <input type="text" value={formData.admin_wa} onChange={e => setFormData({...formData, admin_wa: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Informasi Rekening Pembayaran (Hardbook)</label>
          <textarea rows={3} value={formData.payment_info} onChange={e => setFormData({...formData, payment_info: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2" />
        </div>
        <button onClick={handleSave} disabled={isSaving} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}