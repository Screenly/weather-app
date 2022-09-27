import { Hono } from 'hono'
import { cache } from 'hono/cache'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/serve-static.module'
import { jsx } from 'hono/jsx'
import App from './components/App'
import weather from './routes/weather'
import { locationHeaders, locationQueryParams, defaultLocation } from './constants'
import { trimCoordinates } from './utils'

const app = new Hono()

app.use('*', logger())
app.use('/static/*', serveStatic({ root: './' }))

app.get('/', async (c) => {
  const qLat = c.req.query(locationQueryParams.lat)
  const qLng = c.req.query(locationQueryParams.lng)

  if (!(qLat || qLng)) {
    const lat = c.req.header(locationHeaders.lat) || defaultLocation.lat
    const lng = c.req.header(locationHeaders.lng) || defaultLocation.lng
    const coordinates = trimCoordinates({ lat, lng })

    return new Response(null, {
      status: 301,
      headers: {
        Location: `${c.req.url}?lat=${coordinates.lat}&lng=${coordinates.lng}`
      },
    })
  } else {
    const cache = caches.default
    const key = c.req
    let response = await cache.match(key)

    if (!response) {
      const coordinates = trimCoordinates({ lat: qLat, lng: qLng })
      const env = c.env.ENV
      response = new Response(<App {...coordinates} env={env} />, {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=43200',
          'Content-Type': 'text/html; charset=UTF-8'
        }
      })

      c.executionCtx.waitUntil(cache.put(key, response.clone()))
    }

    return response
  }
})

app.get('/api/weather/*', cache({ cacheName: 'default', cacheControl: 's-maxage=10800' }))
app.route('/api/weather', weather)

export default app
