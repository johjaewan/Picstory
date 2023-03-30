import { BrowserRouter } from 'react-router-dom'
import RoutesSetup from './routes/RoutesSetup'
import Menu from './components/main/menu'
import './assets/css/font-family.css'
import './App.css'

import { RecoilRoot } from 'recoil'

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Menu></Menu>
        <RoutesSetup></RoutesSetup>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
