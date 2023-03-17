import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getStory, deleteStory } from '../api/storyApi'
import styles from '../assets/css/storyDetailPage.module.css'
import BGMPlayer from '../components/storyResult/bgm'
import AudioPlayer from '../components/storyResult/audio'
import StoryResult from '../components/storyResult/storyResult'
import { voiceAtom } from '../atoms'
import { useRecoilState } from 'recoil'

export default function StoryDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const [voice, setVoice] = useRecoilState(voiceAtom)
  const navigate = useNavigate()
  const [storyInfo, setStoryInfo] = useState({
    title: '',
    image: '',
    genre: '',
    content_ko: '',
    content_en: '',
    voice: '',
  })

  useEffect(() => {
    getStoryItem()
  }, [])

  const [lang, setLang] = useState(true)

  const getStoryItem = async () => {
    const response = await getStory(id)
    const result = response.data
    setVoice(result.voice)
    console.log(result)

    setStoryInfo((prevState) => {
      return {
        ...prevState,
        title: result.title,
        image: result.image,
        genre: result.genre,
        content_ko: result.content_ko,
        content_en: result.content_en,
        voice: result.voice,
      }
    })
  }

  const transLang = () => {
    setLang((prev) => !prev)
  }
  const text =
    'Lorem ipsum dolor sit amet cconsecteturconsec teturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturconsecteturonsectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?'
  const text2 =
    '안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다 안녕하세요 저는 백소원이고 나이는 스물 다섯입니다 만나서 반갑습니다'

  const clickDelete = async () => {
    const response = await deleteStory(id)
    if (response.status == 200) {
      alert('삭제가 완료되었습니다.')
      navigate('/library')
    }
  }

  return (
    <div className={styles.container}>
      {' '}
      <div className={styles.title}>{storyInfo.title}</div>
      <div className={styles.left_container}>
        <img className={styles.image} src={storyInfo.image}></img>
        <div className={styles.btnBox}>
          <BGMPlayer genre={storyInfo.genre} />
          <AudioPlayer />
          <button className={styles.langBtn} onClick={transLang}>
            {lang ? 'Korean' : '영어'}
          </button>
        </div>
      </div>
      <div className={styles.clear}></div>
      <div className={styles.right_container}>
        {lang ? (
          <div className={styles.story}>{storyInfo.content_en}</div>
        ) : (
          <div className={styles.story}>{storyInfo.content_ko}</div>
        )}
        <button className={styles.deleteBtn} onClick={clickDelete}>
          삭제
        </button>
      </div>
    </div>
  )
}
