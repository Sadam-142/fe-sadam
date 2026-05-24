import { Suspense } from "react";
import AnggotaClientPage from "./client-page";

export default function AnggotaAdminPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnggotaClientPage />
    </Suspense>
  );
}
