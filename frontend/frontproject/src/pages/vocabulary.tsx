import { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { getWordList } from '../api/vocabularyApi'
import styles from '../assets/css/vocabulary.module.css'
import { colorAtom } from '../atoms'

export default function Vocabulary() {
  const [color, setColor] = useRecoilState(colorAtom)
  const [isSortTime, setIsSortTime] = useState(true)

  const [wordListTime, setWordListTime] = useState([
    {
      word: ' ',
      mean: '',
    },
  ])
  const [wordListAlpha, setWordListAlpha] = useState([
    {
      word: ' ',
      mean: '',
    },
  ])

  const click = () => {
    getList(!isSortTime)
    setIsSortTime(!isSortTime)
  }
  const getList = async (isSortTime: boolean) => {
    console.log(wordListTime)
    console.log(wordListAlpha)
    console.log('!!')

    const response = await getWordList(isSortTime ? '' : 'alpha')

    if (isSortTime) {
      setWordListTime(wordListTime.filter((item) => item.word === ''))
      response.data.forEach((item: any) =>
        setWordListTime((wordList) => [...wordList, item]),
      )
    } else if (!isSortTime) {
      setWordListAlpha(wordListAlpha.filter((item) => item.word === ''))
      response.data.forEach((item: any) =>
        setWordListAlpha((wordList) => [...wordList, item]),
      )
    }
  }

  useEffect(() => {
    // setWordList(wordList.filter((item) => item.word === '-2'))
    // console.log(wordList)
    setWordListTime(wordListTime.filter((item) => item.word !== ' '))
    setWordListAlpha(wordListAlpha.filter((item) => item.word !== ' '))
    console.log(wordListTime)
    console.log(wordListAlpha)
    getList(true)
    getList(false)
  }, [])

  return (
    <div className={styles.container}>
      <button className={`${styles.sortBtn} ${styles[color]}`} onClick={click}>
        {isSortTime ? '알파벳순 정렬' : '시간순 정렬'}
      </button>
      <div className={styles.clear}></div>
      <table className={styles.word_table}>
        {isSortTime
          ? wordListTime.map((item) => {
              return (
                <tr className={styles.table_row}>
                  <td className={styles.word}>{item.word}</td>
                  <td className={styles.mean}>{item.mean}</td>
                </tr>
              )
            })
          : wordListAlpha.map((item) => {
              return (
                <tr>
                  <td className={styles.word}>{item.word}</td>
                  <td className={styles.mean}>{item.mean}</td>
                </tr>
              )
            })}
      </table>
    </div>
  )
}
