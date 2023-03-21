import { Routes, Route } from 'react-router-dom'
import Main from '../components/main/main'
import StoryCreatePage from '../pages/storyCreatePage'
import StoryResultPage from '../pages/storyResultPage'
import StoryDetailPage from '../pages/storyDetailPage'
import LibraryPage from '../pages/LibraryPage'
import Loading from '../components/storyCreate/loading'
import NotFound from '../pages/NotFound'
import Layout from '../components/main/Layout'

export default function RoutesSetup() {
  return (
    <Routes>
      <Route element={<Layout  />}>
        <Route path="/" element={<Main />}/>
        <Route path="/storyCreatePage" element={<StoryCreatePage />}/>
        <Route path="/storyResult" element={<StoryResultPage />}/>
        <Route path="/library" element={<LibraryPage />}/>
        <Route path="/storyDetail/:id" element={<StoryDetailPage />}/>
        <Route path="/Loading" element={<Loading />}/>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
