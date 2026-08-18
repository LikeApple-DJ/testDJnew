package com.personnel.service;

import com.personnel.dto.*;
import java.util.List;

public interface CostBudgetService {
    List<CostBudgetResponse> listCostBudgets(Long employeeId, Integer year);
    CostBudgetResponse createCostBudget(Long employeeId, CostBudgetCreateRequest request);
    CostBudgetResponse updateCostBudget(Long employeeId, Long costId, CostBudgetUpdateRequest request);
    void deleteCostBudget(Long employeeId, Long costId);
}