import axios, { AxiosResponse } from 'axios'
export async function getStoryList() {
  const response: AxiosResponse = await axios.get(`/api/story/list/유저아이디`)
  return response
}

export async function createStory(text: String, genre: String) {
  console.log(text + ' ' + genre)
  const response: AxiosResponse = await axios.post(
    `/api/story/list/유저아이디`,
    {
      text: text,
      genre: genre,
    },
  )
  return response
}
