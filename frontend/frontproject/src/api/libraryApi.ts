import { AxiosResponse } from "axios";
import customAxios from "./api";

// 내 서재 이야기 목록
export async function getStoryList() {
	const response: AxiosResponse = await customAxios.get(`/story/list/`);
	return response;
}
