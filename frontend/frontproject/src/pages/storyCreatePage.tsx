import ImageUpload from '../components/storyCreate/ImageUpload'
import GenreList from '../components/storyCreate/genreList'
import '../assets/css/storyCreatePageStyle.css'
export default function storyCreatePage() {
  return (
    <div className="container">
      <ImageUpload></ImageUpload>
      <GenreList></GenreList>
    </div>
  )
}
