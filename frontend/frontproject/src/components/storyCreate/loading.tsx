import { useEffect, useState } from 'react'
import spinner from '../../assets/spinner.gif'
import '../../assets/css/loading.css'
export default function Loading() {
  const [ranNumber, setRanNumber] = useState(0)
  // useEffect(() => {
  //   console.log('!!')
  //   let num = Math.floor(Math.random() * 3)
  //   setRanNumber(num)
  // }, [])

  const tmiList = [
    '일반적으로 대한민국에서는 200자 원고지 150매 이내의 소설을 단편소설이라고 해요',
    'qweqwe',
    'xcvcxv',
  ]
  return (
    <>
      <div id="loading-box">
        <img id="loading-img" src={spinner} />
        <div id="loading-title">
          TMI
          <div id="loading-coment">
            {tmiList[Math.floor(Math.random() * 3)]}
          </div>
        </div>
      </div>
    </>
  )
}
