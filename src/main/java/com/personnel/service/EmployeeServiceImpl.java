package com.personnel.service;

import com.personnel.dto.*;
import com.personnel.entity.Employee;
import com.personnel.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final FileImportService fileImportService;

    @Override
    public PageResponse<EmployeeResponse> listEmployees(int page, int size, String search, String department) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Employee> employeePage;

        boolean hasSearch = search != null && !search.isBlank();
        boolean hasDepartment = department != null && !department.isBlank();

        if (hasSearch && hasDepartment) {
            employeePage = employeeRepository.findByNameContainingOrEmployeeNoContainingAndDepartment(
                    search, search, department, pageable);
        } else if (hasSearch) {
            employeePage = employeeRepository.findByNameContainingOrEmployeeNoContaining(search, search, pageable);
        } else if (hasDepartment) {
            employeePage = employeeRepository.findByDepartment(department, pageable);
        } else {
            employeePage = employeeRepository.findAll(pageable);
        }

        List<EmployeeResponse> content = employeePage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<EmployeeResponse>builder()
                .content(content)
                .totalElements(employeePage.getTotalElements())
                .totalPages(employeePage.getTotalPages())
                .currentPage(page)
                .pageSize(size)
                .build();
    }

    @Override
    public EmployeeResponse getEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("员工不存在: " + id));
        return toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeCreateRequest request) {
        if (employeeRepository.existsByEmployeeNo(request.getEmployeeNo())) {
            throw new RuntimeException("工号已存在: " + request.getEmployeeNo());
        }
        Employee employee = Employee.builder()
                .name(request.getName())
                .employeeNo(request.getEmployeeNo())
                .department(request.getDepartment())
                .position(request.getPosition())
                .phone(request.getPhone())
                .email(request.getEmail())
                .hireDate(request.getHireDate())
                .salary(request.getSalary())
                .bankAccount(request.getBankAccount())
                .education(request.getEducation())
                .skills(request.getSkills())
                .contractEndDate(request.getContractEndDate())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .emergencyPhone(request.getEmergencyPhone())
                .build();
        employee = employeeRepository.save(employee);
        return toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeUpdateRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("员工不存在: " + id));

        // Check employeeNo uniqueness if it changed
        if (!employee.getEmployeeNo().equals(request.getEmployeeNo())
                && employeeRepository.existsByEmployeeNo(request.getEmployeeNo())) {
            throw new RuntimeException("工号已存在: " + request.getEmployeeNo());
        }

        employee.setName(request.getName());
        employee.setEmployeeNo(request.getEmployeeNo());
        employee.setDepartment(request.getDepartment());
        employee.setPosition(request.getPosition());
        employee.setPhone(request.getPhone());
        employee.setEmail(request.getEmail());
        employee.setHireDate(request.getHireDate());
        employee.setSalary(request.getSalary());
        employee.setBankAccount(request.getBankAccount());
        employee.setEducation(request.getEducation());
        employee.setSkills(request.getSkills());
        employee.setContractEndDate(request.getContractEndDate());
        employee.setAddress(request.getAddress());
        employee.setEmergencyContact(request.getEmergencyContact());
        employee.setEmergencyPhone(request.getEmergencyPhone());
        employee = employeeRepository.save(employee);
        return toResponse(employee);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException("员工不存在: " + id);
        }
        employeeRepository.deleteById(id);
    }

    @Override
    @Transactional
    public ImportResult importEmployees(MultipartFile file) {
        return fileImportService.importFile(file);
    }

    private EmployeeResponse toResponse(Employee employee) {
        return EmployeeResponse.builder()
                .id(employee.getId())
                .name(employee.getName())
                .employeeNo(employee.getEmployeeNo())
                .department(employee.getDepartment())
                .position(employee.getPosition())
                .phone(employee.getPhone())
                .email(employee.getEmail())
                .hireDate(employee.getHireDate())
                .salary(employee.getSalary())
                .bankAccount(employee.getBankAccount())
                .education(employee.getEducation())
                .skills(employee.getSkills())
                .contractEndDate(employee.getContractEndDate())
                .address(employee.getAddress())
                .emergencyContact(employee.getEmergencyContact())
                .emergencyPhone(employee.getEmergencyPhone())
                .createdAt(employee.getCreatedAt())
                .updatedAt(employee.getUpdatedAt())
                .build();
    }
}
