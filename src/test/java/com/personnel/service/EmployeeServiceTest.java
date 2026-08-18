package com.personnel.service;

import com.personnel.dto.EmployeeCreateRequest;
import com.personnel.dto.EmployeeResponse;
import com.personnel.dto.PageResponse;
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

@SpringBootTest
@ActiveProfiles("test")
class EmployeeServiceTest {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
    }

    @Test
    void shouldCreateAndListEmployee() {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setName("王五");
        request.setEmployeeNo("EMP003");
        request.setDepartment("市场部");
        request.setPosition("经理");
        request.setHireDate(LocalDate.of(2022, 3, 15));

        EmployeeResponse created = employeeService.createEmployee(request);
        assertThat(created.getId()).isNotNull();
        assertThat(created.getName()).isEqualTo("王五");

        PageResponse<EmployeeResponse> page = employeeService.listEmployees(0, 10, "", "");
        assertThat(page.getTotalElements()).isEqualTo(1);
    }

    @Test
    void shouldSearchEmployeeByName() {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setName("赵六");
        request.setEmployeeNo("EMP004");
        request.setDepartment("研发部");
        request.setPosition("工程师");
        request.setHireDate(LocalDate.of(2023, 1, 1));
        employeeService.createEmployee(request);

        PageResponse<EmployeeResponse> page = employeeService.listEmployees(0, 10, "赵六", "");
        assertThat(page.getTotalElements()).isEqualTo(1);
    }

    @Test
    void shouldDeleteEmployee() {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setName("孙七");
        request.setEmployeeNo("EMP005");
        request.setDepartment("人事部");
        request.setPosition("专员");
        request.setHireDate(LocalDate.of(2023, 6, 1));
        EmployeeResponse created = employeeService.createEmployee(request);

        employeeService.deleteEmployee(created.getId());

        PageResponse<EmployeeResponse> page = employeeService.listEmployees(0, 10, "", "");
        assertThat(page.getTotalElements()).isEqualTo(0);
    }
}