import { useRecoilValue } from 'recoil'
import { language, storyEn, storyKo } from '../../atoms'
// import classNames from "classnames/bind";
// import styles from "../../assets/css/storyResultPage.module.css";
// const style = classNames.bind(styles);

// 이야기 결과

function StoryResult() {
  const storyResultEn = useRecoilValue(storyEn)
  const storyResultKo = useRecoilValue(storyKo)

  const lang = useRecoilValue(language)

  return (
    <>
      {/* {lang ? storyResultEn : storyResultKo} */}
      <div>
        Once upon a time, there was a woman named Emily who lived in a small
        village nestled in the countryside. Emily was a kind-hearted woman who
        loved animals and spent most of her time taking care of them. One day,
        as Emily was walking through the village, she saw a small, scruffy cat
        hiding in an alleyway. The cat was thin and looked as though it hadn't
        eaten in days. Emily immediately felt sorry for the little creature and
        picked it up, holding it close to her chest.
      </div>
    </>
  )
}

export default StoryResult
