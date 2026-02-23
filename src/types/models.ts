export type Room = {
  id: string;
  number: string;
  title: string;
  capacity: number;
};

export type Asset = {
  id: string;
  name: string;
  description?: string;
};

export type Booking = {
  id: string;
  roomId: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
};