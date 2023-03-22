import { Link } from 'react-router-dom'
import styles from '../../assets/css/main.module.css'
import { Helmet } from 'react-helmet'
import { useRecoilState } from 'recoil'
import { colorAtom } from '../../atoms'
import { useState } from 'react'

export default function Main() {
  const idx = Math.floor(Math.random() * 6)
  const [color, setColor] = useRecoilState(colorAtom)
  const colorList = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
  setColor(colorList[idx])
  return (
    <div className={`${styles['container']} ${styles[color]}`}>
      <Helmet>
        <title>Picstory</title>
      </Helmet>
      <div className={styles.picstory}>
        <h1>
          <span>p</span>
          <span>i</span>
          <span>c</span>
          <span>s</span>
          <span>t</span>
          <span>o</span>
          <span>r</span>
          <span>y</span>
        </h1>
      </div>
      <div className={styles.clear}></div>
      <Link to="/storyCreatePage">
        <button className={styles.btn1}>TRY</button>
      </Link>
    </div>
  )
}
