import React from 'react'
import logo from './logo.svg'
import './App.css'
import StoryResultPage from '../src/pages/storyResultPage'
function App() {
  const text = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum quod et sunt. Dolores, repudiandae modi. Pariatur facilis natus impedit totam cumque voluptates cupiditate quos odio similique. Dolore dolorum nobis ullam."
  const src = "https://dimg.donga.com/ugc/CDB/WEEKLY/Article/5b/b3/22/85/5bb32285000ed2738de6.jpg"
  return (
    <div className="App">
      <header className="App-header">
        <StoryResultPage src={src} text={text}/>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
