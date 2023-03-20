import axios, { AxiosResponse } from 'axios'

// const BASE_URL = "http://192.168.100.166:8000/api"; // 테스트 서버
const BASE_URL = "http://j8d103.p.ssafy.io:9999/api"; // 연결할 서버 ip주소로 바꾸기

// 이야기 생성
export async function createStory(text: string, genre: string) {
  const response: AxiosResponse = await axios.post(`${BASE_URL}/story/create`, {
    text: text,
    genre: genre,
  })
  return response
}
// 이야기 가져오기
export async function getStory(id: number) {
  const response: AxiosResponse = await axios.get(`${BASE_URL}/story/${id}`)
  return response
}

// 이야기 저장
export async function postSaveStory(formData: object) {
  try {
    const response: AxiosResponse = await axios.post(
      `${BASE_URL}/story/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  } catch (error) {
    console.log(error)
    return
  }
}

// 음성 생성
export async function createVoice(content: string, genre: string) {
  const response: AxiosResponse = await axios.post(`${BASE_URL}/story/voice`, {
    content: content,
    genre: genre,
  })
  return response
}

// 이야기 번역
export async function translateStory(content: string) {
  const response: AxiosResponse = await axios.post(
    `${BASE_URL}/story/translate`,
    { content: content },
  )
  return response
}

// 이야기 삭제
export async function deleteStory(id: number) {
  const response: AxiosResponse = await axios.delete(
    `${BASE_URL}/story/delete/${id}`,
  )
  return response
}
