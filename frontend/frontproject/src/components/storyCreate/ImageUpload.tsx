import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { ImageBit } from '../../atoms'
import { loadingAtom } from '../../atoms'
import Loading from './loading'

import styles from '../../assets/css/ImageUpload.module.css'

export default function ImageUpload() {
  const [fileImage, setFileImage] = useRecoilState(ImageBit) // 이미지 파일 base64
  const [fileName, setFileName] = useState('') // 이미지 파일 base64
  const [loading, setLoading] = useRecoilState(loadingAtom)

  const setImageFromFile = (e: any): Promise<void> => {
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])

    return new Promise((resolve) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFileImage(reader.result)
          setFileName(e.target.value)
          resolve()
        }
      }
    })
  }

  return (
    <>
      <div className={styles.filebox}>
        <div>
          {fileImage != '' ? (
            <div className={styles.image_box}>
              <img id={styles.image} src={fileImage} />
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
        <input className={styles.upload_name} value={fileName} />
        <label id={styles.bottom_label} htmlFor="file">
          파일찾기
        </label>
        <input type="file" id="file" onChange={setImageFromFile} />
      </div>
    </>
  )
}
