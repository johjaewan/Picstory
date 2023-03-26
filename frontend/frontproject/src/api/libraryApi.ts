import { AxiosResponse } from "axios";
import customAxios from "./api";

// 내 서재 이야기 목록
export async function getStoryList(user_pk: number) {
	const response: AxiosResponse = await customAxios.get(
		`/story/list/${user_pk}`
	);
	return response;
}
