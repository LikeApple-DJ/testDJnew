package com.personnel.repository;

import com.personnel.entity.ImportWhitelist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ImportWhitelistRepository extends JpaRepository<ImportWhitelist, Long> {
    Optional<ImportWhitelist> findByDepartmentAndAllowedAction(String department, String allowedAction);
    boolean existsByDepartmentAndAllowedAction(String department, String allowedAction);
}