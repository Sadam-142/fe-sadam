import { Suspense } from "react";
import LaporanClientPage from "./client-page";

export default function LaporanAdminPage() {
  return (
    <Suspense fallback={<div>Memuat Laporan...</div>}>
      <LaporanClientPage />
    </Suspense>
  );
}
