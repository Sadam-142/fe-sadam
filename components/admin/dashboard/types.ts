import type { ComponentType } from "react";

export type Period = "today" | "week" | "month" | "year" | "all";

export type DashboardData = {
  filters: {
    period: string;
    tanggal_dari?: string;
    tanggal_sampai?: string;
  };
  summary: {
    total_anggota: number;
    pendaftar_baru: number;
    total_kegiatan: number;
    presensi_hadir: number;
    pending_presensi: number;
    presensi_tidak_hadir: number;
    kegiatan_aktif: number;
  };
  charts: {
    activity: Array<{ date: string; kegiatan: number; presensi_hadir: number }>;
    pendaftaran_status: Array<{ status: string; total: number }>;
    kegiatan_by_type: Array<{ jenis: string; total: number }>;
    attendance_by_kegiatan: Array<{
      id_kegiatan: number;
      nama_kegiatan: string;
      tanggal_kegiatan: string;
      jenis_kegiatan: string;
      status_kegiatan: string;
      hadir: number;
      total_terdaftar: number;
    }>;
  };
};

export type Metric = {
  title: string;
  value: number;
  note: string;
  icon: ComponentType<{ className?: string; weight?: "regular" | "duotone" | "fill" }>;
  color: string;
  bg: string;
};
