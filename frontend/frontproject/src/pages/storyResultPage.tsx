import { useState } from "react";
import StoryResult from "../components/storyResult/storyResult";
import ResultImg from "../components/storyResult/storyImg";
import classNames from "classnames/bind";
import styles from "../assets/css/storyResultPage.module.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalState, genreAtom } from "../atoms"
import Modal from "../components/storyResult/modal";
import BGMPlayer from "../components/storyResult/bgm";
import AudioPlayer from "../components/storyResult/audio";

const style = classNames.bind(styles);

export default function StoryResultPage() {
  
  // 모달
  const setModalOpen = useSetRecoilState(modalState);
  const handleRegister = () => {
    setModalOpen(true);
  };

  // 오디오 파일 설정
  // isOnBGM : 배경음악, isOnAudio: 음성파일
  const genre = useRecoilValue(genreAtom);
  
  //언어설정
  const [lang, setLang] = useState(true);
  const transLang = () => {
    setLang((prev) => !prev);
  };

  // const src = "https://src.hidoc.co.kr/image/lib/2022/5/12/1652337370806_0.jpg";
  const text =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?";

  return (
    <div className="story-result-container">
      <div className={style("story-img-container")}>
        {/* 이미지 */}
        <ResultImg/>
        {/* <img className={style("story-result-image")} src={src} alt="testimg" /> */}
        {/* 설정 버튼 */}
        <div className={style("story-result-btns")}>
          {/* 배경음악 */}
          <BGMPlayer genre={genre}/>
          {/* 음성파일 */}
          <AudioPlayer lang={lang}/>
          {/* 언어설정 */}
          <button className={style("story-result-button")} onClick={transLang}>
            { lang ? "Korean" : "영어" }
          </button>
          {/* 저장 모달 */}
          <button
            className={style("story-result-button")}
            // onClick={onClickToggleModal}
            onClick={handleRegister}
            >
            저장
          </button>
          <Modal />
        </div>
      </div>
      {/* 이야기 결과 */}
      {/* <StoryResult language={lang}/> */}
      <p className={style("story-result-text")}>{text}</p>
    </div>
  );
}
