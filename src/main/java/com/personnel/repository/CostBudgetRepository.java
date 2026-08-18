package com.personnel.repository;

import com.personnel.entity.CostBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CostBudgetRepository extends JpaRepository<CostBudget, Long> {
    List<CostBudget> findByEmployeeIdAndYear(Long employeeId, Integer year);
    List<CostBudget> findByEmployeeId(Long employeeId);
}