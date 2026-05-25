"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FormValues, FieldErrors } from "@/lib/form-utils";
import type { PendaftaranFormApi } from "@/lib/form-types";
import { FormInput } from "./form-inputs";

const FAKULTAS_PRODI = {
  "Fakultas Dakwah dan Komunikasi": [
    "Bimbingan Penyuluhan Islam",
    "Komunikasi dan Penyiaran Islam",
    "Manajemen Dakwah",
    "Pengembangan Masyarakat Islam",
    "Manajemen Haji dan Umrah"
  ],
  "Fakultas Syariah dan Hukum": [
    "Hukum Keluarga Islam",
    "Hukum Pidana Islam",
    "Hukum Ekonomi Syariah",
    "Ilmu Falak",
    "Ilmu Hukum"
  ],
  "Fakultas Ilmu Tarbiyah dan Keguruan": [
    "Pendidikan Agama Islam",
    "Pendidikan Bahasa Arab",
    "Manajemen Pendidikan Islam",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Guru Madrasah Ibtidaiyah",
    "Pendidikan Islam Anak Usia Dini"
  ],
  "Fakultas Ushuluddin dan Humaniora": [
    "Aqidah dan Filsafat Islam",
    "Ilmu Al-Qur'an dan Tafsir",
    "Studi Agama-Agama",
    "Tasawuf dan Psikoterapi",
    "Ilmu Seni dan Arsitektur Islam",
    "Ilmu Hadis"
  ],
  "Fakultas Ekonomi dan Bisnis Islam": [
    "Ekonomi Syariah",
    "Perbankan Syariah",
    "Akuntansi Syariah",
    "Manajemen",
    "Bisnis Digital"
  ],
  "Fakultas Ilmu Sosial dan Politik": [
    "Ilmu Politik",
    "Sosiologi",
    "Perpustakaan dan Sains Informasi"
  ],
  "Fakultas Psikologi dan Kesehatan": ["Psikologi", "Gizi"],
  "Fakultas Sains dan Teknologi": [
    "Biologi",
    "Fisika",
    "Kimia",
    "Matematika",
    "Pendidikan Matematika",
    "Pendidikan Fisika",
    "Pendidikan Kimia",
    "Pendidikan Biologi",
    "Teknologi Informasi",
    "Teknik Lingkungan"
  ],
  "Fakultas Kedokteran": ["Kedokteran"]
};

interface StepAkademikProps {
  form: PendaftaranFormApi;
  errors: FieldErrors;
  onClearError: (field: keyof FormValues) => void;
}

export function StepAkademik({ form, errors, onClearError }: StepAkademikProps) {
  return (
    <form.Subscribe selector={(state) => state.values}>
      {(values) => (
        <div className="space-y-5 animate-in fade-in duration-300">
          <form.Field name="nim">
            {(field) => (
              <FormInput
                label="Nomor Induk Mahasiswa (NIM)"
                placeholder="Masukkan NIM Anda"
                value={field.state.value}
                error={errors.nim}
                onChange={(value) => {
                  field.handleChange(value);
                  onClearError("nim");
                }}
              />
            )}
          </form.Field>

          <form.Field name="fakultas">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase">Fakultas</Label>
                <Select
                  onValueChange={(value) => {
                    field.handleChange(value);
                    form.setFieldValue("program_studi", "");
                    onClearError("fakultas");
                    onClearError("program_studi");
                  }}
                  value={field.state.value}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Pilih Fakultas" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(FAKULTAS_PRODI).map((fakultas) => (
                      <SelectItem key={fakultas} value={fakultas}>
                        {fakultas}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fakultas && <p className="text-xs text-red-500">{errors.fakultas}</p>}
              </div>
            )}
          </form.Field>

          <form.Field name="program_studi">
            {(field) => (
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-700 uppercase">Program Studi</Label>
                <Select
                  onValueChange={(value) => {
                    field.handleChange(value);
                    onClearError("program_studi");
                  }}
                  value={field.state.value}
                  disabled={!values.fakultas}
                >
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue
                      placeholder={values.fakultas ? "Pilih Program Studi" : "Pilih Fakultas terlebih dahulu"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(FAKULTAS_PRODI[values.fakultas as keyof typeof FAKULTAS_PRODI] || []).map((prodi) => (
                      <SelectItem key={prodi} value={prodi}>
                        {prodi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.program_studi && <p className="text-xs text-red-500">{errors.program_studi}</p>}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <form.Field name="angkatan">
              {(field) => (
                <FormInput
                  label="Angkatan (Tahun Masuk)"
                  placeholder="2024"
                  type="number"
                  value={field.state.value}
                  error={errors.angkatan}
                  onChange={(value) => {
                    field.handleChange(value);
                    onClearError("angkatan");
                  }}
                />
              )}
            </form.Field>

            <form.Field name="bidang_minat">
              {(field) => (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-gray-700 uppercase">Bidang yang Diminati</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { value: "Kaligrafi", emoji: "🖊️" },
                      { value: "Tilawah", emoji: "📖" },
                      { value: "Dai dan MSQ", emoji: "🎤" },
                      { value: "Rebana", emoji: "🥁" },
                    ].map((item) => {
                      const selected = field.state.value.includes(item.value);
                      return (
                        <button
                          key={item.value}
                          type="button"
                          onClick={() => {
                            const updated = selected
                              ? field.state.value.filter((value) => value !== item.value)
                              : [...field.state.value, item.value];
                            field.handleChange(updated);
                            onClearError("bidang_minat");
                          }}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all",
                            selected
                              ? "border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75] font-bold"
                              : "border-gray-200 bg-white"
                          )}
                        >
                          <span>{item.emoji}</span> <span>{item.value}</span>
                          {selected && <Check size={14} weight="bold" className="ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                  {errors.bidang_minat && <p className="text-xs text-red-500">{errors.bidang_minat}</p>}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      )}
    </form.Subscribe>
  );
}
