export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

export interface HashResponse {
  algorithm: string;
  original: string;
  hash: string;
}

export interface SortResponse {
  input: number[];
  output: number[];
}

export type TabKey = 'hello' | 'hash' | 'bubble';
export type Dimension = 'userType' | 'userLevel' | 'userDept';
export type ChartType = 'line' | 'bar' | 'pie';

export interface ReportItem {
  dimension: string;
  count: number;
}