import axios from 'axios';
import type {
  HelloRequest, HelloResponse,
  HashRequest, HashResponse,
  SortRequest, SortResponse,
  StatisticsResponse,
} from '../types';

const api = axios.create({
  baseURL: '/api/demo',
  headers: {
    'X-User-Id': 'user001',
    'X-User-Type': '正式',
    'X-User-Level': 'P6',
    'X-User-Dept': '技术部',
  },
});

export const callHello = (data: HelloRequest) =>
  api.post<HelloResponse>('/hello', data).then((res) => res.data);

export const callHash = (data: HashRequest) =>
  api.post<HashResponse>('/hash', data).then((res) => res.data);

export const callBubbleSort = (data: SortRequest) =>
  api.post<SortResponse>('/bubble-sort', data).then((res) => res.data);

export const exportData = (type: string) =>
  api.get('/export', {
    params: { type, format: 'csv' },
    responseType: 'blob',
  }).then((res) => {
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}-export.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  });

export const getStatistics = (dimension: string, period: string = 'all') =>
  api.get<StatisticsResponse>('/statistics', { params: { dimension, period } })
    .then((res) => res.data);
