package com.personnel.service;

import com.personnel.dto.*;
import com.personnel.entity.ImportWhitelist;
import com.personnel.entity.PermissionWhitelist;
import com.personnel.repository.ImportWhitelistRepository;
import com.personnel.repository.PermissionWhitelistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WhitelistServiceImpl implements WhitelistService {

    private final ImportWhitelistRepository importWhitelistRepository;
    private final PermissionWhitelistRepository permissionWhitelistRepository;

    @Override
    public List<WhitelistEntryResponse> listImportWhitelist() {
        return importWhitelistRepository.findAll().stream()
                .map(this::toImportResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WhitelistEntryResponse createImportWhitelist(WhitelistEntryCreateRequest request) {
        if (importWhitelistRepository.existsByDepartmentAndAllowedAction(
                request.getDepartment(), request.getAllowedAction())) {
            throw new RuntimeException("该部门的导入白名单已存在");
        }
        ImportWhitelist entity = ImportWhitelist.builder()
                .department(request.getDepartment())
                .allowedAction(request.getAllowedAction())
                .createdBy("system")
                .build();
        entity = importWhitelistRepository.save(entity);
        return toImportResponse(entity);
    }

    @Override
    @Transactional
    public void deleteImportWhitelist(Long id) {
        if (!importWhitelistRepository.existsById(id)) {
            throw new RuntimeException("白名单记录不存在");
        }
        importWhitelistRepository.deleteById(id);
    }

    @Override
    public List<PermissionWhitelistEntryResponse> listPermissionWhitelist() {
        return permissionWhitelistRepository.findAll().stream()
                .map(this::toPermissionResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PermissionWhitelistEntryResponse createPermissionWhitelist(PermissionWhitelistEntryCreateRequest request) {
        if (permissionWhitelistRepository.existsByUserIdAndPermission(
                request.getUserId(), request.getPermission())) {
            throw new RuntimeException("该用户的权限已存在");
        }
        PermissionWhitelist entity = PermissionWhitelist.builder()
                .userId(request.getUserId())
                .permission(request.getPermission())
                .createdBy("system")
                .build();
        entity = permissionWhitelistRepository.save(entity);
        return toPermissionResponse(entity);
    }

    @Override
    @Transactional
    public void deletePermissionWhitelist(Long id) {
        if (!permissionWhitelistRepository.existsById(id)) {
            throw new RuntimeException("权限记录不存在");
        }
        permissionWhitelistRepository.deleteById(id);
    }

    @Override
    public boolean isDepartmentAllowedForImport(String department) {
        return importWhitelistRepository.existsByDepartmentAndAllowedAction(department, "IMPORT");
    }

    @Override
    public boolean hasPermission(String userId, String permission) {
        return permissionWhitelistRepository.existsByUserIdAndPermission(userId, permission);
    }

    private WhitelistEntryResponse toImportResponse(ImportWhitelist entity) {
        return WhitelistEntryResponse.builder()
                .id(entity.getId())
                .department(entity.getDepartment())
                .allowedAction(entity.getAllowedAction())
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private PermissionWhitelistEntryResponse toPermissionResponse(PermissionWhitelist entity) {
        return PermissionWhitelistEntryResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .permission(entity.getPermission())
                .createdBy(entity.getCreatedBy())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}