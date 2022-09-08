import { html } from 'hono/html'

const Footer = () => html`
  <section class="footer">
    <div class="current-weather">
      <div class="weather-condition">
        <img id="current-weather-icon"></img>
        <span id="current-weather-status"></span>
      </div>
      <div class="temperature">
        <span id="current-temp"></span><sup>°</sup>
      </div>
    </div>
    <div id="weather-item-list">
    </div>
    <div class="weather-item dummy-node">
      <span class="item-temp-degree">
        <span class="item-temp"></span><sup>°</sup>
      </span>
      <img src="" class="item-icon"></img>
      <span class="item-time"></span>
    </div>
  </section>
  `

export default Footer
