"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useThemeStore } from "../store/themeStore";
import { useServiceStore } from "../store/serviceStore";

export default function Home() {
  const { companyName, primaryColor, isLoading: isThemeLoading } = useThemeStore();
  const { services, fetchServices, isLoading: isServicesLoading } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url; 
    return `http://localhost:8080${url}`; 
  };

  if (isThemeLoading || isServicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 relative">
      
      <nav className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-6 md:px-12 py-6">
        <div className="text-white font-extrabold text-2xl tracking-widest drop-shadow-md">
          {companyName?.substring(0, 3).toUpperCase() || 'PBS'}
        </div>
        <Link 
          href="/admin/login" 
          className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Admin Portal
        </Link>
      </nav>

      <div 
        className="h-[60vh] flex flex-col items-center justify-center text-white text-center px-4 relative overflow-hidden"
        style={{ backgroundColor: primaryColor }} 
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-2xl relative z-10">
          {companyName}
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl font-light drop-shadow-md relative z-10">
          Platform reservasi eksklusif untuk pengalaman terbaik Anda. Pilih jadwal dan layanan dalam hitungan detik.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                {service.imageUrl ? (
                  <img 
                    src={getImageUrl(service.imageUrl)} 
                    alt={service.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                    Tidak Ada Gambar
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Sisa Kuota: {service.quota}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <span className="text-xl font-extrabold text-gray-900">
                    Rp {service.basePrice.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ hari</span>
                  </span>
                  <Link 
                    href={`/book/${service.id}`}
                    className="px-6 py-2.5 rounded-xl text-white font-bold shadow-md hover:opacity-90 transition-opacity inline-block"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Pilih
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center text-gray-500 mt-20 p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xl font-medium">Belum ada layanan yang tersedia saat ini.</p>
          </div>
        )}
      </div>
    </main>
  );
}