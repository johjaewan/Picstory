import styles from '../assets/css/libraryPage.module.css'
import { getStoryList } from '../api/libraryApi'
import { useEffect, useState } from 'react'

export default function LibraryPage() {
  const [listItems, setListItems] = useState([
    {
      created_at: '',
      id: -1,
      title: '',
      image: '',
      genre: '',
    },
  ])

  useEffect(() => {
    setListItems(listItems.filter((item) => item.id !== -1))
    console.log('useEffect')
    getList()
  }, [])

  const getList = async () => {
    const response = await getStoryList(1)
    console.log(response.data)
    response.data.forEach((item: any) =>
      setListItems((listItems) => [...listItems, item]),
    )
  }

  return (
    <div className={styles.container}>
      {listItems.map((item, idx) => {
        //listItem -> listItems로 바꾸기
        // 확인 요청. Warning: Each child in a list should have a unique "key" prop. 키 값 필요.
        if ((idx + 1) % 3 === 0)
          return (
            <>
              <div
                className={styles.item_box}
                onClick={() => {
                  window.location.href = `storyDetail/${item.id}`
                }}
              >
                <img
                  className={styles.image}
                  src={item.image}
                  alt="imageName"
                ></img>
                <div className={styles.title}>{item.title}</div>
              </div>
              <div className={styles.clear_line}></div>{' '}
            </>
          )
        else if ((idx + 1) % 3 === 2)
          return (
            <div
              className={styles.item_box_second}
              onClick={() => {
                window.location.href = `storyDetail/${item.id}`
              }}
            >
              <img
                className={styles.image}
                src={item.image}
                alt="imageName"
              ></img>
              <div className={styles.title}>{item.title}</div>
            </div>
          )
        else
          return (
            <div
              className={styles.item_box}
              onClick={() => {
                window.location.href = `storyDetail/${item.id}`
              }}
            >
              <img
                className={styles.image}
                src={item.image}
                alt="imageName"
              ></img>
              <div className={styles.title}>{item.title}</div>
            </div>
          )
      })}
    </div>
  )
}
