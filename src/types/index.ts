// 统一后端响应格式
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

// HelloWorld
export interface HelloWorldData {
  message: string;
  timestamp: string;
}

// Hash
export interface HashData {
  input: string;
  algorithm: string;
  hash: string;
}

// BubbleSort
export interface SortStep {
  round: number;
  array: number[];
}

export interface BubbleSortData {
  original: number[];
  sorted: number[];
  steps: SortStep[];
  comparisons: number;
}

// Metrics
export interface MetricsItem {
  label: string;
  count: number;
  subItems: MetricsItem[];
}

export interface MetricsResponse {
  dimension: string;
  items: MetricsItem[];
  totalCalls: number;
}

// Weather
export interface WeatherDay {
  date: string;
  weekDay: string;
  weather: string;
  highTemp: number;
  lowTemp: number;
  rating: string;
  suggestion: string;
}

export interface WeatherResponse {
  city: string;
  updateTime: string;
  days: WeatherDay[];
  dressAdvice: string;
  outdoorStrategy: string;
}

// 页面状态
export type TabKey = 'helloworld' | 'hash' | 'bubblesort' | 'weather';
export type Dimension = 'personType' | 'level' | 'department';
export type ChartType = 'line' | 'pie' | 'bar';