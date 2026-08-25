package com.testdjnew.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.is;

@SpringBootTest
@AutoConfigureMockMvc
public class AlgorithmControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void hello_shouldReturnMessageAndVersion() throws Exception {
        mockMvc.perform(get("/api/hello"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.message").value("Hello, World!"))
            .andExpect(jsonPath("$.version").value("1.0.0"))
            .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    void hash_sha256_shouldReturnCorrectHash() throws Exception {
        String requestBody = "{\"algorithm\":\"SHA-256\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.algorithm").value("SHA-256"))
            .andExpect(jsonPath("$.input").value("hello"))
            .andExpect(jsonPath("$.hash").value("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"));
    }

    @Test
    void hash_md5_shouldReturnCorrectHash() throws Exception {
        String requestBody = "{\"algorithm\":\"MD5\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hash").value("5d41402abc4b2a76b9719d911017c592"));
    }

    @Test
    void hash_sha1_shouldReturnCorrectHash() throws Exception {
        String requestBody = "{\"algorithm\":\"SHA-1\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.hash").value("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d"));
    }

    @Test
    void hash_unsupportedAlgorithm_shouldReturn400() throws Exception {
        String requestBody = "{\"algorithm\":\"RIPEMD-160\",\"input\":\"hello\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("Unsupported algorithm: RIPEMD-160"));
    }

    @Test
    void hash_caseInsensitive_shouldWork() throws Exception {
        String requestBody = "{\"algorithm\":\"sha-256\",\"input\":\"test\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.algorithm").value("sha-256"));
    }

    @Test
    void sort_basicArray_shouldReturnSortedWithSteps() throws Exception {
        String requestBody = "{\"numbers\":[5,3,8,1,2]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(1))
            .andExpect(jsonPath("$.sorted[1]").value(2))
            .andExpect(jsonPath("$.sorted[2]").value(3))
            .andExpect(jsonPath("$.sorted[3]").value(5))
            .andExpect(jsonPath("$.sorted[4]").value(8))
            .andExpect(jsonPath("$.steps.length()").value(4))
            .andExpect(jsonPath("$.steps[0].pass").value(1))
            .andExpect(jsonPath("$.steps[0].swapped").value(true))
            .andExpect(jsonPath("$.steps[3].swapped").value(false));
    }

    @Test
    void sort_emptyArray_shouldReturn400() throws Exception {
        String requestBody = "{\"numbers\":[]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("numbers array must not be empty"));
    }

    @Test
    void sort_singleElement_shouldReturnSameArray() throws Exception {
        String requestBody = "{\"numbers\":[42]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(42))
            .andExpect(jsonPath("$.steps.length()").value(0));
    }

    @Test
    void hash_nullInput_shouldReturn400() throws Exception {
        String requestBody = "{\"algorithm\":\"SHA-256\",\"input\":null}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("input must not be null or empty"));
    }

    @Test
    void hash_emptyInput_shouldReturn400() throws Exception {
        String requestBody = "{\"algorithm\":\"SHA-256\",\"input\":\"\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("input must not be null or empty"));
    }

    @Test
    void hash_tooLongInput_shouldReturn400() throws Exception {
        String longInput = "a".repeat(10_001);
        String requestBody = "{\"algorithm\":\"SHA-256\",\"input\":\"" + longInput + "\"}";

        mockMvc.perform(post("/api/hash")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("input too long, max 10000 chars"));
    }

    @Test
    void sort_negativeNumbers_shouldSortCorrectly() throws Exception {
        String requestBody = "{\"numbers\":[-3,-1,-4,-1,-5]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(-5))
            .andExpect(jsonPath("$.sorted[1]").value(-4))
            .andExpect(jsonPath("$.sorted[4]").value(-1));
    }

    @Test
    void sort_alreadySorted_shouldReturnSameArray() throws Exception {
        String requestBody = "{\"numbers\":[1,2,3,4,5]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(1))
            .andExpect(jsonPath("$.sorted[4]").value(5))
            .andExpect(jsonPath("$.steps[0].swapped").value(false));
    }

    @Test
    void sort_reverseSorted_shouldSortCorrectly() throws Exception {
        String requestBody = "{\"numbers\":[5,4,3,2,1]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(1))
            .andExpect(jsonPath("$.sorted[4]").value(5));
    }

    @Test
    void sort_duplicateValues_shouldSortCorrectly() throws Exception {
        String requestBody = "{\"numbers\":[3,1,2,1,3]}";

        mockMvc.perform(post("/api/sort")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.sorted[0]").value(1))
            .andExpect(jsonPath("$.sorted[1]").value(1))
            .andExpect(jsonPath("$.sorted[4]").value(3));
    }
}