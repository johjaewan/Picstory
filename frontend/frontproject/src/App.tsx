import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import RoutesSetup from './routes/RoutesSetup'
import './App.css'

function App() {
  return (
    <div>
      <BrowserRouter>
        <RoutesSetup />
      </BrowserRouter>
    </div>
  )
}

export default App
