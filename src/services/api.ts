import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'X-User-Id': 'user001',
    'X-User-Name': 'TestUser',
    'X-User-Type': 'developer',
    'X-User-Level': 'senior',
    'X-User-Dept': 'engineering',
  },
});

export const callHelloworld = async () => {
  const res = await apiClient.get('/helloworld');
  return res.data;
};

export const callHash = async (input: string) => {
  const res = await apiClient.get('/hash', { params: { input } });
  return res.data;
};

export const callBubbleSort = async (array: number[]) => {
  const res = await apiClient.post('/bubblesort', { array });
  return res.data;
};

export const callExport = async (tab: string) => {
  const res = await apiClient.get('/export', {
    params: { tab },
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${tab}_data.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const callStats = async (dimension: string) => {
  const res = await apiClient.get('/stats', { params: { dimension } });
  return res.data;
};