import { useRecoilValue } from "recoil";
import { storyEn, storyKo } from "../../atoms"
import classNames from "classnames/bind";
import styles from "../../assets/css/storyResultPage.module.css";
import TypeIt from "typeit-react";
const style = classNames.bind(styles);

// 이야기 결과

interface StoryResultProp {
  language : boolean;
}

function StoryResult( {language} : StoryResultProp ) {
  
  const storyResultEn = useRecoilValue(storyEn);
  const storyResultKo = useRecoilValue(storyKo);
  
  let story = language ? storyResultEn : storyResultKo;

  return (
    <>
      <TypeIt
        options={{
          speed: 30,
          waitUntilVisible: true,
        }}
      > 
      {story}
      </TypeIt>
      {/* <p className={style("story-result-text")}>{story}</p> */}
    </>
  );
}

export default StoryResult;