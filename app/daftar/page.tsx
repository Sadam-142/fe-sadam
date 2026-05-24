import { PendaftaranForm } from "@/components/forms/pendaftaran-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function DaftarPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute left-4 top-4 sm:left-8 sm:top-8 z-50">
        <Button variant="ghost" size="sm" asChild className="hover:bg-emerald-50 text-emerald-900 font-semibold bg-white/50 backdrop-blur-sm rounded-xl">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft size={16} /> Kembali
          </Link>
        </Button>
      </div>
      
      <PendaftaranForm />
    </div>
  );
}
