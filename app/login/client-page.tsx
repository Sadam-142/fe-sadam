"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { useAuth } from "@/components/shared/auth-provider";
import { loginSchema, LoginFormData } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeSlash } from "@phosphor-icons/react";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const res = await api.post("/auth/login", data);
      
      if (res.success) {
        toast.success("Login berhasil");
        login(res.data.token, res.data.user);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal login, periksa username dan password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full bg-gradient-to-b from-[#f8fdf9] via-[#f0fbf3] to-[#f8fdf9] flex items-center justify-center p-4 overflow-hidden selection:bg-emerald-200 selection:text-emerald-900"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── BACKGROUND IMAGE ELEGANT ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-emerald-50">
        <Image 
          src="/images/bg-login.jpeg" 
          alt="Background" 
          fill 
          className="object-cover opacity-90"
          priority
        />
        
        {/* Overlay Putih Transparan agar teks dan form tetap sangat jelas terbaca */}
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[6px]" />
        
        {/* Efek Cahaya Glow Lembut (Aura Emerald & Gold) */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-400/20 blur-[120px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-amber-200/20 blur-[100px]" />
        <div className="absolute top-1/3 right-[-5%] w-[30vw] h-[30vw] rounded-full bg-[#00c46b]/10 blur-[90px]" />
      </div>

      <div className="absolute left-4 top-4 sm:left-8 sm:top-8 z-50">
        <Button variant="ghost" size="sm" asChild className="hover:bg-emerald-50 text-emerald-900 font-semibold bg-white/50 backdrop-blur-sm rounded-xl">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Kembali
          </Link>
        </Button>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0d2318] font-serif tracking-tight">
            Masuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#008744] to-[#00c46b]">Akun</span>
          </h2>
          <p className="text-sm text-[#4a5e51] font-medium">
            Sistem Informasi Risalah
          </p>
        </div>

        <Card className="border border-emerald-800/10 bg-white/95 backdrop-blur-md shadow-[0_20px_50px_rgba(0,135,68,0.05)] rounded-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#0d2318] via-[#008744] to-amber-300" />
          
          <CardHeader className="space-y-1 text-center pt-8 pb-4">
            <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm border border-gray-100 p-2 overflow-hidden">
              <Image 
                src="/UKMRISALAH.png" 
                alt="Logo Risalah" 
                width={80} 
                height={80} 
                className="object-contain" 
                priority 
              />
            </div>
            <CardDescription className="text-xs font-semibold text-[#008744] bg-emerald-50 mx-auto py-1.5 px-3 rounded-full mt-2 inline-block border border-emerald-100">
              Khusus Pengurus dan Anggota
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 sm:px-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2 text-left">
                <Label htmlFor="username" className="text-sm font-bold text-[#0d2318]">Username / NIM</Label>
                <Input
                  id="username"
                  placeholder="Masukkan NIM atau Username"
                  className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#008744] focus-visible:border-[#008744]"
                  {...register("username")}
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-bold text-[#0d2318]">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-gray-200 focus-visible:ring-[#008744] focus-visible:border-[#008744] pr-10"
                    {...register("password")}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeSlash size={20} weight="duotone" /> : <Eye size={20} weight="duotone" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-[#008744] to-[#00a884] hover:brightness-110 text-white font-bold text-sm shadow-md shadow-emerald-900/20 transition-all" 
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk ke Dashboard"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground pb-8 pt-4">
            <div className="text-xs sm:text-sm font-medium text-[#4a5e51]">
              Belum punya akun?{" "}
              <Link href="/daftar" className="text-[#008744] hover:text-[#00c46b] hover:underline font-bold transition-colors">
                Daftar sekarang
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
