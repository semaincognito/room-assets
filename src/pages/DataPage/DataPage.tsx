import { useRef, useState } from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { downloadJson, exportData, importData, readJsonFile, type AppData } from '@/utils/data/dataIo';

export function DataPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleExport() {
    setError(null);
    setMessage(null);

    const data = exportData();
    const filename = `room-assets-export-${new Date().toISOString().slice(0, 10)}.json`;
    downloadJson(filename, data);

    setMessage('Экспорт выполнен: файл скачан.');
  }

  function openFileDialog() {
    setError(null);
    setMessage(null);
    inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setError(null);
      setMessage(null);

      const file = e.target.files?.[0];
      if (!file) return;

      const raw = await readJsonFile(file);
      importData(raw as AppData);

      setMessage('Импорт выполнен: данные загружены. Перейдите на вкладки Rooms/Assets/Bookings.');
      e.target.value = ''; // чтобы можно было загрузить тот же файл ещё раз
    } catch (err) {
      setError('Ошибка импорта. Проверьте формат JSON файла.');
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Data (Import / Export)</Typography>

      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography>
            Здесь можно экспортировать все данные (Rooms/Assets/Bookings) в JSON или импортировать их обратно.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleExport}>
              Export JSON
            </Button>
            <Button variant="outlined" onClick={openFileDialog}>
              Import JSON
            </Button>
          </Stack>

          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {message && <Typography color="success.main">{message}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
        </Stack>
      </Paper>
    </Stack>
  );
}