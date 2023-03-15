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
    'Lorem ipsum dolor sit amet cconsecteturconsec teturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturonsectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?'
  const text2 =
    '안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다'
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
          <AudioPlayer/>
          <button className={styles.langBtn} onClick={transLang}>
            {lang ? 'Korean' : '영어'}
          </button>
        </div>
      </div>
      <div className={styles.clear}></div>
      <div className={styles.right_container}>
        {lang ? (
          <div className={styles.story}>{text2}</div>
        ) : (
          <div className={styles.story}>{text2}</div>
        )}
      </div>
    </div>
  )
}
