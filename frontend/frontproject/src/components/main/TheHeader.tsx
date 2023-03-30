import styles from '../../assets/css/TheHeader.module.css'
import { colorAtom, menuState, tokenAtom } from '../../atoms'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { useNavigate } from 'react-router-dom'
import menuIcon from '../../assets/menu.png'
import Swal from 'sweetalert2'
import { deleteUser } from '../../api/userAPI'

const TheHeader = () => {
  const navigation = useNavigate()
  const color = useRecoilValue(colorAtom)
  const setMenu = useSetRecoilState(menuState)
  const SetToken = useSetRecoilState(tokenAtom)
  const [user, setUser] = useRecoilState(tokenAtom)

  // 회원정보
  const MyInfo = () => {
    const userEmail = sessionStorage.getItem('userEmail')
    const userNick = sessionStorage.getItem('userNick')
    Swal.fire({
      title: `${userNick}`,
      text: `${userEmail}`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '회원탈퇴',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '탈퇴하시겠습니까?',
          text: '이야기와 단어장 정보가 모두 사라집니다!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '회원 탈퇴',
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await deleteUser()
              if (response.data.status === 200) {
                Swal.fire('탈퇴성공!', 'Your file has been deleted.', 'success')
                navigation('/')
              }
            } catch (error) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '탈퇴실패했습니다.',
              })
            }
          }
        })
      }
    })
  }
  // 로그아웃
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('userNick')
    SetToken(null)

    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      },
    })

    Toast.fire({
      icon: 'success',
      title: '로그아웃 성공',
    })

    navigation('/')
  }

  return (
    <header className={`${styles['header']} `}>
      <div className={styles.contents}>
        {user === null ? null : (
          <>
            <button
              className={styles.btn}
              onClick={() => {
                navigation('/library')
              }}
            >
              ARTICLE
            </button>
            <button
              className={styles.btn}
              onClick={() => {
                navigation('/vocabulary')
              }}
            >
              WORD
            </button>
          </>
        )}

        <div
          className={styles.logo}
          onClick={() => {
            navigation('/')
          }}
        >
          picstory
        </div>
        {user === null ? null : (
          <>
            <button className={`${styles['iconBox']}`} onClick={logout}>
              <img
                className={`${styles['icon']}`}
                src="https://cdn-icons-png.flaticon.com/512/3889/3889524.png"
                alt=""
              />
            </button>
            <button className={`${styles['iconBox']}`} onClick={MyInfo}>
              <img
                className={`${styles['icon']}`}
                src="https://cdn-icons-png.flaticon.com/512/151/151776.png"
                alt=""
              />
            </button>
          </>
        )}
      </div>
      <button
        className={styles.menuIcon}
        onClick={() => {
          setMenu(true)
        }}
      >
        <img src={menuIcon} width={30} alt="" />
      </button>
    </header>
  )
}

export default TheHeader
