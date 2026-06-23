"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Info, LockKey, UserCircle } from "@phosphor-icons/react";

export function SuccessScreen({ nim }: { nim?: string }) {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full">
          <img src="/images/bg-login.jpeg" alt="Background" className="w-full h-full object-cover opacity-90" />
        </div>
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[10px]" />
      </div>

      <Card className="relative z-10 w-full max-w-lg text-center border border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1D9E75] to-[#0f6c4e] text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#1D9E75]/30">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-3xl font-black text-[#0a1f16] mb-3 tracking-tight">Pendaftaran Berhasil!</h2>
        <p className="text-[15px] font-medium text-gray-600 mb-6 leading-relaxed">
          Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi.
        </p>

        {/* Info Akun Login */}
        <div className="bg-white/80 border border-gray-100 rounded-2xl p-5 mb-6 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
            <UserCircle size={20} weight="bold" className="text-[#1D9E75]" />
            <h3 className="font-bold text-[#0a1f16] text-[15px]">Informasi Akun Anda</h3>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Username</span>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[14px] font-mono text-gray-800">
                {nim || "NIM_ANDA"}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Password Default</span>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-[14px] font-mono text-gray-800">
                {nim || "NIM_ANDA"}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Ganti Sandi */}
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-8 text-left">
          <Info size={24} weight="fill" className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[13px] text-amber-900 leading-relaxed font-medium">
            <strong>Rekomendasi Keamanan:</strong> Kami sangat menyarankan Anda untuk segera <strong>mengubah password</strong> default di atas melalui halaman Profil setelah Anda berhasil login.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => router.push("/login")}
            className="flex-1 bg-gradient-to-r from-[#1D9E75] to-[#12bd87] hover:from-[#15805e] hover:to-[#0f966b] text-white rounded-2xl h-14 font-bold text-[15px] shadow-lg shadow-[#1D9E75]/20 transition-all hover:scale-[1.02]"
          >
            <LockKey size={18} className="mr-2" weight="bold" /> Lanjut Login
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 rounded-2xl h-14 font-bold text-[15px] transition-all"
          >
            Kembali
          </Button>
        </div>
      </Card>
    </div>
  );
}
