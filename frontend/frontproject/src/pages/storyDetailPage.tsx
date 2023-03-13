import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getStory } from '../api/storyApi'
import styles from '../assets/css/storyResultPage.module.css'
import BGMPlayer from '../components/storyResult/bgm'

export default function StoryDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  useEffect(() => {
    getStoryItem()
  }, [])

  const storyInfo = {
    title: '',
    genre: '',
  }

  const getStoryItem = async () => {
    const response = await getStory(id)
    storyInfo.title = response.title
    storyInfo.genre = response.genre
  }

  return (
    <div className="story-result-container">
      <div className={styles['story-img-container']}>
        <img src="https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_960_720.jpg"></img>
        <div className={styles['story-result-btns']}>
          {/* 배경음악 */}
          <BGMPlayer genre={storyInfo.genre} />
          {/* 음성파일 */}
          {/* <AudioPlayer lang={lang} /> */}
          {/* 언어설정 */}
          {/* <button className={style('story-result-button')} onClick={transLang}> */}
          {/* {lang ? 'Korean' : '영어'} */}
          {/* </button> */}
          {/* 저장 모달 */}
          <button
          // className={style('story-result-button')}
          // onClick={onClickToggleModal}
          // onClick={handleRegister}
          >
            저장
          </button>
          {/* <Modal /> */}
        </div>
      </div>
      {/* 이야기 결과 */}
      {/* <StoryResult language={lang}/> */}
      {/* <p className={style('story-result-text')}>{text}</p> */}
    </div>
  )
}
