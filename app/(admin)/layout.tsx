import { ReactNode } from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="bg-gradient-to-br from-[#f8fdf9] via-[#f0fbf3] to-[#f8fdf9] relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-400/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-teal-200/5 blur-[100px] pointer-events-none" />

        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-emerald-100/50 bg-white/70 px-6 backdrop-blur-xl lg:h-20 shadow-sm">
          <SidebarTrigger className="-ml-1 text-emerald-800 hover:text-emerald-900" />
          <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#008744] to-[#00c46b] md:hidden">
            Risalah Admin
          </span>
        </header>
        <main className="relative z-10 flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
