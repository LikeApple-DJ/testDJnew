package com.personnel.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
public class WhitelistEntryCreateRequest {
    @NotBlank(message = "部门不能为空")
    private String department;
    @NotBlank(message = "操作类型不能为空")
    private String allowedAction;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WhitelistEntryResponse {
    private Long id;
    private String department;
    private String allowedAction;
    private String createdBy;
    private LocalDateTime createdAt;
}

@Data
public class PermissionWhitelistEntryCreateRequest {
    @NotBlank(message = "用户ID不能为空")
    private String userId;
    @NotBlank(message = "权限不能为空")
    private String permission;
}

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PermissionWhitelistEntryResponse {
    private Long id;
    private String userId;
    private String permission;
    private String createdBy;
    private LocalDateTime createdAt;
}