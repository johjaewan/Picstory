import styles from '../../assets/css/TheHeader.module.css'
import { colorAtom, menuState } from '../../atoms'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import menuIcon from '../../assets/menu.png'
import Swal from 'sweetalert2'

const TheHeader = () => {
  const navigation = useNavigate()
  const color = useRecoilValue(colorAtom)
  const setMenu = useSetRecoilState(menuState)

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })

    Toast.fire({
      icon: 'success',
      title: '로그아웃 성공',
    })

    navigation('/')
  }

  return (
    <header className={`${styles['header']} `}>
      <div className={styles.contents}>
        <div
          className={styles.logo}
          onClick={() => {
            navigation('/')
          }}
        >
          picstory
        </div>

        <nav className={styles.navigation}>
          <ul>
            <button className={styles.list} onClick={logout}>
              Logout
            </button>
            <button className={styles.list} onClick={() => {}}>
              MyInfo
            </button>
            <button
              className={styles.list}
              onClick={() => {
                navigation('/library')
              }}
            >
              이야기들
            </button>
            <button
              className={styles.list}
              onClick={() => {
                navigation('/vocabulary')
              }}
            >
              단어장
            </button>
            <div className={styles.listShadow}></div>
            <li
              onClick={() => {
                setMenu(true)
              }}
            >
              <img
                src={menuIcon}
                className={styles.menuIcon}
                width={30}
                alt=""
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default TheHeader
