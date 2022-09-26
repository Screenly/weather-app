import { html } from 'hono/html'

const Header = () => html`
  <section class="header">
    <div class="location">
      <span class="location-item">
        <img src="/static/images/icons/map-pin.svg" />
        <span id="city"></span>
      </span>

      <span class="location-item">
        <img src="/static/images/icons/clock.svg" />
        <span id="time"></span>
      </span>

      <span class="location-item">
        <img src="/static/images/icons/calendar.svg" />
        <span id="date"></span>
      </span>
    </div>
    <a href="https://screenly.io" target="_blank" class="upgrade-banner">
      For a simple and secure display solution, visit Screenly.io
    </a>
  </section>
  `

export default Header
