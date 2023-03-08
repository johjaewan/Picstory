import { Routes, Route } from 'react-router-dom'
import Main from '../components/main/Main'
import StoryCreatePage from '../pages/storyCreatePage'
export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/storyCreatePage" element={<StoryCreatePage />}></Route>
    </Routes>
  )
}
