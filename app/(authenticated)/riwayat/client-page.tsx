"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/shared/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function RiwayatPage() {
  const { user } = useAuth();
  const [riwayat, setRiwayat] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRiwayat = async () => {
      if (!user) return;
      try {
        const res = await api.get(`/presensi/anggota/${user.id_anggota}`);
        if (res.success) {
          setRiwayat(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch riwayat:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiwayat();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hadir":
        return <Badge className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 border-0">Hadir</Badge>;
      case "izin":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0">Izin</Badge>;
      case "tidak_hadir":
        return <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-0 shadow-none">Tidak Hadir</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Menunggu</Badge>;
    }
  };

  return (
    <div className="p-4 pb-20 space-y-6">
      <header className="pt-4 pb-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Riwayat Presensi</h1>
        <p className="text-slate-500 text-sm font-medium">
          Daftar kehadiran Anda pada kegiatan UKM
        </p>
      </header>

      <div className="space-y-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : riwayat.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            Belum ada riwayat presensi.
          </div>
        ) : (
          riwayat.map((item) => (
            <Card key={item.id_kehadiran} className="overflow-hidden bg-white/90 backdrop-blur-xl border-blue-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)]">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h3 className="font-bold text-slate-800 line-clamp-1 pr-2 leading-tight">
                    {item.nama_kegiatan || `Kegiatan #${item.id_kegiatan}`}
                  </h3>
                  {getStatusBadge(item.keterangan || "pending")}
                </div>
                <p className="text-sm font-medium text-slate-500 mb-3">
                  {format(new Date(item.waktu_presensi.replace(" ", "T")), "d MMM yyyy, HH:mm", { locale: id })}
                </p>
                {item.keterangan && item.keterangan !== "hadir" && item.keterangan !== "izin" && item.keterangan !== "tidak_hadir" && (
                  <p className="text-sm bg-blue-50/80 text-blue-800 p-3 rounded-xl border border-blue-100/50 italic">
                    "{item.keterangan}"
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
