(function () {
  let clockTimer
  let weatherTimer
  let refreshTimer
  let tz

  const assetsPath = '/static'
  const imagesPath = `${assetsPath}/images`
  const iconsPath = `${assetsPath}/images/icons`
  /**
   * Utility Functions
   */
  const getDayString = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[day]
  }

  const getMonthString = (month) => {
    const months = ['Jan', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

  const loadImage = (img) => {
    const src = `${imagesPath}/${img}`
    const image = new Image()
    image.addEventListener('load', () => {
      document.body.style.backgroundImage = `url(${src})`
    })
    image.src = src
  }

  const getBackgroundByWeatherId = (id) => {
    loadImage('bg-nt-clear.jpg')
  }

  const getWeatherIconById = (id = 800, dt) => {
    // List of codes - https://openweathermap.org/weather-conditions
    const isNight = checkIfNight(dt)

    if (id >= 200 && id <= 299) {
      return !isNight ? 'tstorms' : 'nt_storm'
    }

    if (id >= 300 && id <= 399) {
      return 'chancerain'
    }

    if (id >= 500 && id <= 599) {
      return !isNight ? 'rain' : 'nt_rain'
    }

    if (id >= 600 && id <= 699) {
      return 'chancesnow'
    }

    if (id >= 700 && id <= 799) {
      return 'hazy'
    }

    if (id === 800) {
      return !isNight ? 'clear' : 'nt_clear'
    }

    if (id === 801) {
      return !isNight ? 'mostlysunny' : 'nt_partlycloudy'
    }

    if (id >= 802 && id <= 804) {
      return !isNight ? 'mostlycloudy' : 'nt_mostlycloudy'
    }
  }

  /**
   * Update Local Time and Date
   */
  const formatTime = (dateObj) => {
    const hours = String(dateObj.getHours()).padStart(2, '0')
    const mins = String(dateObj.getMinutes()).padStart(2, '0')

    return `${hours}:${mins}`
  }

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

  const updateCurrentWeather = (dt, weatherId, desc, temp) => {
    const icon = getWeatherIconById(weatherId, dt)
    updateAttribute('current-weather-icon', 'src', `${iconsPath}/${icon}.svg`)
    updateContent('current-weather-status', desc)
    updateContent('current-temp', Math.round(temp))
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
      updateCurrentWeather(dt, id, description, temp)
    }

    const weatherListContainer = document.querySelector('#weather-item-list')
    const frag = document.createDocumentFragment()
    list.slice(currentIndex, currentIndex + 5).forEach((item) => {
      const { dt, main: { temp }, weather } = item

      const icon = getWeatherIconById(weather[0]?.id, dt)
      const dateTime = getTimeByOffset(tz, dt)

      const dummyNode = document.querySelector('.dummy-node')
      const node = dummyNode.cloneNode(true)
      node.classList.remove('dummy-node')
      node.querySelector('.item-temp').innerText = Math.round(temp)
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
    const { city: { name, timezone }, list } = data

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
      const data = await response.json()
      updateData(data)
    } catch (e) {
      console.log('--------e---', e)
    }
  }

  const init = () => {
    fetchWeather()
    // Refresh weather from server every 2 hours
    refreshTimer = setTimeout(fetchWeather, 120 * 60 * 1000)
  }

  init()
  loadImage('bg-nt-clear.jpg')
})()
