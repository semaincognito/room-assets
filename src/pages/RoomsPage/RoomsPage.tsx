import { useEffect, useMemo, useState } from 'react';
import type { Room } from '@/types/models';
import { uid } from '@/utils/id';
import { createRoom, deleteRoom, getRooms } from '@/utils/storage/roomsService';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);

  // поля формы
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [minCapacity, setMinCapacity] = useState<number | ''>('');

  function reload() {
    setRooms(getRooms());
  }

  useEffect(() => {
    reload();
  }, []);

  const canSubmit = useMemo(() => {
    return number.trim().length > 0 && title.trim().length > 0 && capacity > 0;
  }, [number, title, capacity]);

  const filteredRooms = useMemo(() => {
  return rooms.filter((r) => {
    const s = search.trim().toLowerCase();

    const matchesSearch =
      s.length === 0 ||
      r.number.toLowerCase().includes(s) ||
      r.title.toLowerCase().includes(s);

    const matchesCapacity =
      minCapacity === '' || r.capacity >= Number(minCapacity);

    return matchesSearch && matchesCapacity;
  });
}, [rooms, search, minCapacity]);

  function resetForm() {
    setNumber('');
    setTitle('');
    setCapacity(0);
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

    const n = number.trim();
    const t = title.trim();

    if (!n || !t || capacity <= 0) {
      setError('Заполните номер, название и вместимость > 0');
      return;
    }

    // Проверка на дубли номера (очень полезно для сдачи)
    const exists = rooms.some((r) => r.number === n);
    if (exists) {
      setError('Аудитория с таким номером уже существует');
      return;
    }

    const newRoom: Room = {
      id: uid('room'),
      number: n,
      title: t,
      capacity,
    };

    createRoom(newRoom);
    reload();
    setOpen(false);
  }

  function handleDelete(id: string) {
    deleteRoom(id);
    reload();
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Rooms</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Добавить аудиторию
        </Button>
      </Stack>

    <Stack direction="row" spacing={2}>
      <TextField
        label="Поиск"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Номер или название"
      />

      <TextField
        label="Мин. вместимость"
        type="number"
        value={minCapacity}
        onChange={(e) =>
          setMinCapacity(e.target.value === '' ? '' : Number(e.target.value))
        }
      />
    </Stack>

      <Paper sx={{ p: 2 }}>
        {rooms.length === 0 ? (
          <Typography>Пока нет аудиторий. Нажмите “Добавить аудиторию”.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Номер</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Вместимость</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredRooms.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.number}</TableCell>
                  <TableCell>{r.title}</TableCell>
                  <TableCell>{r.capacity}</TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => handleDelete(r.id)}>
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
        <DialogTitle>Новая аудитория</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Номер"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Например, 101"
              fullWidth
            />
            <TextField
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например, Аудитория 101"
              fullWidth
            />
            <TextField
              label="Вместимость"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              fullWidth
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