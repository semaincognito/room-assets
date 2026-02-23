import { http, HttpResponse } from 'msw';
import { roomsMock } from '@/mocks/data';

export const handlers = [
  http.get('/api/rooms', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    return HttpResponse.json({ ...roomsMock, page }, { status: 200 });
  }),
];