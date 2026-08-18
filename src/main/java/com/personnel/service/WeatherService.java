package com.personnel.service;

import com.personnel.dto.WeatherResponse;

public interface WeatherService {
    WeatherResponse get7DayForecast(String city);
}
