// OpenWeatherMap weather condition codes:
// https://openweathermap.org/weather-conditions
//
// 2xx: Thunderstorm, 3xx: Drizzle, 5xx: Rain, 6xx: Snow,
// 7xx: Atmosphere (mist, fog), 800: Clear, 80x: Clouds
export const BACKGROUNDS = ['sunny', 'cloudy', 'rainy', 'snow'] as const

export type Background = (typeof BACKGROUNDS)[number]

export function getBackgroundForWeatherId(weatherId: number): Background {
  if (weatherId >= 200 && weatherId < 600) return 'rainy'
  if (weatherId >= 600 && weatherId < 700) return 'snow'
  if (weatherId === 800) return 'sunny'

  return 'cloudy'
}

export function updateBackground(weatherId: number): void {
  const background = getBackgroundForWeatherId(weatherId)

  BACKGROUNDS.forEach((candidate) =>
    document.body.classList.toggle(`bg-${candidate}`, candidate === background),
  )
}
