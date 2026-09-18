import { GRAPH_HEIGHT, type GraphShape } from './graph'

const SVG_NS = 'http://www.w3.org/2000/svg'

function svgEl<K extends keyof SVGElementTagNameMap>(
  name: K,
  attributes: Record<string, string>,
): SVGElementTagNameMap[K] {
  const element = document.createElementNS(SVG_NS, name)
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value),
  )
  return element
}

function buildFill(): SVGDefsElement {
  const gradient = svgEl('linearGradient', {
    id: 'trend-fill',
    x1: '0',
    y1: '0',
    x2: '0',
    y2: '1',
  })
  gradient.append(
    svgEl('stop', {
      offset: '0',
      'stop-color': 'currentColor',
      'stop-opacity': '0.2',
    }),
    svgEl('stop', {
      offset: '1',
      'stop-color': 'currentColor',
      'stop-opacity': '0',
    }),
  )

  const defs = svgEl('defs', {})
  defs.append(gradient)
  return defs
}

function buildTicks(
  shape: GraphShape,
  formatHour: (timestamp: number) => string,
): SVGTextElement[] {
  return shape.ticks.map((tick, index) => {
    const anchor =
      index === 0
        ? 'start'
        : index === shape.ticks.length - 1
          ? 'end'
          : 'middle'
    const label = svgEl('text', {
      x: String(tick.x),
      y: String(GRAPH_HEIGHT - 0.5),
      class: 'trend-tick',
      'text-anchor': anchor,
    })
    label.textContent = formatHour(tick.timestamp)
    return label
  })
}

/**
 * Paints the temperature curve: the filled area, the line itself, a dotted rule
 * at the present moment, dots on the day's extremes and the clock marks.
 */
export function drawTrend(
  chart: SVGSVGElement,
  shape: GraphShape,
  formatHour: (timestamp: number) => string,
): void {
  const area = svgEl('path', { d: shape.area, fill: 'url(#trend-fill)' })
  const line = svgEl('path', {
    d: shape.line,
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '0.9',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  })

  const now = shape.points[0]
  const nowRule = svgEl('line', {
    x1: String(now.x),
    y1: '2',
    x2: String(now.x),
    y2: String(GRAPH_HEIGHT - 5),
    class: 'trend-now',
  })

  const dots = (
    [
      [shape.high, 'high'],
      [shape.low, 'low'],
    ] as const
  ).map(([point, name]) =>
    svgEl('circle', {
      cx: String(point.x),
      cy: String(point.y),
      r: '1.2',
      class: `trend-dot trend-dot-${name}`,
    }),
  )

  chart.replaceChildren(
    buildFill(),
    area,
    line,
    nowRule,
    ...dots,
    ...buildTicks(shape, formatHour),
  )
}
