import SoundBtn from '../components/storyResult/soundBtn'
import '../assets/css/storyResultPage.css'

import { useState } from "react";

export default function StoryResultPage() {
  const [isOnBGM, setOnBGM] = useState(false);
  const [isOnAudio, setOnAudio] = useState(false);

  const clickedBGM = () => {
    setOnBGM((prev) => !prev);
  };

  const clickedAudio = () => {
    setOnAudio((prev) => !prev);
  };

  const src = "https://src.hidoc.co.kr/image/lib/2022/5/12/1652337370806_0.jpg"
  const text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?" 
  return (
    <div className='story-result-container'>
      <div className='story-img-container'>
        <img className="image-box" src={src} alt="testimg" />
        <div className='story-result-btns'>
          <SoundBtn onClick={clickedBGM} soundType='BGM' soundState={isOnBGM} />
          <SoundBtn onClick={clickedAudio} soundType='Audio' soundState={isOnAudio} />
          <button>Korean</button>
          <button>저장</button>
        </div>
      </div>
      <p className='story-result-text'>{text}</p>
    </div>
  )
}
