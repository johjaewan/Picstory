import { Link, useNavigate } from 'react-router-dom'
import styles from '../assets/css/NotFound.module.css'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <div className={styles.container}>
      <div className={styles.text}> Page Not Found</div>
      <div className={styles.text2}>요청하신 페이지를 찾을 수 없습니다.</div>
      <button
        className={styles.homeBtn}
        onClick={() => {
          navigate('/')
        }}
      >
        HOME
      </button>
    </div>
  )
}

export default NotFound
