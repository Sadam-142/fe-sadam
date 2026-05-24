"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, ChartBar, UserCirclePlus, Users } from "@phosphor-icons/react";
import { api } from "@/lib/api";
import type { DashboardData, Metric, Period } from "./types";

export function useAdminDashboard() {
  const [period, setPeriod] = useState<Period>("month");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get(`/laporan/dashboard?period=${period}`)
      .then((res) => {
        if (!cancelled && res.success) {
          setDashboard(res.data);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch admin dashboard", error);
        if (!cancelled) {
          setDashboard(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  const metrics = useMemo<Metric[]>(() => {
    const summary = dashboard?.summary;

    return [
      {
        title: "Total Anggota",
        value: summary?.total_anggota ?? 0,
        note: "Akun anggota aktif di sistem",
        icon: Users,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
      },
      {
        title: "Pendaftar Baru",
        value: summary?.pendaftar_baru ?? 0,
        note: "Menunggu verifikasi admin",
        icon: UserCirclePlus,
        color: "text-blue-600",
        bg: "bg-blue-50",
      },
      {
        title: "Kegiatan",
        value: summary?.total_kegiatan ?? 0,
        note: `${summary?.kegiatan_aktif ?? 0} kegiatan aktif`,
        icon: CalendarCheck,
        color: "text-amber-600",
        bg: "bg-amber-50",
      },
      {
        title: "Presensi Hadir",
        value: summary?.presensi_hadir ?? 0,
        note: `${summary?.pending_presensi ?? 0} presensi perlu validasi`,
        icon: ChartBar,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
      },
    ];
  }, [dashboard?.summary]);

  return {
    dashboard,
    metrics,
    period,
    setPeriod,
  };
}
