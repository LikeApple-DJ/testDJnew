import type {
  ApiResult,
  HelloWorldData,
  HashData,
  BubbleSortData,
  MetricsResponse,
  WeatherResponse,
  Dimension,
} from '../types';

const BASE_URL = '/api';

function callerHeaders(): Record<string, string> {
  return {
    'X-Caller-Name': 'demo-user',
    'X-Caller-Type': '正式员工',
    'X-Caller-Level': 'P7',
    'X-Caller-Dept': '技术部',
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...callerHeaders(),
      ...options?.headers,
    },
  });
  return res.json();
}

export async function fetchHelloWorld(): Promise<ApiResult<HelloWorldData>> {
  return request<HelloWorldData>('/helloworld');
}

export async function fetchHash(
  input: string,
  algorithm: string
): Promise<ApiResult<HashData>> {
  return request<HashData>('/hash', {
    method: 'POST',
    body: JSON.stringify({ input, algorithm }),
  });
}

export async function fetchBubbleSort(
  array: number[],
  order: string
): Promise<ApiResult<BubbleSortData>> {
  return request<BubbleSortData>('/bubblesort', {
    method: 'POST',
    body: JSON.stringify({ array, order }),
  });
}

export async function exportExcel(type: string, data: unknown): Promise<Blob> {
  const res = await fetch(`${BASE_URL}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...callerHeaders(),
    },
    body: JSON.stringify({ type, data }),
  });
  if (!res.ok) throw new Error('导出失败');
  return res.blob();
}

export async function fetchMetrics(
  dimension: Dimension,
  startDate?: string,
  endDate?: string
): Promise<ApiResult<MetricsResponse>> {
  const params = new URLSearchParams({ dimension });
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  return request<MetricsResponse>(`/metrics?${params.toString()}`);
}

export async function fetchWeather(
  city: string = 'hangzhou'
): Promise<ApiResult<WeatherResponse>> {
  return request<WeatherResponse>(`/weather?city=${encodeURIComponent(city)}`);
}