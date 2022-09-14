import { html } from 'hono/html'

const Header = ({ showCTA }) => html`
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
    <a href="https://screenly.io/apps/weather" target="_blank" class="upgrade-banner ${!showCTA ? 'hidden' : ''}">
      Upgrade to the new app at Screenly.io/apps/weather
    </a>
  </section>
  `

export default Header
