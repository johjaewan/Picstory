import { atom } from 'recoil'

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
  key: 'story',
  default: '',
})
