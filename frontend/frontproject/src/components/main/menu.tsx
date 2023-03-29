import { useRecoilState, useRecoilValue } from 'recoil'
import { colorAtom, menuState } from '../../atoms'
import styles from '../../assets/css/menu.module.css'
import closeIcon from '../../assets/close.png'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { myInfo } from './TheHeader'

const Menu = () => {
  const [menu, setMenu] = useRecoilState(menuState)
  const color = useRecoilValue(colorAtom)
  const navigation = useNavigate()

  const myInfoMenu = () => {
    setMenu(false)
    myInfo()
  }
  // 로그아웃
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: 'success',
      title: '로그아웃 성공'
    })

    setMenu(false)
    navigation('/')
  }

  return (
    <div
      className={
        menu ? `${styles['openModal']} ${styles[color]}` : styles.closeModal
      }
    >
      <div className={styles.iconBox}>
        <img
          className={styles.closeIcon}
          src={closeIcon}
          alt=""
          onClick={() => {
            setMenu(false)
          }}
        ></img>
      </div>
      <div className={styles.container}>
        <div className={styles.items}>
          <div>
            <div
              className={styles.item}
              onClick={() => {
                navigation('/library')
                setMenu(false)
              }}
            >
              이야기들
            </div>
            <div
              className={styles.item}
              onClick={() => {
                navigation('/vocabulary')
                setMenu(false)
              }}
            >
              단어장
            </div>
            <div
              className={styles.item}
              onClick={myInfoMenu}
            >
              My Info
            </div>
            <div
              className={styles.item}
              onClick={logout}
            >
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Menu
