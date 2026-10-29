import type { MeasurementUnit } from '@screenly/edge-apps'
import type { CurrentWeatherData, ForecastItem } from './weather'

const CACHE_KEY = 'weather-app:last-snapshot'

export interface CityInfo {
  cityName: string
  countryCode: string
}

export interface WeatherSnapshot {
  latitude: number
  longitude: number
  unit: MeasurementUnit
  weather: CurrentWeatherData
  forecast: ForecastItem[]
  savedAt: number
}

// Storage can be unavailable (private mode, blocked site data), so every
// access is guarded and the app keeps working without a cache.
function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('Failed to cache weather data:', error)
  }
}

function cityKey(latitude: number, longitude: number): string {
  return `weather-app:city:${latitude},${longitude}`
}

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

const isString = (value: unknown): value is string => typeof value === 'string'

function isWeather(value: unknown): value is CurrentWeatherData {
  const w = value as Partial<CurrentWeatherData> | null
  return (
    !!w &&
    isNumber(w.temperature) &&
    isNumber(w.weatherId) &&
    isNumber(w.tempHigh) &&
    isNumber(w.tempLow) &&
    isString(w.description) &&
    isString(w.iconSrc) &&
    isString(w.iconAlt) &&
    isString(w.displayTemp)
  )
}

function isForecastItem(value: unknown): value is ForecastItem {
  const item = value as Partial<ForecastItem> | null
  return (
    !!item &&
    isNumber(item.temperature) &&
    isNumber(item.timestamp) &&
    isString(item.iconSrc) &&
    isString(item.iconAlt) &&
    isString(item.timeLabel) &&
    isString(item.displayTemp)
  )
}

export function saveSnapshot(snapshot: WeatherSnapshot): void {
  writeJson(CACHE_KEY, snapshot)
}

// Only returns a snapshot taken for the same place and unit, so a moved or
// reconfigured screen never shows another location's weather.
export function loadSnapshot(
  latitude: number,
  longitude: number,
  unit: MeasurementUnit,
): WeatherSnapshot | null {
  const snapshot = readJson<WeatherSnapshot>(CACHE_KEY)
  if (
    !snapshot ||
    snapshot.latitude !== latitude ||
    snapshot.longitude !== longitude ||
    snapshot.unit !== unit ||
    !isNumber(snapshot.savedAt) ||
    !isWeather(snapshot.weather) ||
    !Array.isArray(snapshot.forecast) ||
    !snapshot.forecast.every(isForecastItem)
  ) {
    return null
  }
  return snapshot
}

export function saveCityInfo(
  latitude: number,
  longitude: number,
  info: CityInfo,
): void {
  writeJson(cityKey(latitude, longitude), info)
}

export function loadCityInfo(
  latitude: number,
  longitude: number,
): CityInfo | null {
  const info = readJson<CityInfo>(cityKey(latitude, longitude))
  return info &&
    isString(info.cityName) &&
    info.cityName &&
    isString(info.countryCode)
    ? info
    : null
}
