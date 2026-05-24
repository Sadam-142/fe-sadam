"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Clock, CalendarBlank, Check, Image as ImageIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useAuth } from "@/components/shared/auth-provider";
import Image from "next/image";

export default function KegiatanPage() {
  const [kegiatan, setKegiatan] = useState<any[]>([]);
  const [attendedIds, setAttendedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        setIsLoading(true);
        const reqs = [api.get("/kegiatan")];
        
        if (user?.id_anggota) {
          reqs.push(api.get(`/presensi/anggota/${user.id_anggota}`));
        }
        
        const [kegiatanRes, riwayatRes] = await Promise.all(reqs);
        
        if (kegiatanRes.success) {
          setKegiatan(kegiatanRes.data);
        }
        
        if (riwayatRes?.success && Array.isArray(riwayatRes.data)) {
          const ids = riwayatRes.data.map((r: any) => r.id_kegiatan);
          setAttendedIds(ids);
        }
        
      } catch (error) {
        console.error("Failed to fetch kegiatan:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchKegiatan();
  }, [user]);

  // Categorize activities
  const now = new Date();
  const ongoing: any[] = [];
  const upcoming: any[] = [];
  const past: any[] = [];

  kegiatan.forEach((item) => {
    const startDateTime = new Date(`${item.tanggal_kegiatan}T${item.waktu_mulai || "00:00:00"}`);
    const endDateTime = new Date(`${item.tanggal_kegiatan}T${item.waktu_selesai || "23:59:59"}`);
    
    if (now >= startDateTime && now <= endDateTime) {
      ongoing.push(item);
    } else if (now < startDateTime) {
      upcoming.push(item);
    } else {
      past.push(item);
    }
  });

  const renderKegiatanCard = (item: any, type: "ongoing" | "upcoming" | "past") => {
    const isAttended = attendedIds.includes(item.id_kegiatan);
    const isPast = type === "past";
    const isOngoing = type === "ongoing";
    const isFuture = type === "upcoming";

    return (
      <Card key={item.id_kegiatan} className={`bg-white border-slate-100 shadow-sm transition-all hover:shadow-md overflow-hidden flex flex-col ${isPast ? "opacity-80" : ""}`}>
        {/* Pamflet Image */}
        <div className="w-full h-56 sm:h-64 bg-slate-900 relative overflow-hidden group flex items-center justify-center">
          {item.pamflet ? (
            <>
              {/* Blurred background */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110" 
                style={{ backgroundImage: `url(${item.pamflet})` }}
              ></div>
              {/* Actual Image */}
              <img 
                src={item.pamflet} 
                alt={item.nama_kegiatan} 
                className="relative z-10 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
              />
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
              <ImageIcon size={48} weight="duotone" className="mb-2 opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider">Tanpa Pamflet</span>
            </div>
          )}
          {isOngoing && (
            <div className="absolute top-3 right-3 z-20 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md animate-pulse">
              Berlangsung
            </div>
          )}
        </div>

        <CardHeader className="pb-3 flex-none">
          <div className="flex justify-between items-start gap-4 mb-2">
            <Badge variant="outline" className={`shrink-0 border-0 ${isPast ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-600"}`}>
              {item.jenis_kegiatan}
            </Badge>
            {isAttended && (
              <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-0 flex items-center gap-1 shadow-none">
                <Check size={12} weight="bold" /> Presensi
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg font-black text-slate-800 leading-tight line-clamp-2">
            {item.nama_kegiatan}
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5 mt-2 text-slate-500 font-medium">
            <CalendarBlank size={16} />
            {format(new Date(item.tanggal_kegiatan.replace(" ", "T")), "EEEE, d MMMM yyyy", { locale: id })}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-4 text-sm space-y-3 flex-1">
          <div className="flex items-center gap-2 text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <Clock size={16} className="text-emerald-500" />
            <span>{item.waktu_mulai} - {item.waktu_selesai}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-600 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <MapPin size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <span className="line-clamp-2">{item.lokasi}</span>
          </div>
          <p className="text-slate-600 leading-relaxed line-clamp-3 pt-1">{item.deskripsi}</p>
        </CardContent>

        <CardFooter className="pt-0 pb-5 flex-none mt-auto">
          {isAttended ? (
            <Button className="w-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-0 font-bold rounded-xl h-11" variant="outline" disabled>
              <Check className="mr-2" weight="bold" size={18} /> Sudah Presensi
            </Button>
          ) : isOngoing ? (
            <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 font-bold rounded-xl h-11" asChild>
              <Link href={`/presensi/${item.id_kegiatan}`}>
                Isi Presensi Sekarang
              </Link>
            </Button>
          ) : isFuture ? (
            <Button className="w-full text-slate-500 bg-slate-50 border-slate-200 font-bold rounded-xl h-11" variant="outline" disabled>
              <Clock className="mr-2" size={18} /> Belum Mulai
            </Button>
          ) : (
            <Button className="w-full bg-slate-100 text-slate-400 hover:bg-slate-100 font-bold rounded-xl h-11 shadow-none" variant="ghost" disabled>
              Sudah Berakhir
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="p-4 pb-24 max-w-5xl mx-auto space-y-6 min-h-screen bg-[#f8fafc]">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Kegiatan UKM</h1>
        <p className="text-slate-500 font-medium mt-1">
          Daftar kegiatan yang diselenggarakan oleh pengurus
        </p>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-sm">
              <Skeleton className="h-48 w-full rounded-none" />
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full mb-3 rounded-xl" />
                <Skeleton className="h-10 w-full mb-3 rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Tabs defaultValue={ongoing.length > 0 ? "berlangsung" : upcoming.length > 0 ? "mendatang" : "berakhir"} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-200/50 p-1 rounded-xl h-auto">
            <TabsTrigger value="berlangsung" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 font-bold">
              Berlangsung {ongoing.length > 0 && <span className="ml-1.5 bg-emerald-100 text-emerald-600 py-0.5 px-2 rounded-full text-[10px]">{ongoing.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="mendatang" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-bold">
              Mendatang {upcoming.length > 0 && <span className="ml-1.5 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-[10px]">{upcoming.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="berakhir" className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-700 font-bold">
              Berakhir {past.length > 0 && <span className="ml-1.5 bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-[10px]">{past.length}</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="berlangsung" className="focus-visible:outline-none focus-visible:ring-0">
            {ongoing.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-100 border-dashed">
                <div className="bg-emerald-50 text-emerald-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarBlank size={32} weight="duotone" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Tidak ada kegiatan berlangsung</h3>
                <p className="text-slate-500 mt-1">Saat ini tidak ada kegiatan yang sedang berjalan.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoing.map(item => renderKegiatanCard(item, "ongoing"))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mendatang" className="focus-visible:outline-none focus-visible:ring-0">
            {upcoming.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-100 border-dashed">
                <div className="bg-blue-50 text-blue-500 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarBlank size={32} weight="duotone" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Tidak ada kegiatan mendatang</h3>
                <p className="text-slate-500 mt-1">Belum ada agenda kegiatan baru dari pengurus.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map(item => renderKegiatanCard(item, "upcoming"))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="berakhir" className="focus-visible:outline-none focus-visible:ring-0">
            {past.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-100 border-dashed">
                <div className="bg-slate-100 text-slate-400 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarBlank size={32} weight="duotone" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Belum ada riwayat</h3>
                <p className="text-slate-500 mt-1">Belum ada kegiatan yang telah berakhir.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map(item => renderKegiatanCard(item, "past"))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
