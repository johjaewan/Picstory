import { atom } from "recoil";

//로그인 된 사용자
export const userId = atom<number>({
	key: "userId",
	default: 1,
});
//로그인 된 사용자 닉네임
export const userEmail = atom<string>({
	key: "userEmail",
	default: "",
});
//로그인 된 사용자 닉네임
export const userNickName = atom<string>({
	key: "userNickName",
	default: "",
});
// 업로드 된 이미지
export const ImageBit = atom<string>({
	key: "ImageBit",
	default: "",
});
// 업로드 된 이미지
export const ImageFile = atom<string>({
	key: "ImageFile",
	default: "",
});
//장르
export const genreAtom = atom<string>({
	key: "genreAtom",
	default: "",
});
//로딩
export const loadingAtom = atom<boolean>({
	key: "loadingAtom",
	default: false,
});
// 영어 이야기 생성 결과
export const storyEn = atom<string>({
	key: "storyEn",
	default: "",
});
// 한글 이야기 생성 결과
export const storyKo = atom<string>({
	key: "storyKo",
	default: "",
});
// 오디오 생성 결과
export const voiceAtom = atom<string>({
	key: "voiceAtom",
	default: "",
});
// 모달 상태
export const modalState = atom<boolean>({
	key: "modalState",
	default: false,
});
// 메뉴 모달 상태
export const menuState = atom<boolean>({
	key: "menuState",
	default: false,
});
// 언어 상태
export const language = atom<boolean>({
	key: "language",
	default: true,
});
// 테마 색
export const colorAtom = atom<string>({
	key: "colorAtom",
	default: "red",
});
// 이야기 생성 로딩 끝
export const isFinished = atom<boolean>({
  key: 'isFinished',
  default: false,
})