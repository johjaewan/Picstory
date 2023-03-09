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

// const soundIcons : SoundIcons = {
//   BGM: ["https://img.icons8.com/material-outlined/96/null/musical-notes.png","https://img.icons8.com/material/96/null/music--v1.png"],
//   Audio: ["https://img.icons8.com/material-outlined/96/null/mute.png","https://img.icons8.com/material-outlined/96/null/speaker.png"],
// };

const SoundBtn: FC<SoundBtnProps> = ({ onClick, soundType, soundState }) => {
  if (soundType === 'BGM'){
    return (
      <button className={style('sound-btn')} onClick={onClick}>
      { soundState ? <GiMusicalNotes className={style('sound-icon')}/> : <MdOutlineMusicOff className={style('sound-icon')}/> }
    </button>
    )
  }
  return (
      <button className={style('sound-btn')} onClick={onClick}>
        { (soundType === 'Audio' && soundState) ? <AiFillAudio className={style('sound-icon')}/> : <AiOutlineAudioMuted className={style('sound-icon')}/> }
      </button>
  )
}
export default SoundBtn
