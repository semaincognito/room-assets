import { useEffect, useMemo, useState } from 'react';
import type { Booking, Room } from '@/types/models';
import { uid } from '@/utils/id';
import { getRooms } from '@/utils/storage/roomsService';
import { createBooking, deleteBooking, getBookings } from '@/utils/storage/bookingsService';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

function formatDt(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export function BookingsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [items, setItems] = useState<Booking[]>([]);
  const [open, setOpen] = useState(false);

  // форма
  const [roomId, setRoomId] = useState('');
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(''); // datetime-local string
  const [end, setEnd] = useState('');

  const [error, setError] = useState<string | null>(null);

  const [roomFilter, setRoomFilter] = useState('');

  function reload() {
    setRooms(getRooms());
    setItems(getBookings());
  }

  useEffect(() => {
    reload();
  }, []);

  const canSubmit = useMemo(() => {
    return roomId && title.trim() && start && end;
  }, [roomId, title, start, end]);

  function resetForm() {
    setRoomId('');
    setTitle('');
    setStart('');
    setEnd('');
    setError(null);
  }

  function handleOpen() {
    resetForm();
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleCreate() {
    setError(null);

    if (!roomId) {
      setError('Выберите аудиторию');
      return;
    }
    if (!title.trim()) {
      setError('Введите название брони');
      return;
    }
    if (!start || !end) {
      setError('Выберите время начала и окончания');
      return;
    }

    // datetime-local -> ISO
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
      setError('Некорректная дата начала');
      return;
    }
    if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
      setError('Некорректная дата окончания');
      return;
    }
    if (endDate <= startDate) {
      setError('Окончание должно быть позже начала');
      return;
    }

    const newBooking: Booking = {
      id: uid('booking'),
      roomId,
      title: title.trim(),
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    };

    try {
      createBooking(newBooking);
      reload();
      setOpen(false);
    } catch (e) {
      setError('Конфликт бронирования: в это время аудитория уже занята');
    }
  }

  function handleDelete(id: string) {
    deleteBooking(id);
    reload();
  }

  const filteredBookings = useMemo(() => {
  if (!roomFilter) return items;
  return items.filter((b) => b.roomId === roomFilter);
  }, [items, roomFilter]);

  // удобное имя комнаты
  const roomNameById = useMemo(() => {
    const map = new Map<string, string>();
    rooms.forEach((r) => map.set(r.id, `${r.number} — ${r.title}`));
    return map;
  }, [rooms]);

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Bookings</Typography>
        <Button variant="contained" onClick={handleOpen} disabled={rooms.length === 0}>
          Создать бронь
        </Button>
      </Stack>

      <FormControl sx={{ width: 260 }}>
        <InputLabel>Фильтр по аудитории</InputLabel>
        <Select
          value={roomFilter}
          label="Фильтр по аудитории"
          onChange={(e) => setRoomFilter(String(e.target.value))}
        >
          <MenuItem value="">Все</MenuItem>
          {rooms.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              {r.number} — {r.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {rooms.length === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography color="error">
            Нет аудиторий. Сначала создайте аудитории во вкладке Rooms.
          </Typography>
        </Paper>
      )}

      <Paper sx={{ p: 2 }}>
        {items.length === 0 ? (
          <Typography>Пока нет бронирований.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Аудитория</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Начало</TableCell>
                <TableCell>Конец</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{roomNameById.get(b.roomId) ?? b.roomId}</TableCell>
                  <TableCell>{b.title}</TableCell>
                  <TableCell>{formatDt(b.start)}</TableCell>
                  <TableCell>{formatDt(b.end)}</TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => handleDelete(b.id)}>
                      Удалить
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Новая бронь</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="room-select-label">Аудитория</InputLabel>
              <Select
                labelId="room-select-label"
                value={roomId}
                label="Аудитория"
                onChange={(e) => setRoomId(String(e.target.value))}
              >
                {rooms.map((r) => (
                  <MenuItem key={r.id} value={r.id}>
                    {r.number} — {r.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Название брони"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, Лекция"
              fullWidth
            />

            <TextField
              label="Начало"
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Конец"
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {error && <Typography color="error">{error}</Typography>}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!canSubmit}>
            Создать
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}