import { AxiosResponse } from "axios";
import customAxios from "./api";

// 회원가입 요청
export async function signup(
	email: string,
	password: string,
	nickname: string,
	code: string
) {
	const response: AxiosResponse = await customAxios.post(`/accounts/signup/`, {
		email: email,
		password: password,
		nickname: nickname,
		code: code,
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

// email 인증코드 요청
export async function sendCode(email: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/send/code/`,
		{
			email: email,
		}
	);
	return response;
}

// email 인증코드 요청
export async function checkCode(email: string, code: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/verify/email/`,
		{
			email: email,
			code: code,
		}
	);
	return response;
}

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
export async function deleteUser() {
	const response: AxiosResponse = await customAxios.delete(
		`/accounts/withdrawal/`
	);
	return response;
}

//카카오로그인 요청 후 인가코드 전송
export async function kakao(code: string) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/kakao/callback/`,
		{ code: code }
	);
	return response;
}

export async function getTest(data: object) {
	const response: AxiosResponse = await customAxios.post(
		`/accounts/test/`,
		data
	);
	return response;
}
