import { atom } from 'recoil'

//로그인 된 사용자
export const userId = atom({
  key: 'userId',
  default: 1,
})

export const ImageBit = atom({
  key: 'ImageBit',
  default: '',
})

export const ImageFile = atom({
  key: 'ImageFile',
  default: '',
})
//장르
export const genreAtom = atom({
  key: 'genreAtom',
  default: '',
})
//로딩
export const loadingAtom = atom({
  key: 'loadingAtom',
  default: false,
})
// 영어 이야기 생성 결과
export const storyEn = atom({
	key: "storyEn",
	default: "",
});
// 한글 이야기 생성 결과
export const storyKo = atom({
	key: "storyKo",
	default: "",
});
// 오디오 생성 결과
export const storyVoice = atom({
	key: "storyVoice",
	default: '',
});
// 모달 상태
export const modalState = atom({
  key: "modalState",
  default: false,
});
//배경음악 플레이, 일시정지
export const playState = atom<boolean>({ 
  key: 'playState',
  default: false,
});
//음성파일 플레이, 일시정지
export const audioState = atom<boolean>({ 
  key: 'audioState',
  default: false,
});

