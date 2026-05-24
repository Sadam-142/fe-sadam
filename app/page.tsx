/* eslint-disable @next/next/no-img-element */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { api } from "@/lib/api";
import {
  ArrowRight,
  CalendarCheck,
  MapPinLine,
  ShieldCheck,
  Users
} from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Roboto } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";


const roboto = Roboto({
weight :["400"],
subsets: ["latin"]

})
type PublicKegiatan = {
  id_kegiatan: string | number;
  nama_kegiatan: string;
  tanggal_kegiatan?: string;
  waktu_mulai?: string;
  lokasi?: string;
  deskripsi?: string;
  jenis_kegiatan?: string;
  pamflet?: string;
};

async function getKegiatanPublic() {
  try {
    const res = await api.get("/kegiatan/public", { cache: "no-store" });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch public kegiatan", error);
    return [];
  }
}

async function getAnggotaPublic() {
  try {
    const res = await api.get("/anggota/public", { cache: "no-store" });
    if (res.success && Array.isArray(res.data)) {
      return res.data;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch public anggota", error);
    return [];
  }
}

export default async function Home() {
  const [kegiatanList, anggotaList] = (await Promise.all([
    getKegiatanPublic(),
    getAnggotaPublic(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [PublicKegiatan[], any[]];
  const latestKegiatan = kegiatanList.slice(0, 3);
  const features = [
    {
      icon: <Users className="size-6" weight="duotone" />,
      title: "Anggota lebih tertata",
      description:
        "Pendaftaran, verifikasi, dan profil anggota berada dalam alur yang jelas tanpa berkas tercecer.",
    },
    {
      icon: <CalendarCheck className="size-6" weight="duotone" />,
      title: "Agenda mudah dibaca",
      description:
        "Kegiatan, lokasi, poster, dan catatan acara ditampilkan seperti papan informasi digital.",
    },
    {
      icon: <ShieldCheck className="size-6" weight="duotone" />,
      title: "Presensi bisa ditinjau",
      description:
        "Pengurus mendapat bukti lokasi dan foto untuk memeriksa kehadiran dengan lebih tenang.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[white] text-[#163126]">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(212,158,73,0.22),transparent_28%),radial-gradient(circle_at_82%_5%,rgba(31,105,75,0.18),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.56),transparent_42%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(90deg,#163126_1px,transparent_1px),linear-gradient(#163126_1px,transparent_1px)] [background-size:46px_46px]" />


{/* header */}
      <header className="sticky top-0 z-50 border-b border-[#008744]/10 bg-[#f8fdf9]/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4 md:px-8">
          
          {/* LOGO & BRANDING */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative overflow-hidden rounded-full p-0.5 transition-transform duration-300 group-hover:scale-105">
              <Image alt="logo" src="/UKMRISALAH.png" width={40} height={40} className="object-contain" />
            </div>
            <span className="leading-tight">
              {/* Menggunakan font serif mewah agar sinkron dengan section lainnya */}
              <span 
                className="block text-2xl font-black text-[#0d2318] tracking-tight group-hover:text-[#008744] transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Risalah
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#008744]/70 sm:block">
                Sistem Keanggotaan
              </span>
            </span>
          </Link>

          {/* NAVIGASI TOMBOL */}
          <nav className="flex items-center gap-3">
            {/* Tombol Masuk - Lebih bersih dengan border tipis estetik */}
            <Button
              variant="ghost"
              asChild
              className="hidden rounded-full text-xs font-bold text-[#0d2318] border border-transparent hover:border-[#008744]/20 hover:bg-[#008744]/5 hover:text-[#008744] sm:inline-flex px-5 transition-all"
            >
              <Link href="/login">Masuk</Link>
            </Button>
            
            {/* Tombol Daftar - Hijau Berkilau Khas Orditas */}
            <Button
              asChild
              className="rounded-full bg-[#008744] text-xs font-bold px-6 text-white shadow-[0_8px_20px_rgba(0,135,68,0.15)] hover:bg-[#00c46b] hover:shadow-[0_8px_25px_rgba(0,196,107,0.25)] transition-all duration-300"
            >
              <Link href="/daftar">Daftar</Link>
            </Button>
          </nav>

        </div>
      </header>
{/* header */}


      <main>
{/* Import font di bagian atas file atau di layout.tsx */}
{/* <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" /> */}

<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Lato:wght@300;400;700&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .hero-badge   { animation: fadeUp 0.6s ease both; animation-delay: 0.1s; }
  .hero-title   { animation: fadeUp 0.7s ease both; animation-delay: 0.3s; }
  .hero-sub     { animation: fadeUp 0.7s ease both; animation-delay: 0.55s; }
  .hero-cta     { animation: fadeUp 0.7s ease both; animation-delay: 0.75s; }

  .shimmer-text {
    background: linear-gradient(90deg, #ffffff 0%, #a8e6c3 40%, #ffffff 60%, #a8e6c3 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }
`}</style>

<section
  className="relative min-h-[90vh] flex items-center justify-center px-4 py-16 md:px-8 md:py-24 overflow-hidden"
  style={{ fontFamily: "'Lato', sans-serif" }}
>
  {/* ── Background ── */}
  <div className="absolute inset-0 z-0">
    <Image
      className="w-full h-full object-cover object-center scale-105"
      src="/bg.jpeg"
      alt="UKM LDK Risalah"
      width={1920}
      height={1080}
      priority
    />
    {/* Layer 1: gelap merata agar orang tetap kelihatan tapi kontras cukup */}
    <div className="absolute inset-0 bg-black/45" />
    {/* Layer 2: gradasi hijau tua dari bawah untuk branding */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/90 via-[#0d2318]/20 to-transparent" />
    {/* Layer 3: vignette sisi kiri-kanan agar mata fokus ke tengah */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#0d2318]/40 via-transparent to-[#0d2318]/40" />
  </div>

  {/* ── Konten ── */}
  <div className="relative z-10 mx-auto max-w-4xl w-full text-center flex flex-col items-center gap-6">

    {/* Badge */}
    <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white/90 tracking-widest uppercase">
      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
      UKM Risalah
    </div>

    {/* Judul utama */}
    <h1
      className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white"
      style={{ fontFamily: "'Playfair Display', serif" }}
    >
      Hallo,{" "}
      <em className="shimmer-text not-italic">Saintis Muda!</em>
    </h1>

    {/* Deskripsi */}
    <div className="hero-sub max-w-2xl space-y-3">
      <p className="text-base md:text-lg text-white/80 font-light leading-relaxed">
        Jadilah bagian dari komunitas saintis yang unggul dalam ilmu dan akhlak.
      </p>
      <p className="text-base md:text-lg text-white/95 font-semibold leading-relaxed">
        RISALAH menggabungkan kecerdasan Sains dan Teknologi dengan keindahan Tilawah Al-Quran secara terintegrasi.
      </p>
    </div>

    {/* CTA */}
    <div className="hero-cta mt-2 flex flex-col gap-4 sm:flex-row sm:justify-center w-full sm:w-auto">
      <Button
        size="lg"
        asChild
        className="h-14 rounded-full bg-[#008744] hover:bg-[#006b35] px-8 text-base font-bold text-white shadow-[0_8px_30px_rgba(0,135,68,0.5)] hover:shadow-[0_8px_40px_rgba(0,135,68,0.7)] hover:-translate-y-0.5 transition-all duration-200"
      >
        <Link href="/daftar">
          Daftar Sekarang <ArrowRight className="ml-2 size-4" />
        </Link>
      </Button>
      <Button
        size="lg"
        variant="outline"
        asChild
        className="h-14 rounded-full border-white/40 bg-white/10 backdrop-blur-sm px-8 text-base font-semibold text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-200"
      >
        <Link href="/login">Masuk ke Akun</Link>
      </Button>
    </div>
  </div>
</section>


{/* ── Tambahkan style ini di bagian atas file atau globals.css ── */}
<style>{`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@300;400;700&display=swap');
  @keyframes fadeUp {    from { opacity: 0; transform: translateY(28px); }    to   { opacity: 1; transform: translateY(0); }  }
  @keyframes countUp {    from { opacity: 0; transform: scale(0.7); }    to   { opacity: 1; transform: scale(1); }  }
  @keyframes floatBadge {    0%, 100% { transform: translateY(0px); }    50%       { transform: translateY(-6px); }  }
  @keyframes spinSlow {    from { transform: rotate(0deg); }    to   { transform: rotate(360deg); }  }
  @keyframes gradientShift {    0%   { background-position: 0% 50%; }    50%  { background-position: 100% 50%; }    100% { background-position: 0% 50%; }  }
  .anim-fade-1 { animation: fadeUp 0.7s ease both; animation-delay: 0.1s; }
  .anim-fade-2 { animation: fadeUp 0.7s ease both; animation-delay: 0.25s; }
  .anim-fade-3 { animation: fadeUp 0.7s ease both; animation-delay: 0.4s; }
  .anim-fade-4 { animation: fadeUp 0.7s ease both; animation-delay: 0.55s; }
  .anim-count  { animation: countUp 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both; }
  .anim-count-1 { animation-delay: 0.3s; }
  .anim-count-2 { animation-delay: 0.5s; }
  .anim-count-3 { animation-delay: 0.7s; }
  .float-badge  { animation: floatBadge 3s ease-in-out infinite; }
  .stat-card:hover { transform: translateY(-6px) scale(1.03); }
  .stat-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .orditas-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,135,68,0.15); }
  .orditas-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
  .live-gradient {
    background: linear-gradient(270deg, #008744, #00c46b, #004d26, #00a884);
    background-size: 400% 400%;
    animation: gradientShift 6s ease infinite;
  }
`}</style>

<section className="relative px-4 py-20 md:px-8 overflow-hidden">
  {/* ── BACKGROUND BERTEKSTUR ── */}
  <div className="absolute inset-0 z-0" style={{ backgroundColor: '#f8fdf9' }}>
    {/* Pola dot grid */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#008744" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
    {/* Aksen warna kiri atas */}
    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-20"
      style={{ background: 'radial-gradient(circle, #00c46b 0%, transparent 70%)' }} />
    {/* Aksen warna kanan bawah */}
    <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-15"
      style={{ background: 'radial-gradient(circle, #008744 0%, transparent 70%)' }} />
    {/* Strip dekorasi kiri */}
    <div className="absolute left-0 top-0 bottom-0 w-1.5 live-gradient opacity-70" />
  </div>

  <div className="relative z-10 mx-auto max-w-7xl">
    {/* ── HEADER ── */}
    <div className="mb-14 text-center anim-fade-1">
      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4"
        style={{ background: 'rgba(0,135,68,0.1)', color: '#008744', border: '1px solid rgba(0,135,68,0.2)' }}>
        Perjalanan Kami
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#0d2318] tracking-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}>
        Jejak <span className="text-[#008744]">Risalah</span>
      </h2>
    </div>

    {/* ── SECTION: MENGENAL ORDITAS & RISALAH ── */}
    <div className="grid gap-6 md:grid-cols-2 mb-8 anim-fade-2">
      {/* Card: Apa itu ORDITAS */}
      <div className="orditas-card rounded-2xl p-8 border border-[#008744]/20 bg-white relative overflow-hidden">
        {/* Aksen sudut */}
        <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
          style={{ background: '#008744' }} />
        <div className="float-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
          style={{ background: 'rgba(0,135,68,0.1)', color: '#008744', border: '1px dashed #008744' }}>
          <span className="size-1.5 rounded-full bg-[#008744] animate-pulse" />
          Program Unggulan
        </div>
        <h3 className="text-2xl font-bold text-[#0d2318] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Apa itu ORDITAS?
        </h3>
        <p className="text-sm leading-relaxed text-[#3a473c] mb-4">
          <strong className="text-[#008744]">ORDITAS</strong> (Orientasi Dasar Ilmu Tilawah Al-Quran Saintek)
          adalah program orientasi resmi UKM Risalah yang dirancang untuk memperkenalkan calon anggota
          baru pada nilai-nilai dasar organisasi perpaduan antara ilmu Sains dan Teknologi dan keindahan tilawah Al-Quran.
        </p>
        <p className="text-sm leading-relaxed text-[#3a473c]">
          Melalui ORDITAS, peserta dibimbing untuk mengenal visi besar Risalah melahirkan generasi yang
          cerdas secara intelektual sekaligus kokoh dalam nilai-nilai keislaman.
        </p>
        {/* Decorative line */}
        <div className="mt-6 h-1 w-16 rounded-full bg-[#008744] opacity-60" />
      </div>

      {/* Card: Apa itu Risalah */}
      <div className="orditas-card rounded-2xl p-8 border border-[#008744]/20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
          style={{ background: '#00c46b' }} />
        <div className="float-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5"
          style={{ background: 'rgba(0,168,132,0.1)', color: '#00a884', border: '1px dashed #00a884', animationDelay: '1.5s' }}>
          <span className="size-1.5 rounded-full bg-[#00a884] animate-pulse" />
          Tentang Kami
        </div>
        <h3 className="text-2xl font-bold text-[#0d2318] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Apa itu Risalah?
        </h3>
        <p className="text-sm leading-relaxed text-[#3a473c] mb-4">
          <strong className="text-[#008744]">UKM Risalah</strong> (Rebana Ilmu Seni Al-Qur’an dan Tilawah) merupakan Unit Kegiatan Mahasiswa di Fakultas Sains 
          dan Teknologi UIN Walisongo Semarang yang bergerak di bidang seni Islami. Risalah hadir sebagai wadah bagi mahasiswa untuk mengembangkan potensi diri dalam bidang tilawah, 
          tahfidz, rebana, dan dakwah kreatif, sekaligus memperdalam nilai-nilai keagamaan di lingkungan kampus.
        </p>
        <p className="text-sm leading-relaxed text-[#3a473c]">
          Cocok bagi mahasiswa berlatar belakang Pondok Pesantren, Madrasah Aliyah, 
          maupun aktivis yang ingin terus belajar, berkarya, dan berkontribusi melalui seni bernuansa Islami. Bersama Risalah, mahasiswa tidak hanya mengembangkan kreativitas dan kemampuan seni, 
          tetapi juga membangun lingkungan yang religius, inspiratif, serta membuktikan bahwa iman dan ilmu pengetahuan dapat berjalan beriringan.
        </p>
        <div className="mt-6 h-1 w-16 rounded-full bg-[#00a884] opacity-60" />
      </div>
    </div>

    {/* ── SUB-SECTION INFO DETAIL (DARI GAMBAR BROSUR) ── */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-16 anim-fade-2">
      {/* 1. Catat Tanggalnya */}
      <div className="orditas-card rounded-xl p-5 border border-[#008744]/15 bg-white flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-lg bg-[#008744]/10 text-xl">📅</div>
        <div>
          <h4 className="text-xs font-bold text-[#008744] uppercase tracking-wider mb-0.5">Catat Tanggalnya!</h4>
          <p className="text-sm font-extrabold text-[#0d2318]">27 - 28 September 2026</p>
        </div>
      </div>

      {/* 2. Benefit Kegiatan */}
      <div className="orditas-card rounded-xl p-5 border border-[#008744]/15 bg-white lg:col-span-1">
        <h4 className="text-xs font-bold text-[#008744] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          🎁 Benefit Kegiatan
        </h4>
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-[#3a473c] font-medium">
          <li className="flex items-center gap-1">✓ Sertifikat</li>
          <li className="flex items-center gap-1">✓ Relasi</li>
          <li className="flex items-center gap-1">✓ Konsumsi</li>
          <li className="flex items-center gap-1">✓ Merch</li>
          <li className="flex items-center gap-1 col-span-2 text-[#008744]">✓ Ilmu Bermanfaat</li>
        </ul>
      </div>

      {/* 3. Kegiatan di Dalam Risalah */}
      <div className="orditas-card rounded-xl p-5 border border-[#008744]/15 bg-white sm:col-span-2 lg:col-span-1">
        <h4 className="text-xs font-bold text-[#00a884] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          ✨ Ragam Kegiatan Risalah
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {['Orditas', 'Dhibaan', 'Pelatihan-Pelatihan', 'Gainmoris', 'Zarkasi', 'Webinar', 'RIF (Risalah Islamic Fest)'].map((item) => (
            <span key={item} className="px-2 py-0.5 rounded-md bg-[#f8fdf9] border border-[#00a884]/20 text-[11px] font-semibold text-[#3a473c]">
              ✦ {item}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* ── DIVIDER ── */}
    <div className="flex items-center gap-4 mb-12 anim-fade-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#008744]/30" />
      <span className="text-xs font-bold uppercase tracking-widest text-[#008744]/60 px-2">
        Angka yang Bicara
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#008744]/30" />
    </div>

    {/* ── STAT CARDS ── */}
    <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto anim-fade-4">
      {/* Berdiri Sejak */}
      <div className="stat-card anim-count anim-count-1 rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2318 0%, #163126 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%"><pattern id="sg" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#sg)"/></svg>
        </div>
        <div className="text-6xl md:text-7xl font-extrabold text-white mb-2"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 30px rgba(0,196,107,0.5)' }}>
          2016
        </div>
        <div className="text-sm font-semibold uppercase tracking-widest text-[#00c46b]">
          Berdiri Sejak
        </div>
        <div className="mt-4 h-0.5 w-10 mx-auto rounded-full bg-[#008744]" />
      </div>

      {/* Total Kegiatan */}
      <div className="stat-card anim-count anim-count-2 rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #008744 0%, #00a884 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%"><pattern id="sg2" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#sg2)"/></svg>
        </div>
        <div className="text-6xl md:text-7xl font-extrabold text-white mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          {kegiatanList.length}
        </div>
        <div className="text-sm font-semibold uppercase tracking-widest text-white/80">
          Total Kegiatan
        </div>
        <div className="mt-4 h-0.5 w-10 mx-auto rounded-full bg-white/40" />
      </div>

      {/* Data Mahasiswa */}
      <div className="stat-card anim-count anim-count-3 rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2318 0%, #163126 100%)' }}>
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%"><pattern id="sg3" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="1" fill="white"/></pattern><rect width="100%" height="100%" fill="url(#sg3)"/></svg>
        </div>
        <div className="text-6xl md:text-7xl font-extrabold text-white mb-2"
          style={{ fontFamily: "'Playfair Display', serif", textShadow: '0 0 30px rgba(0,196,107,0.5)' }}>
          {anggotaList.length}
        </div>
        <div className="text-sm font-semibold uppercase tracking-widest text-[#00c46b]">
          Data Mahasiswa
        </div>
        <div className="mt-4 h-0.5 w-10 mx-auto rounded-full bg-[#008744]" />
      </div>
    </div>
  </div>
</section>

<section className="relative px-4 py-12 md:px-8 overflow-hidden">
  {/* ── BACKGROUND BERTEKSTUR ── */}
  <div className="absolute inset-0 z-0" style={{ backgroundColor: '#f8fdf9' }}>
    {/* Pola dot grid */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots-section-gallery" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#008744" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-section-gallery)" />
    </svg>
    {/* Aksen warna gradasi lembut */}
    <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full opacity-15"
      style={{ background: 'radial-gradient(circle, #00c46b 0%, transparent 70%)' }} />
    <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full opacity-10"
      style={{ background: 'radial-gradient(circle, #008744 0%, transparent 70%)' }} />
  </div>

  <div className="relative z-10 mx-auto max-w-5xl">
    {/* ── HEADER SECTION ── */}
    <div className="mb-8 text-center">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#008744]">
        Galeri Dokumentasi
      </p>
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#0d2318] tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}>
        Kilas Balik <span className="text-[#008744]">Keseruan ORDITAS</span>
      </h2>
    </div>
    
    {/* ── CAROUSEL GAMBAR LANDSCAPE SERAGAM ── */}
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

      {/* GAMBAR 1 */}
      <div className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
        <div className="orditas-card group relative h-48 sm:h-52 rounded-xl border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] overflow-hidden">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
        
            <img 
              src="/Picture0.jpeg" 
              alt="Dokumentasi 1"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/85 via-[#0d2318]/10 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-block text-[9px] bg-[#00c46b] text-white font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">ORDITAS</span>
              <p className="text-xs font-semibold text-white tracking-tight">Dokumentasi Technical Meeting</p>
            </div>
            <div className="absolute top-2.5 right-2.5 size-6 rounded bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-[10px] font-bold text-white z-10">01</div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

      {/* GAMBAR 2 */}
      <div className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
        <div className="orditas-card group relative h-48 sm:h-52 rounded-xl border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] overflow-hidden">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src="/Picture2.jpeg" 
              alt="Dokumentasi 2"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/85 via-[#0d2318]/10 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-block text-[9px] bg-[#00c46b] text-white font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">RISALAH</span>
              <p className="text-xs font-semibold text-white tracking-tight">Dokumentasi Mahalul Qiyam</p>
            </div>
            <div className="absolute top-2.5 right-2.5 size-6 rounded bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-[10px] font-bold text-white z-10">02</div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

      {/* GAMBAR 3 */}
      <div className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
        <div className="orditas-card group relative h-48 sm:h-52 rounded-xl border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] overflow-hidden">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src="/Picture3.jpeg" 
              alt="Dokumentasi 3"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/85 via-[#0d2318]/10 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-block text-[9px] bg-[#00c46b] text-white font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">ORDITAS</span>
              <p className="text-xs font-semibold text-white tracking-tight">Orientasi anggota Baru</p>
            </div>
            <div className="absolute top-2.5 right-2.5 size-6 rounded bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-[10px] font-bold text-white z-10">03</div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

      {/* GAMBAR 4 */}
      <div className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
        <div className="orditas-card group relative h-48 sm:h-52 rounded-xl border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] overflow-hidden">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src="/Picture4.jpeg" 
              alt="Dokumentasi 4"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/85 via-[#0d2318]/10 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-block text-[9px] bg-[#00c46b] text-white font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">ORDITAS</span>
              <p className="text-xs font-semibold text-white tracking-tight">Dokumentasi fun</p>
            </div>
            <div className="absolute top-2.5 right-2.5 size-6 rounded bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-[10px] font-bold text-white z-10">03</div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

      {/* GAMBAR 5 */}
      <div className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
        <div className="orditas-card group relative h-48 sm:h-52 rounded-xl border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] overflow-hidden">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src="/Picture5.png" 
              alt="Dokumentasi 5"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/85 via-[#0d2318]/10 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-block text-[9px] bg-[#00c46b] text-white font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">ORDITAS</span>
              <p className="text-xs font-semibold text-white tracking-tight">Pembaiatan</p>
            </div>
            <div className="absolute top-2.5 right-2.5 size-6 rounded bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-[10px] font-bold text-white z-10">03</div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

      {/* GAMBAR 6 */}
      <div className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
        <div className="orditas-card group relative h-48 sm:h-52 rounded-xl border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] overflow-hidden">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-100">
            <img 
              src="/Picture6.jpeg" 
              alt="Dokumentasi 6"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/85 via-[#0d2318]/10 to-transparent opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-1 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 z-10">
              <span className="inline-block text-[9px] bg-[#00c46b] text-white font-bold px-1.5 py-0.5 rounded mb-1 uppercase tracking-wider">Pasca ORDITAS</span>
              <p className="text-xs font-semibold text-white tracking-tight">Dokumentasi Gainmoris</p>
            </div>
            <div className="absolute top-2.5 right-2.5 size-6 rounded bg-white/10 backdrop-blur-md border border-white/20 grid place-items-center text-[10px] font-bold text-white z-10">03</div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
        </div>
      </div>

    </div>

    {/* Indikator Navigasi Visual Mini */}
    <div className="flex justify-center gap-1.5 mt-1 text-[9px] font-bold uppercase tracking-widest text-[#3a473c]/40">
      <span>← Geser untuk foto lain →</span>
    </div>
  </div>
</section>

<section
  id="kegiatan-terbaru"
  className="relative scroll-mt-24 px-4 py-12 md:px-8 overflow-hidden"
  style={{ backgroundColor: '#f8fdf9' }}
>
  {/* ── BACKGROUND BERTEKSTUR (SINKRON DENGAN GALERI) ── */}
  <div className="absolute inset-0 z-0">
    {/* Pola dot grid hijau */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots-section-kegiatan" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="#008744" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots-section-kegiatan)" />
    </svg>
    {/* Aksen warna gradasi lembut khas Orditas */}
    <div className="absolute -bottom-32 -right-24 w-80 h-80 rounded-full opacity-15"
      style={{ background: 'radial-gradient(circle, #00c46b 0%, transparent 70%)' }} />
    <div className="absolute -top-32 -left-24 w-80 h-80 rounded-full opacity-10"
      style={{ background: 'radial-gradient(circle, #008744 0%, transparent 70%)' }} />
  </div>

  <div className="relative z-10 mx-auto max-w-5xl">
    {/* ── HEADER SECTION (DIBUAT RATA TENGAH) ── */}
    <div className="mb-10 flex flex-col items-center text-center">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#008744]">
        Kegiatan Terbaru
      </p>
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#0d2318] tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}>
        Agenda yang <span className="text-[#008744]">Sedang Bergerak</span>
      </h2>
      <p className="mt-2 max-w-xl text-xs md:text-sm text-[#4a5e51] leading-relaxed">
        Ikuti kegiatan, kajian, dan agenda aktif yang diselenggarakan oleh UKM Risalah.
      </p>
    </div>

    {/* ── KONTEN KEGIATAN (CAROUSEL SMOOTH) ── */}
    {kegiatanList.length > 0 ? (
      <>
        <div 
          className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {kegiatanList.map((kegiatan) => (
            <div key={kegiatan.id_kegiatan} className="w-[280px] sm:w-[320px] md:w-[360px] flex-shrink-0 snap-start snap-always">
              {/* Card Frame Putih Bersih Estetik */}
              <Card className="group relative flex h-full flex-col border border-[#008744]/15 bg-white p-2 shadow-[0_10px_30px_rgba(0,135,68,0.02)] transition-all duration-300 rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,135,68,0.06)]">
                
                {/* Wadah Gambar / Poster Terkunci Sedang (Landscape-Friendly) */}
                <div className="relative h-48 sm:h-52 w-full rounded-lg overflow-hidden bg-gray-50">
                  {kegiatan.pamflet ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={kegiatan.pamflet}
                      alt={`Poster ${kegiatan.nama_kegiatan}`}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 text-[#697466]">
                      <CalendarCheck
                        size={36}
                        className="mb-2 opacity-30 text-[#008744]"
                      />
                      <span className="text-xs font-medium opacity-70">
                        Poster belum tersedia
                      </span>
                    </div>
                  )}
                  
                  {/* Overlay Gradasi Elegan */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d2318]/80 via-transparent to-transparent opacity-85" />
                  
                  {/* Badge Jenis Kegiatan */}
                  <Badge className="absolute left-3 top-3 rounded bg-[#00c46b] text-[9px] font-bold text-white hover:bg-[#00c46b] uppercase tracking-wider py-0.5 px-2 border-none shadow-sm">
                    {kegiatan.jenis_kegiatan || "Acara"}
                  </Badge>
                </div>

                {/* Detail Konten Teks */}
                <CardHeader className="flex-1 pb-3 pt-4 px-2">
                  <CardTitle className="line-clamp-2 text-base font-bold tracking-tight text-[#0d2318] group-hover:text-[#008744] transition-colors duration-200">
                    {kegiatan.nama_kegiatan}
                  </CardTitle>
                  <CardDescription className="mt-2.5 flex flex-col gap-1.5">
                    <span className="flex items-center text-xs font-semibold text-[#3a473c]">
                      <CalendarCheck className="mr-2 text-[#008744]" size={14} />
                      {kegiatan.tanggal_kegiatan
                        ? format(
                            new Date(kegiatan.tanggal_kegiatan),
                            "EEEE, d MMMM yyyy",
                            { locale: localeId },
                          )
                        : "Tanggal belum ditentukan"}
                    </span>
                    <span className="line-clamp-1 flex items-start text-xs text-[#697466]">
                      <MapPinLine
                        className="mr-2 mt-0.5 flex-shrink-0 text-[#008744]"
                        size={14}
                      />
                      {kegiatan.lokasi || "Lokasi belum ditentukan"}
                    </span>
                  </CardDescription>
                </CardHeader>

                {/* Footer Deskripsi Singkat */}
                <CardFooter className="mt-1 border-t border-[#008744]/10 bg-[#f8fdf9] py-3 px-2 rounded-b-lg">
                  <p className="line-clamp-2 w-full text-xs leading-relaxed text-[#5c6e61]">
                    {kegiatan.deskripsi || "Deskripsi kegiatan belum tersedia."}
                  </p>
                </CardFooter>

                {/* Garis Aksen Animasi Bawah */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#008744] to-[#00c46b] transition-all duration-500 group-hover:w-full" />
              </Card>
            </div>
          ))}
        </div>
        {/* Indikator Navigasi Visual Mini */}
        <div className="flex justify-center gap-1.5 mt-2 text-[9px] font-bold uppercase tracking-widest text-[#3a473c]/40">
          <span>← Geser untuk agenda lain →</span>
        </div>
      </>
    ) : (
      /* ── EMPTY STATE ── */
      <div className="rounded-xl border border-[#008744]/15 bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(0,135,68,0.02)]">
        <CalendarCheck
          className="mx-auto mb-3 h-10 w-10 text-[#008744]/40"
          weight="duotone"
        />
        <h3 className="text-lg font-bold tracking-tight text-[#0d2318]">
          Belum ada kegiatan
        </h3>
        <p className="mt-1 text-xs text-[#697466]">
          Saat ini belum ada jadwal kegiatan yang dipublikasikan.
        </p>
      </div>
    )}
  </div>
</section>
      </main>

 <footer className="relative bg-[#0d2318] px-4 py-12 text-[#d6dece] md:px-8 overflow-hidden border-t border-[#008744]/10">
        {/* Ornamen Halus Penyelaras Desain */}
        <div className="absolute inset-0 opacity-[0.03] z-0 [background-image:radial-gradient(circle_at_1px_1px,#00c46b_1px,transparent_0)] [background-size:24px_24px]" />
        
        <div className="relative z-10 mx-auto max-w-5xl">
          {/* TATA LETAK UTAMA FOOTER */}
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 md:items-start pb-8 border-b border-white/5">
            
            {/* KIRI: NAMA UKM & KEPANJANGAN */}
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-[#fff8e8]"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                UKM Risalah
              </span>
              <p className="mt-2 text-xs md:text-sm text-[#aeb9aa] leading-relaxed max-w-xs">
                Unit Kegiatan Mahasiswa Rebana Ilmu Seni dan Tilawah Al-Qur&apos;an
              </p>
            </div>

            {/* TENGAH: CONTACT PERSON (SESUAI GAMBAR REFERENSI) */}
            <div className="flex flex-col sm:items-start md:items-center">
              <div className="w-full max-w-[210px]">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#00c46b]">
                  Contact Person
                </p>
                <div className="flex flex-col gap-2 text-xs text-[#d6dece]">
                  <a href="https://wa.me/62895360310929" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00c46b] transition-colors">
                    <span className="font-mono">0895-3603-10929</span>
                    <span className="text-[#aeb9aa]/70 text-[11px]">(Vaza)</span>
                  </a>
                  <a href="https://wa.me/6285647320120" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00c46b] transition-colors">
                    <span className="font-mono">0856-4732-0120</span>
                    <span className="text-[#aeb9aa]/70 text-[11px]">(Nasywa)</span>
                  </a>
                  <a href="https://wa.me/6289611793010" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#00c46b] transition-colors">
                    <span className="font-mono">0896-1179-3010</span>
                    <span className="text-[#aeb9aa]/70 text-[11px]">(Luthfi)</span>
                  </a>
                </div>
              </div>
            </div>

            {/* KANAN: ALAMAT LENGKAP */}
            <div className="flex flex-col md:items-end md:text-right">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#00c46b]">
                Sekretariat
              </p>
              <p className="text-xs md:text-sm text-[#aeb9aa] leading-relaxed max-w-xs">
                PKM Kampus 2 UIN Walisongo Semarang
              </p>
              <p className="text-[11px] text-[#697466] mt-1">
                Kota Semarang, Jawa Tengah
              </p>
            </div>

          </div>

          {/* HAK CIPTA SKRIPSI 2026 */}
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left text-xs text-[#697466]">
            <p>&copy; 2026 Sadam At-Tirmidzi.</p>
            <p className="text-[10px] uppercase tracking-wider text-[#008744]/40">UKM Risalah &bull; All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}