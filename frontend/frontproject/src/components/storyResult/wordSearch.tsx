import { useState } from 'react'
import { translateWord } from '../../api/storyApi'
import styles from '../../assets/css/wordSearch.module.css'

export default function WordSearch() {
  const [dragText, setDragText] = useState('')
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

  const search = async () => {
    // const me = true
    // const text = `${dragText}의 뜻은 무엇인가요?`

    const tmp = {
      me: true,
      text: `'${dragText}'의 뜻은 무엇인가요?`,
    }
    setSearchList((searchList) => [...searchList, tmp])
    const response = await translateWord(dragText)
    const word = response.data.content
    console.log(word)
    // const me2 = false
    // const text2 = `${dragText}의 뜻은 ${word}입니다.`
    const tmp2 = {
      me: false,
      text: `'${dragText}'의 뜻은 '${word}'입니다.`,
    }
    setSearchList((searchList) => [...searchList, tmp2])
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.content}>
          Once upon a time, there was a woman named Emily who lived in a small
          village nestled in the countryside. Emily was a kind-hearted woman who
          loved animals and spent most of her time taking care of them. One day,
          as Emily was walking through the village, she saw a small, scruffy cat
          hiding in an alleyway. The cat was thin and looked as though it hadn't
          eaten in days. Emily immediately felt sorry for the little creature
          and picked it up, holding it close to her chest.
        </div>
        <div className={styles.wordSearch}>
          <input
            className={styles.wordInput}
            type="text"
            value={dragText}
          ></input>
        </div>
        <button className={styles.btn} onClick={search}>
          click
        </button>
        <div>result</div>
      </div>
      <div className={styles.container}>11</div>
      {searchList.map((item) => {
        return (
          <>
            <div>{item.text}</div>
          </>
        )
      })}
    </>
  )
}
