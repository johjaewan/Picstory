import styles from '../../assets/css/storyResultPage.module.css'
import classNames from 'classnames/bind';
import { TbPlayerPauseFilled } from 'react-icons/tb';
import { TbPlayerPlayFilled } from 'react-icons/tb';
import { useEffect, useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { audioState, storyResultAtom } from '../../atoms';

const style = classNames.bind(styles);

// prop: genre
export type SoundBtnProps = {
  lang: boolean,
}

function AudioPlayer({ lang }: SoundBtnProps) {
  // 재생 상태
  const myRef = useRef<HTMLAudioElement>(null);
  const [play, setPlay] = useRecoilState(audioState);
  //오디오 파일
  const storyResult  = useRecoilValue(storyResultAtom);
  const voice_kr = storyResult.voice_kr
  const voice_en = storyResult.voice_en
  // 오디오 파일
  const audioFile: string = lang? voice_kr : voice_en
  // 재생
  const start = () => {
    if (myRef.current){
      myRef.current.play()
    }
    setPlay(true);
  };
  // 일시 정지
  const stop = () => {
    if (myRef.current){
      myRef.current.pause()
    }
    setPlay(false);
  };

  useEffect(() => {
    if (!myRef.current) return;
    if (play) {
      myRef.current.play();
    } else myRef.current.pause();
  }, [play]);

  return (
    <>
      <audio ref={myRef} src={audioFile} loop></audio>
      {play?
      // 일시정지 버튼
      (<button className={style('sound-btn')} onClick={stop}>
        <TbPlayerPauseFilled className={style('sound-icon')} />
      </button>):
      // 재생 버튼
      (<button className={style('sound-btn')} onClick={start}>
        <TbPlayerPlayFilled className={style('sound-icon')} />
      </button>)
      }
    </>
  );
}

export default AudioPlayer;