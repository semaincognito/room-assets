# DATA — Формат данных

## Room

Пример объекта Room:

~~~json
{
  "id": "room_...",
  "number": "101",
  "title": "Аудитория 101",
  "capacity": 30
}
~~~

## Asset

Пример объекта Asset:

~~~json
{
  "id": "asset_...",
  "name": "Проектор",
  "description": "HDMI"
}
~~~

## Booking

Пример объекта Booking:

~~~json
{
  "id": "booking_...",
  "roomId": "room_...",
  "title": "Лекция",
  "start": "2026-02-23T09:00:00.000Z",
  "end": "2026-02-23T10:00:00.000Z"
}
~~~

## Экспорт/Импорт (AppData)

Формат общего файла для Import/Export:

~~~json
{
  "rooms": [ /* Room[] */ ],
  "assets": [ /* Asset[] */ ],
  "bookings": [ /* Booking[] */ ]
}
~~~

## Хранение

Данные хранятся в localStorage в ключах:
- `rooms`
- `assets`
- `bookings`