import { jsx } from 'hono/jsx'
import Layout from './Layout'
import Header from './Header'
import Footer from './Footer'
import { sentryIds } from '../constants'

const App = (props) => {
  const { env, lat, lng } = props
  const sentryId = sentryIds[env]
  return (
    <Layout sentryId={sentryId}>
      <div class='content'>
        <Header />
        <Footer />
      </div>
      <div class="watermark">
        <img src="/static/images/watermark.png" />
      </div>
      <span id='location-data' data-location-lat={lat} data-location-lng={lng} />
    </Layout>
  )
}

export default App
