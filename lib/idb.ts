export type PendingPresensi = {
  id?: number;
  id_anggota: string;
  id_kegiatan: string;
  latitude: string;
  longitude: string;
  keterangan: string;
  bukti_foto: {
    buffer: ArrayBuffer;
    type: string;
    name: string;
  };
  timestamp: number;
};

const DB_NAME = "risalah-offline-db";
const STORE_NAME = "presensi-sync-queue";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

export async function savePendingPresensi(data: Omit<PendingPresensi, "id" | "timestamp">): Promise<number> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    
    const record: PendingPresensi = {
      ...data,
      timestamp: Date.now(),
    };

    const request = store.add(record);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPendingPresensi(): Promise<PendingPresensi[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as PendingPresensi[]);
    request.onerror = () => reject(request.error);
  });
}

export async function removePendingPresensi(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
