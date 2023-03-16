import styles from '../../assets/css/storyResultPage.module.css'
import classNames from 'classnames/bind';
import { RiMusic2Fill } from 'react-icons/ri';
import { TbMusicOff } from 'react-icons/tb';
import { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { atom } from 'recoil'

//음원 출처: https://pixabay.com/ko/music/
import fun from '../../assets/audio/comedian-117016.mp3';
import sad from '../../assets/audio/sad-piano-calm-110613.mp3';
import romance from '../../assets/audio/for-you-141500.mp3';
import thriller from '../../assets/audio/creepy-music-box-halloween-music.mp3';

const style = classNames.bind(styles);

//배경음악 플레이, 일시정지
export const playState = atom<boolean>({ 
  key: 'playState',
  default: false,
});

// prop: genre
export type SoundBtnProps = {
  genre: string,
}

function BGMPlayer({ genre }: SoundBtnProps) {
  // 재생 상태
  const myRef = useRef<HTMLAudioElement>(null);
  const [play, setPlay] = useRecoilState(playState);
  // 오디오 파일
  interface audioFileType {
    [key: string] : string;
  }
  const audioFile : audioFileType = {'재미':fun, '슬픔':sad, '로맨스':romance, '공포':thriller}
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
      <audio ref={myRef} src={audioFile[genre]} loop></audio>
      {play?
      // 일시정지 버튼
      (<button className={style('sound-btn')} onClick={stop}>
        <TbMusicOff className={style('sound-icon')} />
      </button>):
      // 재생 버튼
      (<button className={style('sound-btn')} onClick={start}>
        <RiMusic2Fill className={style('sound-icon')} />
      </button>)
      }
    </>
  );
}

export default BGMPlayer;