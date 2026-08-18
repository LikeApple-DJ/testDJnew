package com.personnel.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.personnel.dto.EmployeeCreateRequest;
import com.personnel.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void shouldCreateAndRetrieveEmployee() throws Exception {
        EmployeeCreateRequest request = new EmployeeCreateRequest();
        request.setName("测试员工");
        request.setEmployeeNo("T001");
        request.setDepartment("技术部");
        request.setPosition("工程师");
        request.setHireDate(LocalDate.of(2023, 1, 1));

        // Create
        String json = objectMapper.writeValueAsString(request);
        String createdJson = mockMvc.perform(post("/api/v1/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("测试员工"))
                .andReturn().getResponse().getContentAsString();

        Long id = objectMapper.readTree(createdJson).get("id").asLong();

        // Retrieve
        mockMvc.perform(get("/api/v1/employees/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("测试员工"));

        // List
        mockMvc.perform(get("/api/v1/employees"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void shouldImportCsv() throws Exception {
        String csv = "姓名,工号,部门,职位,入职日期\n" +
                     "导入员工,IMP001,技术部,工程师,2023-01-15\n";
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.csv", "text/csv", csv.getBytes());

        mockMvc.perform(multipart("/api/v1/employees/import")
                        .file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successRows").value(1));
    }
}