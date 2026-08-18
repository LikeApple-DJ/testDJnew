package com.personnel.repository;

import com.personnel.entity.PermissionWhitelist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PermissionWhitelistRepository extends JpaRepository<PermissionWhitelist, Long> {
    Optional<PermissionWhitelist> findByUserIdAndPermission(String userId, String permission);
    boolean existsByUserIdAndPermission(String userId, String permission);
}