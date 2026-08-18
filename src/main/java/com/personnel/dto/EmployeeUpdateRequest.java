package com.personnel.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EmployeeUpdateRequest {
    @NotBlank(message = "姓名不能为空")
    private String name;

    @NotBlank(message = "工号不能为空")
    private String employeeNo;

    @NotBlank(message = "部门不能为空")
    private String department;

    private String position;
    private String phone;
    private String email;

    @NotNull(message = "入职日期不能为空")
    private LocalDate hireDate;

    private BigDecimal salary;
    private String bankAccount;
    private String education;
    private String skills;
    private LocalDate contractEndDate;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
}