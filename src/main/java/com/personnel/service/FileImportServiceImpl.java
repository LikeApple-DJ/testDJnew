package com.personnel.service;

import com.personnel.dto.ImportError;
import com.personnel.dto.ImportResult;
import com.personnel.entity.Employee;
import com.personnel.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FileImportServiceImpl implements FileImportService {

    private final EmployeeRepository employeeRepository;
    private final WhitelistService whitelistService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    @Transactional
    public ImportResult importFile(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new RuntimeException("文件名不能为空");
        }

        if (filename.endsWith(".csv")) {
            return importCsv(file);
        } else if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            return importExcel(file);
        } else {
            throw new RuntimeException("不支持的文件格式，请上传 CSV 或 Excel 文件");
        }
    }

    private ImportResult importCsv(MultipartFile file) {
        List<ImportError> errors = new ArrayList<>();
        int totalRows = 0;
        int successRows = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = reader.readLine(); // skip header
            if (headerLine == null) {
                return ImportResult.builder().totalRows(0).successRows(0).failedRows(0).errors(errors).build();
            }

            String line;
            int rowNum = 1;
            while ((line = reader.readLine()) != null) {
                rowNum++;
                totalRows++;
                try {
                    String[] fields = parseCsvLine(line);
                    Employee employee = buildEmployeeFromFields(fields, rowNum, errors);
                    if (employee != null) {
                        employeeRepository.save(employee);
                        successRows++;
                    }
                } catch (Exception e) {
                    errors.add(ImportError.builder()
                            .row(rowNum)
                            .column("ALL")
                            .message("解析失败: " + e.getMessage())
                            .build());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("文件读取失败: " + e.getMessage());
        }

        return ImportResult.builder()
                .totalRows(totalRows)
                .successRows(successRows)
                .failedRows(totalRows - successRows)
                .errors(errors)
                .build();
    }

    private ImportResult importExcel(MultipartFile file) {
        List<ImportError> errors = new ArrayList<>();
        int totalRows = 0;
        int successRows = 0;

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet.getPhysicalNumberOfRows() <= 1) {
                return ImportResult.builder().totalRows(0).successRows(0).failedRows(0).errors(errors).build();
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                totalRows++;
                try {
                    int colCount = Math.max(row.getLastCellNum(), 5);
                    String[] fields = new String[colCount];
                    for (int j = 0; j < colCount; j++) {
                        Cell cell = row.getCell(j);
                        fields[j] = getCellValueAsString(cell);
                    }
                    Employee employee = buildEmployeeFromFields(fields, i + 1, errors);
                    if (employee != null) {
                        employeeRepository.save(employee);
                        successRows++;
                    }
                } catch (Exception e) {
                    errors.add(ImportError.builder()
                            .row(i + 1)
                            .column("ALL")
                            .message("解析失败: " + e.getMessage())
                            .build());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("文件读取失败: " + e.getMessage());
        }

        return ImportResult.builder()
                .totalRows(totalRows)
                .successRows(successRows)
                .failedRows(totalRows - successRows)
                .errors(errors)
                .build();
    }

    private Employee buildEmployeeFromFields(String[] fields, int rowNum, List<ImportError> errors) {
        if (fields.length < 5) {
            errors.add(ImportError.builder()
                    .row(rowNum)
                    .column("ALL")
                    .message("字段不足，至少需要5列")
                    .build());
            return null;
        }

        String name = fields[0];
        String employeeNo = fields[1];
        String department = fields[2];

        if (name == null || name.isBlank()) {
            errors.add(ImportError.builder().row(rowNum).column("姓名").message("姓名不能为空").build());
            return null;
        }
        if (employeeNo == null || employeeNo.isBlank()) {
            errors.add(ImportError.builder().row(rowNum).column("工号").message("工号不能为空").build());
            return null;
        }
        if (department == null || department.isBlank()) {
            errors.add(ImportError.builder().row(rowNum).column("部门").message("部门不能为空").build());
            return null;
        }

        // Check whitelist - department must be allowed for import
        if (!whitelistService.isDepartmentAllowedForImport(department.trim())) {
            errors.add(ImportError.builder()
                    .row(rowNum).column("部门")
                    .message("该部门不在导入白名单中: " + department)
                    .build());
            return null;
        }

        if (employeeRepository.existsByEmployeeNo(employeeNo.trim())) {
            errors.add(ImportError.builder().row(rowNum).column("工号").message("工号已存在: " + employeeNo).build());
            return null;
        }

        LocalDate hireDate;
        try {
            hireDate = LocalDate.parse(fields[4].trim(), DATE_FORMATTER);
        } catch (DateTimeParseException | ArrayIndexOutOfBoundsException e) {
            errors.add(ImportError.builder().row(rowNum).column("入职日期").message("日期格式错误，需为 yyyy-MM-dd").build());
            return null;
        }

        Employee employee = Employee.builder()
                .name(name.trim())
                .employeeNo(employeeNo.trim())
                .department(department.trim())
                .position(safeGet(fields, 3))
                .hireDate(hireDate)
                .phone(safeGet(fields, 5))
                .email(safeGet(fields, 6))
                .salary(parseBigDecimal(safeGet(fields, 7)))
                .bankAccount(safeGet(fields, 8))
                .education(safeGet(fields, 9))
                .skills(safeGet(fields, 10))
                .address(safeGet(fields, 12))
                .emergencyContact(safeGet(fields, 13))
                .emergencyPhone(safeGet(fields, 14))
                .build();

        if (fields.length > 11 && fields[11] != null && !fields[11].isBlank()) {
            try {
                employee.setContractEndDate(LocalDate.parse(fields[11].trim(), DATE_FORMATTER));
            } catch (DateTimeParseException e) {
                errors.add(ImportError.builder()
                        .row(rowNum).column("合同到期日")
                        .message("合同到期日格式错误，需为 yyyy-MM-dd: " + fields[11])
                        .build());
            }
        }

        return employee;
    }

    private String safeGet(String[] fields, int index) {
        if (index < fields.length && fields[index] != null) {
            String trimmed = fields[index].trim();
            return trimmed.isEmpty() ? null : trimmed;
        }
        return null;
    }

    private BigDecimal parseBigDecimal(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return new BigDecimal(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private String[] parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        boolean inQuotes = false;
        StringBuilder current = new StringBuilder();
        char[] chars = line.toCharArray();
        for (int i = 0; i < chars.length; i++) {
            char c = chars[i];
            if (c == '"') {
                // Handle escaped quotes: "" inside a quoted field
                if (inQuotes && i + 1 < chars.length && chars[i + 1] == '"') {
                    current.append('"');
                    i++; // skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        fields.add(current.toString().trim());
        return fields.toArray(new String[0]);
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getLocalDateTimeCellValue().toLocalDate().toString();
                }
                double val = cell.getNumericCellValue();
                if (val == Math.floor(val) && !Double.isInfinite(val)) {
                    yield String.valueOf((long) val);
                }
                yield String.valueOf(val);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> null;
        };
    }
}
