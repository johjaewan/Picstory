import { AxiosResponse } from "axios";
import customAxios from "./api";

// 회원가입 요청
export async function signup(
	email: string,
	password: string,
	nickname: string
) {
	const response: AxiosResponse = await customAxios.post(`/accounts/signup/`, {
		email: email,
		password: password,
		nickname: nickname,
	});
	return response;
}

// 로그인 요청
export async function login(email: string, password: string) {
	const response: AxiosResponse = await customAxios.post(`/accounts/login/`, {
		email: email,
		password: password,
		withCredentials: true,
	});
	return response;
}

// email 인증코드 재전송 요청
export async function resendCode(email: string, password: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/resend/code/`,
		{
			email: email,
			password: password,
		}
	);
	return response;
}

// 계정 활성화 요청
// export async function userVerify(email: string, code: string) {
// 	const response: AxiosResponse = await customAxios.post(
// 		`/accounts/verify/email/`,
// 		{
// 			email: email,
// 			code: code,
// 		}
// 	);
// 	return response;
// }

// 새로고침 토큰 요청
//cookie는 npm install해야함
//https://jrepository.tistory.com/m/65 참고하셈
export async function refreshToken(email: string, code: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/token/refresh/`,
		{
			email: email,
			code: code,
		}
	);
	return response;
}

//닉네임 중복 체크
export async function nicknameCheck(nickname: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/check/duplicate/nickname/`,
		{
			nickname: nickname,
		}
	);
	return response;
}

//이메일 중복 체크
export async function emailCheck(email: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/check/duplicate/email/`,
		{
			email: email,
		}
	);
	return response;
}

// 유저 삭제
export async function deleteUser(id: number) {
	const response: AxiosResponse = await customAxios.delete(`/user/${id}/`);
	return response;
}

export async function getTest(data : object) {
	const response: AxiosResponse = await customAxios.post(`/accounts/test/`,data);
	return response;
}
