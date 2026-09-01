import './css/style.css'

import {
  formatLocalizedDate,
  formatTime,
  getMetadata,
  getTimeZone,
  getLocale,
  signalReady,
  getSetting,
  getCityInfo,
  resolveMeasurementUnit,
  setupBrandingLogo,
  setupErrorHandling,
  setupTheme,
  type MeasurementUnit,
} from '@screenly/edge-apps'
// Side-effect import: registers <auto-scaler> as a custom element
import '@screenly/edge-apps/components'
import {
  getCurrentWeather,
  getHourlyForecast,
  MISSING_API_KEY_ERROR,
} from './weather'
import type { ForecastItem } from './weather'
import { updateBackground } from './background'
import { getPlaceSizeClass } from './place'
import { buildGraphShape } from './graph'
import { drawTrend } from './trend'

type ErrorReporter = (error: unknown) => void

function showError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error)
  const errorMessage = document.querySelector('[data-error-message]')

  document.getElementById('weather')?.classList.add('has-error')
  if (errorMessage) {
    errorMessage.textContent = message
  }
}

function createErrorReporter(displayErrors: boolean): ErrorReporter {
  if (displayErrors) {
    return (error) => {
      throw error instanceof Error ? error : new Error(String(error))
    }
  }
  return showError
}

// DOM elements
let locationEl: Element | null
let temperatureEl: Element | null
let weatherDescriptionEl: Element | null
let tempHighEl: Element | null
let tempLowEl: Element | null
let forecastItemsEl: Element | null
let forecastCardEl: Element | null
let trendEl: Element | null
let trendChartEl: SVGSVGElement | null
let trendHighEl: Element | null
let trendLowEl: Element | null

let dateEl: Element | null
let logoEl: HTMLImageElement | null

// State
let timezone: string = 'UTC'
let locale: string = 'en'
let measurementUnit: MeasurementUnit = 'metric'

function getCoordinates(): [number, number] {
  const overrideCoordinates = getSetting<string>('override_coordinates')

  if (overrideCoordinates) {
    const coords = overrideCoordinates
      .split(',')
      .map((c) => parseFloat(c.trim()))
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return [coords[0], coords[1]]
    }
  }

  return getMetadata().coordinates
}

function setForecastVisible(visible: boolean) {
  forecastCardEl?.classList.toggle('is-hidden', !visible)
}

function renderForecastItems(items: ForecastItem[]) {
  if (!forecastItemsEl) return

  const template = document.getElementById(
    'forecast-item-template',
  ) as HTMLTemplateElement
  if (!template) return

  forecastItemsEl.replaceChildren()

  for (const item of items) {
    const clone = template.content.cloneNode(true) as DocumentFragment
    const itemEl = clone.querySelector('.forecast-item')
    if (!itemEl) continue

    const tempEl = itemEl.querySelector('.forecast-item-temp')
    if (tempEl) tempEl.textContent = item.displayTemp

    const iconEl = itemEl.querySelector(
      '.forecast-item-icon',
    ) as HTMLImageElement
    if (iconEl) {
      iconEl.setAttribute('src', item.iconSrc)
      iconEl.setAttribute('alt', item.iconAlt)
    }

    const timeValueEl = itemEl.querySelector('.forecast-item-time-value')
    if (timeValueEl) timeValueEl.textContent = item.timeLabel

    const timePeriodEl = itemEl.querySelector('.forecast-item-time-period')
    if (timePeriodEl && item.timePeriod) {
      timePeriodEl.textContent = ` ${item.timePeriod}`
    }

    forecastItemsEl.appendChild(clone)
  }
}

function renderDate(): void {
  if (!dateEl) return

  dateEl.textContent = formatLocalizedDate(new Date(), locale, {
    timeZone: timezone,
    weekday: 'long',
  })
}

async function setupLogo(): Promise<void> {
  if (!logoEl) return

  logoEl.onerror = () => {
    console.error('Failed to load branding logo')
    logoEl?.classList.add('is-hidden')
  }
  logoEl.src = await setupBrandingLogo()
}

