/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { pendaftaranSchema, PendaftaranFormData } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, CalendarBlank, InstagramLogo, YoutubeLogo, TiktokLogo, WhatsappLogo } from "@phosphor-icons/react";

const FAKULTAS_PRODI = {
  "Fakultas Dakwah dan Komunikasi": [
    "Bimbingan Penyuluhan Islam",
    "Komunikasi dan Penyiaran Islam",
    "Manajemen Dakwah",
    "Pengembangan Masyarakat Islam",
    "Manajemen Haji dan Umrah"
  ],
  "Fakultas Syariah dan Hukum": [
    "Hukum Keluarga Islam",
    "Hukum Pidana Islam",
    "Hukum Ekonomi Syariah",
    "Ilmu Falak",
    "Ilmu Hukum"
  ],
  "Fakultas Ilmu Tarbiyah dan Keguruan": [
    "Pendidikan Agama Islam",
    "Pendidikan Bahasa Arab",
    "Manajemen Pendidikan Islam",
    "Pendidikan Bahasa Inggris",
    "Pendidikan Guru Madrasah Ibtidaiyah",
    "Pendidikan Islam Anak Usia Dini"
  ],
  "Fakultas Ushuluddin dan Humaniora": [
    "Aqidah dan Filsafat Islam",
    "Ilmu Al-Qur’an dan Tafsir",
    "Studi Agama-Agama",
    "Tasawuf dan Psikoterapi",
    "Ilmu Seni dan Arsitektur Islam",
    "Ilmu Hadis"
  ],
  "Fakultas Ekonomi dan Bisnis Islam": [
    "Ekonomi Syariah",
    "Perbankan Syariah",
    "Akuntansi Syariah",
    "Manajemen",
    "Bisnis Digital"
  ],
  "Fakultas Ilmu Sosial dan Politik": [
    "Ilmu Politik",
    "Sosiologi",
    "Perpustakaan dan Sains Informasi"
  ],
  "Fakultas Psikologi dan Kesehatan": [
    "Psikologi",
    "Gizi"
  ],
  "Fakultas Sains dan Teknologi": [
    "Biologi",
    "Fisika",
    "Kimia",
    "Matematika",
    "Pendidikan Matematika",
    "Pendidikan Fisika",
    "Pendidikan Kimia",
    "Pendidikan Biologi",
    "Teknologi Informasi",
    "Teknik Lingkungan"
  ],
  "Fakultas Kedokteran": [
    "Kedokteran"
  ]
};

const STEPS = [
  { id: "data-diri", title: "Data Diri" },
  { id: "akademik", title: "Akademik" },
  { id: "sosmed-pembayaran", title: "Sosmed & Pembayaran" },
  { id: "review", title: "Review & Kirim" },
];

