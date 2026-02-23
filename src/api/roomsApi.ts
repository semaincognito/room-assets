import { http } from '@/api/http';

export type RoomDto = {
  id: string;
  number: string;
  title: string;
  capacity: number;
  status: 'available' | 'booked' | 'maintenance';
  equipment: string[];
};

export type RoomsResponseDto = {
  items: RoomDto[];
  page: number;
  total: number;
};

export async function fetchRooms(page = 1) {
  const res = await http.get<RoomsResponseDto>('/rooms', { params: { page } });
  return res.data;
}