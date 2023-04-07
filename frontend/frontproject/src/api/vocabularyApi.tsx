import { AxiosResponse } from 'axios'
import customAxios from './api'

// 단어 불러오기
export async function getWordList(criteria: string, page: number) {
  const response: AxiosResponse = await customAxios.get(
    `/vocabulary/?criteria=${criteria}&page=${page}`,
  )
  return response
}

// 단어 저장
export async function saveWord(word: string, mean: string) {
  const response: AxiosResponse = await customAxios.post(`/vocabulary/save/`, {
    word: word,
    mean: mean,
  })
  return response
}

export async function getRandomWord() {
  const response: AxiosResponse = await customAxios.get(`/vocabulary/all/`)
  return response
}
