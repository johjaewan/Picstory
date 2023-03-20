import axios, { AxiosResponse } from 'axios'

// const BASE_URL = 'http://192.168.100.166:8000/api' // 연결할 서버 ip주소로 바꾸기
const BASE_URL = 'https://j8d103.p.ssafy.io/api'

// 내 서재 이야기 목록
export async function getStoryList(user_pk: number) {
  const response: AxiosResponse = await axios.get(
    `${BASE_URL}/story/list/${user_pk}`,
  )
  return response
}
