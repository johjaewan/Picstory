import { getStoryList } from '../api/libraryApi'
import { useCallback, useEffect, useState } from 'react'
import Card from '../components/storyResult/card'
import { useNavigate } from 'react-router-dom'
export default function LibraryPage() {
  const navigate = useNavigate()

  // 이야기 리스트
  interface storyDetailsType {
      created_at: string
      id: number
      title: string
      image: string
      genre: string
  }

  const [newlistItems, setNewListItems] = useState<storyDetailsType[]>([])
  // 이야기 받아오기
  const handleLoad = useCallback(
    
    async () => {
      try{
        const response = await getStoryList(1);
        if (!response) return;
  
        const item = response.data;
        
        setNewListItems((prevItems) => [...prevItems, ...item]);
      }
      catch(error) {
        navigate('/404')
      }
    },
    [navigate]
  );

  useEffect(() => {
    handleLoad()
  }, [handleLoad])

  return (
    <section className="mx-auto mt-[50px] aut xl:w-8/12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5 justify-items-center min-w-fit ">
      {newlistItems.map((item, idx) => {
          return (
            <div key={idx} onClick={() => {
              window.location.href = `storyDetail/${item.id}`
            }}>
              <Card imageSrc={item.image} title={item.title} id={item.id}></Card>
            </div>
          )
      })}
    </section>

  )
}
