import { atom } from 'recoil'

export const userId = atom({
  key: 'userId',
  default: null,
})

export const ImageBit = atom({
  key: 'ImageBit',
  default: '',
})

export const ImageFile = atom({
  key: 'ImageFile',
  default: '',
})

export const genreAtom = atom({
  key: 'genreAtom',
  default: '',
})

export const loadingAtom = atom({
  key: 'loadingAtom',
  default: false,
})

export const storyAtom = atom({
  key: "story",
  default: '',
});

//이야기 생성 결과 타입
export interface storyResultTypes {
  content_kr: string,
  content_en: string,
  voice_kr: string,
  voice_en: string,
}
//이야기 생성 결과
export const storyResultAtom = atom<storyResultTypes>({
  key: "storyResultAtom",
  default: {
    content_kr: '',
    content_en: '',
    voice_kr: '',
    voice_en: '',
  },
});
// 모달 상태
export const modalState = atom({
  key: "modalState",
  default: false,
});