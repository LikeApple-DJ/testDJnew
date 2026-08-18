package com.personnel.service;

import com.personnel.dto.ImportResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import java.nio.charset.StandardCharsets;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class FileImportServiceTest {

    @Autowired
    private FileImportService fileImportService;

    @Test
    void shouldImportCsvSuccessfully() {
        String csv = "姓名,工号,部门,职位,入职日期,电话,邮箱\n" +
                     "张三,EMP100,技术部,工程师,2023-01-15,13800000001,zhangsan@test.com\n" +
                     "李四,EMP101,财务部,会计,2023-02-20,13800000002,lisi@test.com\n";
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        ImportResult result = fileImportService.importFile(file);
        assertThat(result.getTotalRows()).isEqualTo(2);
        assertThat(result.getSuccessRows()).isEqualTo(2);
        assertThat(result.getFailedRows()).isEqualTo(0);
    }

    @Test
    void shouldReportImportErrors() {
        String csv = "姓名,工号,部门,职位,入职日期\n" +
                     ",EMP102,技术部,工程师,2023-01-15\n";
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.csv", "text/csv", csv.getBytes(StandardCharsets.UTF_8));

        ImportResult result = fileImportService.importFile(file);
        assertThat(result.getTotalRows()).isEqualTo(1);
        assertThat(result.getSuccessRows()).isEqualTo(0);
        assertThat(result.getFailedRows()).isEqualTo(1);
        assertThat(result.getErrors()).isNotEmpty();
    }
}