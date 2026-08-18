package com.personnel.controller;

import com.personnel.dto.*;
import com.personnel.service.CostBudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/employees/{employeeId}/costs")
@RequiredArgsConstructor
public class CostBudgetController {

    private final CostBudgetService costBudgetService;

    @GetMapping
    public ResponseEntity<List<CostBudgetResponse>> listCostBudgets(
            @PathVariable Long employeeId,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(costBudgetService.listCostBudgets(employeeId, year));
    }

    @PostMapping
    public ResponseEntity<CostBudgetResponse> createCostBudget(
            @PathVariable Long employeeId,
            @Valid @RequestBody CostBudgetCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(costBudgetService.createCostBudget(employeeId, request));
    }

    @PutMapping("/{costId}")
    public ResponseEntity<CostBudgetResponse> updateCostBudget(
            @PathVariable Long employeeId,
            @PathVariable Long costId,
            @Valid @RequestBody CostBudgetUpdateRequest request) {
        return ResponseEntity.ok(costBudgetService.updateCostBudget(employeeId, costId, request));
    }

    @DeleteMapping("/{costId}")
    public ResponseEntity<Void> deleteCostBudget(
            @PathVariable Long employeeId,
            @PathVariable Long costId) {
        costBudgetService.deleteCostBudget(employeeId, costId);
        return ResponseEntity.noContent().build();
    }
}