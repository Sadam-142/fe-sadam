/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (string | PrecacheEntry)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

type PushPayload = {
  title?: string;
  body?: string;
  url?: string;
};

self.addEventListener("push", (event: PushEvent) => {
  if (event.data) {
    const data = event.data.json() as PushPayload;
    const options: NotificationOptions = {
      body: data.body,
      icon: "/UKMRISALAH.png",
      badge: "/UKMRISALAH.png",
      data: {
        url: data.url || "/",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title || "UKM Risalah", options));
  }
});

self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();
  const notificationData = event.notification.data as { url?: string } | undefined;
  const urlToOpen = new URL(notificationData?.url || "/", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      let matchingClient: WindowClient | null = null;
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }
      if (matchingClient) {
        return matchingClient.focus();
      } else {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

// Import IndexedDB helpers (assuming TS compiles them correctly for SW)
import { getAllPendingPresensi, removePendingPresensi } from "../lib/idb";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbxuyabsc";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sadam_upload";

async function uploadPresensiPhoto(file: Blob, fileName: string) {
  const formData = new FormData();
  formData.append("file", file, fileName);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", "ukm-risalah");

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.secure_url) {
    throw new Error(data.error?.message || "Gagal upload bukti presensi");
  }

  return data.secure_url as string;
}

// Define SyncEvent interface if missing
interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
}

// Menangani event sinkronisasi latar belakang
self.addEventListener("sync", (event: SyncEvent) => {
  if (event.tag === "sync-presensi") {
    event.waitUntil(
      (async () => {
        try {
          const pendings = await getAllPendingPresensi();
          
          for (const item of pendings) {
            // Reconstruct the file blob, upload it to Cloudinary, then send only the URL to the backend.
            const blob = new Blob([item.bukti_foto.buffer], { type: item.bukti_foto.type });
            const buktiFotoUrl = await uploadPresensiPhoto(blob, item.bukti_foto.name);

            // Fetch to real API
            const baseUrl = self.location.origin;
            const res = await fetch(`${baseUrl}/api/presensi`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id_anggota: item.id_anggota,
                id_kegiatan: item.id_kegiatan,
                latitude: item.latitude,
                longitude: item.longitude,
                keterangan: item.keterangan || undefined,
                bukti_foto: buktiFotoUrl,
              }),
            });

            if (res.ok || res.status === 400 || res.status === 409) {
              // Jika sukses, ATAU jika server menolak karena duplikat (400/409), kita hapus dari antrean
              if (item.id) {
                await removePendingPresensi(item.id);
              }
            } else {
              console.error("Gagal sinkronisasi presensi:", await res.text());
              throw new Error("Server rejected sync");
            }
          }

          if (pendings.length > 0) {
            self.registration.showNotification("UKM Risalah", {
              body: `${pendings.length} presensi offline Anda telah terkirim ke server!`,
              icon: "/UKMRISALAH.png",
              badge: "/UKMRISALAH.png",
            });
          }
        } catch (error) {
          console.error("Background sync failed:", error);
          throw error; // Memicu retry otomatis oleh browser
        }
      })()
    );
  }
});

