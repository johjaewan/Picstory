import { AxiosResponse } from "axios";
import customAxios from "./api";

// 단어 불러오기
export async function getWordList(criteria: string) {
	const response: AxiosResponse = await customAxios.get(
		`/vocabulary/?criteria=${criteria}`
	);
	return response;
}
// 단어 저장
export async function saveWord(word: string, mean: string) {
	const response: AxiosResponse = await customAxios.post(`/vocabulary/save/`, {
		word: word,
		mean: mean,
	});
	return response;
}
