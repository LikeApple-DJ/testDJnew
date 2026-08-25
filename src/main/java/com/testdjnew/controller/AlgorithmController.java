package com.testdjnew.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

@RestController
@RequestMapping("/api")
public class AlgorithmController {

    private static final int MAX_HASH_INPUT_LENGTH = 10_000;

    @GetMapping("/hello")
    public Map<String, Object> hello() {
        return Map.of(
            "message", "Hello, World!",
            "timestamp", Instant.now().toString(),
            "version", "1.0.0"
        );
    }

    public record HashRequest(String algorithm, String input) {}
    public record HashResponse(String algorithm, String input, String hash) {}
    public record ErrorResponse(String error) {}
    public record SortRequest(int[] numbers) {}
    public record SortStep(int pass, int[] array, boolean swapped) {}
    public record SortResponse(int[] sorted, java.util.List<SortStep> steps) {}

    @PostMapping("/hash")
    public ResponseEntity<?> hash(@RequestBody HashRequest request) {
        if (request.input() == null || request.input().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("input must not be null or empty"));
        }
        if (request.input().length() > MAX_HASH_INPUT_LENGTH) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("input too long, max " + MAX_HASH_INPUT_LENGTH + " chars"));
        }

        String algo = request.algorithm().toUpperCase().replace("-", "");
        if (!algo.equals("MD5") && !algo.equals("SHA1") && !algo.equals("SHA256")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Unsupported algorithm: " + request.algorithm()));
        }

        try {
            String javaAlgo = switch (algo) {
                case "SHA1" -> "SHA-1";
                case "SHA256" -> "SHA-256";
                default -> "MD5";
            };
            MessageDigest md = MessageDigest.getInstance(javaAlgo);
            byte[] digest = md.digest(request.input().getBytes(StandardCharsets.UTF_8));
            String hex = HexFormat.of().formatHex(digest);

            return ResponseEntity.ok(new HashResponse(
                request.algorithm(), request.input(), hex
            ));
        } catch (NoSuchAlgorithmException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Hash algorithm not available: " + request.algorithm()));
        }
    }

    @PostMapping("/sort")
    public ResponseEntity<?> sort(@RequestBody SortRequest request) {
        if (request.numbers() == null || request.numbers().length == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("numbers array must not be empty"));
        }

        int[] arr = request.numbers().clone();
        int n = arr.length;
        java.util.List<SortStep> steps = new java.util.ArrayList<>();

        for (int i = 0; i < n - 1; i++) {
            boolean swapped = false;
            for (int j = 0; j < n - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swapped = true;
                }
            }
            steps.add(new SortStep(i + 1, arr.clone(), swapped));
            if (!swapped) {
                break;
            }
        }

        return ResponseEntity.ok(new SortResponse(arr, steps));
    }
}