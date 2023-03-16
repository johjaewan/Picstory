import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  ImageBit,
  genreAtom,
  loadingAtom,
  storyEn,
  storyKo,
  voiceAtom,
} from '../../atoms'
import { createStory, createVoice, translateStory } from '../../api/storyApi'
import Loading from './loading'
import styles from '../../assets/css/genreList.module.css'

export default function ImageUpload() {
  const [genre, setGenre] = useRecoilState(genreAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const [text, setText] = useState('') // 이미지 켑셔닝 결과
  const [storyKorean, setStoryKorean] = useRecoilState(storyKo)
  const [storyEnglish, setStoryEnglish] = useRecoilState(storyEn)
  const [voice, setVoice] = useRecoilState(voiceAtom)

  const navigate = useNavigate()

  const clickGenre = (e: any) => {
    e.target.classList.add('active')
    setGenre(e.target.value)
  }
  const next = () => {}

  const items = ['재미', '슬픔', '공포', '로맨스']

  const Image = useRecoilValue(ImageBit)
  const Image2 = Image.substring(23)

  const ImageCaptioning = async () => {
    runClip()
  }

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

  const sendContent = async (text: string, genre: string) => {
    setText(text)
    const response = await createStory(text, genre)
    const result = response.data.content
    setStoryEnglish(result)
    if (response.status === 200) {
      setLoading(false)
      navigate('/storyResult')
      // makeVoice()
      translate(result)
    }
  }

  const makeVoice = async () => {
    const response = await createVoice(storyEnglish, genre)
    setVoice(response.data)
  }

  const translate = async (storyEng: string) => {
    const response = await translateStory(storyEng)
    setStoryKorean(response.data)
    console.log('storyEng:', response.data)
    console.log('StoryKorean:', storyKorean)
  }

  const trans = async () => {
    console.log('click')
    const response = await translateStory(
      'Maria had just moved into a new apartment, and she was excited to explore all of the new spaces that were now her own. She was especially interested in the dining room, as it was the very first room she had seen when she walked through the door. She loved the bright colors and natural wood tones of the room. Since it was the focal point of the apartment, it filled Maria with joy to think of all the wonderful meals she would share and memories she would make in this special room of hers.At first, everything seemed perfect - until one night when Maria was coming home from work and noticed something strange in the windows of the dining room. It seemed like there was a faint light glowing from the inside. She stopped and stared, wondering what could possibly be creating the eerie atmosphere. When Maria opened the door, she was horrified to find out that the source of the glow was actually a group of shadow figures that were gathered around the large dining room table, silently looking at her. Fear immediately started to sink in, and although the feeling was overwhelming, she stood her ground and refused to back away. The following morning, while Maria was still trying to make sense of what had happened, she had a feeling that the figures were back. Once again, the same eerie light was eminating from the dining room, and she soon realized that the figures were still gathered around the table, looking almost as if they were waiting for something.In a panic, Maria ran to her bedroom before anything else could happen, and stayed there until the morning, unable to make sense of what had just happened. She knew that no matter how much she wanted to forget about it all, the dining room was now a focal point of her apartment that was tainted by fear.',
    )

    console.log('result : ', response.data.content)
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
                <>
                  <input
                    id={styles[`${id}`]}
                    type="radio"
                    name="gerne"
                    value={items[idx]}
                    onChange={clickGenre}
                  ></input>

                  <label
                    className={
                      items[idx] == genre
                        ? `${styles.genre_label_active}`
                        : `${styles.genre_label}`
                    }
                    htmlFor={styles[`${id}`]}
                  >
                    {items[idx]}
                  </label>
                </>
              )
            })}
          </div>
          <button className={styles.createBtn} onClick={ImageCaptioning}>
            이야기 만들기
          </button>
          <button onClick={trans}>test</button>
        </div>
      )}
    </>
  )
}
