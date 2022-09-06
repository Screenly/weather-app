import { Hono } from 'hono'
import { defaultLocation } from '../constants'

const weather = new Hono()

weather.get('/', async (c) => {
  try {
    const { lat = defaultLocation.lat, lng = defaultLocation.lng } = c.req.query()
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&cnt=10&appid=${c.env.OPEN_WEATHER_API_KEY}`
    //`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=001085696589b9680f971c7d40e8e1f3`
    const resp = await fetch(apiUrl)
    const json = await resp.json()

    return c.json(json)
  } catch (e) {
    // To do - Handle error
    console.log(e);
    return c.json({
      error: true
    })
  }
  
})

export default weather
