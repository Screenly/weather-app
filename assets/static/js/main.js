(function () {
  let clockTimer
  let weatherTimer
  let refreshTimer
  let tz
  let currentWeatherId
  let tempScale = 'C'
  const timeFormat = (function () {
    const locale = navigator?.language || 'en-US'
    return Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hourCycle || 'h12'
  })()

  const imagesPath = '/static/images'
  const iconsPath = `${imagesPath}/icons`
  const bgPath = `${imagesPath}/bg`

  /**
   * Countries using F scale
   * United States
   * Bahamas.
   * Cayman Islands.
   * Liberia.
   * Palau.
   * The Federated States of Micronesia.
   * Marshall Islands.
   */

  const countriesUsingFahrenheit = ['US', 'BS', 'KY', 'LR', 'PW', 'FM', 'MH']
  const celsiusToFahrenheit = (temp) => ((1.8 * temp) + 32)

  const getTemp = (temp) => Math.round(tempScale === 'C' ? temp : celsiusToFahrenheit(temp))
  /**
   * Utility Functions
   */
  const generateAnalyticsEvent = (name, payload) => {
    typeof gtag !== 'undefined' && gtag('event', name, payload) // eslint-disable-line no-undef
  }

  const getDayString = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[day]
  }

  const getMonthString = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return months[month].slice(0, 3)
  }

  const getTimeByOffset = (offsetinSecs, dt) => {
    const now = dt ? new Date(dt * 1000) : new Date()
    const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000)
    return new Date(utc + (offsetinSecs * 1000))
  }

  const checkIfNight = (dt) => {
    const dateTime = getTimeByOffset(tz, dt)
    const hrs = dateTime.getHours()

    return hrs <= 5 || hrs >= 20
  }

  const updateContent = (id, text) => {
    document.querySelector(`#${id}`).innerText = text
  }

  const updateAttribute = (id, attr, val) => document.querySelector(`#${id}`).setAttribute(attr, val)

  const loadImage = (img = 'default') => {
    const lowResImgSrc = `${bgPath}/${img}-min.jpg`
    const highResImgSrc = `${bgPath}/${img}.jpg`

    const lowResImage = new Image()
    const highResImage = new Image()

    lowResImage.addEventListener('load', () => {
      document.body.style.backgroundImage = `url(${lowResImgSrc})`
    })

    highResImage.addEventListener('load', () => {
      document.body.style.backgroundImage = `url(${highResImgSrc})`
    })

    lowResImage.src = lowResImgSrc
    highResImage.src = highResImgSrc
  }

  const checkIfInRange = (ranges, code) => ranges.reduce((acc, range) => acc || (code >= range[0] && code <= range[1]))

  const getWeatherImagesById = (id = 800, dt) => {
    // List of codes - https://openweathermap.org/weather-conditions
    // To do - Refactor
    const isNight = checkIfNight(dt)
    const hasNightBg = checkIfInRange([[200, 399], [500, 699], [800, 804]], id)
    let icon
    let bg

    if (id >= 200 && id <= 299) {
      icon = 'thunderstorm'
      bg = 'thunderstorm'
    }

    if (id >= 300 && id <= 399) {
      icon = 'drizzle'
      bg = 'drizzle'
    }

    if (id >= 500 && id <= 599) {
      icon = 'rain'
      bg = 'rain'
    }

    if (id >= 600 && id <= 699) {
      icon = 'snow'
      bg = 'snow'
    }

    if (id >= 700 && id <= 799) {
      // To do - Handle all 7xx cases
      icon = 'haze'

      if (id === 701 || id === 721 || id === 741) {
        bg = 'haze'
      } else if (id === 711) {
        bg = 'smoke'
      } else if (id === 731 || id === 751 || id === 761) {
        bg = 'sand'
      } else if (id === 762) {
        bg = 'volcanic-ash'
      } else if (id === 771) {
        // To do - change image squall
        bg = 'volcanic-ash'
      } else if (id === 781) {
        bg = 'tornado'
      }
    }

    if (id === 800) {
      icon = 'clear'
      bg = 'clear'
    }

    if (id === 801) {
      icon = 'partially-cloudy'
      bg = 'cloudy'
    }

    if (id >= 802 && id <= 804) {
      icon = 'mostly-cloudy'
      bg = 'cloudy'
    }

    return {
      icon: isNight ? `${icon}-night` : icon,
      bg: isNight && hasNightBg ? `${bg}-night` : bg
    }
  }

  /**
   * Update Local Time and Date
   */

  const convert24to12format = (hrs) => hrs > 12 ? hrs - 12 : hrs

  const padTime = (time) => String(time).padStart(2, '0')

  const formatTimeByLocale = (hrs, mins) => {
    const is12HrFormat = timeFormat === 'h11' || timeFormat === 'h12'
    const AmOrPm = hrs < 12 ? 'AM' : 'PM'
    let fmtHrs = hrs

    if (is12HrFormat) {
      fmtHrs = convert24to12format(hrs)
    }

    const timeString = `${padTime(fmtHrs)}:${padTime(mins)}`
    return is12HrFormat ? `${timeString} ${AmOrPm}` : timeString
  }

  const formatTime = (dateObj) => formatTimeByLocale(dateObj.getHours(), dateObj.getMinutes())

  const formatDate = (dateObj) => {
    const date = String(dateObj.getDate()).padStart(2, '0')
    const month = getMonthString(dateObj.getMonth())
    const day = window.innerWidth >= 480 ? getDayString(dateObj.getDay()) : getDayString(dateObj.getDay()).substring(0, 3)

    return `${day}, ${month} ${date}`
  }

  const initDateTime = (tzOffset) => {
    tz = tzOffset
    clearTimeout(clockTimer)
    const today = getTimeByOffset(tzOffset)

    updateContent('time', formatTime(today))
    updateContent('date', formatDate(today))

    clockTimer = setTimeout(() => initDateTime(tzOffset), 30000)
  }

  const getLocation = () => {
    const locationEl = document.querySelector('#location-data')
    const lat = locationEl.getAttribute('data-location-lat')
    const lng = locationEl.getAttribute('data-location-lng')

    return {
      lat,
      lng
    }
  }

  const updateLocation = (name) => {
    updateContent('city', name)
  }

  const updateCurrentWeather = (icon, desc, temp) => {
    updateAttribute('current-weather-icon', 'src', `${iconsPath}/${icon}.svg`)
    updateContent('current-weather-status', desc)
    updateContent('current-temp', getTemp(temp))
    updateContent('current-temp-scale', `°${tempScale}`)
  }

  const findCurrentWeatherItem = (list) => {
    const currentUTC = Math.round(new Date().getTime() / 1000)
    let itemIndex = 0

    while (itemIndex < list.length - 1 && list[itemIndex].dt < currentUTC) {
      itemIndex++
    }

    return itemIndex
  }

  const updateWeather = (list) => {
    clearTimeout(weatherTimer)
    const currentIndex = findCurrentWeatherItem(list)

    const { dt, weather, main: { temp } } = list[currentIndex]

    if (Array.isArray(weather) && weather.length > 0) {
      const { id, description } = weather[0]
      const { icon, bg } = getWeatherImagesById(id, dt)
      if (id !== currentWeatherId) {
        loadImage(bg)
      }

      updateCurrentWeather(icon, description, temp)
      currentWeatherId = id
    }

    const weatherListContainer = document.querySelector('#weather-item-list')
    const frag = document.createDocumentFragment()
    list.slice(currentIndex, currentIndex + 5).forEach((item) => {
      const { dt, main: { temp }, weather } = item

      const { icon } = getWeatherImagesById(weather[0]?.id, dt)
      const dateTime = getTimeByOffset(tz, dt)

      const dummyNode = document.querySelector('.dummy-node')
      const node = dummyNode.cloneNode(true)
      node.classList.remove('dummy-node')
      node.querySelector('.item-temp').innerText = getTemp(temp)
      node.querySelector('.item-icon').setAttribute('src', `${iconsPath}/${icon}.svg`)
      node.querySelector('.item-time').innerText = formatTime(dateTime)

      frag.appendChild(node)
    })

    weatherListContainer.innerHTML = ''
    weatherListContainer.appendChild(frag)
    // Refresh weather from local list every 15 mins
    weatherTimer = setTimeout(() => updateWeather(list), 15 * 60 * 1000)
  }

  const updateData = (data) => {
    const { city: { name, country, timezone }, list } = data
    tempScale = countriesUsingFahrenheit.includes(country) ? 'F' : 'C'
    updateLocation(name)
    initDateTime(timezone)
    updateWeather(list)
  }

  /**
   * Fetch weather
   */

  const fetchWeather = async () => {
    clearTimeout(refreshTimer)
    try {
      const { lat, lng } = getLocation()
      const response = await fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      const isCacheHit = response.headers.get('cf-cache-status') === 'HIT'
      const data = await response.json()
      updateData(data)
      generateAnalyticsEvent('cache_status', {
        app_name: 'Screenly Weather App',
        cached: isCacheHit,
        lat,
        lng
      })
    } catch (e) {
      console.log(e)
    }
  }

  const init = () => {
    fetchWeather()
    // Refresh weather from server every 2 hours
    refreshTimer = setTimeout(fetchWeather, 120 * 60 * 1000)
  }

  init()
})()
