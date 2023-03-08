import { useState } from 'react'
import '../../assets/css/storyCreatePageStyle.css'
export default function ImageUpload() {
  const [fileImage, setFileImage] = useState('') // 이미지 파일 base64
  const [fileName, setFileName] = useState('') // 이미지 파일 base64

  const setImageFromFile = (e: any): Promise<void> => {
    const reader = new FileReader()
    reader.readAsDataURL(e.target.files[0])

    return new Promise((resolve) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          console.log(reader.result)
          setFileImage(reader.result)
          setFileName(e.target.value)
          resolve()
        }
      }
    })
  }

  return (
    <div className="filebox">
      {' '}
      <div>
        {fileImage !== '' ? (
          <div className="image-box">
            <img id="image" src={fileImage} />
          </div>
        ) : (
          <div className="image-box">
            <label id="image-label" htmlFor="file">
              <img
                id="upload-icon"
                src="https://cdn-icons-png.flaticon.com/512/3097/3097412.png"
              ></img>
            </label>
          </div>
        )}
      </div>
      <input className="upload-name" value={fileName} />
      <label id="bottom-label" htmlFor="file">
        파일찾기
      </label>
      <input type="file" id="file" onChange={setImageFromFile} />
    </div>
  )
}
