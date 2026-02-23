import { useEffect, useMemo, useState } from 'react';
import type { Asset } from '@/types/models';
import { uid } from '@/utils/id';
import { createAsset, deleteAsset, getAssets } from '@/utils/storage/assetsService';
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

export function AssetsPage() {
  const [items, setItems] = useState<Asset[]>([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  function reload() {
    setItems(getAssets());
  }

  useEffect(() => {
    reload();
  }, []);

  const canSubmit = useMemo(() => {
    return name.trim().length > 0;
  }, [name]);

  const filteredAssets = useMemo(() => {
  const s = search.trim().toLowerCase();
  if (!s) return items;
  return items.filter((a) => a.name.toLowerCase().includes(s));
  }, [items, search]);

  function resetForm() {
    setName('');
    setDescription('');
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

    const n = name.trim();
    const d = description.trim();

    if (!n) {
      setError('Введите название ресурса');
      return;
    }

    const exists = items.some((a) => a.name.toLowerCase() === n.toLowerCase());
    if (exists) {
      setError('Ресурс с таким названием уже существует');
      return;
    }

    const newAsset: Asset = {
      id: uid('asset'),
      name: n,
      description: d || undefined,
    };

    createAsset(newAsset);
    reload();
    setOpen(false);
  }

  function handleDelete(id: string) {
    deleteAsset(id);
    reload();
  }

  return (
    <Stack spacing={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Assets</Typography>
        <Button variant="contained" onClick={handleOpen}>
          Добавить ресурс
        </Button>
      </Stack>

      <TextField
      label="Поиск"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Название ресурса"
    />

      <Paper sx={{ p: 2 }}>
        {items.length === 0 ? (
          <Typography>Пока нет ресурсов. Нажмите “Добавить ресурс”.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Описание</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredAssets.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.description ?? '-'}</TableCell>
                  <TableCell align="right">
                    <Button color="error" onClick={() => handleDelete(a.id)}>
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
        <DialogTitle>Новый ресурс</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, Проектор"
              fullWidth
            />
            <TextField
              label="Описание (необязательно)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например, BenQ, HDMI"
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