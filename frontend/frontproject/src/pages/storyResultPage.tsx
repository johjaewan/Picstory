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
import { Link } from "react-router-dom";

const style = classNames.bind(styles);

export default function StoryResultPage() {
  
  // 모달
  const setModalOpen = useSetRecoilState(modalState);
  const handleRegister = () => {
    setModalOpen(true);
  };

  // 배경음악 장르 설정
  const genre = useRecoilValue(genreAtom);
  
  //언어설정
  const [lang, setLang] = useState(true);
  const transLang = () => {
    setLang((prev) => !prev);
  };
  
  return (
    <div className="story-result-container">
      <div className={style("story-img-container")}>
        {/* 이미지 */}
        <ResultImg/>
        {/* 설정 버튼 */}
        <div className={style("story-result-btns")}>
          {/* 배경음악 */}
          <BGMPlayer genre={genre}/>
          {/* 음성파일 */}
          <AudioPlayer/>
          {/* 언어설정 */}
          <button className={style("story-result-button")} onClick={transLang}>
            { lang ? "Korean" : "영어" }
          </button>
          {/* 저장 모달 */}
          <button
            className={style("story-result-button")}
            onClick={handleRegister}
            >
            저장
          </button>
          <Modal />
        </div>
      </div>
      {/* 이야기 결과 */}
      <StoryResult language={lang}/>
      <button className={style("story-result-button")}>
        <Link to="/storyCreatePage">다시만들기</Link>
      </button>
    </div>
  );
}