function renderTrend(items: ForecastItem[]): void {
  const shape = buildGraphShape(
    items.map((item) => ({
      temperature: item.temperature,
      timestamp: item.timestamp,
    })),
  )

  trendEl?.classList.toggle('is-hidden', !shape)
  if (!shape || !trendChartEl) return

  drawTrend(trendChartEl, shape, formatHour)

  if (trendHighEl) {
    trendHighEl.textContent = `${Math.round(shape.high.temperature)}°`
  }
  if (trendLowEl) {
    trendLowEl.textContent = `${Math.round(shape.low.temperature)}°`
  }
}

function formatHour(timestamp: number): string {
  const time = formatTime(new Date(timestamp), locale, timezone)
  return time.dayPeriod ? `${time.hour} ${time.dayPeriod}` : `${time.hour}:00`
}

async function updateWeatherDisplay(
  latitude: number,
  longitude: number,
  tz: string,
  unit: MeasurementUnit,
) {
  const weather = await getCurrentWeather(latitude, longitude, tz, unit)

  if (!weather) {
    setForecastVisible(false)
    return
  }

  updateBackground(weather.weatherId)

  if (temperatureEl) {
    temperatureEl.textContent = weather.displayTemp
  }

  if (weatherDescriptionEl) {
    weatherDescriptionEl.textContent = weather.description
  }

  if (tempHighEl) {
    tempHighEl.textContent = `${weather.tempHigh}°`
  }

  if (tempLowEl) {
    tempLowEl.textContent = `${weather.tempLow}°`
  }

  const forecast = await getHourlyForecast(
    latitude,
    longitude,
    tz,
    locale,
    unit,
    weather,
  )

  setForecastVisible(forecast.length > 0)
  renderTrend(forecast)
  if (forecast.length > 0) {
    renderForecastItems(forecast)
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  setupErrorHandling()
  setupTheme()

  dateEl = document.querySelector('[data-date]')
  logoEl = document.querySelector('[data-logo]')
  locationEl = document.querySelector('[data-location]')
  temperatureEl = document.querySelector('[data-temperature]')
  weatherDescriptionEl = document.querySelector('[data-weather-description]')
  tempHighEl = document.querySelector('[data-temp-high]')
  tempLowEl = document.querySelector('[data-temp-low]')
  forecastItemsEl = document.querySelector('[data-forecast-items]')
  forecastCardEl = document.querySelector('[data-forecast-card]')
  trendEl = document.querySelector('[data-trend]')
  trendChartEl = document.querySelector('[data-trend-chart]')
  trendHighEl = document.querySelector('[data-trend-high]')
  trendLowEl = document.querySelector('[data-trend-low]')
  const displayErrors = getSetting<string>('display_errors') === 'true'
  const reportError = createErrorReporter(displayErrors)

  try {
    const apiKey = getSetting<string>('openweathermap_api_key')
    if (!apiKey) {
      throw new Error(MISSING_API_KEY_ERROR)
    }

    const [latitude, longitude] = getCoordinates()

    timezone = await getTimeZone()
    locale = await getLocale()

    renderDate()
    await setupLogo()

    const { cityName, countryCode } = await getCityInfo(latitude, longitude)
    if (locationEl) {
      locationEl.textContent = cityName
      locationEl.className = `now-place ${getPlaceSizeClass(cityName)}`.trim()
    }

    // Get measurement unit from settings, or auto-detect based on location
    measurementUnit = resolveMeasurementUnit(countryCode)

    await updateWeatherDisplay(latitude, longitude, timezone, measurementUnit)

    // Refresh weather every 15 minutes
    setInterval(
      () => {
        updateWeatherDisplay(latitude, longitude, timezone, measurementUnit)
      },
      15 * 60 * 1000,
    )
  } catch (error) {
    console.error('Weather app initialization failed:', error)
    reportError(error)
  } finally {
    signalReady()
  }
})
