import { useRecoilValue } from "recoil";
import { storyResultKo ,storyResultEn } from "../../atoms"
import classNames from "classnames/bind";
import styles from "../../assets/css/storyResultPage.module.css";

const style = classNames.bind(styles);

// 이야기 결과

interface StoryResultProp {
  language : boolean;
}

function StoryResult( {language} : StoryResultProp ) {

  const storyKo = useRecoilValue(storyResultKo);
  const storyEn = useRecoilValue(storyResultEn);
  
  let story = language ? storyKo : storyEn;

  return (
    <>
      <p className={style("story-result-text")}>{story}</p>
    </>
  );
}

export default StoryResult;