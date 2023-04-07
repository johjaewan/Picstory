import styles from './assets/css/main.module.css'
const VideoPlayer = () => {
  return (
    <>
      <video className={styles.video} autoPlay loop muted width="250">
        <source src="/videos/video.mp4" type="video/mp4" />
      </video>
    </>
  )
}

export default VideoPlayer
