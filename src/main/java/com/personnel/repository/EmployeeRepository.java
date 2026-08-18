package com.personnel.repository;

import com.personnel.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Page<Employee> findByNameContainingOrEmployeeNoContaining(String name, String employeeNo, Pageable pageable);
    Page<Employee> findByDepartment(String department, Pageable pageable);
    Page<Employee> findByNameContainingOrEmployeeNoContainingAndDepartment(
            String name, String employeeNo, String department, Pageable pageable);
    boolean existsByEmployeeNo(String employeeNo);
}