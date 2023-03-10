import axios, { AxiosResponse } from 'axios'

const BASE_URL = "https:/api";
// 내 서재 이야기 목록
export async function getStoryList(user_pk : number) {
  const response: AxiosResponse = await axios.get(
    `${BASE_URL}/story/list/${user_pk}`
  );
  return response;
}
// 이야기 생성
export async function createStory(text: string, genre: string) {
  console.log(text + " " + genre);
  const response: AxiosResponse = await axios.post(
    `${BASE_URL}/story/create`,
    {
      text: text,
      genre: genre,
    }
  );
  return response;
}
// 이야기 저장    
export async function postSaveStory(formData : object) {
  try{
    const response: AxiosResponse = await axios.post(
      `${BASE_URL}/story/`,
      formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    });
    return response;
  }catch(error){
    console.log(error);
    return;
  }
};


