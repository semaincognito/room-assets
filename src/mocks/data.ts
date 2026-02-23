import type { RoomsResponseDto } from '@/api/roomsApi';

export const roomsMock: RoomsResponseDto = {
  page: 1,
  total: 3,
  items: [
    {
      id: '1',
      number: '101',
      title: 'Аудитория 101',
      capacity: 30,
      status: 'available',
      equipment: ['Проектор', 'Доска'],
    },
    {
      id: '2',
      number: '202',
      title: 'Аудитория 202',
      capacity: 20,
      status: 'booked',
      equipment: ['Компьютеры', 'Принтер'],
    },
    {
      id: '3',
      number: '305',
      title: 'Лаборатория 305',
      capacity: 16,
      status: 'maintenance',
      equipment: ['Микрофон'],
    },
  ],
};