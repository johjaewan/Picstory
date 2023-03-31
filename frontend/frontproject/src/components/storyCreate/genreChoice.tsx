import { useNavigate } from 'react-router'
import { useRecoilState } from 'recoil'
import styles from '../../assets/css/genreChoice.module.css'
import { genreAtom } from '../../atoms'

export default function GenreChoice() {
  const [genre, setGenre] = useRecoilState(genreAtom)
  const navigation = useNavigate()
  const changeGenre = (genre: string) => {
    console.log(genre)
    setGenre(genre)
    navigation('/storyCreatePage')
  }
  return (
    <div className={styles.container}>
      <div className={styles['section-fluid-main']}>
        {/* <div className={styles['title']}>genre</div> */}
        <div className={styles['section-row']}>
          <div
            className={styles['section-col']}
            onClick={() => {
              changeGenre('fun')
            }}
          >
            <div className={styles['section']}>
              <div className={styles['section-in']}>
                <img src="https://assets.codepen.io/1462889/sl2.jpg" alt="" />
              </div>
            </div>
          </div>
          <div className={styles['hover-text']}>
            <h2>Fun</h2>
          </div>

          <div
            className={styles['section-col']}
            onClick={() => {
              changeGenre('sad')
            }}
          >
            <div className={styles['section']}>
              <div className={styles['section-in']}>
                <img
                  src="https://cdn.pixabay.com/photo/2015/07/27/22/55/woman-863686_960_720.jpg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className={styles['hover-text']}>
            <h2>Sad</h2>
          </div>
          <div
            className={styles['section-col']}
            onClick={() => {
              changeGenre('romance')
            }}
          >
            <div className={styles['section']}>
              <div className={styles['section-in']}>
                <img src="https://assets.codepen.io/1462889/sl4.jpg" alt="" />
              </div>
            </div>
          </div>
          <div className={styles['hover-text']}>
            <h2>Romance</h2>
          </div>
          <div
            className={styles['section-col']}
            onClick={() => {
              changeGenre('thriller')
            }}
          >
            <div className={styles['section']}>
              <div className={styles['section-in']}>
                <img src="https://assets.codepen.io/1462889/sl5.jpg" alt="" />
              </div>
            </div>
          </div>
          <div className={styles['hover-text']}>
            <h2>Horror</h2>
          </div>
        </div>
      </div>
    </div>
  )
}
