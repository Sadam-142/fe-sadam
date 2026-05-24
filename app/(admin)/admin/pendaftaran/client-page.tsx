/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Check, X, Image as ImageIcon, Users } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PendaftaranClientPage() {
  const [pendaftaran, setPendaftaran] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAngkatan, setFilterAngkatan] = useState<string>("all");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get("/pendaftaran");
      if (res.success && Array.isArray(res.data)) {
        setPendaftaran(res.data);
      } else {
        setPendaftaran([]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to fetch:", err);
      setError(err.message || "Terjadi kesalahan saat memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleAction = async (idPendaftaran: number, status: string) => {
    try {
      const res = await api.patch(`/pendaftaran/${idPendaftaran}/status`, { status });
      if (res.success) {
        toast.success(`Status pendaftaran berhasil diubah menjadi ${status}`);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status pendaftaran");
    }
  };

  // Get unique sorted angkatan list from data
  const angkatanOptions = useMemo(() => {
    const all = pendaftaran
      .map((p) => p.angkatan)
      .filter((a) => a && a !== "");
    return [...new Set(all)].sort((a, b) => b.localeCompare(a)); // newest first
  }, [pendaftaran]);

  // Filtered data
  const filteredData = useMemo(() => {
    if (filterAngkatan === "all") return pendaftaran;
    return pendaftaran.filter((p) => p.angkatan === filterAngkatan);
  }, [pendaftaran, filterAngkatan]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0d2318] tracking-tight">Verifikasi Pendaftaran</h1>
        <p className="text-emerald-800/60 font-medium">
          Kelola data pendaftaran calon anggota baru.
        </p>
      </div>

      <Card className="bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <CardHeader className="border-b border-emerald-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl font-bold text-[#0d2318]">Data Pendaftar</CardTitle>

            {/* Filter Angkatan */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-emerald-800/70 whitespace-nowrap">Angkatan:</label>
              <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
                <SelectTrigger className="h-9 w-[160px] border-emerald-200 text-sm font-semibold text-emerald-800 focus:ring-emerald-400">
                  <SelectValue placeholder="Semua Angkatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Angkatan</SelectItem>
                  {angkatanOptions.map((angkatan) => (
                    <SelectItem key={angkatan} value={angkatan}>{angkatan}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-2 mt-2 pt-2">
            <Users size={14} weight="duotone" className="text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">
              Menampilkan <span className="text-emerald-600">{filteredData.length}</span> dari{" "}
              <span className="text-emerald-600">{pendaftaran.length}</span> pendaftar
              {filterAngkatan !== "all" && (
                <span className="ml-1 text-emerald-500">· Angkatan {filterAngkatan}</span>
              )}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error && <div className="p-4 mb-4 text-sm text-red-800 bg-red-50 rounded-lg">{error}</div>}
          <Table wrapperClassName="max-h-[65vh]">
            <TableHeader className="sticky top-0 z-20 bg-emerald-50 shadow-sm backdrop-blur-md">
              <TableRow className="hover:bg-transparent border-emerald-100">
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">No.</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">NIM</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Nama Lengkap</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Tempat, Tanggal Lahir</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Jenis Kelamin</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Email</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">No. HP</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Domisili</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Fakultas</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Prodi</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Angkatan</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Bidang Minat</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Akun IG</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Tanggal Daftar</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Bukti Dokumen</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Status</TableHead>
                <TableHead className="text-right whitespace-nowrap font-bold text-[#0d2318]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={17} className="h-24 text-center text-emerald-700/60 font-medium">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={17} className="h-24 text-center text-emerald-700/60 font-medium">
                      {filterAngkatan !== "all"
                        ? `Tidak ada pendaftar dari angkatan ${filterAngkatan}.`
                        : "Tidak ada data pendaftaran."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => {
                    return (
                      <TableRow key={item.id_pendaftaran} className="hover:bg-slate-50/50 border-emerald-50">
                        <TableCell>
                          <div className="font-semibold text-emerald-800/70 text-center">{index + 1}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-[#0d2318] whitespace-nowrap">{item.nim || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-[#0d2318] whitespace-nowrap">{item.nama_lengkap}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#0d2318] whitespace-nowrap">{item.tempat_lahir}, {item.tanggal_lahir ? format(new Date(item.tanggal_lahir), "dd MMM yyyy", { locale: id }) : "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#0d2318] whitespace-nowrap">{item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-black whitespace-nowrap">{item.email || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-black whitespace-nowrap">{item.no_hp || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-black whitespace-normal break-words min-w-[150px] max-w-[300px]">{item.alamat_domisili || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-bold text-[#0d2318] whitespace-nowrap">{item.fakultas || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700 font-medium whitespace-nowrap">{item.program_studi || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            {item.angkatan || "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-gray-700 max-w-[150px] truncate" title={item.bidang_minat}>
                            {item.bidang_minat || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-pink-600 whitespace-nowrap">{item.nama_akun_ig || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-[#0d2318] whitespace-nowrap">
                            {item.created_at ? format(new Date(item.created_at.replace(" ", "T")), "d MMM yyyy", { locale: id }) : "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                <ImageIcon className="mr-2" size={14} /> Lihat Berkas
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Dokumen Pendaftaran — {item.nama_lengkap}</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <div className="space-y-2">
                                  <h4 className="font-bold text-sm text-gray-700 bg-gray-50 p-2 rounded border">Bukti Follow Instagram</h4>
                                  {item.bukti_follow_ig ? (
                                    <img src={item.bukti_follow_ig} alt="IG" className="w-full rounded-md object-contain border" />
                                  ) : <div className="text-xs text-gray-400 italic p-4 text-center border rounded-md">Tidak ada file</div>}
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-bold text-sm text-gray-700 bg-gray-50 p-2 rounded border">Bukti Follow YouTube</h4>
                                  {item.bukti_follow_yt ? (
                                    <img src={item.bukti_follow_yt} alt="YT" className="w-full rounded-md object-contain border" />
                                  ) : <div className="text-xs text-gray-400 italic p-4 text-center border rounded-md">Tidak ada file</div>}
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-bold text-sm text-gray-700 bg-gray-50 p-2 rounded border">Bukti Follow TikTok</h4>
                                  {item.bukti_follow_tiktok ? (
                                    <img src={item.bukti_follow_tiktok} alt="TikTok" className="w-full rounded-md object-contain border" />
                                  ) : <div className="text-xs text-gray-400 italic p-4 text-center border rounded-md">Tidak ada file</div>}
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-bold text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">Bukti Pembayaran</h4>
                                  {item.bukti_pembayaran ? (
                                    <img src={item.bukti_pembayaran} alt="Bayar" className="w-full rounded-md object-contain border border-amber-200" />
                                  ) : <div className="text-xs text-amber-600/60 italic p-4 text-center border border-amber-200 rounded-md">Bayar Langsung (COD) / Tidak ada file</div>}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status_pendaftaran === "diterima"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                                : item.status_pendaftaran === "ditolak"
                                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                            }
                            variant="outline"
                          >
                            {item.status_pendaftaran}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {item.status_pendaftaran === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                                onClick={() => handleAction(item.id_pendaftaran, "diterima")}
                              >
                                <Check className="mr-1" size={14} /> Terima
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                onClick={() => handleAction(item.id_pendaftaran, "ditolak")}
                              >
                                <X className="mr-1" size={14} /> Tolak
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
