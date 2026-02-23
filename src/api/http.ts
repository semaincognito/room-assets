import axios from 'axios';

// В dev (npm run dev) по умолчанию /api — это перехватит MSW
// В prod мы зададим VITE_API_URL = https://...onrender.com/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

export const http = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});