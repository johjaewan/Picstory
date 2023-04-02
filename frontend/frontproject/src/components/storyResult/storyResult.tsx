import { useRecoilValue } from 'recoil'
import { language, storyEn, storyKo } from '../../atoms'

// 이야기 결과

function StoryResult() {
  const storyResultEn = useRecoilValue(storyEn)
  const storyResultKo = useRecoilValue(storyKo)

  const lang = useRecoilValue(language)

  // return <>{lang ? storyResultEn : storyResultKo}</>
  return <>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex esse velit eligendi commodi fugiat possimus, alias, iure, assumenda aperiam et voluptates. Esse, veniam quia soluta harum odio debitis. Atque, necessitatibus.Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex esse velit eligendi commodi fugiat possimus, alias, iure, assumenda aperiam et voluptates. Esse, veniam quia soluta harum odio debitis. Atque, necessitatibus.Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex esse velit eligendi commodi fugiat possimus, alias, iure, assumenda aperiam et voluptates. Esse, veniam quia soluta harum odio debitis. Atque, </>
}

export default StoryResult
