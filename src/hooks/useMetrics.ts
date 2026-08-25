import { useEffect, useState } from 'react';
import { fetchReport } from '../api/client';

export interface ReportItem {
  dimension: string;
  count: number;
}

export type Dimension = 'userType' | 'userLevel' | 'userDept';

export function useMetrics(dimension: Dimension) {
  const [data, setData] = useState<ReportItem[]>([]);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    fetchReport(dimension.toUpperCase(), start.toISOString(), end.toISOString())
      .then(setData)
      .catch(() => setData([]));
  }, [dimension]);

  return data;
}