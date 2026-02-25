"use client";

import { useEffect } from "react";
import { useThemeStore } from "../store/themeStore";
import { useServiceStore } from "../store/serviceStore";

export default function Home() {
  const { companyName, primaryColor, isLoading: isThemeLoading } = useThemeStore();
  const { services, fetchServices, isLoading: isServicesLoading } = useServiceStore();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (isThemeLoading || isServicesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div 
        className="h-[60vh] flex flex-col items-center justify-center text-white text-center px-4"
        style={{ backgroundColor: primaryColor }} 
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          {companyName}
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl font-light drop-shadow-md">
          Platform reservasi eksklusif untuk pengalaman terbaik Anda. Pilih jadwal dan layanan dalam hitungan detik.
        </p>
      </div>

      {/* Catalog Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Image Container */}
              <div className="h-56 bg-gray-200 relative">
                {service.imageUrl ? (
                  <img 
                    src={service.imageUrl} 
                    alt={service.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xl font-extrabold text-gray-900">
                    Rp {service.basePrice.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/ hari</span>
                  </span>
                  <button 
                    className="px-5 py-2.5 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Pilih
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            Belum ada layanan yang tersedia.
          </div>
        )}
      </div>
    </main>
  );
}