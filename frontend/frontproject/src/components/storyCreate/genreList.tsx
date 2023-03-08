import axios, { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { ImageBit } from '../../atoms'
import { genreAtom } from '../../atoms'
import { loadingAtom } from '../../atoms'
import Loading from './loading'

import '../../assets/css/storyCreatePageStyle.css'
export default function ImageUpload() {
  const [genreTmp, setGenreTmp] = useState('')
  const [genre, setGenre] = useRecoilState(genreAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const [content, setContent] = useState('')

  const clickGenre = (e: any) => {
    e.target.classList.add('active')
    setGenreTmp(e.target.value)
  }

  useEffect(() => {}, [content])

  const items = ['재미', '슬픔', '공포', '로맨스']

  const Image = useRecoilValue(ImageBit)
  const Image2 = Image.substring(23)

  const ImageCaptioning = () => {
    setGenre(genreTmp)
    runClip()
  }

  const runClip = async () => {
    const raw = JSON.stringify({
      user_app_id: {
        user_id: 'clarifai',
        app_id: 'main',
      },
      inputs: [
        {
          data: {
            image: {
              base64: Image2,
            },
          },
        },
      ],
    })

    const info = {
      detailImageFile: Object,
      detailImageUrl: String,
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + '65a4f037b024440db6d5786d9c868030',
      },
      body: raw,
    }

    // const response: AxiosResponse = await axios.post(
    //   `https://api.clarifai.com/v2/models/general-english-image-caption-clip/versions/2489aad78abf4b39a128fbbc64a8830c/outputs`,
    //   {
    //     requestOptions,
    //   },
    // )

    fetch(
      `https://api.clarifai.com/v2/models/general-english-image-caption-clip/versions/2489aad78abf4b39a128fbbc64a8830c/outputs`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        setContent(result.outputs[0].data.text.raw)
        sendContent()
      })
      .catch((error) => console.log('error', error))
  }

  const sendContent = async () => {
    // api 호출
    // setLoading(false)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className="container">
            {items.map((item, idx) => {
              let id = 'genreBtn-' + (idx + 1)
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
                      'genre-label' + (items[idx] == genreTmp ? '-active' : '')
                    }
                    htmlFor={id}
                  >
                    {items[idx]}
                  </label>
                </>
              )
            })}
          </div>
          <button className="createBtn" onClick={ImageCaptioning}>
            이야기 만들기
          </button>
          <div>{content}</div>
        </div>
      )}
    </>
  )
}
