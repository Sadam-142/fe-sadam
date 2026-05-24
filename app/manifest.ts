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
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
