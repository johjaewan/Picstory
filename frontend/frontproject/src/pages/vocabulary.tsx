import { useState, useEffect } from 'react'
import { getWordList } from '../api/vocabulary'
import styles from '../assets/css/vocabulary.module.css'
export default function Vocabulary() {
  const [sortState, setSortState] = useState(true)
  const [wordList, setWordList] = useState([
    {
      word: '-1',
      mean: '',
    },
  ])

  const click = () => {
    getList(!sortState)
    setSortState(!sortState)
  }
  const getList = async (sortState: boolean) => {
    console.log('!!')
    const response = await getWordList(sortState ? '' : 'alpha')
    setWordList(wordList.filter((item) => item.word === '-3'))
    response.data.forEach((item: any) =>
      setWordList((wordList) => [...wordList, item]),
    )
  }

  useEffect(() => {
    // setWordList(wordList.filter((item) => item.word === '-2'))
    // console.log(wordList)
    setWordList(wordList.filter((item) => item.word !== '-1'))
    getList(true)
  }, [])

  return (
    <div className={styles.container}>
      <button className={styles.sortBtn} onClick={click}>
        알파벳순 정렬
      </button>
      <table className={styles.word_table}>
        {wordList.map((item) => {
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
