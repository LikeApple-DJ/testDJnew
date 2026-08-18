package com.personnel.service;

import com.personnel.dto.*;
import com.personnel.entity.Employee;
import com.personnel.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import java.math.BigDecimal;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class CostBudgetServiceTest {

    @Autowired
    private CostBudgetService costBudgetService;

    @Autowired
    private EmployeeRepository employeeRepository;

    private Long employeeId;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
        Employee emp = Employee.builder()
                .name("测试员工")
                .employeeNo("EMP_COST_001")
                .department("技术部")
                .position("工程师")
                .hireDate(LocalDate.of(2023, 1, 1))
                .build();
        emp = employeeRepository.save(emp);
        employeeId = emp.getId();
    }

    @Test
    void shouldCreateAndListCostBudget() {
        CostBudgetCreateRequest request = new CostBudgetCreateRequest();
        request.setCostType("SALARY");
        request.setAmount(new BigDecimal("50000.00"));
        request.setDescription("年薪");
        request.setYear(2025);

        CostBudgetResponse created = costBudgetService.createCostBudget(employeeId, request);
        assertThat(created.getId()).isNotNull();
        assertThat(created.getCostType()).isEqualTo("SALARY");

        assertThat(costBudgetService.listCostBudgets(employeeId, 2025)).hasSize(1);
    }

    @Test
    void shouldUpdateCostBudget() {
        CostBudgetCreateRequest createRequest = new CostBudgetCreateRequest();
        createRequest.setCostType("TRAINING");
        createRequest.setAmount(new BigDecimal("10000.00"));
        createRequest.setDescription("培训费");
        createRequest.setYear(2025);
        CostBudgetResponse created = costBudgetService.createCostBudget(employeeId, createRequest);

        CostBudgetUpdateRequest updateRequest = new CostBudgetUpdateRequest();
        updateRequest.setCostType("TRAVEL");
        updateRequest.setAmount(new BigDecimal("20000.00"));
        updateRequest.setDescription("差旅费");
        updateRequest.setYear(2025);

        CostBudgetResponse updated = costBudgetService.updateCostBudget(employeeId, created.getId(), updateRequest);
        assertThat(updated.getCostType()).isEqualTo("TRAVEL");
        assertThat(updated.getAmount()).isEqualByComparingTo(new BigDecimal("20000.00"));
    }

    @Test
    void shouldDeleteCostBudget() {
        CostBudgetCreateRequest request = new CostBudgetCreateRequest();
        request.setCostType("OTHER");
        request.setAmount(new BigDecimal("5000.00"));
        request.setDescription("其他");
        request.setYear(2025);
        CostBudgetResponse created = costBudgetService.createCostBudget(employeeId, request);

        costBudgetService.deleteCostBudget(employeeId, created.getId());
        assertThat(costBudgetService.listCostBudgets(employeeId, 2025)).isEmpty();
    }
}