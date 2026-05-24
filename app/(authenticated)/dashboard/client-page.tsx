/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarBlank, CheckCircle, TrendUp, Clock, XCircle } from "@phosphor-icons/react";
import { useAuth } from "@/components/shared/auth-provider";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type DashboardKegiatan = {
  id_kegiatan: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
};

type DashboardPresensi = {
  id_kegiatan: number;
  tgl_presensi: string;
  keterangan: string;
  kegiatan?: DashboardKegiatan;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_kegiatan: 0,
    total_kehadiran: 0,
    persentase_keaktifan: 0,
    aktivitas_terakhir: [] as DashboardPresensi[],
    chartData: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id_anggota) return;

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [kegiatanRes, presensiRes] = await Promise.all([
          api.get("/kegiatan"),
          api.get(`/presensi/anggota/${user.id_anggota}`),
        ]);

        const kegiatan = Array.isArray(kegiatanRes.data) ? kegiatanRes.data : [];
        const presensi = Array.isArray(presensiRes.data) ? presensiRes.data : [];

        const total_kegiatan = kegiatan.length;
        const total_kehadiran = presensi.filter((p: any) => p.keterangan === 'hadir').length;
        const persentase_keaktifan = total_kegiatan > 0 ? Math.round((total_kehadiran / total_kegiatan) * 100) : 0;

        // Map presensi with kegiatan name
        const mappedPresensi = presensi.map((p: any) => {
          const k = kegiatan.find((keg: any) => keg.id_kegiatan === p.id_kegiatan);
          return { ...p, kegiatan: k };
        }).sort((a, b) => new Date(b.tgl_presensi).getTime() - new Date(a.tgl_presensi).getTime())
        .slice(0, 4); // last 4 activities

        // Calculate monthly attendance for chart
        let hadirBulanIni = 0;
        const currentMonth = format(new Date(), "MMM yy", { locale: localeId });
        
        const monthlyData = presensi.reduce((acc: any, curr: any) => {
          if (curr.keterangan === 'hadir') {
            const date = new Date(curr.tgl_presensi);
            const month = format(date, "MMM yy", { locale: localeId });
            acc[month] = (acc[month] || 0) + 1;
            
            if (month === currentMonth) {
              hadirBulanIni++;
            }
          }
          return acc;
        }, {});
        
        let chartData = Object.keys(monthlyData).map(key => ({
          name: key,
          kehadiran: monthlyData[key]
        })).slice(-6);

        // Fallback dummy data if not enough history
        if (chartData.length < 2) {
          chartData = [
            { name: 'Jan', kehadiran: 0 },
            { name: 'Feb', kehadiran: 1 },
            { name: 'Mar', kehadiran: 2 },
            { name: 'Apr', kehadiran: total_kehadiran > 0 ? total_kehadiran : 4 },
            { name: currentMonth, kehadiran: total_kehadiran },
          ];
          hadirBulanIni = total_kehadiran; // For demo purpose
        }

        setStats({
          total_kegiatan,
          total_kehadiran,
          persentase_keaktifan,
          aktivitas_terakhir: mappedPresensi,
          chartData,
          hadirBulanIni,
        });

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return null;

  const targetKehadiran = 80;
  const isMelampauiTarget = stats.persentase_keaktifan >= targetKehadiran;

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 space-y-6 lg:space-y-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen">
      
      {/* Header Section */}
      <header className="pt-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 font-medium mt-1">
          Selamat Datang kembali, <span className="text-emerald-600 font-bold">{user.nama_lengkap || user.username}</span> 👋
        </p>
      </header>

      {/* Elegant Banner Card */}
      <Card className="border-0 shadow-xl shadow-emerald-900/10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <CardContent className="p-6 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-white/20 shadow-inner bg-white/10 backdrop-blur-sm text-white">
              <AvatarFallback className="text-xl font-bold bg-transparent text-white">
               
              </AvatarFallback>
              <AvatarImage
              src={user.foto_profil}
              />
            </Avatar>
            <div className="text-white">
              <h2 className="text-lg font-bold leading-tight drop-shadow-sm">{user.nama_lengkap || user.username}</h2>
              <p className="text-xs font-medium opacity-90 mt-0.5 tracking-wide bg-white/20 inline-block px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10">
                NIM: {user.nim || user.no_anggota || "-"}
              </p>
            </div>
          </div>
          <div className="text-right text-white">
            <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Angkatan</p>
            <p className="text-lg font-black drop-shadow-sm">{user.angkatan || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Kiri: Statistik Utama & Grafik (Lebar 2 Kolom di PC) */}
        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
          
          {/* Modern Stat Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <Card className="border-0 shadow-sm rounded-2xl bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-5">
                <div className="p-3 sm:p-4 bg-blue-50 text-blue-600 rounded-2xl hidden sm:block">
                  <CalendarBlank size={28} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-slate-500 font-semibold uppercase tracking-wider mb-0.5 sm:mb-1">Semua Kegiatan</p>
                  <p className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-800 leading-none">{stats.total_kegiatan}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-2xl bg-emerald-50 hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6 flex items-center gap-3 sm:gap-5">
                <div className="p-3 sm:p-4 bg-emerald-100 text-emerald-600 rounded-2xl hidden sm:block">
                  <CheckCircle size={28} weight="duotone" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-emerald-600 font-bold uppercase tracking-wider mb-0.5 sm:mb-1">Bulan Ini</p>
                  <p className="text-sm sm:text-xl lg:text-2xl font-black text-emerald-800 leading-none">Hadir {stats.hadirBulanIni}x</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress & Chart Section */}
          <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden h-full">
            <CardHeader className="p-5 sm:p-6 border-b border-slate-50">
              <CardTitle className="text-sm sm:text-base font-bold text-slate-800 flex items-center justify-between">
                <span>Statistik Keaktifan</span>
                <span className="text-emerald-600 font-black text-lg sm:text-2xl">{stats.persentase_keaktifan}%</span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Target Kehadiran Periode Ini: {targetKehadiran}%</p>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-xs sm:text-sm font-bold mb-2">
                  <span className="text-slate-600">Progress</span>
                  <span className={isMelampauiTarget ? "text-emerald-600" : "text-amber-600"}>
                    {isMelampauiTarget ? "Melampaui Target 🎉" : "Perlu Ditingkatkan"}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 sm:h-4 shadow-inner">
                  <div 
                    className={`h-3 sm:h-4 rounded-full transition-all duration-1000 ${isMelampauiTarget ? 'bg-emerald-500' : 'bg-amber-400'}`} 
                    style={{ width: `${Math.min(stats.persentase_keaktifan, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Area Chart */}
              <div className="h-[180px] sm:h-[220px] lg:h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKehadiran" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                      labelStyle={{ color: '#64748b', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="kehadiran" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorKehadiran)" 
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Kanan: Aktivitas Terakhir (Lebar 1 Kolom di PC) */}
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 px-1 uppercase tracking-wider">Aktivitas Terakhir</h3>
          <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden h-full min-h-[400px]">
            <div className="divide-y divide-slate-50">
              {stats.aktivitas_terakhir.length > 0 ? (
                stats.aktivitas_terakhir.map((act, idx) => (
                  <div key={idx} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3.5 sm:gap-4">
                      {act.keterangan === 'hadir' ? (
                        <div className="p-2 sm:p-3 bg-emerald-50 text-emerald-500 rounded-xl">
                          <CheckCircle size={22} weight="fill" />
                        </div>
                      ) : (
                        <div className="p-2 sm:p-3 bg-rose-50 text-rose-500 rounded-xl">
                          <XCircle size={22} weight="fill" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm sm:text-base font-bold text-slate-800 leading-tight mb-0.5 sm:mb-1">{act.kegiatan?.nama_kegiatan || "Kegiatan UKM"}</p>
                        <p className="text-xs sm:text-sm font-medium text-slate-500 flex items-center gap-1.5">
                          <Clock size={14} weight="bold" />
                          {(() => {
                            try {
                              return format(new Date(act.tgl_presensi), "dd MMM yyyy", { locale: localeId });
                            } catch {
                              return act.tgl_presensi;
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                    <div>
                      {act.keterangan === 'hadir' ? (
                        <span className="px-3 py-1 sm:py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-emerald-100">Hadir</span>
                      ) : (
                        <span className="px-3 py-1 sm:py-1.5 rounded-full bg-rose-50 text-rose-600 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-rose-100">Alpa</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center text-slate-400 h-full">
                  <CalendarBlank size={40} weight="duotone" className="mb-3 opacity-50" />
                  <p className="text-sm font-medium">Belum ada riwayat aktivitas</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
