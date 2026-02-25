"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "../../../store/adminAuthStore";
import { useThemeStore } from "../../../store/themeStore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  
  const { login, isLoading, isAuthenticated, checkAuth } = useAdminAuthStore();
  const { primaryColor, companyName } = useThemeStore();

  useEffect(() => {
    checkAuth();
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router, checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    const success = await login(username, password);
    if (success) {
      router.push("/admin/dashboard");
    } else {
      setErrorMsg("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="py-8 px-6 text-center text-white" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="mt-2 opacity-90">{companyName}</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-200">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !username || !password}
              className="w-full py-3 rounded-lg text-white font-bold shadow-md transition disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push('/')}
              className="text-sm text-gray-500 hover:text-gray-800 transition"
            >
              ← Kembali ke Beranda Publik
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}