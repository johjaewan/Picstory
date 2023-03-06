import type {FC} from 'react'
import SoundBtn from '../components/main/soundBtn'
import { useState } from "react";


export type StoryResultPageProps = {
  src : string,
  text : string,
}

const StoryResultPage: FC<StoryResultPageProps> = props => {
  const [isOnBGM, setOnBGM] = useState(false);
  const [isOnAudio, setOnAudio] = useState(false);

  const clickedBGM = () => {
    setOnBGM((prev) => !prev);
  };

  const clickedAudio = () => {
    setOnAudio((prev) => !prev);
  };

  const {src, text} = props

  return (
    <div>
      <p>storyResultPage</p>
      <img src={src} alt="testimg" />
      <p>{text}</p>
      <SoundBtn onClick={clickedBGM} soundType='BGM' soundState={isOnBGM} />
      <SoundBtn onClick={clickedAudio} soundType='Audio' soundState={isOnAudio} />
      <button>저장</button>
    </div>
  )
}

export default StoryResultPage
