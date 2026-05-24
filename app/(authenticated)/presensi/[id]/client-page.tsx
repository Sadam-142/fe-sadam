"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "@phosphor-icons/react";
import { toast } from "sonner";
import { useAuth } from "@/components/shared/auth-provider";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type KegiatanDetail = {
  id_kegiatan: number;
  nama_kegiatan: string;
  tanggal_kegiatan: string;
  waktu_mulai?: string;
  waktu_selesai?: string;
  lokasi?: string;
};

type RiwayatPresensi = {
  id_kegiatan: number;
};

type PresensiClientPageProps = {
  idKegiatan: number;
};

export function PresensiClientPage({ idKegiatan }: PresensiClientPageProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [kegiatan, setKegiatan] = useState<KegiatanDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [keterangan, setKeterangan] = useState("");
  const [buktiFoto, setBuktiFoto] = useState<File | null>(null);

  useEffect(() => {
    if (!user?.id_anggota) return;

    const fetchKegiatanAndStatus = async () => {
      try {
        const [kegiatanRes, checkRes] = await Promise.all([
          api.get(`/kegiatan/${idKegiatan}`),
          api.get(`/presensi/anggota/${user.id_anggota}`),
        ]);

        if (!kegiatanRes.success) {
          toast.error("Kegiatan tidak ditemukan");
          router.push("/kegiatan");
          return;
        }

        const item = kegiatanRes.data as KegiatanDetail;
        setKegiatan(item);

        const now = new Date();
        const startDateTime = new Date(`${item.tanggal_kegiatan}T${item.waktu_mulai || "00:00:00"}`);
        const endDateTime = new Date(`${item.tanggal_kegiatan}T${item.waktu_selesai || "23:59:59"}`);

        if (now < startDateTime) {
          toast.warning("Kegiatan belum dimulai");
          router.push("/kegiatan");
          return;
        }

        if (now > endDateTime) {
          toast.warning("Kegiatan sudah berakhir");
          router.push("/kegiatan");
          return;
        }

        if (checkRes.success && Array.isArray(checkRes.data)) {
          const alreadyAttended = (checkRes.data as RiwayatPresensi[]).some(
            (record) => record.id_kegiatan === idKegiatan
          );
          if (alreadyAttended) {
            toast.info("Anda sudah melakukan presensi untuk kegiatan ini");
            router.push("/riwayat");
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchKegiatanAndStatus();
  }, [idKegiatan, user?.id_anggota, router]);

  const getLocation = () => {
    setLocationLoading(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation tidak didukung oleh browser Anda");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationLoading(false);
        toast.success("Lokasi berhasil didapatkan");
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (!location) {
      toast.error("Lokasi wajib diisi untuk presensi");
      return;
    }

    if (!buktiFoto) {
      toast.error("Bukti foto wajib diunggah");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();
      payload.append("id_anggota", String(user.id_anggota));
      payload.append("id_kegiatan", String(idKegiatan));
      payload.append("latitude", String(location.lat));
      payload.append("longitude", String(location.lng));
      if (keterangan) payload.append("keterangan", keterangan);
      payload.append("bukti_foto", buktiFoto);

      // Paksa masuk ke offline handler jika benar-benar offline
      if (!navigator.onLine) {
        throw new Error("Failed to fetch");
      }

      const res = await api.post("/presensi", payload);

      if (res.success) {
        toast.success("Presensi berhasil dikirim!");
        router.push("/riwayat");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal mengirim presensi";
      
      // OFFLINE FALLBACK
      if (message.includes("Failed to fetch") || message.includes("Network") || !navigator.onLine) {
        try {
          const { savePendingPresensi } = await import("@/lib/idb");
          const arrayBuffer = await buktiFoto.arrayBuffer();
          
          await savePendingPresensi({
            id_anggota: String(user.id_anggota),
            id_kegiatan: String(idKegiatan),
            latitude: String(location.lat),
            longitude: String(location.lng),
            keterangan: keterangan || "",
            bukti_foto: {
              buffer: arrayBuffer,
              type: buktiFoto.type,
              name: buktiFoto.name,
            }
          });

          if ("serviceWorker" in navigator && "SyncManager" in window) {
            const registration = await navigator.serviceWorker.ready;
            // @ts-ignore
            await registration.sync.register("sync-presensi");
            toast.success("Sinyal terputus. Presensi disimpan & akan terkirim otomatis saat online.", { duration: 6000 });
          } else {
            // Fallback untuk iOS Safari yang tidak punya SyncManager
            toast.success("Presensi disimpan offline. Harap buka aplikasi kembali saat internet stabil.", { duration: 6000 });
          }
          
          router.push("/riwayat");
        } catch (idbError) {
          console.error("IDB Error:", idbError);
          toast.error("Gagal menyimpan presensi offline. Penyimpanan penuh atau tidak didukung.");
        }
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Memuat data kegiatan...</div>;
  }

  if (!kegiatan) return null;

  return (
    <div className="space-y-4 p-4 pb-20">
      <div className="flex items-center gap-2 pb-4 pt-2">
        <Button variant="ghost" size="icon" asChild className="size-8">
          <Link href="/kegiatan">
            <ArrowLeft size={18} />
          </Link>
        </Button>
        <h1 className="text-xl font-bold">Isi Presensi</h1>
      </div>

      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg">{kegiatan.nama_kegiatan}</CardTitle>
          <CardDescription>{kegiatan.lokasi}</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Lokasi Saat Ini</Label>
              {location ? (
                <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
                  <MapPin size={16} className="text-primary" />
                  <span>
                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-auto px-2 py-1"
                    onClick={getLocation}
                    disabled={locationLoading}
                  >
                    Perbarui
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 w-full border-dashed"
                  onClick={getLocation}
                  disabled={locationLoading}
                >
                  <MapPin className="mr-2" />
                  {locationLoading ? "Mendapatkan lokasi..." : "Dapatkan Lokasi"}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="bukti_foto">
                Bukti Foto Kehadiran <span className="text-destructive">*</span>
              </Label>
              <Input
                id="bukti_foto"
                type="file"
                accept="image/*"
                onChange={(event) => setBuktiFoto(event.target.files?.[0] || null)}
              />
              {buktiFoto && (
                <div className="relative mt-2 aspect-video overflow-hidden rounded-md border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(buktiFoto)}
                    alt="Preview"
                    className="size-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
              <Textarea
                id="keterangan"
                placeholder="Tambahkan catatan jika diperlukan..."
                value={keterangan}
                onChange={(event) => setKeterangan(event.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !location || !buktiFoto}>
              {isSubmitting ? "Mengirim..." : "Kirim Presensi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
