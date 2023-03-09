import type {FC} from 'react'
import styles from '../../assets/css/storyResultPage.module.css'
import classNames from 'classnames/bind';
import { GiMusicalNotes } from 'react-icons/gi';
import { MdOutlineMusicOff } from 'react-icons/md';
import { AiFillAudio } from 'react-icons/ai';
import { AiOutlineAudioMuted } from 'react-icons/ai';

const style = classNames.bind(styles);

export type SoundBtnProps = {
  onClick: () => void,
  soundType: string,
  soundState: boolean
}

interface SoundIcons {
	[key: string] : Array<string>;
}

const SoundBtn: FC<SoundBtnProps> = ({ onClick, soundType, soundState }) => {
  // 배경 음악
  if (soundType === 'BGM'){
    return (
      <button className={style('sound-btn')} onClick={onClick}>
      { soundState ? <GiMusicalNotes className={style('sound-icon')}/> : <MdOutlineMusicOff className={style('sound-icon')}/> }
    </button>
    )
  }
  // 음성 오디오
  return (
      <button className={style('sound-btn')} onClick={onClick}>
        { (soundType === 'Audio' && soundState) ? <AiFillAudio className={style('sound-icon')}/> : <AiOutlineAudioMuted className={style('sound-icon')}/> }
      </button>
  )
}
export default SoundBtn
