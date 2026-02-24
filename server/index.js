import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());

// Разрешаем CORS (для GH Pages)
app.use(
  cors({
    origin: "*",
  })
);

// Простой healthcheck 
app.get("/health", (req, res) => res.json({ ok: true }));

// Демо-данные Rooms (можно расширять)
const rooms = [
  {
    id: "1",
    number: "101",
    title: "Аудитория 101",
    capacity: 30,
    status: "available",
    equipment: ["Проектор", "Доска"],
  },
  {
    id: "2",
    number: "202",
    title: "Аудитория 202",
    capacity: 20,
    status: "booked",
    equipment: ["Компьютеры", "Принтер"],
  },
  {
    id: "3",
    number: "305",
    title: "Лаборатория 305",
    capacity: 16,
    status: "maintenance",
    equipment: ["Микрофон"],
  },
];

app.get("/api/rooms", (req, res) => {
  const page = Number(req.query.page ?? 1);
  res.json({ items: rooms, page, total: rooms.length });
});

// Render задаёт PORT сам
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});