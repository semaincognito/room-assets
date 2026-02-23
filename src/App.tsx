import { useState } from 'react';
import { Header } from '@/components/Header';
import { RoomsTable } from '@/components/RoomsTable/RoomsTable';
import { RoomsPage } from '@/pages/RoomsPage/RoomsPage';
import { AssetsPage } from '@/pages/AssetsPage/AssetsPage';
import { BookingsPage } from '@/pages/BookingsPage/BookingsPage';
import { DataPage } from '@/pages/DataPage/DataPage';
import { Box, Container, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

type Tab = 'rooms' | 'assets' | 'bookings' | 'data';
type RoomsMode = 'demo' | 'crud';

export default function App() {
  const [tab, setTab] = useState<Tab>('rooms');
  const [roomsMode, setRoomsMode] = useState<RoomsMode>('crud');

  return (
    <>
      <Header activeTab={tab} onTabChange={setTab} />

      <Container sx={{ py: 4 }}>
        {tab === 'rooms' && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Rooms
            </Typography>

            <ToggleButtonGroup
              value={roomsMode}
              exclusive
              onChange={(_, v) => v && setRoomsMode(v)}
              sx={{ mb: 2 }}
            >
              <ToggleButton value="crud">CRUD (Task 1)</ToggleButton>
              <ToggleButton value="demo">Demo (MSW)</ToggleButton>
            </ToggleButtonGroup>

            {roomsMode === 'crud' ? <RoomsPage /> : <RoomsTable />}
          </Box>
        )}

        {tab === 'assets' && <AssetsPage />}
        {tab === 'bookings' && <BookingsPage />}
        {tab === 'data' && <DataPage />}
      </Container>
    </>
  );
}