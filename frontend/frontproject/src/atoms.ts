import { atom } from 'recoil'

export const ImageBit = atom({
  key: 'ImageBit',
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
