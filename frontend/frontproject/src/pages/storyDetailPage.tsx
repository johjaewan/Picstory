import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getStory } from '../api/storyApi'
import styles from '../assets/css/storyDetailPage.module.css'
import BGMPlayer from '../components/storyResult/bgm'
import AudioPlayer from '../components/storyResult/audio'
import StoryResult from '../components/storyResult/storyResult'

export default function StoryDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  useEffect(() => {
    getStoryItem()
  }, [])

  const storyInfo = {
    title: '제목',
    image: null,
    genre: '',
    content_kr: '',
    content_en: '',
    voice_kr: '',
    voice_en: '',
  }
  const [lang, setLang] = useState(true)

  const getStoryItem = async () => {
    // const response = await getStory(id)
    // storyInfo.title = response.title
    // storyInfo.genre = response.genre
  }
  const transLang = () => {
    setLang((prev) => !prev)
  }
  const text =
    'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?'
  const text2 =
    '한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어한국어'
  return (
    <div className={styles.container}>
      <div className={styles.left_container}>
        <div className={styles.title}>{storyInfo.title}</div>
        <img
          className={styles.image}
          src="https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_960_720.jpg"
        ></img>
        <div className={styles.btnBox}>
          <BGMPlayer genre={storyInfo.genre} />
          <AudioPlayer lang={lang} />
          <button className={styles.langBtn} onClick={transLang}>
            {lang ? 'Korean' : '영어'}
          </button>
        </div>
      </div>
      <div className={styles.right_container}>
        {lang ? (
          <div className={styles.story}>{text}</div>
        ) : (
          <div className={styles.story}>{text2}</div>
        )}
      </div>
    </div>
  )
}
