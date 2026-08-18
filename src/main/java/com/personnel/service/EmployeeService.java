package com.personnel.service;

import com.personnel.dto.*;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeService {
    PageResponse<EmployeeResponse> listEmployees(int page, int size, String search, String department);
    EmployeeResponse getEmployee(Long id);
    EmployeeResponse createEmployee(EmployeeCreateRequest request);
    EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request);
    void deleteEmployee(Long id);
    ImportResult importEmployees(MultipartFile file);
}