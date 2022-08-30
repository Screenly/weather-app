import { html } from 'hono/html'

const Layout = (props) => html`<!DOCTYPE html>
  <html>
    <head>
      <title>Screenly Weather App - Weather Forecast</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preload" href="/static/fonts/Barlow-Regular.woff" as="font" />
      <link rel="stylesheet" href="/static/styles/main.css" />
      <script src="/static/js/main.js" async defer></script>
    </head>
    <body>
      ${props.children}
    </body>
  </html>`

export default Layout