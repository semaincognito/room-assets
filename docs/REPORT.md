# REPORT — Room Assets

## Кратко о проекте
Room Assets — учебное приложение для учёта аудиторий (Rooms), ресурсов (Assets) и бронирований (Bookings).
Реализованы CRUD-операции, предотвращение пересечений бронирований, поиск/фильтры, импорт/экспорт JSON и документация.

---

## 1) Архитектура и структура проекта

Стек:
- Vite + React + TypeScript
- Material UI (MUI) — таблицы, формы, модальные окна
- axios — HTTP слой (Demo режим)
- MSW — мокирование backend API (Demo режим)

Структура проекта (ключевые папки):
- `src/components` — переиспользуемые UI-компоненты (Button, Header, RoomsTable)
- `src/pages` — страницы приложения (RoomsPage, AssetsPage, BookingsPage, DataPage)
- `src/utils/storage` — слой хранения данных в localStorage (roomsService, assetsService, bookingsService)
- `src/utils/data` — импорт/экспорт JSON (dataIo)
- `src/mocks` — мокирование API через MSW (handlers/data/browser)
- `src/api` — контракты DTO и функция `fetchRooms` для Demo режима
- `src/context` — заготовка авторизации (AuthContext)
- `docs/` — документация для Task 1
- `screens/` — скриншоты работы приложения

Принцип организации:
- UI (pages/components) не хранит данные напрямую — использует сервисы.
- Данные хранятся в localStorage (Task 1), а для демонстрации API есть отдельный режим MSW.

---

## 2) Схема авторизации (заготовка)
Реализована заготовка авторизации через React Context:
- `AuthProvider` и хук `useAuth`
- пользователь сохраняется в localStorage (ключ `app_user`)
- при перезапуске приложения пользователь восстанавливается
- есть функции `signIn` / `signOut`

Подготовка под реальный backend:
- можно заменить сохранение user в localStorage на запрос `/auth/me`
- возможны варианты: JWT (localStorage) или cookie-сессии (httpOnly cookies)

---

## 3) Моки (MSW) и контракты для миграции на реальный backend
Demo режим использует:
- `axios` с `baseURL: /api`
- контракт `RoomDto` и `RoomsResponseDto`
- запрос `GET /api/rooms?page=...`

MSW:
- `src/mocks/handlers.ts` перехватывает `GET /api/rooms`
- `src/mocks/data.ts` содержит тестовые данные
- MSW запускается в `main.tsx` только в режиме разработки (DEV)
- при миграции на реальный backend Demo режим можно отключить, либо MSW останется только для локальных тестов

---

## 4) Реализованный функционал (Task 1)

### Rooms
- Просмотр списка
- Добавление аудитории (номер, название, вместимость)
- Удаление аудитории
- Поиск по номеру/названию
- Фильтр по минимальной вместимости
- Валидации: обязательные поля, вместимость > 0, уникальный номер

### Assets
- Просмотр списка
- Добавление ресурса (название + опциональное описание)
- Удаление ресурса
- Поиск по названию
- Валидации: название обязательно, уникальное (без учета регистра)

### Bookings
- Просмотр списка бронирований
- Создание брони (выбор аудитории, название, start/end)
- Удаление брони
- Фильтр по аудитории
- Валидации: обязательные поля, end > start
- Предотвращение пересечений интервалов в одной аудитории:
  - конфликт, если `aStart < bEnd && bStart < aEnd`
- Время хранится в UTC (ISO/RFC3339), отображается в локальном часовом поясе

### Data (Import/Export)
- Export JSON — скачивание файла с данными `{ rooms, assets, bookings }`
- Import JSON — загрузка данных из JSON
- Пример данных: `seed.example.json`

---

## 5) Сборка (Release)
- `npm run build` создаёт папку `dist/`
- `npm run preview` позволяет проверить production-сборку локально

---

## 6) Скриншоты
Скриншоты находятся в `screens/`:
- `01-rooms-crud.png` — Rooms CRUD + поиск/фильтр
- `02-bookings-conflict.png` — конфликт бронирования
- `03-msw-error.png` — обработка ошибки в Demo (MSW) режиме
- `04-data-page.png` — Import/Export JSON

(Названия могут отличаться, но в папке есть 3–4 скриншота по указанным сценариям.)