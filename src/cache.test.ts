import { beforeEach, describe, expect, test } from 'bun:test'
import {
  loadCityInfo,
  loadSnapshot,
  saveCityInfo,
  saveSnapshot,
  type WeatherSnapshot,
} from './cache'

const store = new Map<string, string>()
globalThis.localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, value),
  removeItem: (key: string) => void store.delete(key),
  clear: () => store.clear(),
  key: () => null,
  length: 0,
} as Storage

const snapshot: WeatherSnapshot = {
  latitude: 40.7,
  longitude: -74,
  unit: 'metric',
  weather: {
    temperature: 21,
    weatherId: 800,
    description: 'Clear sky',
    iconSrc: 'clear.svg',
    iconAlt: 'clear sky',
    tempHigh: 24,
    tempLow: 17,
    displayTemp: '21°C',
  },
  forecast: [
    {
      temperature: 21,
      iconSrc: 'clear.svg',
      iconAlt: 'clear sky',
      timeLabel: 'NOW',
      timestamp: 1_700_000_000_000,
      displayTemp: '21°',
    },
  ],
  savedAt: 1_700_000_000_000,
}

describe('weather snapshot cache', () => {
  beforeEach(() => store.clear())

  test('returns the last saved snapshot for the same place and unit', () => {
    saveSnapshot(snapshot)
    expect(loadSnapshot(40.7, -74, 'metric')).toEqual(snapshot)
  })

  test('ignores a snapshot from another place or unit', () => {
    saveSnapshot(snapshot)
    expect(loadSnapshot(51.5, -0.1, 'metric')).toBeNull()
    expect(loadSnapshot(40.7, -74, 'imperial')).toBeNull()
  })

  test('returns null when nothing is cached or the entry is corrupt', () => {
    expect(loadSnapshot(40.7, -74, 'metric')).toBeNull()
    store.set('weather-app:last-snapshot', '{not json')
    expect(loadSnapshot(40.7, -74, 'metric')).toBeNull()
  })

  test('stores the city per coordinate', () => {
    saveCityInfo(40.7, -74, { cityName: 'New York, US', countryCode: 'US' })
    expect(loadCityInfo(40.7, -74)).toEqual({
      cityName: 'New York, US',
      countryCode: 'US',
    })
    expect(loadCityInfo(51.5, -0.1)).toBeNull()
  })
})
