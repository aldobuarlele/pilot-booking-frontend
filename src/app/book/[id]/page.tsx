"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useThemeStore } from "../../../store/themeStore";
import { useServiceStore, ServiceFacility } from "../../../store/serviceStore";

export default function BookServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { primaryColor } = useThemeStore();
  const { services } = useServiceStore();
  const [service, setService] = useState<ServiceFacility | null>(null);

  useEffect(() => {
    if (services.length > 0) {
      const found = services.find((s) => s.id === resolvedParams.id);
      if (found) {
        setService(found);
      } else {
        router.push("/");
      }
    }
  }, [services, resolvedParams.id, router]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gray-800 px-6 py-8 text-white" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-3xl font-bold mb-2">Formulir Reservasi</h1>
          <p className="text-gray-100 opacity-90">{service.name}</p>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8 pb-8 border-b border-gray-200">
            {service.imageUrl && (
              <img src={service.imageUrl} alt={service.name} className="w-full md:w-1/3 h-32 object-cover rounded-lg shadow-sm" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Detail Layanan</h2>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-gray-900">
                Rp {service.basePrice.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ hari</span>
              </p>
            </div>
          </div>

          {/* Nanti form kalender, data diri, dan OTP akan masuk di sini */}
          <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-300 rounded-xl">
            [Area Kalender & Form Data Diri Akan Dibangun Di Sini]
          </div>

          <div className="mt-8 flex justify-between items-center">
            <button 
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button 
              className="px-6 py-2.5 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition opacity-50 cursor-not-allowed"
              style={{ backgroundColor: primaryColor }}
            >
              Lanjutkan ke Verifikasi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}