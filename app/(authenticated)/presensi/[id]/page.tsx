import { PresensiClientPage } from "./client-page";

export default async function PresensiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PresensiClientPage idKegiatan={Number(id)} />;
}
