import styles from '../assets/css/libraryPage.module.css'
import { getStoryList } from '../api/libraryApi'
import { useEffect } from 'react'

export default function LibraryPage() {
  const listItems: any[] = []

  useEffect(() => {
    console.log('useEffect')
    getList()
  }, [])

  const getList = async () => {
    // const response = await getStoryList(1)
    // response.data.forEach((item: any) => listItems.push(item))
  }

  const listItem = [
    {
      title: '사진',
      img:
        'https://cdn.pixabay.com/photo/2021/08/23/01/03/cubic-house-6566412_960_720.jpg',
      id: 1,
    },
    {
      title: '사진2',
      img:
        'https://cdn.pixabay.com/photo/2021/08/08/14/16/road-6531031_960_720.jpg',
      id: 2,
    },
    {
      title: '사진3',
      img:
        'https://cdn.pixabay.com/photo/2013/08/20/15/47/poppies-174276_960_720.jpg',
      id: 3,
    },
    {
      title: '사진4',
      img:
        'https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg',
      id: 4,
    },
    {
      title: '사진5',
      img:
        'https://cdn.pixabay.com/photo/2017/12/11/15/34/lion-3012515_960_720.jpg',
      id: 5,
    },
    {
      title: '사진6',
      img:
        'https://cdn.pixabay.com/photo/2018/10/01/09/21/pets-3715733_960_720.jpg',
      id: 6,
    },
    {
      title: '사진7',
      img:
        'https://cdn.pixabay.com/photo/2015/04/20/17/39/man-731900_960_720.jpg',
      id: 7,
    },
    {
      title: '사진8',
      img:
        'https://cdn.pixabay.com/photo/2016/11/23/13/48/beach-1852945_960_720.jpg',
      id: 8,
    },
    {
      title: '사진9',
      img:
        'https://cdn.pixabay.com/photo/2016/11/23/13/48/beach-1852945_960_720.jpg',
      id: 9,
    },
  ]

  return (
    <div className={styles.container}>
      {listItem.map((item, idx) => {
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
                  src={item.img}
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
                src={item.img}
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
                src={item.img}
                alt="imageName"
              ></img>
              <div className={styles.title}>{item.title}</div>
            </div>
          )
      })}
    </div>
  )
}
