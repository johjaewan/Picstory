import { useRecoilState } from 'recoil'
import { colorAtom, menuState } from '../../atoms'
import styles from '../../assets/css/menu.module.css'
import closeIcon from '../../assets/close.png'
import { useNavigate } from 'react-router-dom'
const Menu = (props: any) => {
  const [menu, setMenu] = useRecoilState(menuState)
  const [color, setColor] = useRecoilState(colorAtom)
  const navigation = useNavigate()
  console.log(menu)
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
              onClick={() => {
                navigation('/vocabulary')
                setMenu(false)
              }}
            >
              My Info
            </div>
            <div
              className={styles.item}
              onClick={() => {
                navigation('/')
                setMenu(false)
              }}
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
