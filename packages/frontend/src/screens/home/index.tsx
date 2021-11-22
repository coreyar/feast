import Strings from '../../localization/strings'
import { Menu } from '../../components'

const App = (): JSX.Element => (
  <div className="app">
    <div className="menu">
      <div className="header">
        <h1>{Strings.event}</h1>
        <h4>{Strings.description}</h4>
      </div>
      <Menu />
      <div className="footer">
        <h4>{Strings.address}</h4>
        <h5>{Strings.city}</h5>
      </div>
    </div>
  </div>
)
export default App
