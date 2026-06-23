"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormValues, FieldErrors } from "@/lib/form-utils";
import type { PendaftaranFormApi } from "@/lib/form-types";
import { FormInput, FormDatePicker } from "./form-inputs";

interface StepDataDiriProps {
  form: PendaftaranFormApi;
  errors: FieldErrors;
  onClearError: (field: keyof FormValues) => void;
}

export function StepDataDiri({ form, errors, onClearError }: StepDataDiriProps) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <form.Field name="email">
        {(field) => (
          <FormInput
            label="Email Aktif"
            placeholder="contoh@gmail.com"
            value={field.state.value}
            error={errors.email}
            onChange={(value) => {
              field.handleChange(value);
              onClearError("email");
            }}
          />
        )}
      </form.Field>

      <form.Field name="nama_lengkap">
        {(field) => (
          <FormInput
            label="Nama Lengkap"
            placeholder="Nama sesuai KTM"
            value={field.state.value}
            error={errors.nama_lengkap}
            onChange={(value) => {
              field.handleChange(value);
              onClearError("nama_lengkap");
            }}
          />
        )}
      </form.Field>

      <form.Field name="jenis_kelamin">
        {(field) => (
          <div className="space-y-3">
            <Label className="text-xs font-bold text-gray-700 uppercase">Jenis Kelamin</Label>
            <RadioGroup
              onValueChange={(value) => {
                field.handleChange(value as "L" | "P");
                onClearError("jenis_kelamin");
              }}
              value={field.state.value}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="L" id="L" className="text-[#1D9E75] focus:ring-[#1D9E75]" />
                <Label htmlFor="L">Laki-laki</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P" id="P" className="text-[#1D9E75] focus:ring-[#1D9E75]" />
                <Label htmlFor="P">Perempuan</Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </form.Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <form.Field name="tempat_lahir">
          {(field) => (
            <FormInput
              label="Tempat Lahir"
              placeholder="Kota Lahir"
              value={field.state.value}
              error={errors.tempat_lahir}
              onChange={(value) => {
                field.handleChange(value);
                onClearError("tempat_lahir");
              }}
            />
          )}
        </form.Field>

        <form.Field name="tanggal_lahir">
          {(field) => (
            <FormDatePicker
              label="Tanggal Lahir"
              value={field.state.value}
              error={errors.tanggal_lahir}
              onChange={(value) => {
                field.handleChange(value);
                onClearError("tanggal_lahir");
              }}
            />
          )}
        </form.Field>
      </div>

      <form.Field name="alamat_domisili">
        {(field) => (
          <FormInput
            label="Alamat Domisili"
            placeholder="Alamat lengkap saat ini"
            value={field.state.value}
            error={errors.alamat_domisili}
            onChange={(value) => {
              field.handleChange(value);
              onClearError("alamat_domisili");
            }}
          />
        )}
      </form.Field>

      <form.Field name="no_hp">
        {(field) => (
          <FormInput
            label="Nomor WhatsApp"
            placeholder="08xxxxxxxxxx"
            type="tel"
            value={field.state.value}
            error={errors.no_hp}
            onChange={(value) => {
              field.handleChange(value);
              onClearError("no_hp");
            }}
          />
        )}
      </form.Field>
    </div>
  );
}
