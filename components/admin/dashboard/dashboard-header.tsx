"use client";

import { ClockCounterClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { periodOptions } from "./chart-config";
import type { DashboardData, Period } from "./types";

type DashboardHeaderProps = {
  dashboard: DashboardData | null;
  period: Period;
  onPeriodChange: (period: Period) => void;
};

export function DashboardHeader({
  dashboard,
  period,
  onPeriodChange,
}: DashboardHeaderProps) {
  return (
    <section className="rounded-3xl bg-white/90 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[20vw] h-[20vw] rounded-full bg-emerald-400/5 blur-[80px] pointer-events-none" />
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between relative z-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">Dashboard Pengurus</p>
          <h1 className="mt-1 text-3xl font-black text-[#0d2318] tracking-tight">
            Statistik Keanggotaan Risalah
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 font-medium text-emerald-800/60">
            Ringkasan anggota, pendaftaran, kegiatan, dan presensi berdasarkan rentang waktu yang dipilih.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              variant="outline"
              className={
                period === option.value
                  ? "bg-[#008744] hover:bg-[#007038] text-white border-transparent shadow-sm"
                  : "text-emerald-800 hover:text-emerald-950 border-emerald-100 hover:bg-emerald-50/80 bg-white"
              }
              size="sm"
              onClick={() => onPeriodChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-emerald-800/60 relative z-10">
        <ClockCounterClockwise size={16} weight="duotone" />
        {dashboard?.filters.tanggal_dari && dashboard?.filters.tanggal_sampai
          ? `${dashboard.filters.tanggal_dari} sampai ${dashboard.filters.tanggal_sampai}`
          : "Semua data tersedia"}
      </div>
    </section>
  );
}
