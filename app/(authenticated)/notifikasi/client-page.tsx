"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/shared/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle } from "@phosphor-icons/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type Notifikasi = {
  id_notifikasi: number;
  judul?: string;
  pesan?: string;
  tipe_notifikasi?: string;
  created_at: string;
  terbaca?: number | boolean;
};

export default function NotifikasiPage() {
  const { user } = useAuth();
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifikasi = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/notifikasi/${user.id_anggota}`);
      if (res.success) {
        setNotifikasi(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch notifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifikasi();
  }, [fetchNotifikasi]);

  const markAsRead = async (idNotifikasi?: number) => {
    try {
      const res = await api.patch("/notifikasi/read", { id_notifikasi: idNotifikasi });
      if (res.success) {
        if (idNotifikasi) {
          setNotifikasi((prev) =>
            prev.map((n) => n.id_notifikasi === idNotifikasi ? { ...n, terbaca: 1 } : n)
          );
        } else {
          setNotifikasi((prev) => prev.map((n) => ({ ...n, terbaca: 1 })));
        }
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const unreadCount = notifikasi.filter((n) => !n.terbaca).length;

  return (
    <div className="p-4 pb-20 space-y-4">
      <header className="pt-4 pb-2 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Notifikasi</h1>
          <p className="text-slate-500 text-sm font-medium">
            Pemberitahuan untuk Anda
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={() => markAsRead()} className="text-xs h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Tandai semua dibaca
          </Button>
        )}
      </header>

      <div className="space-y-3">
        {isLoading ? (
          Array(5).fill(0).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : notifikasi.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground flex flex-col items-center">
            <Bell size={48} className="text-muted mb-4" />
            <p>Tidak ada notifikasi</p>
          </div>
        ) : (
          notifikasi.map((item) => (
            <Card 
              key={item.id_notifikasi} 
              className={`overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.08)] bg-white/90 backdrop-blur-xl ${!item.terbaca ? 'bg-blue-50/50 border-blue-200/60 shadow-sm' : 'border-blue-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'}`}
              onClick={() => !item.terbaca && markAsRead(item.id_notifikasi)}
            >
              <CardContent className="p-5 flex gap-4 items-start cursor-pointer">
                <div className={`mt-0.5 rounded-2xl p-2.5 shrink-0 ${!item.terbaca ? 'bg-blue-100/80 text-blue-600 shadow-inner' : 'bg-slate-100 text-slate-400'}`}>
                  {item.tipe_notifikasi === "pendaftaran" ? <CheckCircle size={22} weight={!item.terbaca ? "fill" : "regular"} /> : <Bell size={22} weight={!item.terbaca ? "fill" : "regular"} />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className={`text-sm ${!item.terbaca ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                    {item.judul}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.pesan}
                  </p>
                  <p className="text-xs text-slate-400 pt-1.5 font-medium">
                    {format(new Date(item.created_at.replace(" ", "T")), "d MMM yyyy, HH:mm", { locale: id })}
                  </p>
                </div>
                {!item.terbaca && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2 shadow-sm shadow-blue-300"></div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
