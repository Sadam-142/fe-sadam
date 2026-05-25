"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { WhatsappLogo, TiktokLogo } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FormValues, FieldErrors } from "@/lib/form-utils";
import type { PendaftaranFormApi } from "@/lib/form-types";
import { FormFileInput } from "./form-inputs";

interface StepPembayaranProps {
  form: PendaftaranFormApi;
  errors: FieldErrors;
  paymentMethod: string;
  onPaymentMethodChange: (method: string) => void;
  onClearError: (field: keyof FormValues) => void;
}

export function StepPembayaran({
  form,
  errors,
  paymentMethod,
  onPaymentMethodChange,
  onClearError,
}: StepPembayaranProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
        <h3 className="text-[17px] font-black text-[#0a1f16]">Metode Pembayaran HTM</h3>
      </div>

      <div className="p-6 bg-gradient-to-br from-[#1D9E75]/10 to-[#12bd87]/5 rounded-2xl border border-[#1D9E75]/20 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <TiktokLogo size={100} />
        </div>
        <p className="text-[13px] text-gray-600 font-bold uppercase tracking-wider">Biaya Pendaftaran</p>
        <p className="text-4xl font-black text-[#1D9E75] mt-2 tracking-tight">Rp 45.000,00</p>
      </div>

      <RadioGroup value={paymentMethod} onValueChange={onPaymentMethodChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Label
          className={cn(
            "p-5 border-2 rounded-2xl cursor-pointer text-center space-y-2 transition-all duration-200",
            paymentMethod === "BRI"
              ? "border-[#1D9E75] bg-[#1D9E75]/5 shadow-md shadow-[#1D9E75]/10"
              : "border-gray-100 hover:border-[#1D9E75]/40 hover:bg-gray-50"
          )}
        >
          <RadioGroupItem value="BRI" className="sr-only" />
          <div className="font-black text-sm text-[#0a1f16]">Transfer BRI</div>
          <div className="text-xs text-gray-500 font-medium">
            617901041157538
            <br />
            a.n Yumaysila N.H
          </div>
        </Label>
        <Label
          className={cn(
            "p-5 border-2 rounded-2xl cursor-pointer text-center space-y-2 transition-all duration-200",
            paymentMethod === "ShopeePay"
              ? "border-[#1D9E75] bg-[#1D9E75]/5 shadow-md shadow-[#1D9E75]/10"
              : "border-gray-100 hover:border-[#1D9E75]/40 hover:bg-gray-50"
          )}
        >
          <RadioGroupItem value="ShopeePay" className="sr-only" />
          <div className="font-black text-sm text-[#0a1f16]">ShopeePay</div>
          <div className="text-xs text-gray-500 font-medium">
            089699459997
            <br />
            a.n Widya Yuni A.
          </div>
        </Label>
        <Label
          className={cn(
            "p-5 border-2 rounded-2xl cursor-pointer text-center space-y-2 transition-all duration-200",
            paymentMethod === "COD"
              ? "border-[#1D9E75] bg-[#1D9E75]/5 shadow-md shadow-[#1D9E75]/10"
              : "border-gray-100 hover:border-[#1D9E75]/40 hover:bg-gray-50"
          )}
        >
          <RadioGroupItem value="COD" className="sr-only" />
          <div className="font-black text-sm text-[#0a1f16]">Bayar COD</div>
          <div className="text-xs text-gray-500 font-medium">
            Bayar di lokasi
            <br />
            saat kegiatan
          </div>
        </Label>
      </RadioGroup>

      {paymentMethod !== "COD" && (
        <form.Field name="bukti_pembayaran">
          {(field) => (
            <FormFileInput
              label="Upload Bukti Transfer"
              error={errors.bukti_pembayaran}
              onChange={(file) => {
                field.handleChange(file);
                onClearError("bukti_pembayaran");
              }}
            />
          )}
        </form.Field>
      )}

      <div className="mt-8 text-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
        <p className="text-[13px] text-gray-600 font-medium mb-3">
          Setelah transfer / jika ada kendala, silakan konfirmasi ke WhatsApp admin:
        </p>
        <a
          href="https://wa.me/6281259721308"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5"
        >
          <WhatsappLogo size={22} weight="fill" /> Konfirmasi ke Yumaysila
        </a>
      </div>
    </div>
  );
}
