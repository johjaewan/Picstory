import axios, { AxiosResponse } from 'axios'

const BASE_URL = "https:/api";

export async function getStoryList(user_pk : number) {
  const response: AxiosResponse = await axios.get(
    `${BASE_URL}/story/list/${user_pk}`
  );
  return response;
}

export async function postSaveStory() {
  const response: AxiosResponse = await axios.post(`${BASE_URL}/story/`);
  return response
}


