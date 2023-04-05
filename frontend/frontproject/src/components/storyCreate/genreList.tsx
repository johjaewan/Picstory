import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  ImageBit,
  genreAtom,
  loadingAtom,
  storyEn,
  storyKo,
  voiceAtom,
  isFinished,
  translateIsFinished,
  voiceIsFinished,
  tokenAtom,
} from '../../atoms'
import { createStory, createVoice, translateStory } from '../../api/storyApi'
import Loading from './loading'
import styles from '../../assets/css/LayerButton.module.css'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router'

export default function ImageUpload() {
  const navigation = useNavigate()

  const [genre, setGenre] = useRecoilState(genreAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const setStoryKorean = useSetRecoilState(storyKo)
  const setStoryEnglish = useSetRecoilState(storyEn)
  const setVoice = useSetRecoilState(voiceAtom)
  const setFinished = useSetRecoilState(isFinished)
  const setTransIsFin = useSetRecoilState(translateIsFinished)
  const setVoiceIsFin = useSetRecoilState(voiceIsFinished)
  const SetToken = useSetRecoilState(tokenAtom)

  // 이미지
  const [Image, setImage] = useRecoilState(ImageBit)
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
        Authorization: 'Key 65a4f037b024440db6d5786d9c868030',
      },
      body: raw,
    }

    fetch(
      `https://api.clarifai.com/v2/models/general-english-image-caption-clip/versions/2489aad78abf4b39a128fbbc64a8830c/outputs`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        console.log(result.outputs[0].data.text.raw)
        sendContent(result.outputs[0].data.text.raw, genre)
      })
      .catch((error) => console.log('error', error))
  }
  // 이야기 생성 요청
  const sendContent = async (text: string, genre: string) => {
    try {
      const response = await createStory(text, genre)
      const result = response.data.content
      setStoryEnglish(result)
      if (response.status === 200) {
        setFinished(true)
        makeVoice(result, genre)
        translate(result)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        sessionStorage.removeItem('userEmail')
        sessionStorage.removeItem('userNick')
        SetToken(null)
      }
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '이야기 생성을 실패했습니다',
      })

      setLoading(false)
      setGenre('')
      setImage('')
      navigation('/')
    }
  }
  // 음성파일 생성 요청
  const makeVoice = async (storyEng: string, genre: string) => {
    try {
      const response = await createVoice(storyEng, genre)
      setVoice(response.data.voice)
      setVoiceIsFin(true)
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '음성파일 생성을 실패했습니다',
      })
      setLoading(false)
      setGenre('')
      setImage('')
      navigation('/')
    }
  }
  // 번역 요청
  const translate = async (storyEng: string) => {
    try {
      const response = await translateStory(storyEng)
      setStoryKorean(response.data.content)
      setTransIsFin(true)
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: '번역 요청이 실패했습니다',
      })
      setLoading(false)
      setGenre('')
      setImage('')
      navigation('/')
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <button className={styles.layerbutton} onClick={ImageCaptioning}>
            <span className={styles.color_span} aria-hidden="true">
              Create Story
            </span>
            <span className={styles.color_span}></span>
            <span className={styles.color_span}>Create Story</span>
          </button>
        </div>
      )}
    </>
  )
}
