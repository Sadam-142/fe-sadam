"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "@phosphor-icons/react";

export function SuccessScreen() {
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

      <Card className="relative z-10 w-full max-w-md text-center border border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1D9E75] to-[#0f6c4e] text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#1D9E75]/30">
          <Check size={40} weight="bold" />
        </div>
        <h2 className="text-3xl font-black text-[#0a1f16] mb-3 tracking-tight">Pendaftaran Berhasil!</h2>
        <p className="text-[15px] font-medium text-gray-600 mb-8 leading-relaxed">
          Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="w-full bg-[#1D9E75] hover:bg-[#15805e] text-white rounded-2xl h-14 font-bold text-[15px] shadow-lg shadow-[#1D9E75]/20 transition-all"
        >
          Kembali ke Beranda
        </Button>
      </Card>
    </div>
  );
}
