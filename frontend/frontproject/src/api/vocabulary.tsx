import axios, { AxiosResponse } from 'axios'

const BASE_URL = 'http://192.168.100.166:8000/api' // 연결할 서버 ip주소로 바꾸기
// const BASE_URL = 'https://j8d103.p.ssafy.io/api'

export async function getWordList(criteria: string) {
  const response: AxiosResponse = await axios.get(
    `${BASE_URL}/vocabulary/?criteria=${criteria}`,
  )
  return response
}

export async function getStory(id: number) {
  const response: AxiosResponse = await axios.get(`${BASE_URL}/story/${id}/`)
  return response
}
