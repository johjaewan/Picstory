import { useState } from 'react'
import { translateWord } from '../../api/storyApi'
import { saveWord } from '../../api/vocabularyApi'

import styles from '../../assets/css/wordSearch.module.css'

export default function WordSearch() {
  const [dragText, setDragText] = useState('')
  const [mean, setMean] = useState('')
  const [searchList, setSearchList] = useState([
    {
      me: true,
      text: '',
    },
  ])

  document.onmouseup = function () {
    let selectedObj = window.getSelection()
    let selectText = selectedObj?.getRangeAt(0).toString()
    setDragText(selectText !== undefined ? selectText.trim() : 'sd')
  }

  interface chatInfo {
    me: boolean
    text: string
  }

  const save = async () => {
    const response = await saveWord(dragText, mean)
    if (response.status == 200) alert('저장이 완료되었습니다')
  }

  const search = async () => {
    // const me = true
    // const text = `${dragText}의 뜻은 무엇인가요?`

    if (dragText === '') {
      alert('단어를 드래그 해주세요')
      return
    }

    const tmp = {
      me: true,
      text: `'${dragText}'의 뜻은 무엇인가요?`,
    }
    setSearchList((searchList) => [...searchList, tmp])
    const response = await translateWord(dragText)
    let result = response.data.content
    if (result.indexOf('.') !== -1) {
      result = result.substring(0, result.length - 1)
    }
    setMean(result)
    // const me2 = false
    // const text2 = `${dragText}의 뜻은 ${word}입니다.`
    const tmp2 = {
      me: false,
      text: `'${dragText}'의 뜻은 '${result}'입니다.`,
    }
    setSearchList((searchList) => [...searchList, tmp2])
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wordSearch}>
          <input
            className={styles.wordInput}
            type="text"
            value={dragText}
          ></input>
          <button className={styles.btn} onClick={search}>
            search
          </button>
          <button className={styles.btn} onClick={save}>
            save
          </button>
        </div>
      </div>
      {searchList.map((item) => {
        return (
          <>
            <div className={styles.searchResult}>{item.text}</div>
          </>
        )
      })}
    </>
  )
}
