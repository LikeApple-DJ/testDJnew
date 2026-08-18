package com.personnel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherResponse {
    private String city;
    private String updateDate;
    private List<DailyForecast> forecasts;
    private boolean fallback;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyForecast {
        private String date;
        private double maxTemp;
        private double minTemp;
        private String weatherCode;
        private String weatherDesc;
        private String weatherIcon;
        private double precipitationProbability;
        private double windSpeed;
    }
}
