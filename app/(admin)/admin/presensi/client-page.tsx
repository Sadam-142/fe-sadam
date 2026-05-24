"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, HandHeart } from "@phosphor-icons/react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

export default function PresensiAdminClientPage() {
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  const [selectedKegiatan, setSelectedKegiatan] = useState<string>("");
  
  const [presensiList, setPresensiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchKegiatan = async () => {
      try {
        const res = await api.get("/kegiatan");
        if (res.success && Array.isArray(res.data)) {
          setKegiatanList(res.data);
          if (res.data.length > 0) {
            setSelectedKegiatan(res.data[0].id_kegiatan.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch kegiatan:", error);
      }
    };
    fetchKegiatan();
  }, []);

  useEffect(() => {
    if (!selectedKegiatan) return;

    const fetchPresensi = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/presensi/kegiatan/${selectedKegiatan}`);
        if (res.success && Array.isArray(res.data)) {
          setPresensiList(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch presensi:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPresensi();
  }, [selectedKegiatan]);

  const handleVerify = async (idKehadiran: number, status: string) => {
    try {
      const res = await api.post("/presensi/verifikasi", {
        id_kehadiran: idKehadiran,
        status: status
      });
      
      if (res.success) {
        toast.success(`Presensi berhasil diverifikasi sebagai: ${status}`);
        // Refresh table optimistically
        setPresensiList(prev => 
          prev.map(item => 
            item.id_kehadiran === idKehadiran 
              ? { ...item, keterangan: status, sync_status: "synced" } 
              : item
          )
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memverifikasi presensi");
    }
  };

  const getStatusBadge = (keterangan: string | null) => {
    switch(keterangan) {
      case "hadir":
        return <Badge className="bg-green-600">Hadir</Badge>;
      case "tidak_hadir":
        return <Badge variant="destructive">Tidak Hadir</Badge>;
      case "izin":
        return <Badge className="bg-indigo-500 hover:bg-indigo-600">Izin</Badge>;
      default:
        return <Badge variant="outline">Menunggu</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0d2318] tracking-tight">Verifikasi Presensi</h1>
        <p className="text-emerald-800/60 font-medium">Kelola dan verifikasi presensi peserta kegiatan.</p>
      </div>
      
      <Card className="bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <CardHeader className="border-b border-emerald-50">
          <CardTitle className="text-xl font-bold text-[#0d2318]">Daftar Presensi</CardTitle>
          <CardDescription className="text-emerald-800/60 font-medium">Pilih kegiatan untuk melihat dan memverifikasi presensi berdasarkan bukti foto.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 max-w-sm">
            <Select value={selectedKegiatan} onValueChange={setSelectedKegiatan}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kegiatan..." />
              </SelectTrigger>
              <SelectContent>
                {kegiatanList.map(k => {
                  let dateStr = k.tanggal_kegiatan;
                  try {
                    dateStr = format(new Date(k.tanggal_kegiatan.replace(" ", "T")), "d MMM yyyy", { locale: localeId });
                  } catch(e) {}
                  return (
                    <SelectItem key={k.id_kegiatan} value={k.id_kegiatan.toString()}>
                      {k.nama_kegiatan} ({dateStr})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border border-emerald-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Lokasi (Lat, Lng)</TableHead>
                  <TableHead>Bukti Foto</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi Verifikasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24">Memuat data presensi...</TableCell></TableRow>
                ) : !selectedKegiatan ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Silakan pilih kegiatan terlebih dahulu.</TableCell></TableRow>
                ) : presensiList.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center h-24 text-muted-foreground">Belum ada presensi untuk kegiatan ini.</TableCell></TableRow>
                ) : (
                  presensiList.map((item) => {
                    let waktu = "-";
                    try {
                      if (item.waktu_presensi) {
                         waktu = format(new Date(item.waktu_presensi.replace(" ", "T")), "HH:mm");
                      }
                    } catch(e) {}

                    return (
                      <TableRow key={item.id_kehadiran}>
                        <TableCell>
                          <div className="font-medium">{item.nama_lengkap}</div>
                          <div className="text-xs text-muted-foreground">{item.nim} • {item.no_anggota}</div>
                        </TableCell>
                        <TableCell>{waktu}</TableCell>
                        <TableCell>
                          {item.latitude && item.longitude ? (
                            <span className="text-xs text-muted-foreground">{item.latitude},<br/>{item.longitude}</span>
                          ) : "-"}
                        </TableCell>
                        <TableCell>
                          {item.bukti_foto ? (
                            <a href={item.bukti_foto} target="_blank" rel="noopener noreferrer" className="block w-16 h-16 rounded overflow-hidden border">
                              <img src={item.bukti_foto} alt="Bukti" className="w-full h-full object-cover" 
                                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=Invalid"; }} 
                              />
                            </a>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">Tanpa foto</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.keterangan)}
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleVerify(item.id_kehadiran, "hadir")}
                              title="Setujui (Hadir)"
                            >
                              <Check size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 border-indigo-200 hover:border-indigo-300"
                              onClick={() => handleVerify(item.id_kehadiran, "izin")}
                              title="Izin"
                            >
                              <HandHeart size={16} weight="duotone" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleVerify(item.id_kehadiran, "tidak_hadir")}
                              title="Tolak (Tidak Hadir)"
                            >
                              <X size={16} />
                            </Button>
                           </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
