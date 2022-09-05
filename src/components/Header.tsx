import { html } from 'hono/html'

const Header = () => html`
  <section class="header">
    <span class="header-item">
      <img src="/static/images/icons/map-pin.svg" />
      <span id="city"></span>
    </span>

    <span class="header-item">
      <img src="/static/images/icons/clock.svg" />
      <span id="time"></span>
    </span>

    <span class="header-item">
      <img src="/static/images/icons/calendar.svg" />
      <span id="date"></span>
    </span>
  </section>
  `

export default Header

