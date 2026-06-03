/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { ActivityAttendanceCard } from "@/components/admin/dashboard/activity-attendance-card";
import { api } from "@/lib/api";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { DashboardData } from "@/components/admin/dashboard/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { PencilSimple, Trash, Plus, CalendarBlank, Image as ImageIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function KegiatanClientPage() {
  const [kegiatan, setKegiatan] = useState<any[]>([]);
  const [attendanceByKegiatan, setAttendanceByKegiatan] = useState<DashboardData["charts"]["attendance_by_kegiatan"]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog States
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    nama_kegiatan: "",
    jenis_kegiatan: "",
    tanggal_kegiatan: "",
    waktu_mulai: "",
    waktu_selesai: "",
    lokasi: "",
    deskripsi: "",
    status_kegiatan: "",
    pamflet: null as File | null,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [kegiatanRes, dashboardRes] = await Promise.all([
        api.get("/kegiatan"),
        api.get("/laporan/dashboard?period=all"),
      ]);
      if (kegiatanRes.success && Array.isArray(kegiatanRes.data)) {
        setKegiatan(kegiatanRes.data);
      }
      if (dashboardRes.success) {
        setAttendanceByKegiatan(dashboardRes.data?.charts?.attendance_by_kegiatan ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleCreateClick = () => {
    setFormData({
      nama_kegiatan: "",
      jenis_kegiatan: "",
      tanggal_kegiatan: "",
      waktu_mulai: "",
      waktu_selesai: "",
      lokasi: "",
      deskripsi: "",
      status_kegiatan: "mendatang",
      pamflet: null,
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreate = async () => {
    try {
      const pamfletUrl = formData.pamflet ? await uploadImageToCloudinary(formData.pamflet) : undefined;
      const res = await api.post("/kegiatan", {
        ...formData,
        pamflet: pamfletUrl,
      });
      if (res.success) {
        toast.success("Kegiatan berhasil ditambahkan");
        setIsCreateDialogOpen(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menambahkan kegiatan");
    }
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setFormData({
      nama_kegiatan: item.nama_kegiatan || "",
      jenis_kegiatan: item.jenis_kegiatan || "",
      tanggal_kegiatan: item.tanggal_kegiatan ? item.tanggal_kegiatan.split(" ")[0] : "",
      waktu_mulai: item.waktu_mulai || "",
      waktu_selesai: item.waktu_selesai || "",
      lokasi: item.lokasi || "",
      deskripsi: item.deskripsi || "",
      status_kegiatan: item.status_kegiatan || "mendatang",
      pamflet: null,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedItem) return;
    try {
      const pamfletUrl = formData.pamflet ? await uploadImageToCloudinary(formData.pamflet) : undefined;
      const res = await api.put(`/kegiatan/${selectedItem.id_kegiatan}`, {
        ...formData,
        ...(pamfletUrl ? { pamflet: pamfletUrl } : {}),
      });
      if (res.success) {
        toast.success("Kegiatan berhasil diperbarui");
        setIsEditDialogOpen(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui kegiatan");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const res = await api.delete(`/kegiatan/${selectedItem.id_kegiatan}`);
      if (res.success) {
        toast.success("Kegiatan berhasil dihapus");
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus kegiatan");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("semua");

  const filteredKegiatan = kegiatan.filter((item) => {
    const matchesSearch = item.nama_kegiatan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenis = filterJenis === "semua" || item.jenis_kegiatan === filterJenis;
    return matchesSearch && matchesJenis;
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0d2318] tracking-tight">Kelola Kegiatan</h1>
          <p className="text-emerald-800/60 font-medium mt-1">Kelola jadwal kegiatan UKM Risalah.</p>
        </div>
        <Button 
          onClick={handleCreateClick}
          className="rounded-full bg-gradient-to-r from-[#008744] to-[#00c46b] hover:from-[#007038] hover:to-[#00a859] text-white shadow-lg shadow-emerald-600/20 px-6 h-12 text-sm font-bold transition-all"
        >
          <Plus className="mr-2" weight="bold" size={18} /> Tambah Kegiatan Baru
        </Button>
      </div>

      <ActivityAttendanceCard data={attendanceByKegiatan} />

      {/* ── FILTER & PENCARIAN MODERN ── */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-100/50 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-600/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Input 
            type="text" 
            placeholder="Cari nama kegiatan atau lokasi..." 
            className="pl-11 h-12 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] focus-visible:border-[#008744] w-full font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-auto min-w-[200px]">
          <Select value={filterJenis} onValueChange={setFilterJenis}>
            <SelectTrigger className="h-12 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold text-[#0d2318] focus:ring-[#008744]">
              <SelectValue placeholder="Semua Jenis Kegiatan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
              <SelectItem value="semua">Semua Jenis Kegiatan</SelectItem>
              <SelectItem value="rutin">Rutin</SelectItem>
              <SelectItem value="insidental">Insidental</SelectItem>
              <SelectItem value="kepanitiaan">Kepanitiaan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-emerald-100/50 shadow-sm overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-100 via-[#00c46b] to-emerald-100" />
        <CardHeader className="bg-emerald-50/30 border-b border-emerald-50">
          <CardTitle className="text-lg font-bold text-[#0d2318]">Daftar Kegiatan</CardTitle>
          <CardDescription className="text-emerald-700/70 font-medium">Tambah, ubah, hapus, atau cari kegiatan.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50">
                  <TableHead className="font-bold text-[#008744]">Nama Kegiatan</TableHead>
                  <TableHead className="font-bold text-[#008744]">Tanggal</TableHead>
                  <TableHead className="font-bold text-[#008744]">Waktu</TableHead>
                  <TableHead className="font-bold text-[#008744]">Lokasi</TableHead>
                  <TableHead className="font-bold text-[#008744]">Jenis</TableHead>
                  <TableHead className="font-bold text-[#008744]">Poster</TableHead>
                  <TableHead className="text-right font-bold text-[#008744]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center h-24 font-medium text-emerald-800">Memuat data...</TableCell></TableRow>
                ) : filteredKegiatan.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center h-24 font-medium text-emerald-800">Tidak ada kegiatan yang ditemukan</TableCell></TableRow>
                ) : (
                  filteredKegiatan.map((item) => {
                    let formattedDate = "-";
                    try {
                      if (item.tanggal_kegiatan) {
                        formattedDate = format(new Date(item.tanggal_kegiatan.replace(" ", "T")), "d MMM yyyy", { locale: localeId });
                      }
                    } catch(e) {}

                    return (
                      <TableRow key={item.id_kegiatan}>
                        <TableCell className="font-bold text-[#0d2318]">{item.nama_kegiatan}</TableCell>
                        <TableCell className="font-medium text-emerald-900/80">{formattedDate}</TableCell>
                        <TableCell className="font-medium text-emerald-900/80">{item.waktu_mulai} - {item.waktu_selesai}</TableCell>
                        <TableCell className="font-medium text-emerald-900/80">{item.lokasi}</TableCell>
                        <TableCell className="capitalize font-semibold text-[#008744]">
                          <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{item.jenis_kegiatan}</span>
                        </TableCell>
                        <TableCell>
                          {item.pamflet ? (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                                  <ImageIcon className="mr-2" size={14} weight="duotone" /> Lihat
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md rounded-2xl border-emerald-100/50 shadow-2xl">
                                <DialogHeader>
                                  <DialogTitle className="text-[#0d2318] font-bold">Poster Kegiatan</DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center mt-2 p-2 bg-emerald-50/30 rounded-xl border border-emerald-50">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img 
                                    src={item.pamflet} 
                                    alt="Poster Kegiatan" 
                                    className="max-w-full rounded-lg max-h-[65vh] object-contain shadow-sm" 
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-muted-foreground text-sm font-medium opacity-50">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => handleEditClick(item)}
                            title="Edit"
                            className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                          >
                            <PencilSimple size={16} weight="duotone" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            onClick={() => handleDeleteClick(item)}
                            title="Hapus"
                            className="rounded-full bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white border border-rose-200 hover:border-rose-500 transition-colors shadow-none"
                          >
                            <Trash size={16} weight="duotone" />
                          </Button>
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

      {/* ── DIALOG TAMBAH MODERN ── */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh] rounded-3xl border-emerald-100 shadow-2xl p-0 bg-white/95 backdrop-blur-xl">
          <div className="h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-[#0d2318] via-[#008744] to-[#00c46b]" />
          <div className="p-6 pt-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black text-[#0d2318]">Tambah Kegiatan Baru</DialogTitle>
              <DialogDescription className="text-emerald-800/60 font-medium">
                Lengkapi rincian formulir di bawah ini untuk menjadwalkan kegiatan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-2">
              <div className="grid gap-2">
                <Label htmlFor="create_nama_kegiatan" className="font-bold text-[#0d2318]">Nama Kegiatan</Label>
                <Input
                  id="create_nama_kegiatan"
                  placeholder="Cth: Rapat Rutin Bulanan"
                  className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                  value={formData.nama_kegiatan}
                  onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create_jenis" className="font-bold text-[#0d2318]">Jenis Kegiatan</Label>
                <Select 
                  value={formData.jenis_kegiatan} 
                  onValueChange={(v) => setFormData({ ...formData, jenis_kegiatan: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold focus:ring-[#008744]">
                    <SelectValue placeholder="Pilih jenis..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
                    <SelectItem value="rutin">Rutin</SelectItem>

                    <SelectItem value="kepanitiaan">Pelatihan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 flex-col items-start">
                <Label htmlFor="create_tanggal" className="font-bold text-[#0d2318]">Tanggal Pelaksanaan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-medium h-11 rounded-xl border-emerald-100 bg-emerald-50/30 hover:bg-emerald-100/50",
                        !formData.tanggal_kegiatan && "text-muted-foreground"
                      )}
                    >
                      <CalendarBlank className="mr-3 h-5 w-5 text-emerald-600" />
                      {formData.tanggal_kegiatan ? format(new Date(formData.tanggal_kegiatan), "PPP", { locale: localeId }) : <span>Pilih tanggal di kalender</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border-emerald-100 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_kegiatan ? new Date(formData.tanggal_kegiatan) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, "yyyy-MM-dd");
                          setFormData({ ...formData, tanggal_kegiatan: formatted });
                        }
                      }}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="create_waktu_mulai" className="font-bold text-[#0d2318]">Waktu Mulai</Label>
                  <Input
                    id="create_waktu_mulai"
                    type="time"
                    className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                    value={formData.waktu_mulai}
                    onChange={(e) => setFormData({ ...formData, waktu_mulai: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create_waktu_selesai" className="font-bold text-[#0d2318]">Waktu Selesai</Label>
                  <Input
                    id="create_waktu_selesai"
                    type="time"
                    className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                    value={formData.waktu_selesai}
                    onChange={(e) => setFormData({ ...formData, waktu_selesai: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create_lokasi" className="font-bold text-[#0d2318]">Lokasi</Label>
                <Input
                  id="create_lokasi"
                  placeholder="Cth: Ruang Sekre UKM Risalah"
                  className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create_deskripsi" className="font-bold text-[#0d2318]">Deskripsi (Opsional)</Label>
                <Textarea
                  id="create_deskripsi"
                  placeholder="Tuliskan catatan atau rincian kegiatan..."
                  className="rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium min-h-[80px]"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create_status" className="font-bold text-[#0d2318]">Status Awal</Label>
                <Select 
                  value={formData.status_kegiatan} 
                  onValueChange={(v) => setFormData({ ...formData, status_kegiatan: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold focus:ring-[#008744]">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
                    <SelectItem value="mendatang">Mendatang</SelectItem>
                    <SelectItem value="berlangsung">Berlangsung</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create_pamflet" className="font-bold text-[#0d2318]">Poster / Pamflet</Label>
                <Input
                  id="create_pamflet"
                  type="file"
                  accept="image/*"
                  className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] file:bg-emerald-100 file:text-emerald-800 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-full hover:file:bg-emerald-200"
                  onChange={(e) => setFormData({ ...formData, pamflet: e.target.files?.[0] || null })}
                />
              </div>
            </div>
            <DialogFooter className="mt-4 border-t border-emerald-50 pt-4">
              <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50" onClick={() => setIsCreateDialogOpen(false)}>Batal</Button>
              <Button className="rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold" onClick={handleCreate}>Simpan Kegiatan</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG EDIT MODERN ── */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] overflow-y-auto max-h-[90vh] rounded-3xl border-emerald-100 shadow-2xl p-0 bg-white/95 backdrop-blur-xl">
          <div className="h-1.5 w-full rounded-t-3xl bg-gradient-to-r from-[#0d2318] via-[#008744] to-[#00c46b]" />
          <div className="p-6 pt-4">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black text-[#0d2318]">Edit Kegiatan</DialogTitle>
              <DialogDescription className="text-emerald-800/60 font-medium">
                Perbarui rincian informasi kegiatan di bawah ini.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-5 py-2">
              <div className="grid gap-2">
                <Label htmlFor="nama_kegiatan" className="font-bold text-[#0d2318]">Nama Kegiatan</Label>
                <Input
                  id="nama_kegiatan"
                  className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                  value={formData.nama_kegiatan}
                  onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jenis" className="font-bold text-[#0d2318]">Jenis Kegiatan</Label>
                <Select
                  value={formData.jenis_kegiatan}
                  onValueChange={(v) => setFormData({ ...formData, jenis_kegiatan: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold focus:ring-[#008744]">
                    <SelectValue placeholder="Pilih jenis..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
                    <SelectItem value="rutin">Rutin</SelectItem>
                    <SelectItem value="insidental">Insidental</SelectItem>
                    <SelectItem value="kepanitiaan">Kepanitiaan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 flex-col items-start">
                <Label htmlFor="tanggal" className="font-bold text-[#0d2318]">Tanggal Pelaksanaan</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-medium h-11 rounded-xl border-emerald-100 bg-emerald-50/30 hover:bg-emerald-100/50",
                        !formData.tanggal_kegiatan && "text-muted-foreground"
                      )}
                    >
                      <CalendarBlank className="mr-3 h-5 w-5 text-emerald-600" />
                      {formData.tanggal_kegiatan ? format(new Date(formData.tanggal_kegiatan), "PPP", { locale: localeId }) : <span>Pilih tanggal</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 rounded-2xl border-emerald-100 shadow-xl" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.tanggal_kegiatan ? new Date(formData.tanggal_kegiatan) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formatted = format(date, "yyyy-MM-dd");
                          setFormData({ ...formData, tanggal_kegiatan: formatted });
                        }
                      }}
                      initialFocus
                      className="p-3"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="waktu_mulai" className="font-bold text-[#0d2318]">Waktu Mulai</Label>
                  <Input
                    id="waktu_mulai"
                    type="time"
                    className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                    value={formData.waktu_mulai}
                    onChange={(e) => setFormData({ ...formData, waktu_mulai: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="waktu_selesai" className="font-bold text-[#0d2318]">Waktu Selesai</Label>
                  <Input
                    id="waktu_selesai"
                    type="time"
                    className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                    value={formData.waktu_selesai}
                    onChange={(e) => setFormData({ ...formData, waktu_selesai: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lokasi" className="font-bold text-[#0d2318]">Lokasi</Label>
                <Input
                  id="lokasi"
                  className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deskripsi" className="font-bold text-[#0d2318]">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  className="rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] font-medium min-h-[80px]"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status" className="font-bold text-[#0d2318]">Status</Label>
                <Select
                  value={formData.status_kegiatan}
                  onValueChange={(v) => setFormData({ ...formData, status_kegiatan: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold focus:ring-[#008744]">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
                    <SelectItem value="mendatang">Mendatang</SelectItem>
                    <SelectItem value="berlangsung">Berlangsung</SelectItem>
                    <SelectItem value="selesai">Selesai</SelectItem>
                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_pamflet" className="font-bold text-[#0d2318]">Ganti Poster / Pamflet</Label>
                <Input
                  id="edit_pamflet"
                  type="file"
                  accept="image/*"
                  className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 focus-visible:ring-[#008744] file:bg-emerald-100 file:text-emerald-800 file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-full hover:file:bg-emerald-200"
                  onChange={(e) => setFormData({ ...formData, pamflet: e.target.files?.[0] || null })}
                />
                <span className="text-xs font-semibold text-emerald-600/70">Biarkan kosong jika tidak ingin mengubah poster saat ini.</span>
              </div>
            </div>
            <DialogFooter className="mt-4 border-t border-emerald-50 pt-4">
              <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
              <Button className="rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold" onClick={handleUpdate}>Simpan Perubahan</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* AlertDialog Delete */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-rose-100 shadow-2xl p-0 bg-white/95 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400" />
          <div className="p-6">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100">
                  <Trash size={22} weight="duotone" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-black text-[#0d2318]">Hapus Kegiatan</AlertDialogTitle>
                  <AlertDialogDescription className="text-emerald-800/60 font-medium">
                    Kegiatan <strong className="text-rose-600">{selectedItem?.nama_kegiatan}</strong> akan dihapus permanen.
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="border-t border-rose-50 pt-4">
              <AlertDialogCancel className="rounded-xl border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50">Batal</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-md shadow-rose-500/20">
                Ya, Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
