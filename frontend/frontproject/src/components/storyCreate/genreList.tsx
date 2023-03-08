import { useState, useEffect } from 'react'
import '../../assets/css/storyCreatePageStyle.css'
export default function ImageUpload() {
  const [genre, setGenre] = useState('')
  const [loading, setLoading] = useState(true)

  const clickGenre = (e: any) => {
    e.target.classList.add('active')
    setGenre(e.target.value)
  }

  const items = ['재미', '슬픔', '공포', '로맨스']

  const sendContent = async () => {
    // api 호출
    setLoading(true)
  }

  return (
    <>
      <div className="container">
        {items.map((item, idx) => {
          let id = 'genreBtn-' + (idx + 1)
          console.log(id)
          return (
            <>
              <input
                id={id}
                type="radio"
                name="gerne"
                value={items[idx]}
                onChange={clickGenre}
              ></input>{' '}
              <label
                className={
                  'genre-label' + (items[idx] == genre ? '-active' : '')
                }
                htmlFor={id}
              >
                {items[idx]}{' '}
              </label>
            </>
          )
        })}
      </div>{' '}
      <button className="createBtn">이야기 만들기</button>
    </>
  )
}
