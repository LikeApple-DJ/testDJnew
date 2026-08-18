package com.personnel.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CostBudgetCreateRequest {
    @NotBlank(message = "成本类型不能为空")
    private String costType;
    @NotNull(message = "金额不能为空")
    @DecimalMin(value = "0.01", message = "金额必须大于0")
    private BigDecimal amount;
    private String description;
    @NotNull(message = "年份不能为空")
    private Integer year;
}

@Data
public class CostBudgetUpdateRequest {
    @NotBlank(message = "成本类型不能为空")
    private String costType;
    @NotNull(message = "金额不能为空")
    @DecimalMin(value = "0.01", message = "金额必须大于0")
    private BigDecimal amount;
    private String description;
    @NotNull(message = "年份不能为空")
    private Integer year;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CostBudgetResponse {
    private Long id;
    private Long employeeId;
    private String costType;
    private BigDecimal amount;
    private String description;
    private Integer year;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}