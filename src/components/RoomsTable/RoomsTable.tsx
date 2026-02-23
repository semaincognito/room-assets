import { useEffect, useState } from 'react';
import { fetchRooms, type RoomDto } from '@/api/roomsApi';
import {
  CircularProgress,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  Paper,
} from '@mui/material';

function statusLabel(status: RoomDto['status']) {
  if (status === 'available') return 'Свободна';
  if (status === 'booked') return 'Забронирована';
  return 'На обслуживании';
}

export function RoomsTable() {
  const [items, setItems] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setError(null);

    fetchRooms(1)
      .then((data) => {
        if (!alive) return;
        setItems(data.items);
      })
      .catch(() => {
        if (!alive) return;
        setError('Не удалось загрузить аудитории. Попробуйте позже.');
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Загрузка...</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Аудитории
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>№</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Вместимость</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Оборудование</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {items.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.number}</TableCell>
              <TableCell>{r.title}</TableCell>
              <TableCell>{r.capacity}</TableCell>
              <TableCell>
                <Chip label={statusLabel(r.status)} />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {r.equipment.map((e) => (
                    <Chip key={e} label={e} variant="outlined" size="small" />
                  ))}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}