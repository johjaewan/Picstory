import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue, atom } from 'recoil'
import { voiceAtom } from '../../atoms'
import styles from '../../assets/css/storyResultPage.module.css'
import classNames from 'classnames/bind'

//버튼 아이콘
import { TbPlayerPauseFilled } from 'react-icons/tb'
import { TbPlayerPlayFilled } from 'react-icons/tb'

//음성파일 플레이, 일시정지
export const audioState = atom<boolean>({
  key: 'audioState',
  default: false,
})

function AudioPlayer() {
  // 재생 상태
  const myRef = useRef<HTMLAudioElement>(null)
  const [play, setPlay] = useRecoilState(audioState)
  //오디오 파일
  const voice = useRecoilValue(voiceAtom)
  // 재생
  const start = () => {
    if (myRef.current) {
      myRef.current.play()
    }
    setPlay(true)
  }
  // 일시 정지
  const stop = () => {
    if (myRef.current) {
      myRef.current.pause()
    }
    setPlay(false)
  }

  useEffect(() => {
    if (!myRef.current) return
    if (play) {
      myRef.current.play()
    } else myRef.current.pause()
  }, [play])

  return (
    <>
      <audio ref={myRef} src={voice} loop></audio>
      {play ? (
        // 일시정지 버튼
        <button
          disabled={voice ? false : true}
          className={styles.sound_btn}
          onClick={stop}
        >
          <TbPlayerPauseFilled className={styles.sound_icon} />
        </button>
      ) : (
        // 재생 버튼
        <button
          disabled={voice ? false : true}
          className={styles.sound_btn}
          onClick={start}
        >
          <TbPlayerPlayFilled className={styles.sound_icon} />
        </button>
      )}
    </>
  )
}

export default AudioPlayer
