import { useEffect, useState } from 'react';
import { fetchReport } from '../api/client';
import type { Dimension, ReportItem } from '../types';

const DIMENSION_MAP: Record<Dimension, string> = {
  userType: 'USER_TYPE',
  userLevel: 'USER_LEVEL',
  userDept: 'USER_DEPT'
};

export function useMetrics(dimension: Dimension) {
  const [data, setData] = useState<ReportItem[]>([]);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    fetchReport(DIMENSION_MAP[dimension], start.toISOString(), end.toISOString())
      .then(setData)
      .catch(() => setData([]));
  }, [dimension]);

  return data;
}
