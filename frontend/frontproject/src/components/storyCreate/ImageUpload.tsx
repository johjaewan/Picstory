import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { ImageBit } from '../../atoms'
import { ImageFile } from '../../atoms'
import { loadingAtom } from '../../atoms'
import Loading from './loading'

import styles from '../../assets/css/ImageUpload.module.css'

export default function ImageUpload() {
  const [bitImage, setBitImage] = useRecoilState(ImageBit) // 이미지 파일 base64
  const [imageName, setImageName] = useState('') // 이미지 파일 base64
  const [imageFile, setImageFile] = useRecoilState(ImageFile) // 이미지 파일 base64
  const [loading, setLoading] = useRecoilState(loadingAtom)

  const setImageFromFile = (e: any): Promise<void> => {
    let file = e.target.files[0]
    setImageFile(file)
    const reader = new FileReader()
    reader.readAsDataURL(file)

    if (
      file.type != 'image/jpg' &&
      file.type != 'image/png' &&
      file.type != 'image/jpeg' &&
      file.type != 'image/JPG' &&
      file.type != 'image/PNG' &&
      file.type != 'image/JPEG'
    ) {
      alert('이미지 파일을 업로드 해주세요')
      return new Promise(() => {})
    }

    return new Promise((resolve) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBitImage(reader.result)
          setImageName(e.target.files[0].name)
          resolve()
        }
      }
    })
  }

  return (
    // 이미지 태그에는 alt가 있어야한다는 경고 문구가 떠서 수정 확인 요청
    <>
      {loading ? null : (
        <div className={styles.filebox}>
          <div>
            {bitImage != '' ? (
              <div className={styles.image_box}>
                <img id={styles.image} src={bitImage} />
              </div>
            ) : (
              <div className={styles.image_box}>
                <label id={styles.image_label} htmlFor="file">
                  <img
                    id={styles.upload_icon}
                    src="https://cdn-icons-png.flaticon.com/512/3097/3097412.png"
                  ></img>
                </label>
              </div>
            )}
          </div>
          <input className={styles.upload_name} value={imageName} />
          <label id={styles.bottom_label} htmlFor="file">
            파일찾기
          </label>
          <input type="file" id="file" onChange={setImageFromFile} />
        </div>
      )}
    </>
  )
}
