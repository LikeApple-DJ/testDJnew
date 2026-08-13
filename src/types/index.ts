export interface HelloRequest {
  name: string;
}

export interface HelloResponse {
  message: string;
  timestamp: string;
}

export interface HashRequest {
  input: string;
  algorithm: 'MD5' | 'SHA-1' | 'SHA-256';
}

export interface HashResponse {
  input: string;
  algorithm: string;
  hash: string;
}

export interface SortRequest {
  array: number[];
}

export interface SortResponse {
  original: number[];
  sorted: number[];
  steps: number;
}

export interface StatisticsResponse {
  dimension: string;
  data: DimensionItem[];
  total: number;
}

export interface DimensionItem {
  label: string;
  count: number;
}

export interface UserHeaders {
  'X-User-Id': string;
  'X-User-Type': string;
  'X-User-Level': string;
  'X-User-Dept': string;
}
