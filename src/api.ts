import { AirPollutionSchema } from "./schemas/airPollutionSchema"
import { GeocodeSchema } from "./schemas/geocodeSchema"


import { Weather25Schema, Forecast25Schema } from "./schemas/openWeather25"
import { adaptToWeatherSchema } from "./utils/weatherAdapter"

const API_KEY = import.meta.env.VITE_API_KEY

export async function getWeather({ lat, lon }: { lat: number; lon: number }) {
  const [weatherRes, forecastRes] = await Promise.all([
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    ),
    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`
    ),
  ])

  const weatherData = await weatherRes.json()
  const forecastData = await forecastRes.json()

  const parsedWeather = Weather25Schema.parse(weatherData)
  const parsedForecast = Forecast25Schema.parse(forecastData)

  return adaptToWeatherSchema(parsedWeather, parsedForecast)
}

export async function getGeocode(location: string) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
  )
  const data = await res.json()
  return GeocodeSchema.parse(data)
}

export async function getAirPollution({
  lat,
  lon,
}: {
  lat: number
  lon: number
}) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  )
  const data = await res.json()
  return AirPollutionSchema.parse(data)
}
