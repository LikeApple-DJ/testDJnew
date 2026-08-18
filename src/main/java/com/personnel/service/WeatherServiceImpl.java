package com.personnel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personnel.dto.WeatherResponse;
import com.personnel.dto.WeatherResponse.DailyForecast;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class WeatherServiceImpl implements WeatherService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // 城市坐标映射（可扩展更多城市）
    private static final Map<String, double[]> CITY_COORDS = Map.of(
        "杭州", new double[]{30.2741, 120.1551},
        "北京", new double[]{39.9042, 116.4074},
        "上海", new double[]{31.2304, 121.4737},
        "深圳", new double[]{22.5431, 114.0579}
    );

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // WMO天气代码 → 中文描述
    private static final Map<Integer, String[]> WMO_CODES = Map.ofEntries(
        Map.entry(0, new String[]{"☀️", "晴天"}),
        Map.entry(1, new String[]{"🌤", "大部晴朗"}),
        Map.entry(2, new String[]{"⛅", "多云"}),
        Map.entry(3, new String[]{"☁️", "阴天"}),
        Map.entry(45, new String[]{"🌫", "雾天"}),
        Map.entry(48, new String[]{"🌫", "雾凇"}),
        Map.entry(51, new String[]{"🌦", "小毛毛雨"}),
        Map.entry(53, new String[]{"🌦", "中毛毛雨"}),
        Map.entry(55, new String[]{"🌦", "大毛毛雨"}),
        Map.entry(61, new String[]{"🌧", "小雨"}),
        Map.entry(63, new String[]{"🌧", "中雨"}),
        Map.entry(65, new String[]{"🌧", "大雨"}),
        Map.entry(71, new String[]{"🌨", "小雪"}),
        Map.entry(73, new String[]{"🌨", "中雪"}),
        Map.entry(75, new String[]{"🌨", "大雪"}),
        Map.entry(80, new String[]{"🌦", "阵雨"}),
        Map.entry(81, new String[]{"🌧", "中阵雨"}),
        Map.entry(82, new String[]{"🌧", "大阵雨"}),
        Map.entry(95, new String[]{"⛈", "雷暴"}),
        Map.entry(96, new String[]{"⛈", "雷暴伴冰雹"}),
        Map.entry(99, new String[]{"⛈", "强雷暴伴冰雹"})
    );

    @Override
    public WeatherResponse get7DayForecast(String city) {
        double[] coords = CITY_COORDS.getOrDefault(city, CITY_COORDS.get("杭州"));
        double lat = coords[0];
        double lon = coords[1];

        String url = String.format(
            "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f" +
            "&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,wind_speed_10m_max" +
            "&timezone=Asia%%2FShanghai&forecast_days=7",
            lat, lon
        );

        try {
            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(json);
            JsonNode daily = root.get("daily");

            List<DailyForecast> forecasts = new ArrayList<>();
            JsonNode dates = daily.get("time");
            JsonNode maxTemps = daily.get("temperature_2m_max");
            JsonNode minTemps = daily.get("temperature_2m_min");
            JsonNode weatherCodes = daily.get("weathercode");
            JsonNode precipProbs = daily.get("precipitation_probability_max");
            JsonNode windSpeeds = daily.get("wind_speed_10m_max");

            for (int i = 0; i < dates.size(); i++) {
                int code = weatherCodes.get(i).asInt();
                String[] weatherInfo = WMO_CODES.getOrDefault(code, new String[]{"❓", "未知"});

                DailyForecast forecast = DailyForecast.builder()
                    .date(dates.get(i).asText())
                    .maxTemp(maxTemps.get(i).asDouble())
                    .minTemp(minTemps.get(i).asDouble())
                    .weatherCode(String.valueOf(code))
                    .weatherDesc(weatherInfo[1])
                    .weatherIcon(weatherInfo[0])
                    .precipitationProbability(precipProbs.get(i).asDouble())
                    .windSpeed(windSpeeds.get(i).asDouble())
                    .build();
                forecasts.add(forecast);
            }

            return WeatherResponse.builder()
                .city(city)
                .updateTime(LocalDate.now().format(DATE_FMT))
                .forecasts(forecasts)
                .build();

        } catch (Exception e) {
            log.error("获取天气数据失败: {}", e.getMessage());
            // 降级：返回模拟数据
            return getFallbackForecast(city);
        }
    }

    /**
     * 降级方案：返回模拟天气数据（API不可用时）
     */
    private WeatherResponse getFallbackForecast(String city) {
        List<DailyForecast> forecasts = new ArrayList<>();
        LocalDate today = LocalDate.now();
        String[] descs = {"晴天", "多云", "阴天", "小雨", "晴转多云", "多云转阴", "阵雨"};
        String[] icons = {"☀️", "⛅", "☁️", "🌧", "🌤", "⛅", "🌦"};
        double[] maxT = {28, 26, 24, 22, 27, 25, 23};
        double[] minT = {18, 17, 16, 15, 19, 18, 16};

        for (int i = 0; i < 7; i++) {
            forecasts.add(DailyForecast.builder()
                .date(today.plusDays(i).format(DATE_FMT))
                .maxTemp(maxT[i])
                .minTemp(minT[i])
                .weatherCode(String.valueOf(i))
                .weatherDesc(descs[i])
                .weatherIcon(icons[i])
                .precipitationProbability(Math.random() * 60)
                .windSpeed(3 + Math.random() * 10)
                .build());
        }

        return WeatherResponse.builder()
            .city(city)
            .updateTime(today.format(DATE_FMT))
            .forecasts(forecasts)
            .build();
    }
}
