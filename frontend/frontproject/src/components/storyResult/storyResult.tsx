import { useRecoilValue } from "recoil";
import { storyResultAtom } from "../../atoms"
import classNames from "classnames/bind";
import styles from "../../assets/css/storyResultPage.module.css";

const style = classNames.bind(styles);

// 이야기 결과

interface StoryResultProp {
  language : boolean;
}

function StoryResult( {language} : StoryResultProp ) {

  const storyResult = useRecoilValue(storyResultAtom);
  
  let story = language ? storyResult.content_kr : storyResult.content_en;
  
  
  return story && (
    <>
      <p className={style("story-result-text")}>{story}</p>
    </>
  );
}

export default StoryResult;