import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RoutesSetup from './routes/RoutesSetup'
import './App.css'

import { RecoilRoot } from 'recoil'

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <RoutesSetup />
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