export function PendaftaranForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("BRI");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<PendaftaranFormData>({
    resolver: zodResolver(pendaftaranSchema),
    defaultValues: {
      jenis_kelamin: "L",
      bidang_minat: [],
  });

  // Extract onChange from register to add custom validation logic
  const { onChange: onChangeIg, ...restIg } = register("bukti_follow_ig");
  const { onChange: onChangeYt, ...restYt } = register("bukti_follow_yt");
  const { onChange: onChangeTiktok, ...restTiktok } = register("bukti_follow_tiktok");
  const { onChange: onChangePembayaran, ...restPembayaran } = register("bukti_pembayaran");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, hookFormOnChange: any) => {
    const file = e.target.files?.[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file " + file.name + " terlalu besar! (Maksimal 5MB). Silakan kompres foto Anda terlebih dahulu.");
      e.target.value = ""; // Reset input
    }
    hookFormOnChange(e);
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (currentStep === 0) {
      fieldsToValidate = ["email", "nama_lengkap", "jenis_kelamin", "tempat_lahir", "tanggal_lahir", "alamat_domisili", "no_hp"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["fakultas", "program_studi", "angkatan", "bidang_minat"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["nama_akun_ig", "bukti_follow_ig", "bukti_follow_yt", "bukti_follow_tiktok"];
      if (paymentMethod !== "COD") {
        fieldsToValidate.push("bukti_pembayaran");
      }
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (data: PendaftaranFormData) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (["bukti_follow_ig", "bukti_follow_yt", "bukti_follow_tiktok", "bukti_pembayaran"].includes(key)) {
          const fileList = data[key as keyof PendaftaranFormData] as FileList;
          if (fileList && fileList.length > 0) {
            formData.append(key, fileList[0]);
          }
        } else if (key === "bidang_minat") {
          formData.append("bidang_minat", (data.bidang_minat as string[]).join(", "));
        } else {
          formData.append(key, data[key as keyof PendaftaranFormData] as string);
        }
      });
      const res = await api.post("/pendaftaran", formData);
      
      if (res.success) {
        setIsSuccess(true);
        toast.success("Pendaftaran berhasil dikirim");
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal mengirim pendaftaran");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div 
        className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* BACKGROUND ELEGANT */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 w-full h-full">
            <img src="/images/bg-login.jpeg" alt="Background" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[10px]" />
        </div>

        <Card className="relative z-10 w-full max-w-md text-center border border-white/40 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-[#1D9E75] to-[#0f6c4e] text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#1D9E75]/30">
            <Check size={40} weight="bold" />
          </div>
          <h2 className="text-3xl font-black text-[#0a1f16] mb-3 tracking-tight">Pendaftaran Berhasil!</h2>
          <p className="text-[15px] font-medium text-gray-600 mb-8 leading-relaxed">
            Data pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi.
          </p>
          <Button onClick={() => router.push("/")} className="w-full bg-[#1D9E75] hover:bg-[#15805e] text-white rounded-2xl h-14 font-bold text-[15px] shadow-lg shadow-[#1D9E75]/20 transition-all">
            Kembali ke Beranda
          </Button>
        </Card>
      </div>
    );
  }

  const formData = watch();

  return (
    <div 
      className="relative min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── BACKGROUND ELEGANT ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full">
          <img src="/images/bg-login.jpeg" alt="Background" className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
        </div>
        <div className="absolute inset-0 bg-[#f4f9f7]/90 backdrop-blur-[12px]" />
        
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#1D9E75]/10 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-200/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
        
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0a1f16] tracking-tight">
            Formulir <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9E75] to-[#12bd87]">Pendaftaran</span>
          </h2>
          <p className="text-[13px] sm:text-[15px] text-[#4a5e51] font-medium">
            Gerbang Orientasi Dasar Ilmu Tilawah Al-Quran Saintek (ORDITAS)
          </p>
        </div>

        {/* STEP INDICATOR */}
        <div className="flex justify-between items-start mb-8 relative max-w-2xl mx-auto px-2 sm:px-6">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === idx;
            const isDone = currentStep > idx;
            const isLast = idx === STEPS.length - 1;
            
            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative group">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="absolute top-5 left-1/2 w-full h-[3px] bg-gray-200/70 -z-10">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1D9E75] to-[#12bd87] transition-all duration-500 ease-in-out"
                      style={{ width: isDone ? "100%" : "0%" }}
                    />
                  </div>
                )}
                
                {/* Step Circle */}
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold border-[3px] transition-all duration-500 shadow-sm relative z-10",
                  isDone ? "bg-[#1D9E75] border-[#1D9E75] text-white scale-100" : 
                  isActive ? "bg-white border-[#1D9E75] text-[#1D9E75] scale-110 shadow-md shadow-[#1D9E75]/20" : 
                  "bg-white border-gray-300 text-gray-400 scale-95"
                )}>
                  {isDone ? <Check size={18} weight="bold" /> : idx + 1}
                </div>
                
                {/* Step Label */}
                <span className={cn(
                  "text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden sm:block transition-colors duration-500 mt-3 text-center",
                  isDone || isActive ? "text-[#1D9E75]" : "text-gray-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* MAIN CARD */}
        <Card className="border border-white/60 shadow-[0_30px_60px_rgba(29,158,117,0.08)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 w-full bg-gradient-to-r from-[#0a1f16] via-[#1D9E75] to-amber-300" />
          <CardHeader className="border-b border-gray-100/50 bg-gradient-to-b from-[#1D9E75]/5 to-transparent pb-6 pt-8 px-8">
            <CardTitle className="text-2xl sm:text-3xl font-black text-[#0a1f16] tracking-tight">{STEPS[currentStep].title}</CardTitle>
            <CardDescription className="text-[14px] text-gray-500 font-medium">Lengkapi data pendaftaran UKM Risalah dengan saksama di bawah ini.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* STEP 1: DATA DIRI */}
              {currentStep === 0 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Email Aktif</Label>
                    <Input type="email" placeholder="contoh@gmail.com" className="h-12 rounded-xl" {...register("email")} />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Nama Lengkap</Label>
                    <Input placeholder="Nama sesuai KTM" className="h-12 rounded-xl" {...register("nama_lengkap")} />
                    {errors.nama_lengkap && <p className="text-xs text-red-500">{errors.nama_lengkap.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Jenis Kelamin</Label>
                    <RadioGroup onValueChange={(val) => setValue("jenis_kelamin", val as any)} defaultValue={watch("jenis_kelamin")} className="flex gap-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="L" id="L" className="text-[#1D9E75] focus:ring-[#1D9E75]" />
                        <Label htmlFor="L">Laki-laki</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="P" id="P" className="text-[#1D9E75] focus:ring-[#1D9E75]" />
                        <Label htmlFor="P">Perempuan</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700 uppercase">Tempat Lahir</Label>
                      <Input placeholder="Kota Lahir" className="h-12 rounded-xl" {...register("tempat_lahir")} />
                      {errors.tempat_lahir && <p className="text-xs text-red-500">{errors.tempat_lahir.message}</p>}
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <Label className="text-xs font-bold text-gray-700 uppercase">Tanggal Lahir</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("h-12 rounded-xl justify-start text-left font-normal", !formData.tanggal_lahir && "text-muted-foreground")}>
                            <CalendarBlank className="mr-2 h-4 w-4" />
                            {formData.tanggal_lahir ? format(new Date(formData.tanggal_lahir), "PPP", { locale: localeId }) : <span>Pilih Tanggal</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={formData.tanggal_lahir ? new Date(formData.tanggal_lahir) : undefined}
                            onSelect={(date) => date && setValue("tanggal_lahir", format(date, "yyyy-MM-dd"), { shouldValidate: true })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.tanggal_lahir && <p className="text-xs text-red-500">{errors.tanggal_lahir.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Alamat Domisili</Label>
                    <Input placeholder="Alamat lengkap saat ini" className="h-12 rounded-xl" {...register("alamat_domisili")} />
                    {errors.alamat_domisili && <p className="text-xs text-red-500">{errors.alamat_domisili.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Nomor WhatsApp</Label>
                    <Input type="tel" placeholder="08xxxxxxxxxx" className="h-12 rounded-xl" {...register("no_hp")} />
                    {errors.no_hp && <p className="text-xs text-red-500">{errors.no_hp.message}</p>}
                  </div>
                </div>
              )}

              {/* STEP 2: AKADEMIK */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Nomor Induk Mahasiswa (NIM)</Label>
                    <Input placeholder="Masukkan NIM Anda" className="h-12 rounded-xl" {...register("nim")} />
                    {errors.nim && <p className="text-xs text-red-500">{errors.nim.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Fakultas</Label>
                    <Select 
                      onValueChange={(val) => {
                        setValue("fakultas", val, { shouldValidate: true });
                        setValue("program_studi", "", { shouldValidate: true }); // reset prodi when fakultas changes
                      }} 
                      value={watch("fakultas")}
                    >
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Pilih Fakultas" /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(FAKULTAS_PRODI).map((fakultas) => (
                          <SelectItem key={fakultas} value={fakultas}>{fakultas}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fakultas && <p className="text-xs text-red-500">{errors.fakultas.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-gray-700 uppercase">Program Studi</Label>
                    <Select 
                      onValueChange={(val) => setValue("program_studi", val, { shouldValidate: true })} 
                      value={watch("program_studi")}
                      disabled={!watch("fakultas")}
                    >
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder={watch("fakultas") ? "Pilih Program Studi" : "Pilih Fakultas terlebih dahulu"} /></SelectTrigger>
                      <SelectContent>
                        {(FAKULTAS_PRODI[watch("fakultas") as keyof typeof FAKULTAS_PRODI] || []).map((prodi) => (
                          <SelectItem key={prodi} value={prodi}>{prodi}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.program_studi && <p className="text-xs text-red-500">{errors.program_studi.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700 uppercase">Angkatan (Tahun Masuk)</Label>
                      <Input type="number" placeholder="2024" className="h-12 rounded-xl" {...register("angkatan")} />
                      {errors.angkatan && <p className="text-xs text-red-500">{errors.angkatan.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-gray-700 uppercase">Bidang yang Diminati</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { value: "Kaligrafi", emoji: "🖊️" },
                          { value: "Tilawah", emoji: "📖" },
                          { value: "Dai dan MSQ", emoji: "🎤" },
                          { value: "Rebana", emoji: "🥁" },
                        ].map((item) => {
                          const selected = (watch("bidang_minat") || []).includes(item.value);
                          return (
                            <button
                              key={item.value}
                              type="button"
                              onClick={() => {
                                const current = watch("bidang_minat") || [];
                                const updated = selected ? current.filter((v) => v !== item.value) : [...current, item.value];
                                setValue("bidang_minat", updated, { shouldValidate: true });
                              }}
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all",
                                selected ? "border-[#1D9E75] bg-[#1D9E75]/10 text-[#1D9E75] font-bold" : "border-gray-200 bg-white"
                              )}
                            >
                              <span>{item.emoji}</span> <span>{item.value}</span>
                              {selected && <Check size={14} weight="bold" className="ml-auto" />}
                            </button>
                          );
                        })}
                      </div>
                      {errors.bidang_minat && <p className="text-xs text-red-500">{errors.bidang_minat.message}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: SOSMED & PEMBAYARAN */}
              {currentStep === 2 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* BAGIAN A */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="w-8 h-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] font-bold text-sm">A</div>
                      <h3 className="text-[17px] font-black text-[#0a1f16]">Sosial Media</h3>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Nama Akun Instagram</Label>
                      <Input placeholder="Contoh: @username" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors" {...register("nama_akun_ig")} />
                      {errors.nama_akun_ig && <p className="text-xs font-semibold text-red-500">{errors.nama_akun_ig.message}</p>}
                    </div>
                    
                    <div className="grid gap-4 mt-2">
                      <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-pink-200 transition-all space-y-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white"><InstagramLogo size={22} weight="fill" /></div>
                          <div className="flex-1">
                            <span className="block font-bold text-gray-800">Instagram UKM Risalah</span>
                            <a href="https://www.instagram.com/ukmrisalah?igsh=MTY2cW16c2J4eTByYw==" target="_blank" className="text-xs text-blue-500 font-medium hover:underline">Buka Profil Instagram ↗</a>
                          </div>
                        </div>
                        <Input type="file" accept="image/png, image/jpeg, image/webp" className="h-11 text-xs bg-gray-50/50 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100" {...restIg} onChange={(e) => handleFileChange(e, onChangeIg)} />
                        {errors.bukti_follow_ig && <p className="text-xs font-semibold text-red-500">{errors.bukti_follow_ig.message as string}</p>}
                      </div>

                      <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-red-200 transition-all space-y-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center text-white"><YoutubeLogo size={22} weight="fill" /></div>
                          <div className="flex-1">
                            <span className="block font-bold text-gray-800">YouTube Risalah</span>
                            <a href="https://youtube.com/@risalahfst?si=Ktg-ESTBbCQmf0vW" target="_blank" className="text-xs text-blue-500 font-medium hover:underline">Buka Channel YouTube ↗</a>
                          </div>
                        </div>
                        <Input type="file" accept="image/png, image/jpeg, image/webp" className="h-11 text-xs bg-gray-50/50 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100" {...restYt} onChange={(e) => handleFileChange(e, onChangeYt)} />
                        {errors.bukti_follow_yt && <p className="text-xs font-semibold text-red-500">{errors.bukti_follow_yt.message as string}</p>}
                      </div>

                      <div className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all space-y-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white"><TiktokLogo size={22} weight="fill" /></div>
                          <div className="flex-1">
                            <span className="block font-bold text-gray-800">TikTok UKM Risalah</span>
                            <a href="https://www.tiktok.com/@ukmrisalah?_r=1&_t=ZS-96ZGhorKIlu" target="_blank" className="text-xs text-blue-500 font-medium hover:underline">Buka Profil TikTok ↗</a>
                          </div>
                        </div>
                        <Input type="file" accept="image/png, image/jpeg, image/webp" className="h-11 text-xs bg-gray-50/50 rounded-xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-black hover:file:bg-gray-200" {...restTiktok} onChange={(e) => handleFileChange(e, onChangeTiktok)} />
                        {errors.bukti_follow_tiktok && <p className="text-xs font-semibold text-red-500">{errors.bukti_follow_tiktok.message as string}</p>}
                      </div>
                    </div>
                  </div>

                  {/* BAGIAN B */}
                  <div className="space-y-5 pt-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                      <div className="w-8 h-8 rounded-full bg-[#1D9E75]/10 flex items-center justify-center text-[#1D9E75] font-bold text-sm">B</div>
                      <h3 className="text-[17px] font-black text-[#0a1f16]">Pembayaran HTM</h3>
                    </div>
                    
                    <div className="p-6 bg-gradient-to-br from-[#1D9E75]/10 to-[#12bd87]/5 rounded-2xl border border-[#1D9E75]/20 text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10"><TiktokLogo size={100} /></div> {/* Just decorative */}
                      <p className="text-[13px] text-gray-600 font-bold uppercase tracking-wider">Biaya Pendaftaran</p>
                      <p className="text-4xl font-black text-[#1D9E75] mt-2 tracking-tight">Rp 45.000,00</p>
                    </div>
                    
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Label className={cn("p-5 border-2 rounded-2xl cursor-pointer text-center space-y-2 transition-all duration-200", paymentMethod === "BRI" ? "border-[#1D9E75] bg-[#1D9E75]/5 shadow-md shadow-[#1D9E75]/10" : "border-gray-100 hover:border-[#1D9E75]/40 hover:bg-gray-50")}>
                        <RadioGroupItem value="BRI" className="sr-only" />
                        <div className="font-black text-sm text-[#0a1f16]">Transfer BRI</div>
                        <div className="text-xs text-gray-500 font-medium">617901041157538<br/>a.n Yumaysila N.H</div>
                      </Label>
                      <Label className={cn("p-5 border-2 rounded-2xl cursor-pointer text-center space-y-2 transition-all duration-200", paymentMethod === "ShopeePay" ? "border-[#1D9E75] bg-[#1D9E75]/5 shadow-md shadow-[#1D9E75]/10" : "border-gray-100 hover:border-[#1D9E75]/40 hover:bg-gray-50")}>
                        <RadioGroupItem value="ShopeePay" className="sr-only" />
                        <div className="font-black text-sm text-[#0a1f16]">ShopeePay</div>
                        <div className="text-xs text-gray-500 font-medium">089699459997<br/>a.n Widya Yuni A.</div>
                      </Label>
                      <Label className={cn("p-5 border-2 rounded-2xl cursor-pointer text-center space-y-2 transition-all duration-200", paymentMethod === "COD" ? "border-[#1D9E75] bg-[#1D9E75]/5 shadow-md shadow-[#1D9E75]/10" : "border-gray-100 hover:border-[#1D9E75]/40 hover:bg-gray-50")}>
                        <RadioGroupItem value="COD" className="sr-only" />
                        <div className="font-black text-sm text-[#0a1f16]">Bayar COD</div>
                        <div className="text-xs text-gray-500 font-medium">Bayar di lokasi<br/>saat kegiatan</div>
                      </Label>
                    </RadioGroup>

                    {paymentMethod !== "COD" && (
                      <div className="space-y-4 p-5 bg-amber-50/80 rounded-2xl border border-amber-200/60 shadow-inner">
                        <div className="flex gap-3">
                          <div className="w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <p className="text-[13px] text-amber-900 leading-relaxed font-medium"><strong>Penting:</strong> Untuk transfer via BRI & ShopeePay, harap tambahkan <strong className="text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Rp 1.000</strong> sebagai biaya admin.</p>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-amber-200/50">
                          <Label className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Upload Bukti Transfer</Label>
                          <Input type="file" accept="image/png, image/jpeg, image/webp" className="h-11 text-xs bg-white rounded-xl border-amber-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200" {...restPembayaran} onChange={(e) => handleFileChange(e, onChangePembayaran)} />
                          {errors.bukti_pembayaran && <p className="text-xs font-semibold text-red-500">{errors.bukti_pembayaran.message as string}</p>}
                        </div>
                      </div>
                    )}

                    <div className="mt-8 text-center bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <p className="text-[13px] text-gray-600 font-medium mb-3">Setelah transfer / jika ada kendala, silakan konfirmasi ke WhatsApp admin:</p>
                      <a href="https://wa.me/6281259721308" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2.5 rounded-xl text-[14px] font-bold shadow-lg shadow-[#25D366]/20 transition-all hover:-translate-y-0.5">
                        <WhatsappLogo size={22} weight="fill" /> Konfirmasi ke Yumaysila
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & KIRIM */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-gradient-to-b from-[#f8fdf9] to-white border border-[#1D9E75]/10 p-6 rounded-3xl text-[14px] space-y-4 shadow-[0_10px_40px_rgba(29,158,117,0.04)]">
                    <h3 className="font-black text-[#0a1f16] border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                      <Check size={18} className="text-[#1D9E75]" weight="bold" /> Ringkasan Pendaftaran
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Nama Lengkap</span><strong className="text-gray-800 text-[15px]">{formData.nama_lengkap}</strong></div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">NIM</span><strong className="text-gray-800 text-[15px]">{formData.nim}</strong></div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Email Aktif</span><strong className="text-gray-800 text-[15px]">{formData.email}</strong></div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Jenis Kelamin</span><strong className="text-gray-800 text-[15px]">{formData.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}</strong></div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Tempat, Tanggal Lahir</span><strong className="text-gray-800 text-[15px]">{formData.tempat_lahir}, {formData.tanggal_lahir}</strong></div>
                      <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Alamat Domisili</span><strong className="text-gray-800 text-[15px]">{formData.alamat_domisili}</strong></div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Nomor WhatsApp</span><strong className="text-gray-800 text-[15px]">{formData.no_hp}</strong></div>
                      <div className="bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Nama Akun IG</span><strong className="text-[#E1306C] text-[15px]">{formData.nama_akun_ig}</strong></div>
                      <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm"><span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Fakultas / Prodi</span><strong className="text-[#1D9E75] text-[15px]">{formData.fakultas} — {formData.program_studi} <span className="text-gray-500 font-normal">({formData.angkatan})</span></strong></div>
                      
                      <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                        <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Bidang Minat Kegiatan</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.bidang_minat?.map(m => <span key={m} className="bg-gradient-to-r from-[#1D9E75]/10 to-[#1D9E75]/5 text-[#1D9E75] border border-[#1D9E75]/20 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">{m}</span>)}
                        </div>
                      </div>
                      
                      <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-gray-50 shadow-sm">
                        <span className="block text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">Dokumen & Pembayaran</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.bukti_follow_ig?.[0] && <span className="bg-pink-50 text-pink-700 border border-pink-200 px-3 py-1.5 rounded-lg text-xs font-bold">✓ Bukti IG</span>}
                          {formData.bukti_follow_yt?.[0] && <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold">✓ Bukti YT</span>}
                          {formData.bukti_follow_tiktok?.[0] && <span className="bg-gray-100 text-gray-800 border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold">✓ Bukti TikTok</span>}
                          {formData.bukti_pembayaran?.[0] && <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">✓ Bukti Bayar ({paymentMethod})</span>}
                          {paymentMethod === "COD" && <span className="bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold">⚠️ Bayar COD</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 p-5 bg-amber-50/80 border border-amber-200/60 rounded-2xl">
                    <div className="w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <p className="text-[13px] text-amber-900 font-medium leading-relaxed">
                      Mohon periksa kembali keselarasan data di atas. Data yang dikirim akan langsung diarsip secara permanen oleh kesekretariatan.
                    </p>
                  </div>

                  <div className="flex gap-4 p-5 bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-2xl">
                    <div className="w-1.5 rounded-full bg-[#1D9E75] shrink-0" />
                    <p className="text-[13px] text-[#0f6c4e] font-medium leading-relaxed">
                      Setelah pendaftaran dikirim, silakan menunggu informasi kegiatan ORDITAS dan proses pengaktifan akun dari panitia.
                    </p>
                  </div>
                </div>
              )}

              {/* FOOTER BUTTONS */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={currentStep === 0 ? () => router.push("/") : prevStep} disabled={isLoading} className="h-12 px-6 rounded-2xl text-gray-600 font-bold border-gray-200 hover:bg-gray-50 transition-all hover:-translate-x-1">
                  {currentStep === 0 ? "Batal" : <><ArrowLeft size={16} className="mr-2" /> Sebelumnya</>}
                </Button>

                {currentStep < STEPS.length - 1 ? (
                  <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-2xl bg-[#1D9E75] hover:bg-[#15805e] text-white font-bold shadow-lg shadow-[#1D9E75]/20 transition-all hover:translate-x-1">
                    Lanjut <ArrowRight size={16} className="ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isLoading} className="h-12 px-8 rounded-2xl bg-gradient-to-r from-[#1D9E75] to-[#12bd87] hover:from-[#15805e] hover:to-[#0f966b] text-white font-bold shadow-xl shadow-[#1D9E75]/30 transition-all hover:scale-[1.02]">
                    {isLoading ? "Memproses Data..." : "Kirim Pendaftaran Resmi ✓"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
