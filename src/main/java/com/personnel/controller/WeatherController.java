package com.personnel.controller;

import com.personnel.dto.WeatherResponse;
import com.personnel.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/weather")
@RequiredArgsConstructor
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/forecast/7days")
    public ResponseEntity<WeatherResponse> get7DayForecast(
            @RequestParam(defaultValue = "杭州") String city) {
        return ResponseEntity.ok(weatherService.get7DayForecast(city));
    }
}
