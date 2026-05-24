"use client";

import { CalendarCheck, UsersThree } from "@phosphor-icons/react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DashboardData } from "./types";

type ActivityAttendanceCardProps = {
  data: DashboardData["charts"]["attendance_by_kegiatan"];
  className?: string;
};

const formatActivityDate = (value: string) => {
  try {
    return format(new Date(value.replace(" ", "T")), "d MMM yyyy", { locale: localeId });
  } catch {
    return "Tanggal belum valid";
  }
};

export function ActivityAttendanceCard({ data, className }: ActivityAttendanceCardProps) {
  return (
    <Card className={cn("bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]", className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-xl font-bold text-[#0d2318]">Kegiatan vs Kehadiran</CardTitle>
            <CardDescription className="text-sm font-medium text-emerald-800/60">Jumlah hadir dibanding total mahasiswa terdaftar.</CardDescription>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
            <UsersThree className="size-6" weight="duotone" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="rounded-2xl border border-emerald-200/50 border-dashed p-6 text-center text-sm font-medium text-emerald-800/60">
            Belum ada data kehadiran kegiatan.
          </div>
        ) : (
          data.map((item) => {
            const total = item.total_terdaftar || 0;
            const percentage = total > 0 ? Math.round((item.hadir / total) * 100) : 0;

            return (
              <div key={item.id_kegiatan} className="rounded-2xl border bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-700">
                      <CalendarCheck className="size-4" weight="duotone" />
                      {formatActivityDate(item.tanggal_kegiatan)}
                    </div>
                    <h3 className="truncate font-semibold text-[#0d2318]">{item.nama_kegiatan}</h3>
                    <p className="text-xs capitalize font-medium text-emerald-800/60">
                      {item.jenis_kegiatan} · {item.status_kegiatan || "tanpa status"}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-2xl font-bold text-[#0d2318]">{item.hadir}/{total}</p>
                    <p className="text-xs font-medium text-emerald-800/60">mahasiswa hadir</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-800/60">
                    <span>Tingkat kehadiran</span>
                    <span className="font-semibold text-emerald-700">{percentage}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-100/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
