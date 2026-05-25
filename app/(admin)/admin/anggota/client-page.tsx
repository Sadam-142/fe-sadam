/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { PencilSimple, Trash, MagnifyingGlass } from "@phosphor-icons/react";
import { toast } from "sonner";
import React from "react";

export default function AnggotaClientPage() {
  const [anggota, setAnggota] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dialog States
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    role: "",
    status_anggota: "",
  });

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("all");

  const uniqueAngkatan = React.useMemo(() => {
    const angkatans = new Set<string>();
    anggota.forEach(a => {
      if (a.angkatan) {
        angkatans.add(a.angkatan.toString());
      } else if (a.no_anggota && a.no_anggota.length >= 4) {
         const year = a.no_anggota.substring(0, 4);
         if (!isNaN(Number(year))) angkatans.add(year);
      }
    });
    return Array.from(angkatans).sort((a, b) => b.localeCompare(a));
  }, [anggota]);

  const filteredAnggota = React.useMemo(() => {
    return anggota.filter((item) => {
      const matchName = (item.nama_lengkap || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (item.username || "").toLowerCase().includes(searchQuery.toLowerCase());
      
      const itemAngkatan = item.angkatan?.toString() || (item.no_anggota ? item.no_anggota.substring(0, 4) : "");
      const matchAngkatan = filterAngkatan === "all" ? true : itemAngkatan === filterAngkatan;
      
      return matchName && matchAngkatan;
    });
  }, [anggota, searchQuery, filterAngkatan]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/anggota");
      if (res.success && Array.isArray(res.data)) {
        setAnggota(res.data);
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

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setFormData({
      role: item.role || "user",
      status_anggota: item.status_anggota || "aktif",
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
      const res = await api.put(`/anggota/${selectedItem.id_anggota}`, formData);
      if (res.success) {
        toast.success("Data anggota berhasil diperbarui");
        setIsEditDialogOpen(false);
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui data anggota");
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      const res = await api.delete(`/anggota/${selectedItem.id_anggota}`);
      if (res.success) {
        toast.success("Data anggota berhasil dihapus");
        fetchData();
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus data anggota");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-[#0d2318] tracking-tight">Data Anggota</h1>
        <p className="text-emerald-800/60 font-medium">Kelola anggota aktif UKM Risalah.</p>
      </div>
      <Card className="bg-white/90 backdrop-blur-xl border-emerald-100/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <CardHeader className="border-b border-emerald-50">
          <CardTitle className="text-xl font-bold text-[#0d2318]">Data Anggota</CardTitle>
          <CardDescription className="text-emerald-800/60 font-medium">Ubah peran atau hapus akses anggota sistem.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:max-w-xs">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-800/60" size={18} />
              <Input 
                placeholder="Cari nama atau username..." 
                className="pl-9 border-emerald-100 focus-visible:ring-emerald-500 rounded-xl bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px]">
              <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Semua Angkatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Angkatan</SelectItem>
                  {uniqueAngkatan.map(year => (
                    <SelectItem key={year} value={year}>Angkatan {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Table wrapperClassName="max-h-[65vh]">
              <TableHeader className="sticky top-0 z-20 bg-emerald-50 shadow-sm backdrop-blur-md">
                <TableRow className="hover:bg-transparent border-emerald-100">
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">No.Anggota</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">NIM</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Nama Anggota</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Tempat, Tanggal Lahir</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Jenis Kelamin</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Email</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">No. HP</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Domisili</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Fakultas</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Program Studi</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Angkatan</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Bidang Minat</TableHead>
                  <TableHead className="whitespace-nowrap font-bold text-[#0d2318]">Peran & Status</TableHead>
                  <TableHead className="text-right whitespace-nowrap font-bold text-[#0d2318]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={14} className="text-center h-24 text-emerald-800/60 font-medium">Memuat...</TableCell></TableRow>
                ) : filteredAnggota.length === 0 ? (
                  <TableRow><TableCell colSpan={14} className="text-center h-24 text-emerald-800/60 font-medium">
                    {anggota.length === 0 ? "Belum ada anggota." : "Tidak ada anggota yang cocok dengan filter pencarian."}
                  </TableCell></TableRow>
                ) : (
                  filteredAnggota.map((item) => (
                    <TableRow key={item.id_anggota}>
                      <TableCell className="font-medium whitespace-nowrap">{item.no_anggota || "-"}</TableCell>
                      <TableCell>
                        {item.nim ? (
                          <div className="font-medium text-[#0d2318] whitespace-nowrap">{item.nim}</div>
                        ) : (
                          <span className="text-emerald-800/60 text-xs italic">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-[#0d2318] whitespace-nowrap">{item.nama_lengkap || item.username}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-[#0d2318] whitespace-nowrap">{item.tempat_lahir || "-"}, {item.tanggal_lahir ? format(new Date(item.tanggal_lahir), "dd MMM yyyy", { locale: id }) : "-"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-[#0d2318] whitespace-nowrap">{item.jenis_kelamin === "L" ? "Laki-laki" : item.jenis_kelamin === "P" ? "Perempuan" : "-"}</div>
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
                        <span className="text-black text-sm font-medium whitespace-nowrap">{item.program_studi || "-"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-[#0d2318] whitespace-nowrap">{item.angkatan || (item.no_anggota ? item.no_anggota.substring(0, 4) : "-")}</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-700 max-w-[150px] truncate" title={item.bidang_minat}>
                          {item.bidang_minat || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex flex-col gap-2 items-start">
                          <Badge variant="outline" className="capitalize border-emerald-200 text-emerald-700 bg-emerald-50 text-[10px] h-5 px-2">
                            {item.role}
                          </Badge>
                          <Badge 
                            variant={item.status_anggota === "aktif" ? "default" : "secondary"} 
                            className={item.status_anggota === "aktif" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                          >
                            {item.status_anggota || "aktif"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(item)}
                            title="Edit"
                            className="h-8 w-8 p-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 rounded-lg"
                          >
                            <PencilSimple size={15} weight="duotone" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(item)}
                            title="Hapus"
                            className="h-8 w-8 p-0 border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 rounded-lg"
                          >
                            <Trash size={15} weight="duotone" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog Edit */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl border-emerald-100 shadow-2xl p-0 bg-white/95 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0d2318] via-[#008744] to-[#00c46b]" />
          <div className="p-6 pt-4">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <PencilSimple size={20} weight="duotone" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-[#0d2318]">Edit Akun Anggota</DialogTitle>
                  <DialogDescription className="text-emerald-800/60 font-medium">
                    Ubah peran atau status akun milik <strong className="text-emerald-700">{selectedItem?.nama_lengkap || selectedItem?.username}</strong>.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="role" className="font-bold text-[#0d2318]">Peran (Role)</Label>
                <Select
                  value={formData.role}
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold focus:ring-[#008744]">
                    <SelectValue placeholder="Pilih peran..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status" className="font-bold text-[#0d2318]">Status Akun</Label>
                <Select
                  value={formData.status_anggota}
                  onValueChange={(v) => setFormData({ ...formData, status_anggota: v })}
                >
                  <SelectTrigger className="h-11 rounded-xl border-emerald-100 bg-emerald-50/30 font-semibold focus:ring-[#008744]">
                    <SelectValue placeholder="Pilih status..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-emerald-100 shadow-xl font-medium">
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                    <SelectItem value="diblokir">Diblokir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4 border-t border-emerald-50 pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-xl border-emerald-200 text-emerald-800 font-semibold hover:bg-emerald-50">Batal</Button>
              <Button onClick={handleUpdate} className="rounded-xl bg-[#008744] hover:bg-[#007038] text-white font-bold">Simpan Perubahan</Button>
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
                  <AlertDialogTitle className="text-xl font-black text-[#0d2318]">Hapus Anggota</AlertDialogTitle>
                  <AlertDialogDescription className="text-emerald-800/60 font-medium">
                    Akun <strong className="text-rose-600">{selectedItem?.nama_lengkap || selectedItem?.username}</strong> akan dihapus permanen dan tidak dapat dikembalikan.
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
