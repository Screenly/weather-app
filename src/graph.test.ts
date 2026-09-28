import { describe, expect, test } from 'bun:test'
import { buildGraphShape } from './graph'

const HOUR = 60 * 60 * 1000
const START = Date.UTC(2026, 0, 1, 9)
const readings = [
  { temperature: 10, timestamp: START },
  { temperature: 16, timestamp: START + 3 * HOUR },
  { temperature: 21, timestamp: START + 6 * HOUR },
  { temperature: 14, timestamp: START + 9 * HOUR },
]

describe('buildGraphShape', () => {
  test('needs at least two readings to draw a line', () => {
    expect(buildGraphShape([])).toBeNull()
    expect(buildGraphShape([{ temperature: 10, timestamp: START }])).toBeNull()
  })

  test('spreads points evenly across the full width', () => {
    const shape = buildGraphShape(readings)!
    const xs = shape.points.map((p) => p.x)
    expect(xs[0]).toBeGreaterThan(0)
    expect(xs.at(-1)).toBeLessThan(100)
    const gaps = xs.slice(1).map((x, index) => x - xs[index])
    gaps.forEach((gap) => expect(gap).toBeCloseTo(gaps[0], 6))
  })

  test('puts the warmest reading above the coldest', () => {
    const shape = buildGraphShape(readings)!
    expect(shape.high.temperature).toBe(21)
    expect(shape.low.temperature).toBe(10)
    expect(shape.high.y).toBeLessThan(shape.low.y)
  })

  test('closes the area path back along the baseline', () => {
    const shape = buildGraphShape(readings)!
    expect(shape.area.startsWith(shape.line)).toBe(true)
    expect(shape.line.startsWith('M')).toBe(true)
    expect(shape.area.endsWith('40 Z')).toBe(true)
  })

  test('draws a flat run down the middle rather than dividing by zero', () => {
    const flat = buildGraphShape([
      { temperature: 12, timestamp: START },
      { temperature: 12, timestamp: START + 3 * HOUR },
    ])!
    expect(flat.points.every((p) => Number.isFinite(p.y))).toBe(true)
    expect(flat.points[0].y).toBe(flat.points[1].y)
  })
})

describe('smoothing', () => {
  test('draws curves rather than straight segments', () => {
    const shape = buildGraphShape(readings)!
    expect(shape.line).toContain('C')
    expect(shape.line).not.toContain('L')
  })

  test('still passes through every reading', () => {
    const shape = buildGraphShape(readings)!
    shape.points.forEach((point) => {
      expect(shape.line).toContain(`${Math.round(point.x * 100) / 100} `)
    })
  })
})

describe('ticks', () => {
  test('marks every second reading, so six-hourly on a three-hour grid', () => {
    const shape = buildGraphShape(readings)!
    expect(shape.ticks).toHaveLength(2)
    expect(shape.ticks.map((t) => t.timestamp)).toEqual([
      START,
      START + 6 * HOUR,
    ])
  })

  test('never repeats a reading in the tick list', () => {
    const shape = buildGraphShape(readings)!
    const stamps = shape.ticks.map((t) => t.timestamp)
    expect(new Set(stamps).size).toBe(stamps.length)
  })
})
