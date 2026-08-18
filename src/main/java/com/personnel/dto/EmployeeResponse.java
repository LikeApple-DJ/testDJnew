package com.personnel.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class EmployeeResponse {
    private Long id;
    private String name;
    private String employeeNo;
    private String department;
    private String position;
    private String phone;
    private String email;
    private LocalDate hireDate;
    private BigDecimal salary;
    private String bankAccount;
    private String education;
    private String skills;
    private LocalDate contractEndDate;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}