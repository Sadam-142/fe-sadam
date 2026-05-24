/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/components/shared/auth-provider";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, User, GraduationCap, EnvelopeSimple, Phone, Lock, Bell, IdentificationCard, MapPin, Buildings, Eye, EyeSlash } from "@phosphor-icons/react";

export default function ProfilPage() {
  const { user, logout } = useAuth();
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Edit Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    nama_lengkap: user?.nama_lengkap || user?.username || "",
    no_hp: user?.no_hp || "",
    email: user?.email || "",
    alamat_domisili: user?.alamat_domisili || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setIsEditingProfile(true); // Automatically open edit mode so user can save
    }
  };

  // Push Notification State
  const [isPushSupported] = useState(
    () => typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window
  );
  const [pushPermission, setPushPermission] = useState<NotificationPermission | "unsupported">(
    () => (typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported")
  );
  const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const handleSubscribePush = async () => {
    if (!isPushSupported || !publicVapidKey) {
      toast.error("Push notification tidak didukung atau konfigurasi VAPID tidak ada");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });
        }

        const res = await api.post("/device-token", {
          device_token: JSON.stringify(subscription),
        });

        if (res.success) {
          toast.success("Notifikasi berhasil diaktifkan!");
        }
      } else {
        toast.error("Izin notifikasi ditolak");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengaktifkan notifikasi");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingProfile(true);
      
      const formData = new FormData();
      formData.append("nama_lengkap", profileData.nama_lengkap);
      formData.append("no_hp", profileData.no_hp);
      formData.append("email", profileData.email);
      formData.append("alamat_domisili", profileData.alamat_domisili);
      if (selectedPhoto) {
        formData.append("foto_profil", selectedPhoto);
      }

      const res = await api.put("/auth/profile", formData);
      if (res.success) {
        toast.success("Profil berhasil diperbarui!");
        setIsEditingProfile(false);
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui profil");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Konfirmasi sandi baru tidak cocok");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Sandi baru minimal 6 karakter");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await api.put("/auth/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        toast.success("Sandi berhasil diubah");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setShowPasswordForm(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah sandi");
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-4 pb-20 space-y-6 max-w-2xl mx-auto bg-[#f8fafc] min-h-screen">
      <header className="pt-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Profil Saya</h1>
        <p className="text-slate-500 font-medium mt-1">
          Kelola Informasi dan Pengaturan Akun
        </p>
      </header>

      {/* Elegant Banner Card for Avatar */}
      <Card className="border-0 shadow-xl shadow-emerald-900/10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center gap-4 sm:flex-row sm:text-left sm:justify-start">
          <div className="relative shrink-0">
            <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl bg-white/10 backdrop-blur-sm text-white relative">
              <AvatarImage src={photoPreview || user.foto_profil || ""} className="object-cover" />
              <AvatarFallback className="text-3xl font-black bg-emerald-700/50 text-white">
                {user.username.substring(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-2 bg-white text-emerald-600 rounded-full shadow-lg border-2 border-emerald-600 flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer"
            >
              <Camera size={16} weight="fill" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              className="hidden" 
              accept="image/*" 
            />
          </div>
          <div className="text-white flex-1">
            <h2 className="text-xl font-bold leading-tight drop-shadow-sm">{user.nama_lengkap || user.username}</h2>
            <p className="text-sm font-medium opacity-90 mt-1 drop-shadow-sm flex items-center justify-center sm:justify-start gap-1.5">
              <IdentificationCard size={18} /> {user.nim || user.no_anggota || "-"}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/10">
                Anggota Aktif
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider border border-white/10">
                Angkatan {user.angkatan || "-"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Informasi Profil */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Informasi Profil</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Data detail keanggotaan Anda</p>
            </div>
            {!isEditingProfile && (
              <Button onClick={() => setIsEditingProfile(true)} size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl h-9 px-4 font-bold">
                <User size={16} className="mr-2" weight="duotone" />
                Edit Profil
              </Button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="nama_lengkap" className="text-xs font-bold text-slate-700 uppercase">Nama Lengkap</Label>
                    <Input 
                      id="nama_lengkap" 
                      value={profileData.nama_lengkap} 
                      onChange={(e) => setProfileData({ ...profileData, nama_lengkap: e.target.value })} 
                      required 
                      className="bg-white border-slate-200 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="no_hp" className="text-xs font-bold text-slate-700 uppercase">No. HP</Label>
                    <Input 
                      id="no_hp" 
                      value={profileData.no_hp} 
                      onChange={(e) => setProfileData({ ...profileData, no_hp: e.target.value })} 
                      className="bg-white border-slate-200 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-700 uppercase">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profileData.email} 
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} 
                      className="bg-white border-slate-200 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="alamat_domisili" className="text-xs font-bold text-slate-700 uppercase">Domisili</Label>
                    <Input 
                      id="alamat_domisili" 
                      value={profileData.alamat_domisili} 
                      onChange={(e) => setProfileData({ ...profileData, alamat_domisili: e.target.value })} 
                      className="bg-white border-slate-200 focus-visible:ring-emerald-500 rounded-xl"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium md:col-span-2">*Pastikan data yang Anda masukkan benar dan dapat dihubungi.</p>
                </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button type="button" variant="ghost" onClick={() => { setIsEditingProfile(false); setSelectedPhoto(null); setPhotoPreview(null); }} disabled={isSavingProfile} className="text-slate-500 font-bold">Batal</Button>
                <Button type="submit" disabled={isSavingProfile} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20">
                  {isSavingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 h-fit">
                  <User size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Nama Lengkap</p>
                  <p className="text-sm font-black text-slate-800">{user?.nama_lengkap || user.username}</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 h-fit">
                  <IdentificationCard size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">NIM</p>
                  <p className="text-sm font-black text-slate-800">{user?.nim || user.no_anggota || "-"}</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 h-fit">
                  <EnvelopeSimple size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm font-black text-slate-800">{user?.email || "-"}</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl shrink-0 h-fit">
                  <Phone size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">No. HP</p>
                  <p className="text-sm font-black text-slate-800">{user?.no_hp || "-"}</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl shrink-0 h-fit">
                  <MapPin size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Domisili</p>
                  <p className="text-sm font-black text-slate-800">{user?.alamat_domisili || "-"}</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl shrink-0 h-fit">
                  <Buildings size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Fakultas</p>
                  <p className="text-sm font-black text-slate-800">{user?.fakultas || "-"}</p>
                </div>
              </div>

              <div className="flex gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 h-fit">
                  <GraduationCap size={20} weight="duotone" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Program Studi</p>
                  <p className="text-sm font-black text-slate-800">{user?.program_studi || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 3: Keamanan */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Keamanan Akun</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Kelola password untuk keamanan data</p>
            </div>
            <Button 
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl h-10 px-5 font-bold shadow-none"
            >
              <Lock size={18} className="mr-2" weight="duotone" />
              Ubah Password
            </Button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4 mt-6 pt-6 border-t border-slate-100 bg-slate-50/50 p-5 rounded-2xl">
              <div className="space-y-2">
                <Label htmlFor="oldPassword" className="text-xs font-bold text-slate-700">Sandi Lama</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    required
                    className="bg-white rounded-xl focus-visible:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    tabIndex={-1}
                  >
                    {showOldPassword ? <EyeSlash size={18} weight="duotone" /> : <Eye size={18} weight="duotone" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-xs font-bold text-slate-700">Sandi Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="bg-white rounded-xl focus-visible:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeSlash size={18} weight="duotone" /> : <Eye size={18} weight="duotone" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Konfirmasi Sandi Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="bg-white rounded-xl focus-visible:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeSlash size={18} weight="duotone" /> : <Eye size={18} weight="duotone" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={isChangingPassword} className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md">
                {isChangingPassword ? "Menyimpan..." : "Simpan Sandi Baru"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Card 4: Notifikasi Push */}
      <Card className="border-0 shadow-sm rounded-2xl bg-white mb-8 overflow-hidden">
        <CardContent className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl shrink-0">
              <Bell size={24} weight="duotone" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Notifikasi Push</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Terima notifikasi tentang kegiatan terbaru</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <input 
              type="checkbox" 
              id="push-toggle" 
              className="h-5 w-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 bg-white"
              checked={pushPermission === "granted"}
              onChange={handleSubscribePush}
              disabled={!isPushSupported || pushPermission === "granted"}
            />
            <label htmlFor="push-toggle" className="text-xs font-bold text-slate-600 select-none cursor-pointer">Aktif</label>
          </div>
        </CardContent>
      </Card>
      
      {/* Logout */}
      <div className="pt-2 flex justify-center pb-8">
        <button 
          onClick={logout}
          className="text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-xl transition-colors text-sm flex items-center gap-2"
        >
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
