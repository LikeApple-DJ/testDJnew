package com.personnel.service;

import com.personnel.dto.*;
import java.util.List;

public interface WhitelistService {
    List<WhitelistEntryResponse> listImportWhitelist();
    WhitelistEntryResponse createImportWhitelist(WhitelistEntryCreateRequest request);
    void deleteImportWhitelist(Long id);
    List<PermissionWhitelistEntryResponse> listPermissionWhitelist();
    PermissionWhitelistEntryResponse createPermissionWhitelist(PermissionWhitelistEntryCreateRequest request);
    void deletePermissionWhitelist(Long id);
    boolean isDepartmentAllowedForImport(String department);
    boolean hasPermission(String userId, String permission);
}