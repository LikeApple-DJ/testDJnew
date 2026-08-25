import axios from 'axios';
import type { ApiResponse, HashResponse, SortResponse } from '../types';

const api = axios.create({
  baseURL: '/api/v1/demo',
  headers: {
    'X-User-Id': 'u001',
    'X-User-Type': '正式员工',
    'X-User-Level': 'P5',
    'X-User-Dept': '技术部'
  }
});

export const hello = () =>
  api.get<ApiResponse<string>>('/hello').then(r => r.data.data);

export const hash = (content: string, algorithm: string = 'SHA-256') =>
  api.post<ApiResponse<HashResponse>>('/hash', { content, algorithm }).then(r => r.data.data);

export const bubbleSort = (numbers: number[], ascending = true, unique = false) =>
  api.post<ApiResponse<SortResponse>>('/sort/bubble', { numbers, ascending, unique }).then(r => r.data.data);

export const exportData = (tab: string, format: string) =>
  api.post('/export', { tab, format }, { responseType: 'blob' }).then(r => r.data);

export const fetchReport = (dimension: string, startDate: string, endDate: string) =>
  api.get<ApiResponse<Array<{ dimension: string; count: number }>>>('/metrics/report', {
    params: { dimension, startDate, endDate }
  }).then(r => r.data.data);