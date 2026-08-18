package com.personnel.service;

import com.personnel.dto.*;
import com.personnel.entity.CostBudget;
import com.personnel.repository.CostBudgetRepository;
import com.personnel.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CostBudgetServiceImpl implements CostBudgetService {

    private final CostBudgetRepository costBudgetRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public List<CostBudgetResponse> listCostBudgets(Long employeeId, Integer year) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("员工不存在: " + employeeId);
        }
        List<CostBudget> budgets;
        if (year != null) {
            budgets = costBudgetRepository.findByEmployeeIdAndYear(employeeId, year);
        } else {
            budgets = costBudgetRepository.findByEmployeeId(employeeId);
        }
        return budgets.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CostBudgetResponse createCostBudget(Long employeeId, CostBudgetCreateRequest request) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("员工不存在: " + employeeId);
        }
        CostBudget budget = CostBudget.builder()
                .employeeId(employeeId)
                .costType(request.getCostType())
                .amount(request.getAmount())
                .description(request.getDescription())
                .year(request.getYear())
                .build();
        budget = costBudgetRepository.save(budget);
        return toResponse(budget);
    }

    @Override
    @Transactional
    public CostBudgetResponse updateCostBudget(Long employeeId, Long costId, CostBudgetUpdateRequest request) {
        CostBudget budget = costBudgetRepository.findById(costId)
                .orElseThrow(() -> new RuntimeException("成本预算记录不存在: " + costId));
        if (!budget.getEmployeeId().equals(employeeId)) {
            throw new RuntimeException("成本预算不属于该员工");
        }
        budget.setCostType(request.getCostType());
        budget.setAmount(request.getAmount());
        budget.setDescription(request.getDescription());
        budget.setYear(request.getYear());
        budget = costBudgetRepository.save(budget);
        return toResponse(budget);
    }

    @Override
    @Transactional
    public void deleteCostBudget(Long employeeId, Long costId) {
        CostBudget budget = costBudgetRepository.findById(costId)
                .orElseThrow(() -> new RuntimeException("成本预算记录不存在: " + costId));
        if (!budget.getEmployeeId().equals(employeeId)) {
            throw new RuntimeException("成本预算不属于该员工");
        }
        costBudgetRepository.deleteById(budget.getId());
    }

    private CostBudgetResponse toResponse(CostBudget budget) {
        return CostBudgetResponse.builder()
                .id(budget.getId())
                .employeeId(budget.getEmployeeId())
                .costType(budget.getCostType())
                .amount(budget.getAmount())
                .description(budget.getDescription())
                .year(budget.getYear())
                .createdAt(budget.getCreatedAt())
                .updatedAt(budget.getUpdatedAt())
                .build();
    }
}