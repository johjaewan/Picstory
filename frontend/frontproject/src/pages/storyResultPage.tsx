import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  modalState,
  genreAtom,
  language,
  storyEn,
  storyKo,
  voiceAtom,
} from '../atoms'
import classNames from 'classnames/bind'
import styles from '../assets/css/storyResultPage.module.css'
import TypeIt from 'typeit-react'
import StoryResult from '../components/storyResult/storyResult'
import ResultImg from '../components/storyResult/storyImg'
import Modal from '../components/storyResult/modal'
import BGMPlayer from '../components/storyResult/bgm'
import AudioPlayer from '../components/storyResult/audio'
import WordSearch from '../components/storyResult/wordSearch'

export default function StoryResultPage() {
  // 모달
  const setModalOpen = useSetRecoilState(modalState)
  const handleRegister = () => {
    setModalOpen(true)
  }

  // 배경음악 장르 설정
  const genre = useRecoilValue(genreAtom)

  //언어설정
  const [lang, setLang] = useRecoilState(language)
  const storyResultEn = useRecoilValue(storyEn)
  const storyResultKo = useRecoilValue(storyKo)
  // 처음에만(cnt==0) typeIt 적용
  const [cnt, setCnt] = useState(0)

  const transLang = () => {
    setLang((prev) => !prev)
    setCnt(cnt + 1)
  }

  // 음성 파일
  const voice = useRecoilValue(voiceAtom)

  return (
    <div className={styles.container}>
      <div className={styles.container1}>
        <div className={styles.story_img_container}>
          {/* 이미지 */}
          <ResultImg />
          {/* 설정 버튼 */}
          <div className={styles.story_result_btns}>
            {/* 배경음악 */}
            <BGMPlayer genre={genre} />
            {/* 음성파일 */}
            <AudioPlayer />
            {/* 언어설정 */}
            <button
              disabled={storyResultKo ? false : true}
              className={styles.story_result_button}
              onClick={transLang}
            >
              {lang ? 'Korean' : '영어'}
            </button>
            {/* 저장 모달 */}
            <button
              disabled={storyResultKo && voice ? false : true} // 이게 진짜
              // disabled={storyResultKo ? false : true} // 테스트코드
              className={styles.story_result_button}
              onClick={handleRegister}
            >
              저장
            </button>
            <Modal />
          </div>
        </div>

        <button className={(styles.story_result_button, styles.redo_button)}>
          <Link to="/storyCreatePage">다시만들기</Link>
        </button>
      </div>
      <div className={styles.container2}>
        {/* 이야기 결과 */}
        <div className={styles.content}>
          {/* {cnt === 0 ? (
            <TypeIt
              options={{
                speed: 30,
                waitUntilVisible: true,
              }}
            >
              {storyResultEn}
            </TypeIt>
          ) : ( */}
          <StoryResult />
          {/* )} */}
        </div>
      </div>
      <div className={styles.container3}>
        <WordSearch></WordSearch>
      </div>
    </div>
  )
}
