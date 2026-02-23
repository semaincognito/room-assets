import type { Asset, Booking, Room } from '@/types/models';
import { getRooms } from '@/utils/storage/roomsService';
import { getAssets } from '@/utils/storage/assetsService';
import { getBookings } from '@/utils/storage/bookingsService';
import { save } from '@/utils/storage/storage';

export type AppData = {
  rooms: Room[];
  assets: Asset[];
  bookings: Booking[];
};

export function exportData(): AppData {
  return {
    rooms: getRooms(),
    assets: getAssets(),
    bookings: getBookings(),
  };
}

export function importData(data: AppData) {
  // минимальная защита от “битого” файла
  if (!data || !Array.isArray(data.rooms) || !Array.isArray(data.assets) || !Array.isArray(data.bookings)) {
    throw new Error('Invalid data format');
  }

  save('rooms', data.rooms);
  save('assets', data.assets);
  save('bookings', data.bookings);
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('File read error'));
    reader.onload = () => {
      try {
        const text = String(reader.result ?? '');
        resolve(JSON.parse(text));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    };
    reader.readAsText(file);
  });
}