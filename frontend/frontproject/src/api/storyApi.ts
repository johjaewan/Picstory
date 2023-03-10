import axios, { AxiosResponse } from 'axios'
export async function getStoryList() {
  const response: AxiosResponse = await axios.get(`/api/story/list/유저아이디`)
  return response
}
