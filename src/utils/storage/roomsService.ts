import { load, save } from './storage';
import type { Room } from '@/types/models';

const KEY = 'rooms';

export function getRooms(): Room[] {
  return load<Room[]>(KEY, []);
}

export function createRoom(room: Room) {
  const rooms = getRooms();
  save(KEY, [...rooms, room]);
}

export function deleteRoom(id: string) {
  const rooms = getRooms();
  save(KEY, rooms.filter(r => r.id !== id));
}