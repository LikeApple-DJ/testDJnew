package com.personnel.service;

import com.personnel.dto.ImportResult;
import org.springframework.web.multipart.MultipartFile;

public interface FileImportService {
    ImportResult importFile(MultipartFile file);
}