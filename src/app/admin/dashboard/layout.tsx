"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAdminAuthStore } from "../../../store/adminAuthStore";
import { useThemeStore } from "../../../store/themeStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { checkAuth, logout } = useAdminAuthStore();
  const { primaryColor, companyName } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    checkAuth();
    if (!localStorage.getItem('admin_token')) {
      router.push('/admin/login');
    }
  }, [checkAuth, router]);

  if (!isMounted) return null;

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Manajemen Booking', path: '/admin/dashboard/bookings' },
    { name: 'Layanan & Fasilitas', path: '/admin/dashboard/services' },
    { name: 'Pengaturan Web', path: '/admin/dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-2xl flex flex-col hidden md:flex z-20">
        <div 
          className="h-16 flex items-center justify-center font-extrabold text-xl text-white tracking-wide shadow-md" 
          style={{ backgroundColor: primaryColor }}
        >
          {companyName}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'text-white shadow-lg transform scale-105' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                style={isActive ? { backgroundColor: primaryColor } : {}}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={handleLogout} 
            className="w-full py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
          >
            Keluar (Logout)
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center px-8 border-b border-gray-100 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {navItems.find(i => i.path === pathname)?.name || 'Admin Panel'}
          </h2>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}