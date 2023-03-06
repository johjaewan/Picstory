import { Link } from 'react-router-dom'

export default function Main() {
  return (
    <div className="App">
      <Link to="/storyCreatePage">
        <button>click</button>
      </Link>
    </div>
  )
}
