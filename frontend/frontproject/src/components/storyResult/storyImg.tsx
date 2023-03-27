import { useRecoilValue } from 'recoil'
import { ImageBit } from '../../atoms'
import styles from '../../assets/css/storyResultPage.module.css'

// 이야기 결과

function ResultImg() {
  const bitImage = useRecoilValue(ImageBit)

  return (
    <>
      <img className={styles.story_result_image} src={bitImage} alt="testimg" />
    </>
  )
}

export default ResultImg
