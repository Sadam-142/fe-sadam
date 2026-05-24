import type { ChartConfig } from "@/components/ui/chart";
import type { Period } from "./types";

export const periodOptions: Array<{ value: Period; label: string }> = [
  { value: "today", label: "Hari ini" },
  { value: "week", label: "7 hari" },
  { value: "month", label: "Bulan ini" },
  { value: "year", label: "Tahun ini" },
  { value: "all", label: "Semua" },
];

export const statusColors = ["#10B981", "#3B82F6", "#0D9488", "#EF4444"];

export const kegiatanTypeColors = [
  "#3B82F6",
  "#10B981",
  "#0D9488",
  "#6366F1",
  "#14B8A6",
  "#EF4444",
];

export const activityChartConfig = {
  presensi_hadir: {
    label: "Presensi hadir",
    color: "#10B981",
  },
  kegiatan: {
    label: "Kegiatan",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export const pendaftaranChartConfig = {
  pending: {
    label: "Pending",
    color: "#0D9488",
  },
  diterima: {
    label: "Diterima",
    color: "#10B981",
  },
  ditolak: {
    label: "Ditolak",
    color: "#EF4444",
  },
  total: {
    label: "Total",
    color: "#3B82F6",
  },
} satisfies ChartConfig;

export const kegiatanTypeChartConfig = {
  total: {
    label: "Total kegiatan",
    color: "#3B82F6",
  },
} satisfies ChartConfig;
