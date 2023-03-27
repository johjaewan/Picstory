import { ChangeEvent } from 'react'
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil'
import {
  ImageBit,
  genreAtom,
  loadingAtom,
  storyEn,
  storyKo,
  voiceAtom,
  colorAtom,
  isFinished,
} from '../../atoms'
import { createStory, createVoice, translateStory } from '../../api/storyApi'
import Loading from './loading'
import styles from '../../assets/css/genreList.module.css'
import Swal from 'sweetalert2'

export default function ImageUpload() {
  const color = useRecoilValue(colorAtom)
  const [genre, setGenre] = useRecoilState(genreAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const setStoryKorean = useSetRecoilState(storyKo)
  const setStoryEnglish = useSetRecoilState(storyEn)
  const setVoice = useSetRecoilState(voiceAtom)
  const [finished, setFinished] = useRecoilState(isFinished)

  // 장르
  const clickGenre = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.classList.add('active')
    setGenre(e.target.value)
  }
  const items: string[] = ['재미', '슬픔', '공포', '로맨스']

  // 이미지
  const Image = useRecoilValue(ImageBit)
  const Image2 = Image.substring(23)

  // 이미지 캡셔닝 제출
  const ImageCaptioning = async () => {
    if (!Image) {
      Swal.fire({
        icon: 'warning',
        text: '사진을 선택해 주세요!',
      })
      return
    }
    if (!genre) {
      Swal.fire({
        icon: 'warning',
        text: '장르를 선택해주세요!',
      })
      return
    }
    runClip()
  }
  // 이미지 캡셔닝
  const runClip = async () => {
    setLoading(true)
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

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + '65a4f037b024440db6d5786d9c868030',
      },
      body: raw,
    }

    fetch(
      `https://api.clarifai.com/v2/models/general-english-image-caption-clip/versions/2489aad78abf4b39a128fbbc64a8830c/outputs`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        sendContent(result.outputs[0].data.text.raw, genre)
      })
      .catch((error) => console.log('error', error))
  }
  // 이야기 생성 요청
  const sendContent = async (text: string, genre: string) => {
    const response = await createStory(text, genre)
    const result = response.data.content
    setStoryEnglish(result)
    if (response.status === 200) {
      setFinished(true)
      makeVoice(result, genre)
      translate(result)
    }
  }
  // 음성파일 생성 요청
  const makeVoice = async (storyEng: string, genre: string) => {
    const response = await createVoice(storyEng, genre)
    setVoice(response.data.voice)
  }
  // 번역 요청
  const translate = async (storyEng: string) => {
    const response = await translateStory(storyEng)
    setStoryKorean(response.data.content)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div className={styles.container}>
            {items.map((item, idx) => {
              let id = 'genreBtn-' + (idx + 1)
              return (
                <div key={idx}>
                  <input
                    id={styles[`${id}`]}
                    type="radio"
                    name="gerne"
                    value={items[idx]}
                    onChange={clickGenre}
                  ></input>

                  <label
                    className={
                      items[idx] === genre
                        ? `${styles['genre_label_active']} ${styles[color]}`
                        : `${styles['genre_label']}`
                    }
                    htmlFor={styles[`${id}`]}
                  >
                    {items[idx]}
                  </label>
                </div>
              )
            })}
          </div>

          <button className={styles.createBtn} onClick={ImageCaptioning}>
            이야기 만들기
          </button>
        </div>
      )}
    </>
  )
}
