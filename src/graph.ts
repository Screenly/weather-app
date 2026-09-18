/**
 * Geometry for the temperature curve. Kept free of the DOM so the shape of the
 * line can be tested without a browser.
 */
export interface GraphPoint {
  x: number
  y: number
  temperature: number
  timestamp: number
}

export interface GraphShape {
  points: GraphPoint[]
  line: string
  area: string
  high: GraphPoint
  low: GraphPoint
  ticks: GraphPoint[]
}

export interface GraphInput {
  temperature: number
  timestamp: number
}

const VIEWBOX_WIDTH = 100
const VIEWBOX_HEIGHT = 40
// Keeps the curve clear of the labels sitting above and below it
const TOP_PADDING = 9
const BOTTOM_PADDING = 7
// Keeps the end caps and the outermost dots clear of the viewBox edge
const SIDE_PADDING = 4

/**
 * Maps readings onto a 100x40 viewBox. A flat run would divide by zero, so it
 * is drawn along the middle instead.
 */
export function buildGraphShape(readings: GraphInput[]): GraphShape | null {
  if (readings.length < 2) return null

  const temperatures = readings.map((reading) => reading.temperature)
  const min = Math.min(...temperatures)
  const max = Math.max(...temperatures)
  const span = max - min
  const usableHeight = VIEWBOX_HEIGHT - TOP_PADDING - BOTTOM_PADDING

  const points: GraphPoint[] = readings.map((reading, index) => ({
    x:
      SIDE_PADDING +
      (index / (readings.length - 1)) * (VIEWBOX_WIDTH - SIDE_PADDING * 2),
    y:
      span === 0
        ? TOP_PADDING + usableHeight / 2
        : TOP_PADDING +
          usableHeight -
          ((reading.temperature - min) / span) * usableHeight,
    temperature: reading.temperature,
    timestamp: reading.timestamp,
  }))

  const line = smoothPath(points)

  const lastX = points[points.length - 1].x
  const area = `${line} L${round(lastX)} ${VIEWBOX_HEIGHT} L${SIDE_PADDING} ${VIEWBOX_HEIGHT} Z`

  return {
    points,
    line,
    area,
    high: points.reduce((a, b) => (b.temperature > a.temperature ? b : a)),
    low: points.reduce((a, b) => (b.temperature < a.temperature ? b : a)),
    ticks: pickTicks(points),
  }
}

/**
 * Readings arrive on a fixed three-hour grid, so taking every other one gives
 * six-hourly marks on whole clock hours, the way a weather app labels a day.
 */
const TICK_STRIDE = 2

function pickTicks(points: GraphPoint[]): GraphPoint[] {
  return points.filter((_, index) => index % TICK_STRIDE === 0)
}

/**
 * Catmull-Rom through every reading, converted to cubic beziers. Weather moves
 * gradually, so a curve reads truer than straight segments between samples.
 */
function smoothPath(points: GraphPoint[]): string {
  const segments = [`M${round(points[0].x)} ${round(points[0].y)}`]

  for (let i = 0; i < points.length - 1; i++) {
    const previous = points[i - 1] ?? points[i]
    const current = points[i]
    const next = points[i + 1]
    const after = points[i + 2] ?? next

    const cp1x = current.x + (next.x - previous.x) / 6
    const cp1y = current.y + (next.y - previous.y) / 6
    const cp2x = next.x - (after.x - current.x) / 6
    const cp2y = next.y - (after.y - current.y) / 6

    segments.push(
      `C${round(cp1x)} ${round(cp1y)}, ${round(cp2x)} ${round(cp2y)}, ${round(next.x)} ${round(next.y)}`,
    )
  }

  return segments.join(' ')
}

function round(value: number): number {
  return Math.round(value * 100) / 100
}

export const GRAPH_HEIGHT = VIEWBOX_HEIGHT

export const GRAPH_VIEWBOX = `0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`
