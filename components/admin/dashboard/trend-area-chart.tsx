"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { TrendUp } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { activityChartConfig } from "./chart-config";
import type { DashboardData } from "./types";

type TrendAreaChartProps = {
  data: DashboardData["charts"]["activity"];
};

export function TrendAreaChart({ data }: TrendAreaChartProps) {
  return (
    <Card className="bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300" />
      
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-emerald-50 py-5 sm:flex-row">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-[#008744] shadow-inner border border-emerald-100/50">
            <TrendUp size={20} weight="duotone" />
          </div>
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-xl font-bold text-[#0d2318]">Tren Kegiatan & Presensi</CardTitle>
            <CardDescription className="text-sm font-medium text-emerald-800/60">
              Menampilkan statistik pergerakan berdasarkan filter di atas
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={activityChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data} margin={{ left: 12, right: 12, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="fillPresensiHadir" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activityChartConfig.presensi_hadir.color} stopOpacity={0.5} />
                <stop offset="95%" stopColor={activityChartConfig.presensi_hadir.color} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="fillKegiatan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={activityChartConfig.kegiatan.color} stopOpacity={0.5} />
                <stop offset="95%" stopColor={activityChartConfig.kegiatan.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e2e8f0" strokeOpacity={0.6} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tickFormatter={(value) => {
                const d = new Date(value);
                return isNaN(d.getTime())
                  ? String(value).slice(0, 6)
                  : d.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
              }}
              className="text-xs font-semibold fill-emerald-800/50"
            />
            <ChartTooltip
              cursor={{ stroke: 'rgba(0, 135, 68, 0.2)', strokeWidth: 2, strokeDasharray: '4 4' }}
              content={
                <ChartTooltipContent
                  className="bg-white/95 backdrop-blur-md border border-emerald-100 shadow-xl rounded-xl p-3"
                  labelFormatter={(value) => {
                     const d = new Date(value);
                     if (isNaN(d.getTime())) return value;
                     return `📅 ${d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="kegiatan"
              type="natural"
              fill="url(#fillKegiatan)"
              stroke={activityChartConfig.kegiatan.color}
              strokeWidth={3}
              activeDot={{ r: 6, fill: activityChartConfig.kegiatan.color, stroke: "#fff", strokeWidth: 2 }}
            />
            <Area
              dataKey="presensi_hadir"
              type="natural"
              fill="url(#fillPresensiHadir)"
              stroke={activityChartConfig.presensi_hadir.color}
              strokeWidth={3}
              activeDot={{ r: 6, fill: activityChartConfig.presensi_hadir.color, stroke: "#fff", strokeWidth: 2 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
