Описание проекта

- Фронтенд реализован с использованием:
React + TypeScript
Vite (сборка и dev-сервер)
Material UI (MUI) для интерфейса
Axios для HTTP-запросов
MSW (Mock Service Worker) для мокирования API в режиме разработки

- Подход к разработке
Проект организован по принципу разделения ответственности:
pages/ — страницы (Rooms, Assets, Bookings, Data)
components/ — переиспользуемые UI-компоненты
utils/storage — работа с localStorage
api/ — HTTP-клиент и DTO-контракты
mocks/ — MSW для demo-режима
context/ — заготовка авторизации

- Реализовано:
CRUD для Rooms, Assets и Bookings
Поиск и фильтры
Предотвращение пересечений бронирований
Хранение времени в UTC (ISO/RFC3339) с отображением в локальном часовом поясе
Import/Export JSON + seed.example.json
Production-сборка через Vite
В production фронтенд развернут на GitHub Pages.

- Что сделано в бэкенде

Бэкенд реализован с использованием:
Node.jsExpress
CORS

Реализован REST endpoint:
GET /api/rooms

Сервер:
слушает порт через process.env.PORT
настроен для работы на Render
поддерживает CORS для взаимодействия с GitHub Pages

Бэкенд развернут на Render как Web Service.

- Как настроен CI/CD

CI/CD реализован следующим образом:
Frontend (GitHub Pages)
Используется GitHub Actions

При каждом push в ветку main:
устанавливаются зависимости
выполняется сборка npm run build
содержимое папки dist/ автоматически деплоится на GitHub Pages
URL backend передаётся через GitHub Secret VITE_API_URL

Таким образом, деплой фронтенда полностью автоматизирован.

Backend (Render)
Render подключён к GitHub репозиторию
При каждом push в main:
выполняется npm install
запускается сервер (node index.js)
происходит автоматический деплой

Таким образом, backend также обновляется автоматически без ручных действий.