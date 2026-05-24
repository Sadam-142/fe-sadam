"use client";

import { ActivityAttendanceCard } from "./activity-attendance-card";
import { CompositionCharts } from "./composition-charts";
import { DashboardHeader } from "./dashboard-header";
import { MetricCards } from "./metric-cards";
import { TrendAreaChart } from "./trend-area-chart";
import { useAdminDashboard } from "./use-admin-dashboard";

export function AdminDashboardClient() {
  const { dashboard, metrics, period, setPeriod } = useAdminDashboard();

  return (
    <div className="space-y-6">
      <DashboardHeader
        dashboard={dashboard}
        period={period}
        onPeriodChange={setPeriod}
      />
      <MetricCards metrics={metrics} />
      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <TrendAreaChart data={dashboard?.charts.activity ?? []} />
        <CompositionCharts
          pendaftaranStatus={dashboard?.charts.pendaftaran_status ?? []}
          kegiatanByType={dashboard?.charts.kegiatan_by_type ?? []}
        />
      </section>
      <ActivityAttendanceCard data={dashboard?.charts.attendance_by_kegiatan ?? []} />
    </div>
  );
}
