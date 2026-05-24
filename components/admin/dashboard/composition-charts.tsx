"use client";

import * as React from "react";
import { Cell, Label, LabelList, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  kegiatanTypeChartConfig,
  kegiatanTypeColors,
  pendaftaranChartConfig,
  statusColors,
} from "./chart-config";
import type { DashboardData } from "./types";

type CompositionChartsProps = {
  pendaftaranStatus: DashboardData["charts"]["pendaftaran_status"];
  kegiatanByType: DashboardData["charts"]["kegiatan_by_type"];
};

export function CompositionCharts({
  pendaftaranStatus,
  kegiatanByType,
}: CompositionChartsProps) {
  const totalPendaftaran = React.useMemo(
    () => pendaftaranStatus.reduce((acc, curr) => acc + curr.total, 0),
    [pendaftaranStatus]
  );

  const pendaftaranChartData = React.useMemo(
    () =>
      pendaftaranStatus.map((item, index) => ({
        ...item,
        fill: statusColors[index % statusColors.length],
      })),
    [pendaftaranStatus]
  );

  const kegiatanChartData = React.useMemo(
    () =>
      kegiatanByType.map((item, index) => ({
        ...item,
        fill: kegiatanTypeColors[index % kegiatanTypeColors.length],
      })),
    [kegiatanByType]
  );

  return (
    <Card className="bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#0d2318]">Komposisi Data</CardTitle>
        <CardDescription className="text-sm font-medium text-emerald-800/60">
          Status pendaftaran dan tipe kegiatan dalam satu tampilan.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700 text-center">Status Pendaftaran</p>
          <ChartContainer config={pendaftaranChartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={pendaftaranChartData}
                dataKey="total"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
              >
                {pendaftaranChartData.map((entry) => (
                  <Cell key={entry.status} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                      return null;
                    }
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-[#0d2318] text-3xl font-black"
                        >
                          {totalPendaftaran.toLocaleString("id-ID")}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-emerald-800/60 font-medium"
                        >
                          Pendaftar
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        <div className="border-t border-emerald-100/50 pt-5">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-700 text-center">Kegiatan Berdasarkan Tipe</p>
          <ChartContainer
            config={kegiatanTypeChartConfig}
            className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="jenis" hideLabel />}
              />
              <Pie data={kegiatanChartData} dataKey="total">
                <LabelList
                  dataKey="jenis"
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                  formatter={(value) => {
                    const label = String(value ?? "");
                    return label.length > 10 ? `${label.slice(0, 10)}…` : label;
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
