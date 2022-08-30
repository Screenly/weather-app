import { html } from 'hono/html'

const Header = () => html`
  <section class="header">
    <span id="city" class="header-item"></span>
    <span id="time" class="header-item"></span>
    <span id="date" class="header-item"></span>
  </section>
  `

export default Header

