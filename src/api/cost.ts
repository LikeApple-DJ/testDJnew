import axios from 'axios';
import request from './request';
import type {
  ApiResult,
  DimensionVO,
  LaborCostQuery,
  LaborCostVO,
  ProjectCostQuery,
  ProjectCostVO,
  DashboardVO,
} from '../types/cost';

export async function getDimensions(): Promise<ApiResult<DimensionVO>> {
  return request.get('/cost/dimensions');
}

export async function queryLaborStats(
  params: LaborCostQuery
): Promise<ApiResult<LaborCostVO>> {
  return request.post('/cost/labor-stats', params);
}

export async function queryProjectStats(
  params: ProjectCostQuery
): Promise<ApiResult<ProjectCostVO>> {
  return request.post('/cost/project-stats', params);
}

export async function getDashboard(
  periodType: string,
  periodValue: string
): Promise<ApiResult<DashboardVO>> {
  return request.get('/cost/dashboard', {
    params: { periodType, periodValue },
  });
}

export async function exportReport(params: Record<string, unknown>): Promise<Blob> {
  const response = await axios.post('/api/cost/export', params, {
    responseType: 'blob',
  });
  return response.data;
}