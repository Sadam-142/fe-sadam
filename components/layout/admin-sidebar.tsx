"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/components/shared/auth-provider";
import { 
  House, 
  Users, 
  CalendarCheck, 
  MapPinLine, 
  ChartBar,
  SignOut,
  UserCircle
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";

const adminNavItems = [
  { href: "/admin", icon: House, label: "Dashboard" },
  { href: "/admin/pendaftaran", icon: Users, label: "Pendaftaran" },
  { href: "/admin/anggota", icon: UserCircle, label: "Data Anggota" },
  { href: "/admin/kegiatan", icon: CalendarCheck, label: "Kegiatan" },
  { href: "/admin/presensi", icon: MapPinLine, label: "Presensi" },
  { 
    href: "/admin/laporan", 
    icon: ChartBar, 
    label: "Laporan",
    subItems: [
      { href: "/admin/laporan?tab=anggota", tabVal: "anggota", label: "Data Anggota" },
      { href: "/admin/laporan?tab=kegiatan", tabVal: "kegiatan", label: "Data Kegiatan" },
      { href: "/admin/laporan?tab=kehadiran", tabVal: "kehadiran", label: "Agregasi Kehadiran" },
    ]
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "anggota";
  const { logout, user } = useAuth();

  return (
    <Sidebar className="border-r border-emerald-100/50 bg-white">
      <SidebarHeader className="h-20 justify-center border-b border-emerald-100/50 p-4">
        <Link href="/admin" className="flex items-center gap-3 font-semibold">
          <div className="flex size-11 items-center justify-center rounded-xl bg-white shadow-sm border border-emerald-50 p-1.5 overflow-hidden">
            <Image 
              src="/UKMRISALAH.png" 
              alt="Logo Risalah" 
              width={40} 
              height={40} 
              className="object-contain" 
            />
          </div>
          <span className="leading-tight">
            <span className="block text-sm font-black text-[#0d2318]">Risalah Admin</span>
            <span className="text-xs font-semibold text-[#008744]">Pengurus</span>
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-800/60 font-semibold uppercase text-[10px] tracking-wider mb-2">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavItems.map((item) => {
                const isActive = item.href === "/admin" 
                  ? pathname === "/admin" 
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive && !item.subItems} tooltip={item.label} className="min-h-11 rounded-xl mb-1">
                      <Link href={item.href}>
                        <item.icon weight={isActive ? "fill" : "regular"} size={20} />
                        <span className="text-sm font-semibold">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                    
                    <AnimatePresence>
                      {item.subItems && isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.href}>
                                <SidebarMenuSubButton asChild isActive={currentTab === subItem.tabVal} className="transition-all duration-300 ease-in-out hover:bg-emerald-500/10 hover:text-emerald-700 data-[active=true]:bg-emerald-500/15 data-[active=true]:text-[#008744] data-[active=true]:font-bold rounded-lg py-1.5 px-3 backdrop-blur-sm">
                                  <Link href={subItem.href}>
                                    <span>{subItem.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-emerald-100/50">
        <div className="mb-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 px-3 py-3">
          <p className="text-sm font-bold text-[#0d2318] leading-none">{user?.username || "Admin"}</p>
          <p className="text-xs font-semibold text-[#008744] mt-1">Admin</p>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={logout} className="min-h-11 cursor-pointer rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors">
              <a>
                <SignOut size={20} weight="bold" />
                <span className="text-sm font-bold">Keluar</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
