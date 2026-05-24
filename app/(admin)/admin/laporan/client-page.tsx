"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCsv, FilePdf, Funnel, MagnifyingGlass, Spinner, Users, CalendarCheck, ChartBar } from "@phosphor-icons/react";
import { format, subMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";

export default function LaporanClientPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "anggota";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  const [isLoading, setIsLoading] = useState(false);
  
  // Data States
  const [anggotaData, setAnggotaData] = useState<any[]>([]);
  const [kegiatanList, setKegiatanList] = useState<any[]>([]);
  const [kehadiranData, setKehadiranData] = useState<any[]>([]);
  
  // Filter States
  const [filterAngkatan, setFilterAngkatan] = useState("all");
  const [filterWaktu, setFilterWaktu] = useState("all"); // 'month', '6month', 'year', 'all'
  const [filterKegiatan, setFilterKegiatan] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resAnggota, resKegiatan, resKehadiran] = await Promise.all([
        api.get("/laporan/anggota"),
        api.get("/kegiatan"),
        api.get("/laporan/kehadiran")
      ]);
      
      if (resAnggota.success) setAnggotaData(resAnggota.data);
      if (resKegiatan.success) setKegiatanList(resKegiatan.data);
      if (resKehadiran.success) setKehadiranData(resKehadiran.data);
    } catch (error) {
      toast.error("Gagal mengambil data laporan");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for Date Filtering
  const isDateInFilter = (dateStr: string) => {
    if (filterWaktu === "all" || !dateStr) return true;
    
    const date = new Date(dateStr);
    const now = new Date();
    
    if (filterWaktu === "month") {
      return date >= startOfMonth(now) && date <= endOfMonth(now);
    } else if (filterWaktu === "6month") {
      return date >= subMonths(now, 6) && date <= now;
    } else if (filterWaktu === "year") {
      return date >= startOfYear(now) && date <= endOfYear(now);
    }
    return true;
  };

  // --- TAB 1: ANGGOTA DATA ---
  const filteredAnggota = anggotaData.filter(item => {
    const matchAngkatan = filterAngkatan === "all" || item.angkatan === filterAngkatan;
    const term = searchQuery.toLowerCase();
    const matchSearch = (item.nama_lengkap || "").toLowerCase().includes(term) || (item.nim || "").toLowerCase().includes(term);
    return matchAngkatan && matchSearch;
  });

  const getUniqAngkatan = () => Array.from(new Set(anggotaData.map(a => a.angkatan).filter(Boolean))).sort();

  // --- TAB 2: KEGIATAN DATA ---
  const filteredKehadiran = kehadiranData.filter(item => {
    const matchKegiatan = filterKegiatan === "all" || item.id_kegiatan.toString() === filterKegiatan;
    const matchWaktu = isDateInFilter(item.tanggal_kegiatan);
    const term = searchQuery.toLowerCase();
    const matchSearch = (item.nama_lengkap || "").toLowerCase().includes(term) || (item.nama_kegiatan || "").toLowerCase().includes(term);
    return matchKegiatan && matchWaktu && matchSearch;
  });

  // --- TAB 3: AGREGASI KEHADIRAN ---
  const getAgregasiKehadiran = () => {
    const map = new Map();
    const dataByTime = kehadiranData.filter(item => isDateInFilter(item.tanggal_kegiatan));
    
    dataByTime.forEach(item => {
      if (!map.has(item.id_anggota)) {
        map.set(item.id_anggota, {
          nama: item.nama_lengkap,
          nim: item.nim,
          angkatan: item.angkatan,
          hadir: 0,
          alpa: 0,
          pending: 0
        });
      }
      const stat = map.get(item.id_anggota);
      if (item.keterangan === "hadir") stat.hadir++;
      else if (item.keterangan === "tidak_hadir") stat.alpa++;
      else stat.pending++;
    });

    const res = Array.from(map.values()).filter(item => {
      const term = searchQuery.toLowerCase();
      return (item.nama || "").toLowerCase().includes(term) || (item.nim || "").toLowerCase().includes(term);
    });
    
    return res.sort((a, b) => b.hadir - a.hadir);
  };

  const agregasiKehadiran = getAgregasiKehadiran();

  // --- EXPORT FUNCTIONS ---
  const exportToCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = "";

    if (activeTab === "anggota") {
      headers = ["No", "No Anggota", "NIM", "Nama Lengkap", "Angkatan", "Program Studi", "Fakultas"];
      rows = filteredAnggota.map((item, i) => [
        i + 1, item.no_anggota || "-", item.nim || "-", `"${(item.nama_lengkap || "").replace(/"/g, '""')}"`, item.angkatan || "-", `"${(item.program_studi || "").replace(/"/g, '""')}"`, `"${(item.fakultas || "").replace(/"/g, '""')}"`
      ]);
      filename = `Laporan_Anggota_${format(new Date(), "yyyyMMdd")}.csv`;
    } else if (activeTab === "kegiatan") {
      headers = ["No", "Nama Kegiatan", "Tanggal", "Nama Anggota", "NIM", "Status"];
      rows = filteredKehadiran.map((item, i) => [
        i + 1, `"${(item.nama_kegiatan || "").replace(/"/g, '""')}"`, 
        item.tanggal_kegiatan ? format(new Date(item.tanggal_kegiatan), "yyyy-MM-dd") : "-",
        `"${(item.nama_lengkap || "").replace(/"/g, '""')}"`, item.nim || "-", 
        item.keterangan === "hadir" ? "Hadir" : item.keterangan === "tidak_hadir" ? "Alpa" : "Pending"
      ]);
      filename = `Laporan_Kegiatan_${format(new Date(), "yyyyMMdd")}.csv`;
    } else {
      headers = ["No", "Nama Lengkap", "NIM", "Angkatan", "Total Hadir", "Total Alpa", "Total Pending"];
      rows = agregasiKehadiran.map((item, i) => [
        i + 1, `"${(item.nama || "").replace(/"/g, '""')}"`, item.nim || "-", item.angkatan || "-", item.hadir, item.alpa, item.pending
      ]);
      filename = `Laporan_Keaktifan_${format(new Date(), "yyyyMMdd")}.csv`;
    }

    const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let title = "";
    let head: string[][] = [];
    let body: any[][] = [];

    if (activeTab === "anggota") {
      title = "Laporan Data Anggota UKM Risalah";
      head = [["No", "No Anggota", "NIM", "Nama Lengkap", "Angkatan", "Prodi"]];
      body = filteredAnggota.map((item, i) => [
        i + 1, item.no_anggota || "-", item.nim || "-", item.nama_lengkap || "-", item.angkatan || "-", item.program_studi || "-"
      ]);
    } else if (activeTab === "kegiatan") {
      title = "Laporan Kehadiran per Kegiatan UKM Risalah";
      head = [["No", "Kegiatan", "Tanggal", "Nama Anggota", "NIM", "Status"]];
      body = filteredKehadiran.map((item, i) => [
        i + 1, item.nama_kegiatan || "-", item.tanggal_kegiatan ? format(new Date(item.tanggal_kegiatan), "dd/MM/yyyy") : "-",
        item.nama_lengkap || "-", item.nim || "-", item.keterangan === "hadir" ? "Hadir" : item.keterangan === "tidak_hadir" ? "Alpa" : "Pending"
      ]);
    } else {
      title = "Laporan Rekapitulasi Keaktifan Anggota";
      head = [["No", "Nama Lengkap", "NIM", "Angkatan", "Total Hadir", "Total Alpa"]];
      body = agregasiKehadiran.map((item, i) => [
        i + 1, item.nama || "-", item.nim || "-", item.angkatan || "-", `${item.hadir}x`, `${item.alpa}x`
      ]);
    }

    doc.setFontSize(14);
    doc.text(title, 14, 15);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${format(new Date(), "dd MMM yyyy HH:mm")}`, 14, 22);

    autoTable(doc, {
      startY: 28,
      head,
      body,
      theme: 'grid',
      headStyles: { fillColor: [29, 158, 117] }, // emerald-600
      styles: { fontSize: 8 }
    });

    doc.save(`${title.replace(/ /g, "_")}_${format(new Date(), "yyyyMMdd")}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0d2318] tracking-tight">Pusat Laporan</h1>
          <p className="text-emerald-800/60 font-medium">Rekapitulasi data anggota, kegiatan, dan statistik keaktifan.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl shadow-sm">
            <FileCsv size={20} weight="bold" className="mr-2" /> CSV
          </Button>
          <Button onClick={exportToPDF} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200">
            <FilePdf size={20} weight="bold" className="mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} className="w-full space-y-4">

        {/* Global Filter Bar */}
        <Card className="border border-emerald-100 shadow-sm rounded-2xl bg-white/80 backdrop-blur-md">
          <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-end">
            <div className="relative w-full sm:max-w-xs">
              <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Pencarian</Label>
              <MagnifyingGlass className="absolute left-3 top-[28px] text-gray-400" size={18} />
              <Input 
                placeholder="Cari Nama / NIM..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-xl bg-gray-50 border-gray-200"
              />
            </div>

            {activeTab === "anggota" && (
              <div className="w-full sm:max-w-xs">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Filter Angkatan</Label>
                <Select value={filterAngkatan} onValueChange={setFilterAngkatan}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Semua Angkatan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Angkatan</SelectItem>
                    {getUniqAngkatan().map(th => (
                      <SelectItem key={th} value={th as string}>{th}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(activeTab === "kegiatan" || activeTab === "kehadiran") && (
              <div className="w-full sm:max-w-xs">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Filter Periode Waktu</Label>
                <Select value={filterWaktu} onValueChange={setFilterWaktu}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Semua Waktu" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Keseluruhan Waktu</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                    <SelectItem value="6month">6 Bulan Terakhir</SelectItem>
                    <SelectItem value="year">Tahun Ini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "kegiatan" && (
              <div className="w-full sm:max-w-xs">
                <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Filter Kegiatan Khusus</Label>
                <Select value={filterKegiatan} onValueChange={setFilterKegiatan}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Semua Kegiatan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kegiatan</SelectItem>
                    {kegiatanList.map(k => (
                      <SelectItem key={k.id_kegiatan} value={k.id_kegiatan.toString()}>{k.nama_kegiatan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="ml-auto flex items-center gap-2">
              <Button onClick={fetchData} variant="outline" size="icon" className="rounded-xl border-emerald-200 text-emerald-600">
                <Funnel size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* TAB 1: ANGGOTA */}
            <TabsContent value="anggota" className="m-0" forceMount={activeTab === "anggota" ? true : undefined} hidden={activeTab !== "anggota"}>
              <Card className="border border-emerald-100 shadow-sm rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
                <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 p-4">
                  <CardTitle className="text-lg font-bold text-[#0d2318]">Daftar Anggota ({filteredAnggota.length})</CardTitle>
                </CardHeader>
            <CardContent className="p-0">
              <Table wrapperClassName="max-h-[65vh]">
                <TableHeader className="sticky top-0 z-20 bg-emerald-50 shadow-sm">
                  <TableRow>
                    <TableHead className="font-bold text-[#0d2318]">No</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">Nama & Angkatan</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">NIM / No Anggota</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">Fakultas & Prodi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center"><Spinner className="animate-spin mx-auto text-emerald-600" size={32}/></TableCell></TableRow>
                  ) : filteredAnggota.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-gray-500">Tidak ada data</TableCell></TableRow>
                  ) : (
                    filteredAnggota.map((item, i) => (
                      <TableRow key={item.id_anggota}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>
                          <div className="font-bold text-[#0d2318]">{item.nama_lengkap}</div>
                          <Badge variant="outline" className="mt-1 text-[10px] bg-gray-50">Angkatan {item.angkatan || "-"}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium text-emerald-700">{item.nim || "-"}</div>
                          <div className="text-xs text-gray-500">{item.no_anggota || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-bold text-gray-900">{item.fakultas || "-"}</div>
                          <div className="text-xs text-gray-500">{item.program_studi || "-"}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

            {/* TAB 2: KEGIATAN */}
            <TabsContent value="kegiatan" className="m-0" forceMount={activeTab === "kegiatan" ? true : undefined} hidden={activeTab !== "kegiatan"}>
              <Card className="border border-emerald-100 shadow-sm rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
                <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 p-4">
                  <CardTitle className="text-lg font-bold text-[#0d2318]">Detail Kehadiran per Kegiatan ({filteredKehadiran.length} Catatan)</CardTitle>
                </CardHeader>
            <CardContent className="p-0">
              <Table wrapperClassName="max-h-[65vh]">
                <TableHeader className="sticky top-0 z-20 bg-emerald-50 shadow-sm">
                  <TableRow>
                    <TableHead className="font-bold text-[#0d2318]">No</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">Kegiatan</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">Nama Anggota</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">Status Hadir</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center"><Spinner className="animate-spin mx-auto text-emerald-600" size={32}/></TableCell></TableRow>
                  ) : filteredKehadiran.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-gray-500">Tidak ada data kehadiran di periode ini</TableCell></TableRow>
                  ) : (
                    filteredKehadiran.map((item, i) => (
                      <TableRow key={item.id_kehadiran}>
                        <TableCell className="font-medium">{i + 1}</TableCell>
                        <TableCell>
                          <div className="font-bold text-[#0d2318]">{item.nama_kegiatan}</div>
                          <div className="text-xs text-gray-500">{item.tanggal_kegiatan ? format(new Date(item.tanggal_kegiatan), "dd MMM yyyy", { locale: localeId }) : "-"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-gray-900">{item.nama_lengkap}</div>
                          <div className="text-xs text-emerald-700">{item.nim || "-"}</div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              item.keterangan === "hadir" ? "bg-emerald-500" :
                              item.keterangan === "tidak_hadir" ? "bg-red-500" : "bg-amber-500"
                            }
                          >
                            {item.keterangan === "hadir" ? "Hadir" : item.keterangan === "tidak_hadir" ? "Alpa" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

            {/* TAB 3: AGREGASI KEHADIRAN */}
            <TabsContent value="kehadiran" className="m-0" forceMount={activeTab === "kehadiran" ? true : undefined} hidden={activeTab !== "kehadiran"}>
              <Card className="border border-emerald-100 shadow-sm rounded-2xl overflow-hidden bg-white/70 backdrop-blur-xl">
                <CardHeader className="bg-emerald-50/30 border-b border-emerald-50 p-4">
                  <CardTitle className="text-lg font-bold text-[#0d2318]">Statistik Keaktifan Anggota</CardTitle>
                </CardHeader>
            <CardContent className="p-0">
              <Table wrapperClassName="max-h-[65vh]">
                <TableHeader className="sticky top-0 z-20 bg-emerald-50 shadow-sm">
                  <TableRow>
                    <TableHead className="font-bold text-[#0d2318]">Peringkat</TableHead>
                    <TableHead className="font-bold text-[#0d2318]">Nama Anggota</TableHead>
                    <TableHead className="font-bold text-center text-[#0d2318]">Total Hadir</TableHead>
                    <TableHead className="font-bold text-center text-[#0d2318]">Total Alpa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center"><Spinner className="animate-spin mx-auto text-emerald-600" size={32}/></TableCell></TableRow>
                  ) : agregasiKehadiran.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="h-40 text-center text-gray-500">Tidak ada rekap kehadiran</TableCell></TableRow>
                  ) : (
                    agregasiKehadiran.map((item, i) => (
                      <TableRow key={item.nim || i}>
                        <TableCell>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                            {i + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-[#0d2318]">{item.nama}</div>
                          <div className="text-xs text-gray-500">NIM: {item.nim || "-"} • Angkatan {item.angkatan || "-"}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold">
                            {item.hadir}x Hadir
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold">
                            {item.alpa}x Alpa
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
          </motion.div>
        </AnimatePresence>

      </Tabs>
    </div>
  );
}
