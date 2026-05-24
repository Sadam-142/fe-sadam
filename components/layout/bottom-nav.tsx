"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, CalendarCheck, MapPinLine, Bell, User } from "@phosphor-icons/react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: House, label: "Beranda" },
    { href: "/kegiatan", icon: CalendarCheck, label: "Kegiatan" },
    { href: "/riwayat", icon: MapPinLine, label: "Riwayat" },
    { href: "/notifikasi", icon: Bell, label: "Notif" },
    { href: "/profil", icon: User, label: "Profil" },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/90 shadow-[0_-10px_30px_rgba(17,24,39,0.08)] backdrop-blur-xl pb-safe">
      <div className="mx-auto flex h-[72px] max-w-3xl items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full w-full flex-col items-center justify-center gap-1 rounded-2xl transition-colors ${
                isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className={isActive ? "rounded-full bg-indigo-50 px-4 py-1 shadow-sm border border-indigo-100/50" : "px-4 py-1"}>
              <item.icon
                size={23}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "text-indigo-600" : ""}
              />
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
