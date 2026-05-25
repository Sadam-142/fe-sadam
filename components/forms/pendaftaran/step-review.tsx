"use client";

import { Check } from "@phosphor-icons/react";
import type { PendaftaranFormApi } from "@/lib/form-types";

interface StepReviewProps {
  form: PendaftaranFormApi;
  paymentMethod: string;
}

export function StepReview({ form, paymentMethod }: StepReviewProps) {
  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-b from-[#f8fdf9] to-white border border-[#1D9E75]/10 p-6 rounded-3xl text-[14px] space-y-4 shadow-[0_10px_40px_rgba(29,158,117,0.04)]">
            <h3 className="font-black text-[#0a1f16] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
              <Check size={18} className="text-[#1D9E75]" weight="bold" /> Ringkasan Pendaftaran
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Nama Lengkap
                </span>
                <strong className="text-gray-800 text-[15px]">{values.nama_lengkap}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">NIM</span>
                <strong className="text-gray-800 text-[15px]">{values.nim}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Email Aktif
                </span>
                <strong className="text-gray-800 text-[15px]">{values.email}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Jenis Kelamin
                </span>
                <strong className="text-gray-800 text-[15px]">
                  {values.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                </strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Tempat, Tanggal Lahir
                </span>
                <strong className="text-gray-800 text-[15px]">
                  {values.tempat_lahir}, {values.tanggal_lahir}
                </strong>
              </div>
              <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Alamat Domisili
                </span>
                <strong className="text-gray-800 text-[15px]">{values.alamat_domisili}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Nomor WhatsApp
                </span>
                <strong className="text-gray-800 text-[15px]">{values.no_hp}</strong>
              </div>
              <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                  Fakultas / Prodi
                </span>
                <strong className="text-[#1D9E75] text-[15px]">
                  {values.fakultas} — {values.program_studi}{" "}
                  <span className="text-gray-500 font-normal">({values.angkatan})</span>
                </strong>
              </div>
              <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                  Bidang Minat Kegiatan
                </span>
                <div className="flex flex-wrap gap-2">
                  {values.bidang_minat.map((minat) => (
                    <span
                      key={minat}
                      className="bg-gradient-to-r from-[#1D9E75]/10 to-[#1D9E75]/5 text-[#1D9E75] border border-[#1D9E75]/20 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                    >
                      {minat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                  Dokumen & Pembayaran
                </span>
                <div className="flex flex-wrap gap-2">
                  {values.bukti_pembayaran && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                      ✓ Bukti Bayar ({paymentMethod})
                    </span>
                  )}
                  {paymentMethod === "COD" && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                      ⚠️ Bayar COD
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-5 bg-amber-50/80 border border-amber-200/60 rounded-2xl">
            <div className="w-1.5 rounded-full bg-amber-400 shrink-0" />
            <p className="text-[13px] text-amber-900 font-medium leading-relaxed">
              Mohon periksa kembali keselarasan data di atas. Data yang dikirim akan langsung diarsip secara permanen oleh
              kesekretariatan.
            </p>
          </div>

          <div className="flex gap-4 p-5 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-2xl">
            <div className="w-1.5 rounded-full bg-[#1D9E75] shrink-0" />
            <p className="text-[13px] text-[#0f6c4e] font-medium leading-relaxed">
              Setelah pendaftaran dikirim, silakan menunggu informasi kegiatan ORDITAS dan proses pengaktifan akun dari
              panitia.
            </p>
          </div>
        </div>
      )}
    </form.Subscribe>
  );
}
