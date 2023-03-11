import { Routes, Route } from 'react-router-dom'
import Main from '../components/main/main'
import StoryCreatePage from '../pages/storyCreatePage'
import StoryResultPage from '../pages/storyResultPage'
import LibraryPage from '../pages/LibraryPage'
import Loading from '../components/storyCreate/loading'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/storyCreatePage" element={<StoryCreatePage />}></Route>
      <Route path="/storyResult" element={<StoryResultPage />}></Route>
      <Route path="/library" element={<LibraryPage />}></Route>
      <Route path="/Loading" element={<Loading />}></Route>
    </Routes>
  ) 
}
