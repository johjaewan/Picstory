import styles from '../../assets/css/TheHeader.module.css'
import { colorAtom } from '../../atoms'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import menuIcon from '../../assets/menu.png'
import { useState } from 'react'
import Menu from '../main/menu'

const TheHeader = () => {
  const navigation = useNavigate()
  const [color, setColor] = useRecoilState(colorAtom)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  console.log(modalIsOpen)
  return (
    <header className={`${styles['header']} ${styles[color]}`}>
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
            <li
              className={styles.list}
              onClick={() => {
                navigation('/')
              }}
            >
              Logout
            </li>
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
            <li
              onClick={() => {
                setModalIsOpen(true)
              }}
            >
              <img
                src={menuIcon}
                className={styles.menuIcon}
                width={30}
                alt=""
              />
              <button
                onClick={() => {
                  setModalIsOpen(!modalIsOpen)
                }}
              >
                {modalIsOpen && <Menu setModalIsOpen={setModalIsOpen}></Menu>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default TheHeader
