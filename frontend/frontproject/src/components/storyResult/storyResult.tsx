import { useRecoilValue } from "recoil";
import { language, storyEn, storyKo } from "../../atoms"
import classNames from "classnames/bind";
import styles from "../../assets/css/storyResultPage.module.css";
const style = classNames.bind(styles);

// 이야기 결과

function StoryResult() {
  
  const storyResultEn = useRecoilValue(storyEn);
  const storyResultKo = useRecoilValue(storyKo);

  const lang = useRecoilValue(language);

  return (
    <>
		  {lang ? storyResultEn : storyResultKo}
    </>
  );
}

export default StoryResult;