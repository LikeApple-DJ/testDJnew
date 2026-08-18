package com.personnel.controller;

import com.personnel.dto.*;
import com.personnel.service.WhitelistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/whitelist")
@RequiredArgsConstructor
public class WhitelistController {

    private final WhitelistService whitelistService;

    @GetMapping("/import")
    public ResponseEntity<List<WhitelistEntryResponse>> listImportWhitelist() {
        return ResponseEntity.ok(whitelistService.listImportWhitelist());
    }

    @PostMapping("/import")
    public ResponseEntity<WhitelistEntryResponse> createImportWhitelist(
            @Valid @RequestBody WhitelistEntryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(whitelistService.createImportWhitelist(request));
    }

    @DeleteMapping("/import/{id}")
    public ResponseEntity<Void> deleteImportWhitelist(@PathVariable Long id) {
        whitelistService.deleteImportWhitelist(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/permission")
    public ResponseEntity<List<PermissionWhitelistEntryResponse>> listPermissionWhitelist() {
        return ResponseEntity.ok(whitelistService.listPermissionWhitelist());
    }

    @PostMapping("/permission")
    public ResponseEntity<PermissionWhitelistEntryResponse> createPermissionWhitelist(
            @Valid @RequestBody PermissionWhitelistEntryCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(whitelistService.createPermissionWhitelist(request));
    }

    @DeleteMapping("/permission/{id}")
    public ResponseEntity<Void> deletePermissionWhitelist(@PathVariable Long id) {
        whitelistService.deletePermissionWhitelist(id);
        return ResponseEntity.noContent().build();
    }
}