import type { Weather25, Forecast25 } from "../schemas/openWeather25"
import { z } from "zod"
import { weatherSchema } from "../schemas/weatherSchema"

type WeatherData = z.infer<typeof weatherSchema>

export function adaptToWeatherSchema(
    current: Weather25,
    forecast: Forecast25
): WeatherData {
    const timezone_offset = current.timezone

    // Adapt current weather
    const currentData = {
        dt: current.dt,
        sunrise: current.sys.sunrise,
        sunset: current.sys.sunset,
        temp: current.main.temp,
        feels_like: current.main.feels_like,
        pressure: current.main.pressure,
        humidity: current.main.humidity,
        dew_point: 0, // Not available in 2.5/weather
        uvi: 0, // Not available in 2.5/weather
        clouds: current.clouds.all,
        visibility: current.visibility,
        wind_speed: current.wind.speed,
        wind_deg: current.wind.deg,
        wind_gust: current.wind.gust,
        weather: current.weather,
    }

    // Adapt hourly forecast (using the 3-hour forecast list)
    const hourlyData = forecast.list.map((item) => ({
        dt: item.dt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        pressure: item.main.pressure,
        humidity: item.main.humidity,
        dew_point: 0, // Not available
        uvi: 0, // Not available
        clouds: item.clouds.all,
        visibility: item.visibility,
        wind_speed: item.wind.speed,
        wind_deg: item.wind.deg,
        wind_gust: item.wind.gust || 0,
        weather: item.weather,
        pop: item.pop,
    }))

    // Adapt daily forecast (aggregating 3-hour forecast by day)
    const dailyDataMap = new Map<string, any>()

    forecast.list.forEach((item) => {
        const date = new Date(item.dt * 1000).toISOString().split("T")[0]

        if (!dailyDataMap.has(date)) {
            dailyDataMap.set(date, {
                dt: item.dt,
                sunrise: forecast.city.sunrise,
                sunset: forecast.city.sunset,
                moonrise: 0, // Not available
                moonset: 0, // Not available
                moon_phase: 0, // Not available
                summary: item.weather[0].description,
                temp: {
                    day: item.main.temp,
                    min: item.main.temp_min,
                    max: item.main.temp_max,
                    night: item.main.temp, // Approximation
                    eve: item.main.temp, // Approximation
                    morn: item.main.temp, // Approximation
                },
                feels_like: {
                    day: item.main.feels_like,
                    night: item.main.feels_like,
                    eve: item.main.feels_like,
                    morn: item.main.feels_like,
                },
                pressure: item.main.pressure,
                humidity: item.main.humidity,
                dew_point: 0,
                wind_speed: item.wind.speed,
                wind_deg: item.wind.deg,
                wind_gust: item.wind.gust || 0,
                weather: item.weather,
                clouds: item.clouds.all,
                pop: item.pop,
                rain: item.rain ? item.rain["3h"] : 0,
                uvi: 0,
            })
        } else {
            const dayData = dailyDataMap.get(date)
            // Update min/max temps
            dayData.temp.min = Math.min(dayData.temp.min, item.main.temp_min)
            dayData.temp.max = Math.max(dayData.temp.max, item.main.temp_max)
            // Update rain
            if (item.rain) {
                dayData.rain = (dayData.rain || 0) + item.rain["3h"]
            }
            // Max pop for the day
            dayData.pop = Math.max(dayData.pop, item.pop)
        }
    })

    const dailyData = Array.from(dailyDataMap.values()).slice(0, 8) // Limit to 8 days if possible (forecast is 5 days)

    return {
        lat: current.coord.lat,
        lon: current.coord.lon,
        timezone: "UTC", // 2.5 API returns offset in seconds, not timezone name. We'll use UTC or approximate.
        timezone_offset: timezone_offset,
        current: currentData,
        hourly: hourlyData,
        daily: dailyData,
    }
}
