import styles from '../../assets/css/TheHeader.module.css'
import { colorAtom, menuState } from '../../atoms'
import { useRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import menuIcon from '../../assets/menu.png'
import { useState } from 'react'
import Menu from '../main/menu'

const TheHeader = () => {
  const navigation = useNavigate()
  const [color, setColor] = useRecoilState(colorAtom)
  const [menu, setMenu] = useRecoilState(menuState)
  console.log(menu)
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
