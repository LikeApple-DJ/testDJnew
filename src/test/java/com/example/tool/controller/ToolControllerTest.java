package com.example.tool.controller;

import com.example.tool.model.vo.SortResultVO;
import com.example.tool.service.HashService;
import com.example.tool.service.SortService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.bean.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * {@link ToolController} 单元测试。
 *
 * @author DTCoder
 */
@WebMvcTest(ToolController.class)
@DisplayName("ToolController 单元测试")
class ToolControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HashService hashService;

    @MockBean
    private SortService sortService;

    @Test
    @DisplayName("GET /api/tool/helloworld 返回问候语")
    void should_returnHelloWorld_when_getHello() throws Exception {
        mockMvc.perform(get("/api/tool/helloworld"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.msg").value("SUCCESS"))
                .andExpect(jsonPath("$.data.message").value("Hello, World!"));
    }

    @Test
    @DisplayName("POST /api/tool/hash 正常返回哈希结果")
    void should_returnHash_when_validRequest() throws Exception {
        when(hashService.computeHash(anyString(), any()))
                .thenReturn("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");

        String requestBody = "{\"input\":\"hello\",\"algorithm\":\"SHA-256\"}";

        mockMvc.perform(post("/api/tool/hash")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data.hash").isNotEmpty());
    }

    @Test
    @DisplayName("POST /api/tool/hash 空输入返回错误")
    void should_returnError_when_hashEmptyInput() throws Exception {
        String requestBody = "{\"input\":\"\",\"algorithm\":\"SHA-256\"}";

        mockMvc.perform(post("/api/tool/hash")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("TOOL_001"));
    }

    @Test
    @DisplayName("POST /api/tool/sort 正常返回排序结果")
    void should_returnSorted_when_validRequest() throws Exception {
        SortResultVO mockResult = new SortResultVO();
        mockResult.setOriginal(new int[]{5, 2, 8, 1, 9});
        mockResult.setSorted(new int[]{1, 2, 5, 8, 9});
        mockResult.setSteps(10);

        when(sortService.bubbleSort(any())).thenReturn(mockResult);

        String requestBody = "{\"array\":[5,2,8,1,9]}";

        mockMvc.perform(post("/api/tool/sort")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("OK"))
                .andExpect(jsonPath("$.data.sorted").isArray());
    }

    @Test
    @DisplayName("POST /api/tool/sort 空数组返回错误")
    void should_returnError_when_sortEmptyArray() throws Exception {
        String requestBody = "{\"array\":[]}";

        mockMvc.perform(post("/api/tool/sort")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("TOOL_003"));
    }
}