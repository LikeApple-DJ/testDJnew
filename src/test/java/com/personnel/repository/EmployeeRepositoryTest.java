package com.personnel.repository;

import com.personnel.entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import java.math.BigDecimal;
import java.time.LocalDate;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void shouldSaveAndFindEmployee() {
        Employee emp = Employee.builder()
                .name("张三")
                .employeeNo("EMP001")
                .department("技术部")
                .position("高级工程师")
                .phone("13800138000")
                .hireDate(LocalDate.of(2020, 1, 1))
                .salary(new BigDecimal("15000.00"))
                .build();
        employeeRepository.save(emp);

        Page<Employee> result = employeeRepository
                .findByNameContainingOrEmployeeNoContaining("张三", "", PageRequest.of(0, 10));
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getEmployeeNo()).isEqualTo("EMP001");
    }

    @Test
    void shouldReturnUniqueEmployeeNo() {
        Employee emp1 = Employee.builder()
                .name("李四")
                .employeeNo("EMP002")
                .department("财务部")
                .position("会计")
                .phone("13900139000")
                .hireDate(LocalDate.of(2021, 6, 1))
                .build();
        employeeRepository.save(emp1);

        boolean exists = employeeRepository.existsByEmployeeNo("EMP002");
        assertThat(exists).isTrue();

        boolean notExists = employeeRepository.existsByEmployeeNo("EMP999");
        assertThat(notExists).isFalse();
    }
}