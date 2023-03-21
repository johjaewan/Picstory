import axios, { AxiosResponse } from 'axios'

// const BASE_URL = 'http://192.168.100.166:8000/api' // 연결할 서버 ip주소로 바꾸기
const BASE_URL = 'https://j8d103.p.ssafy.io/api'

export async function getWordList(criteria: string) {
  const response: AxiosResponse = await axios.get(
    `${BASE_URL}/vocabulary/?criteria=${criteria}`,
  )
  return response
}

export async function saveWord(word: string, mean: string) {
  const response: AxiosResponse = await axios.post(
    `${BASE_URL}/vocabulary/save/`,
    {
      word: word,
      mean: mean,
    },
  )
  return response
}
