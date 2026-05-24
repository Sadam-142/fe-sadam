import { ReactNode } from "react";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f8fafc] via-[#f0f9ff] to-[#eef2ff] pb-[72px] relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-300/5 blur-[100px] pointer-events-none" />
      
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
