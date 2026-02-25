"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { useThemeStore } from "../../../store/themeStore";
import { useServiceStore, ServiceFacility } from "../../../store/serviceStore";
import { useBookingStore } from "../../../store/bookingStore";

type ModalState = 'CLOSED' | 'OTP_INPUT' | 'PAYMENT_SELECTION' | 'SUCCESS_SOFT';

export default function BookServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  
  const { primaryColor, adminWa, paymentInfo } = useThemeStore();
  const { services } = useServiceStore();
  
  const [service, setService] = useState<ServiceFacility | null>(null);
  const [modalState, setModalState] = useState<ModalState>('CLOSED');
  const [otpCode, setOtpCode] = useState('');
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    startDate, endDate, setDates,
    userName, userEmail, userPhone, setUserData,
    notes, setNotes,
    unavailableDates, fetchUnavailableDates, isLoadingDates,
    requestOtp, verifyOtp, submitBooking, isSubmitting
  } = useBookingStore();

  useEffect(() => {
    if (services.length > 0) {
      const found = services.find((s) => s.id === resolvedParams.id);
      if (found) {
        setService(found);
        fetchUnavailableDates(found.id);
      } else {
        router.push("/");
      }
    }
  }, [services, resolvedParams.id, router, fetchUnavailableDates]);

  const onChangeDate = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setDates(start, end);
  };

  const handleLanjutkanClick = async () => {
    const success = await requestOtp();
    if (success) {
      setModalState('OTP_INPUT');
    } else {
      alert("Gagal mengirim OTP. Periksa koneksi atau email Anda.");
    }
  };

  const handleVerifyOtp = async () => {
    const success = await verifyOtp(otpCode);
    if (success) {
      setModalState('PAYMENT_SELECTION');
    } else {
      alert("Kode OTP salah atau kedaluwarsa.");
    }
  };

  const handleFinalSubmit = async (type: 'SOFT' | 'HARD') => {
    if (type === 'HARD' && !paymentImage) {
      alert("Harap unggah bukti transfer untuk pembayaran instan.");
      return;
    }
    
    if (service) {
      const success = await submitBooking(service.id, type, paymentImage || undefined);
      if (success) {
        if (type === 'SOFT') {
          setModalState('SUCCESS_SOFT');
        } else {
          alert("Pembayaran Berhasil Diunggah! Menunggu verifikasi admin.");
          setModalState('CLOSED');
          setDates(null, null);
          router.push('/');
        }
      } else {
        alert("Pemesanan gagal diproses. Tanggal mungkin sudah terisi.");
      }
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: primaryColor }}></div>
      </div>
    );
  }

  const isFormValid = startDate && endDate && userName && userEmail && userPhone;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden relative z-10">
        
        {/* --- HEADER --- */}
        <div className="bg-gray-800 px-6 py-8 text-white" style={{ backgroundColor: primaryColor }}>
          <h1 className="text-3xl font-bold mb-2">Formulir Reservasi</h1>
          <p className="text-gray-100 opacity-90">{service.name}</p>
        </div>

        {/* --- KONTEN FORM --- */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Kalender */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Pilih Tanggal</h3>
              {isLoadingDates ? (
                <div className="text-sm text-gray-500 animate-pulse">Memuat ketersediaan...</div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-2 inline-block bg-white shadow-sm">
                  <DatePicker
                    selected={startDate}
                    onChange={onChangeDate}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline 
                    minDate={new Date()}
                    excludeDates={unavailableDates} 
                  />
                </div>
              )}
            </div>

            {/* Data Diri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Data Pemesan</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" value={userName} onChange={(e) => setUserData(e.target.value, userEmail, userPhone)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={userEmail} onChange={(e) => setUserData(userName, e.target.value, userPhone)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. WhatsApp</label>
                <input type="tel" value={userPhone} onChange={(e) => setUserData(userName, userEmail, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 outline-none transition" rows={3} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
            <button onClick={() => router.back()} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">Kembali</button>
            <button 
              disabled={!isFormValid || isSubmitting}
              onClick={handleLanjutkanClick}
              className={`px-6 py-2.5 rounded-lg text-white font-semibold shadow-md transition ${isFormValid && !isSubmitting ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'}`}
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP --- */}
      {modalState !== 'CLOSED' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
            
            {/* Modal: Input OTP */}
            {modalState === 'OTP_INPUT' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verifikasi OTP</h3>
                <p className="text-gray-600 mb-6 text-center text-sm">Masukkan 6 digit kode yang dikirim ke <span className="font-semibold">{userEmail}</span></p>
                
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} 
                  className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent outline-none mb-6"
                  placeholder="------"
                />
                
                <div className="flex gap-4">
                  <button onClick={() => setModalState('CLOSED')} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Batal</button>
                  <button onClick={handleVerifyOtp} disabled={otpCode.length !== 6 || isSubmitting} className="flex-1 px-4 py-2 rounded-lg text-white font-semibold shadow-md disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
                    {isSubmitting ? 'Cek...' : 'Verifikasi'}
                  </button>
                </div>
              </div>
            )}

            {/* Modal: Pemilihan Pembayaran */}
            {modalState === 'PAYMENT_SELECTION' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pilih Mode Pemesanan</h3>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                  {/* Opsi Softbook */}
                  <div className="border border-gray-200 p-4 rounded-xl hover:border-gray-400 transition cursor-pointer">
                    <h4 className="font-bold text-lg mb-1">Tanya Dulu (Softbook)</h4>
                    <p className="text-sm text-gray-600 mb-4">Kami akan memblokir jadwal ini sementara. Harap hubungi WhatsApp kami setelah ini.</p>
                    <button onClick={() => handleFinalSubmit('SOFT')} disabled={isSubmitting} className="w-full py-2 border-2 rounded-lg font-semibold" style={{ borderColor: primaryColor, color: primaryColor }}>
                      {isSubmitting ? 'Memproses...' : 'Pilih & Hubungi Admin'}
                    </button>
                  </div>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">ATAU</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  {/* Opsi Hardbook */}
                  <div className="border border-gray-200 p-4 rounded-xl hover:border-gray-400 transition">
                    <h4 className="font-bold text-lg mb-1">Bayar Langsung (Hardbook)</h4>
                    <p className="text-sm text-gray-600 mb-3">Amankan tanggal Anda sekarang juga dengan mentransfer ke rekening di bawah ini:</p>
                    
                    {/* Kotak Info Rekening Dinamis */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4 text-sm text-blue-900 whitespace-pre-line font-medium">
                      {paymentInfo}
                    </div>
                    
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setPaymentImage(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 mb-4"
                    />
                    
                    <button onClick={() => handleFinalSubmit('HARD')} disabled={!paymentImage || isSubmitting} className="w-full py-2 rounded-lg font-semibold text-white disabled:opacity-50" style={{ backgroundColor: primaryColor }}>
                      {isSubmitting ? 'Mengunggah...' : 'Upload & Pesan'}
                    </button>
                  </div>
                </div>

                <button onClick={() => setModalState('CLOSED')} className="mt-6 w-full text-center text-gray-500 hover:text-gray-800 text-sm font-medium">Batalkan Transaksi</button>
              </div>
            )}

            {/* Modal: Sukses Softbook & Tombol WA */}
            {modalState === 'SUCCESS_SOFT' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">✓</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pemesanan Disimpan!</h3>
                <p className="text-gray-600 mb-6 text-sm">Jadwal Anda telah diblokir sementara. Silakan chat Admin untuk mengonfirmasi dan melanjutkan pembayaran.</p>
                
                <a 
                  href={`https://wa.me/${adminWa.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg font-semibold mb-4 transition shadow-md"
                >
                  Hubungi Admin di WhatsApp
                </a>
                
                <button 
                  onClick={() => {
                    setModalState('CLOSED');
                    setDates(null, null);
                    router.push('/');
                  }} 
                  className="text-gray-500 hover:text-gray-800 text-sm font-medium"
                >
                  Kembali ke Beranda
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}