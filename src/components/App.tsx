import { jsx } from 'hono/jsx'
import Layout from './Layout'
import Header from './Header'
import Footer from './Footer'

const App = (props: { lat: string, lng: string }) => (
  <Layout>
    <div class="content">
      <Header />
      <Footer />
    </div>
    <span id="location-data" data-location-lat={props.lat} data-location-lng={props.lng} />
  </Layout>
)

export default App
