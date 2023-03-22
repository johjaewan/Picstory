import ImageUpload from '../components/storyCreate/ImageUpload'
import GenreList from '../components/storyCreate/genreList'
import styles from '../assets/css/storyCreatePageStyle.module.css'
export default function storyCreatePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <ImageUpload></ImageUpload>
      <GenreList></GenreList>
    </div>
  )
}
