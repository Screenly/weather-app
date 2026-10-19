import { describe, expect, test } from 'bun:test'
import { getBackgroundForWeatherId } from './background'

describe('getBackgroundForWeatherId', () => {
  test('treats thunderstorm, drizzle and rain as rainy', () => {
    expect(getBackgroundForWeatherId(200)).toBe('rainy')
    expect(getBackgroundForWeatherId(300)).toBe('rainy')
    expect(getBackgroundForWeatherId(500)).toBe('rainy')
    expect(getBackgroundForWeatherId(599)).toBe('rainy')
  })

  test('treats the 6xx range as snow', () => {
    expect(getBackgroundForWeatherId(600)).toBe('snow')
    expect(getBackgroundForWeatherId(699)).toBe('snow')
  })

  test('treats a clear sky as sunny', () => {
    expect(getBackgroundForWeatherId(800)).toBe('sunny')
  })

  test('falls back to cloudy for atmosphere, clouds and anything unknown', () => {
    expect(getBackgroundForWeatherId(701)).toBe('cloudy')
    expect(getBackgroundForWeatherId(804)).toBe('cloudy')
    expect(getBackgroundForWeatherId(0)).toBe('cloudy')
  })
})
