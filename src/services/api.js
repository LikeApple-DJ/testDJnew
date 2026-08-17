import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function callHello(name) {
  return api.post('/hello', { name });
}

export function callHash(input) {
  return api.post('/hash', { input });
}

export function callBubbleSort(array) {
  return api.post('/bubble-sort', { array });
}

export function exportTab(tab) {
  return api.post('/export', { tab }, { responseType: 'blob' });
}