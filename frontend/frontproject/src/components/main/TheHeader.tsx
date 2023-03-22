import styles from '../../assets/css/TheHeader.module.css'
import { colorAtom } from '../../atoms'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'

const TheHeader = () => {
  const navigation = useNavigate()
  const [color, setColor] = useRecoilState(colorAtom)

  const move = () => {
    navigation('/library')
  }

  return (
    <header className={`${styles['header']} ${styles[color]}`}>
      <div className={styles.contents}>
        <div
          className={styles.big_logo}
          onClick={() => {
            navigation('/')
          }}
        >
          picstory
        </div>
        <div
          className={styles.small_logo}
          onClick={() => {
            navigation('/')
          }}
        >
          P
        </div>
        {/* <h1>this is header space!</h1> */}
        <nav className={styles.navigation}>
          <ul>
            <li
              className={styles.list}
              onClick={() => {
                navigation('/')
              }}
            >
              Logout
            </li>{' '}
            <li className={styles.list} onClick={() => {}}>
              MyInfo
            </li>
            <li
              className={styles.list}
              onClick={() => {
                navigation('/library')
              }}
            >
              이야기들
            </li>
            <li
              className={styles.list}
              onClick={() => {
                navigation('/vocabulary')
              }}
            >
              단어장
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default TheHeader
