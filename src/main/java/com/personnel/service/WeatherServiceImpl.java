package com.personnel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.personnel.dto.WeatherResponse;
import com.personnel.dto.WeatherResponse.DailyForecast;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    private record CityCoord(double lat, double lon) {}
    private record WeatherInfo(String icon, String desc) {}

    private static final Map<String, CityCoord> CITY_COORDS = Map.of(
        "杭州", new CityCoord(30.2741, 120.1551),
        "北京", new CityCoord(39.9042, 116.4074),
        "上海", new CityCoord(31.2304, 121.4737),
        "深圳", new CityCoord(22.5431, 114.0579)
    );

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final Map<Integer, WeatherInfo> WMO_CODES = Map.ofEntries(
        Map.entry(0, new WeatherInfo("☀️", "晴天")),
        Map.entry(1, new WeatherInfo("🌤", "大部晴朗")),
        Map.entry(2, new WeatherInfo("⛅", "多云")),
        Map.entry(3, new WeatherInfo("☁️", "阴天")),
        Map.entry(45, new WeatherInfo("🌫", "雾天")),
        Map.entry(48, new WeatherInfo("🌫", "雾凇")),
        Map.entry(51, new WeatherInfo("🌦", "小毛毛雨")),
        Map.entry(53, new WeatherInfo("🌦", "中毛毛雨")),
        Map.entry(55, new WeatherInfo("🌦", "大毛毛雨")),
        Map.entry(61, new WeatherInfo("🌧", "小雨")),
        Map.entry(63, new WeatherInfo("🌧", "中雨")),
        Map.entry(65, new WeatherInfo("🌧", "大雨")),
        Map.entry(71, new WeatherInfo("🌨", "小雪")),
        Map.entry(73, new WeatherInfo("🌨", "中雪")),
        Map.entry(75, new WeatherInfo("🌨", "大雪")),
        Map.entry(80, new WeatherInfo("🌦", "阵雨")),
        Map.entry(81, new WeatherInfo("🌧", "中阵雨")),
        Map.entry(82, new WeatherInfo("🌧", "大阵雨")),
        Map.entry(95, new WeatherInfo("⛈", "雷暴")),
        Map.entry(96, new WeatherInfo("⛈", "雷暴伴冰雹")),
        Map.entry(99, new WeatherInfo("⛈", "强雷暴伴冰雹"))
    );

    @Override
    public WeatherResponse get7DayForecast(String city) {
        CityCoord coord = CITY_COORDS.getOrDefault(city, CITY_COORDS.get("杭州"));
        String url = buildApiUrl(coord.lat(), coord.lon());

        try {
            log.debug("Fetching weather data from: {}", url);
            String json = restTemplate.getForObject(url, String.class);

            if (json == null || json.isBlank()) {
                log.warn("Open-Meteo API returned empty response for city: {}", city);
                return getFallbackForecast(city, true);
            }

            JsonNode root = objectMapper.readTree(json);
            return parseWeatherResponse(root, city);

        } catch (ResourceAccessException e) {
            log.error("网络连接失败，无法获取天气数据: {}", e.getMessage());
            return getFallbackForecast(city, true);
        } catch (Exception e) {
            log.error("获取天气数据发生未知错误: {}", e.getMessage(), e);
            return getFallbackForecast(city, true);
        }
    }

    /**
     * 构建 Open-Meteo API URL
     */
    private String buildApiUrl(double lat, double lon) {
        return String.format(
            "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f" +
            "&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_probability_max,wind_speed_10m_max" +
            "&timezone=Asia%%2FShanghai&forecast_days=7",
            lat, lon
        );
    }

    /**
     * 解析 Open-Meteo API 响应
     */
    private WeatherResponse parseWeatherResponse(JsonNode root, String city) {
        JsonNode daily = root.get("daily");
        if (daily == null || !daily.has("time") || !daily.get("time").isArray()) {
            log.warn("Open-Meteo 返回数据缺少 daily/time 字段");
            return getFallbackForecast(city, true);
        }

        JsonNode dates = daily.get("time");
        JsonNode maxTemps = daily.get("temperature_2m_max");
        JsonNode minTemps = daily.get("temperature_2m_min");
        JsonNode weatherCodes = daily.get("weathercode");
        JsonNode precipProbs = daily.get("precipitation_probability_max");
        JsonNode windSpeeds = daily.get("wind_speed_10m_max");

        if (maxTemps == null || minTemps == null || weatherCodes == null) {
            log.warn("Open-Meteo 返回数据缺少必要字段");
            return getFallbackForecast(city, true);
        }

        List<DailyForecast> forecasts = new ArrayList<>();
        for (int i = 0; i < dates.size(); i++) {
            int code = weatherCodes.get(i).asInt();
            WeatherInfo info = WMO_CODES.getOrDefault(code, new WeatherInfo("❓", "未知"));

            DailyForecast forecast = DailyForecast.builder()
                .date(dates.get(i).asText())
                .maxTemp(maxTemps.get(i).asDouble())
                .minTemp(minTemps.get(i).asDouble())
                .weatherCode(String.valueOf(code))
                .weatherDesc(info.desc())
                .weatherIcon(info.icon())
                .precipitationProbability(precipProbs != null ? precipProbs.get(i).asDouble() : 0)
                .windSpeed(windSpeeds != null ? windSpeeds.get(i).asDouble() : 0)
                .build();
            forecasts.add(forecast);
        }

        return WeatherResponse.builder()
            .city(city)
            .updateDate(LocalDateTime.now().format(DATETIME_FMT))
            .forecasts(forecasts)
            .fallback(false)
            .build();
    }

    /**
     * 降级方案：返回模拟天气数据（API不可用时）
     */
    private WeatherResponse getFallbackForecast(String city, boolean isFallback) {
        log.warn("使用降级模拟数据返回天气信息，city={}", city);
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
                .precipitationProbability(20 + i * 5)
                .windSpeed(5 + i * 1.5)
                .build());
        }

        return WeatherResponse.builder()
            .city(city)
            .updateDate(LocalDateTime.now().format(DATETIME_FMT))
            .forecasts(forecasts)
            .fallback(true)
            .build();
    }
}
