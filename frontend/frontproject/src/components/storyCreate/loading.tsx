import { useEffect, useState } from 'react'
import '../../assets/css/loading.css'
export default function Loading() {
  const [ranNumber, setRanNumber] = useState(0)
  useEffect(() => {
    console.log('!!')
    let num = Math.floor(Math.random() * 3)
    setRanNumber(num)
  }, [])

  const tmiList = [
    '일반적으로 대한민국에서는 200자 원고지 150매 이내의 소설을 단편소설이라고 해요',
    'qweqwe',
    'xcvcxv',
  ]
  return (
    <>
      <div id="loading-box">
        <img
          id="loading-img"
          src="https://media4.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e47gujet56koyo8xbaxuz91en6vqkysiqm9n61pqrco&rid=giphy.gif&ct=g"
        />
        <div id="loading-title">
          TMI{' '}
          <img
            id="light-icon"
            src="https://cdn-icons-png.flaticon.com/512/566/566359.png"
          ></img>{' '}
          <div id="loading-coment">{tmiList[ranNumber]}</div>
        </div>
      </div>
    </>
  )
}
