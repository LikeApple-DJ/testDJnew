// 统一响应
export interface ApiResult<T> {
  code: number;
  data: T;
  message: string;
}

// 分页参数
export interface PageParams {
  pageNum: number;
  pageSize: number;
}

// 维度
export interface PersonnelOption {
  id: number;
  name: string;
}

export interface DimensionVO {
  departments: string[];
  projects: string[];
  businessLines: string[];
  personnel: PersonnelOption[];
}

// 人力成本
export interface LaborCostQuery {
  department?: string;
  project?: string;
  businessLine?: string;
  personnelId?: number;
  periodType: 'month' | 'quarter' | 'year';
  periodValue: string;
  role?: 'dev' | 'test' | 'product' | 'ops';
}

export interface LaborCostBreakdown {
  role: string;
  cost: number;
  headcount: number;
  ratio: number;
}

export interface LaborCostSummary {
  totalLaborCost: number;
  avgCostPerPerson: number;
  headcount: number;
}

export interface LaborCostVO {
  summary: LaborCostSummary;
  breakdown: LaborCostBreakdown[];
}

// 项目成本
export interface ProjectCostQuery {
  department?: string;
  project?: string;
  businessLine?: string;
  periodType: 'month' | 'quarter' | 'year';
  periodValue: string;
}

export interface ProjectCostItem {
  projectName: string;
  budget: number;
  actual: number;
  ratio: number;
  overspend: number;
  department: string;
  businessLine: string;
}

export interface ProjectCostSummary {
  totalBudget: number;
  totalActual: number;
  totalRatio: number;
  totalOverspend: number;
}

export interface ProjectCostVO {
  summary: ProjectCostSummary;
  items: ProjectCostItem[];
}

// Dashboard
export interface DashboardVO {
  laborCost: {
    total: number;
    byRole: { role: string; cost: number }[];
  };
  projectCost: {
    totalBudget: number;
    totalActual: number;
    totalRatio: number;
  };
  trend: {
    label: string;
    laborCost: number;
    projectCost: number;
  }[];
  topOverspendProjects: {
    projectName: string;
    overspend: number;
  }[];
}