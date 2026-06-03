import { pendaftaranSchema } from "@/lib/validators";

export type FormValues = {
  nama_lengkap: string;
  nim: string;
  email: string;
  angkatan: string;
  no_hp: string;
  fakultas: string;
  program_studi: string;
  bidang_minat: string[];
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat_domisili: string;
  jenis_kelamin: "L" | "P";
  bukti_pembayaran: File | null;
};

export type FieldErrors = Partial<Record<keyof FormValues, string>>;

export const defaultValues: FormValues = {
  nama_lengkap: "",
  nim: "",
  email: "",
  angkatan: "",
  no_hp: "",
  fakultas: "",
  program_studi: "",
  bidang_minat: [],
  tempat_lahir: "",
  tanggal_lahir: "",
  alamat_domisili: "",
  jenis_kelamin: "L",
  bukti_pembayaran: null,
};

export const STEPS = [
  { id: "data-diri", title: "Data Diri" },
  { id: "akademik", title: "Akademik" },
  { id: "pembayaran", title: "Pembayaran" },
  { id: "review", title: "Review & Kirim" },
];

export const STEP_FIELDS = [
  ["email", "nama_lengkap", "jenis_kelamin", "tempat_lahir", "tanggal_lahir", "alamat_domisili", "no_hp"],
  ["nim", "fakultas", "program_studi", "angkatan", "bidang_minat"],
  ["bukti_pembayaran"],
] as const;

export function getValidationErrors(values: FormValues) {
  const fileList = values.bukti_pembayaran
    ? { length: 1, 0: values.bukti_pembayaran }
    : { length: 0 };
  const result = pendaftaranSchema.safeParse({ ...values, bukti_pembayaran: fileList });

  if (result.success) return {};

  return result.error.issues.reduce<FieldErrors>((acc, issue) => {
    const key = issue.path[0] as keyof FormValues | undefined;
    if (key && !acc[key]) acc[key] = issue.message;
    return acc;
  }, {});
}

export function getStepWithError(errors: FieldErrors) {
  const fields = Object.keys(errors);

  if (fields.some((field) => STEP_FIELDS[0].includes(field as any))) return 0;
  if (fields.some((field) => STEP_FIELDS[1].includes(field as any))) return 1;
  if (fields.some((field) => STEP_FIELDS[2].includes(field as any))) return 2;

  return -1;
}

export function buildPendaftaranPayload(values: FormValues, buktiPembayaranUrl?: string) {
  return {
    ...values,
    bidang_minat: values.bidang_minat.join(", "),
    bukti_pembayaran: buktiPembayaranUrl || undefined,
  };
}
