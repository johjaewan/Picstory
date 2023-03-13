import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getStory } from '../api/storyApi'

const StoryDetailPage = ({ match }: any) => {
  const params = useParams()
  const id = Number(params.id)
  useEffect(() => {
    getStoryItem()
  }, [])
  const getStoryItem = async () => {
    const response = await getStory(id)
  }

  return (
    <>
      <div>{id}</div>
    </>
  )
}

export default StoryDetailPage
