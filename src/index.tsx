import { Hono } from 'hono'
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

app.get('/', (c) => {
  const lat = c.req.header(locationHeaders.lat) || c.req.query(locationQueryParams.lat) || defaultLocation.lat
  const lng = c.req.header(locationHeaders.lng) || c.req.query(locationQueryParams.lng) || defaultLocation.lng

  const coordinates = trimCoordinates({ lat, lng })
  return c.html(<App {...coordinates} />)
})

app.route('/api/weather', weather)

export default app
