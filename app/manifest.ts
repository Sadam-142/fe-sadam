import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sistem Informasi Keanggotaan UKM Risalah",
    short_name: "UKM Risalah",
    description: "Progressive Web App untuk keanggotaan dan presensi UKM Risalah.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3f4c2e",
    orientation: "portrait",
    icons: [
      {
        src: "/UKMRISALAH.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/UKMRISALAH.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      },
    ],
  };
}
