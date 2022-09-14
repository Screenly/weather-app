import { jsx } from 'hono/jsx'
import Layout from './Layout'
import Header from './Header'
import Footer from './Footer'

const App = (props) => (
  <Layout>
    <div class='content'>
      <Header showCTA={props.showCTA} />
      <Footer />
    </div>
    <span id='location-data' data-location-lat={props.lat} data-location-lng={props.lng} />
  </Layout>
)

export default App
