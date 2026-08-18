package com.personnel.service;

import com.personnel.dto.*;
import com.personnel.entity.ImportWhitelist;
import com.personnel.entity.PermissionWhitelist;
import com.personnel.repository.ImportWhitelistRepository;
import com.personnel.repository.PermissionWhitelistRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class WhitelistServiceTest {

    @Autowired
    private WhitelistService whitelistService;

    @Autowired
    private ImportWhitelistRepository importWhitelistRepository;

    @Autowired
    private PermissionWhitelistRepository permissionWhitelistRepository;

    @BeforeEach
    void setUp() {
        importWhitelistRepository.deleteAll();
        permissionWhitelistRepository.deleteAll();
    }

    @Test
    void shouldCreateAndListImportWhitelist() {
        WhitelistEntryCreateRequest request = new WhitelistEntryCreateRequest();
        request.setDepartment("技术部");
        request.setAllowedAction("IMPORT");

        WhitelistEntryResponse created = whitelistService.createImportWhitelist(request);
        assertThat(created.getId()).isNotNull();
        assertThat(created.getDepartment()).isEqualTo("技术部");

        assertThat(whitelistService.listImportWhitelist()).hasSize(1);
    }

    @Test
    void shouldCheckDepartmentAllowedForImport() {
        WhitelistEntryCreateRequest request = new WhitelistEntryCreateRequest();
        request.setDepartment("财务部");
        request.setAllowedAction("IMPORT");
        whitelistService.createImportWhitelist(request);

        assertThat(whitelistService.isDepartmentAllowedForImport("财务部")).isTrue();
        assertThat(whitelistService.isDepartmentAllowedForImport("技术部")).isFalse();
    }

    @Test
    void shouldCreateAndCheckPermission() {
        PermissionWhitelistEntryCreateRequest request = new PermissionWhitelistEntryCreateRequest();
        request.setUserId("user001");
        request.setPermission("VIEW_COST");

        PermissionWhitelistEntryResponse created = whitelistService.createPermissionWhitelist(request);
        assertThat(created.getId()).isNotNull();

        assertThat(whitelistService.hasPermission("user001", "VIEW_COST")).isTrue();
        assertThat(whitelistService.hasPermission("user001", "EDIT_COST")).isFalse();
    }

    @Test
    void shouldDeleteImportWhitelist() {
        WhitelistEntryCreateRequest request = new WhitelistEntryCreateRequest();
        request.setDepartment("人事部");
        request.setAllowedAction("IMPORT");
        WhitelistEntryResponse created = whitelistService.createImportWhitelist(request);

        whitelistService.deleteImportWhitelist(created.getId());
        assertThat(whitelistService.listImportWhitelist()).isEmpty();
    }

    @Test
    void shouldDeletePermissionWhitelist() {
        PermissionWhitelistEntryCreateRequest request = new PermissionWhitelistEntryCreateRequest();
        request.setUserId("user002");
        request.setPermission("VIEW_ALL");
        PermissionWhitelistEntryResponse created = whitelistService.createPermissionWhitelist(request);

        whitelistService.deletePermissionWhitelist(created.getId());
        assertThat(whitelistService.listPermissionWhitelist()).isEmpty();
    }
}