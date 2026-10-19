import { test } from '@playwright/test'
import {
  captureScreenshot,
  createMockScreenlyForScreenshots,
  RESOLUTIONS,
  setupOpenWeatherMocks,
} from '@screenly/edge-apps/test/screenshots'
import {
  mockCloudyForecastResponse,
  mockCloudyWeatherResponse,
  mockForecastResponse,
  mockGeocodingResponse,
  mockSnowForecastResponse,
  mockSnowWeatherResponse,
  mockSunnyForecastResponse,
  mockSunnyWeatherResponse,
  mockWeatherResponse,
} from './weather-mocks'

const { screenlyJsContent } = createMockScreenlyForScreenshots(
  {
    coordinates: [37.3893889, -122.0832101],
    location: 'Mountain View, CA',
  },
  {
    display_errors: 'false',
    override_timezone: 'America/Los_Angeles',
    override_locale: 'en',
    openweathermap_api_key: 'mock-api-key',
  },
)

const { screenlyJsContent: screenlyJsContentNoApiKey } =
  createMockScreenlyForScreenshots(
    {
      coordinates: [37.3893889, -122.0832101],
      location: 'Mountain View, CA',
    },
    {
      display_errors: 'false',
      override_timezone: 'America/Los_Angeles',
      override_locale: 'en',
    },
  )

for (const { width, height } of RESOLUTIONS) {
  test(`screenshot ${width}x${height}`, async ({ browser }) => {
    await captureScreenshot(browser, {
      width,
      height,
      filenamePrefix: 'weather-app',
      screenlyJsContent,
      setupMocks: async (page) => {
        await setupOpenWeatherMocks(page, {
          geocoding: mockGeocodingResponse,
          weather: mockWeatherResponse,
          forecast: mockForecastResponse,
        })
      },
    })
  })
}

const NO_API_KEY_RESOLUTIONS = [
  { width: 3840, height: 2160 },
  { width: 2160, height: 3840 },
]

for (const { width, height } of NO_API_KEY_RESOLUTIONS) {
  test(`screenshot no-api-key ${width}x${height}`, async ({ browser }) => {
    await captureScreenshot(browser, {
      width,
      height,
      filenamePrefix: 'weather-app-no-api-key',
      screenlyJsContent: screenlyJsContentNoApiKey,
      setupMocks: async () => {},
    })
  })
}

/** Landscape + portrait only — rainy is covered by the default screenshots above */
const WEATHER_VARIANT_RESOLUTIONS = [
  { width: 1920, height: 1080 },
  { width: 1080, height: 1920 },
]

const WEATHER_VARIANTS = [
  {
    name: 'sunny',
    weather: mockSunnyWeatherResponse,
    forecast: mockSunnyForecastResponse,
  },
  {
    name: 'cloudy',
    weather: mockCloudyWeatherResponse,
    forecast: mockCloudyForecastResponse,
  },
  {
    name: 'snow',
    weather: mockSnowWeatherResponse,
    forecast: mockSnowForecastResponse,
  },
] as const

for (const variant of WEATHER_VARIANTS) {
  for (const { width, height } of WEATHER_VARIANT_RESOLUTIONS) {
    test(`screenshot ${variant.name} ${width}x${height}`, async ({
      browser,
    }) => {
      await captureScreenshot(browser, {
        width,
        height,
        filenamePrefix: `weather-app-${variant.name}`,
        screenlyJsContent,
        setupMocks: async (page) => {
          await setupOpenWeatherMocks(page, {
            geocoding: mockGeocodingResponse,
            weather: variant.weather,
            forecast: variant.forecast,
          })
        },
      })
    })
  }
}
