"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metric } from "./types";

type MetricCardsProps = {
  metrics: Metric[];
};

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-800/70 uppercase tracking-wider">
              {metric.title}
            </CardTitle>
            <div className={`rounded-xl p-2 ${metric.bg} ${metric.color}`}>
              <metric.icon className="size-5" weight="duotone" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-[#0d2318] tracking-tight">
              {metric.value.toLocaleString("id-ID")}
            </div>
            <p className="mt-1 text-xs font-medium text-emerald-800/60">{metric.note}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
