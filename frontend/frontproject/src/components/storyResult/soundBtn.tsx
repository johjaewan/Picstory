import type {FC} from 'react'
import '../../assets/css/storyResultPage.css'

export type SoundBtnProps = {
  onClick: () => void,
  soundType: string,
  soundState: boolean
}

interface SoundIcons {
	[key: string] : Array<string>;
}

const soundIcons : SoundIcons = {
  BGM: ["https://img.icons8.com/material-outlined/96/null/musical-notes.png","https://img.icons8.com/material/96/null/music--v1.png"],
  Audio: ["https://img.icons8.com/material-outlined/96/null/mute.png","https://img.icons8.com/material-outlined/96/null/speaker.png"],
};

const SoundBtn: FC<SoundBtnProps> = ({ onClick, soundType, soundState }) => {
  
  const src = soundIcons[soundType][soundState ? 1 : 0];
  return (
      <button className="sound-btn" onClick={onClick}>
        <img className="sound-icon" src={src} alt={soundType} />
      </button>
  )
}

export default SoundBtn
