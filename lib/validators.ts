import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const pendaftaranSchema = z.object({
  nama_lengkap: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  nim: z.string().min(5, "NIM tidak valid"),
  email: z.string().email("Format email tidak valid"),
  angkatan: z.string().min(4, "Angkatan tidak valid"),
  no_hp: z.string().min(10, "Nomor HP tidak valid"),
  fakultas: z.string().min(2, "Fakultas wajib diisi"),
  program_studi: z.string().min(2, "Program studi wajib diisi"),
  bidang_minat: z.array(z.string()).min(1, "Pilih minimal 1 bidang minat"),
  tempat_lahir: z.string().min(3, "Tempat lahir wajib diisi"),
  tanggal_lahir: z.string().refine((val) => !isNaN(Date.parse(val)), "Tanggal lahir tidak valid"),
  alamat_domisili: z.string().min(5, "Alamat domisili wajib diisi"),
  jenis_kelamin: z.enum(["L", "P"], { message: "Pilih jenis kelamin" }),


  bukti_pembayaran: z.any()
    .refine((files) => !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE, "Ukuran file maksimal 5MB")
    .optional(), // Optional if COD
});

export type PendaftaranFormData = z.infer<typeof pendaftaranSchema>;

export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const presensiSchema = z.object({
  id_kegiatan: z.number({ message: "Pilih kegiatan" }),
  keterangan: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export type PresensiFormData = z.infer<typeof presensiSchema>;
