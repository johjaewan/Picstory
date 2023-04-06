import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import Swal from 'sweetalert2'
import { login } from '../../api/userAPI'
import styles from '../../assets/css/Login.module.css'
import { tokenAtom } from '../../atoms'
// import kImg from "../../assets/kakao1.png";
function LoginForm() {
  type FormData = {
    email: string
    password: string
  }
  const SetToken = useSetRecoilState(tokenAtom)
  const navigate = useNavigate()
  // 로그인 제출
  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data.email, data.password)
      // 로그인 요청 성공 시 토큰과 유저정보 저장 후 페이지 이동
      const result = res.data
      if (res.status === 200) {
        // sessionStorage에 이메일과 닉네임 저장
        sessionStorage.setItem('userEmail', result.email)
        sessionStorage.setItem('userNick', result.nickname)
        // localStorage에 토큰 저장
        localStorage.setItem(
          'access_token',
          JSON.stringify(result.access_token),
        )
        localStorage.setItem(
          'refresh_token',
          JSON.stringify(result.refresh_token),
        )

        SetToken(JSON.stringify(result.access_token))
        //mainPage로 이동하기
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
          title: `${result.nickname}님 안녕하세요!`,
        })

        navigate('/')
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
      })
      console.log(error)
    }
  }

  //카카오 로그인 페이지로 이동
  const handleClick = () => {
    window.location.href = 'http://j8d103.p.ssafy.io/api/accounts/kakao/login/'
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors },
  } = useForm<FormData>()

  return (
    <>
      <div className={styles.title}>Sign in</div>
      <div className={styles.container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.emailBox}>
            <label className={styles.label} htmlFor="email">
              E-MAIL
            </label>
            <input
              id={styles.inputEmail}
              type="text"
              placeholder="Please enter your e-mail"
              aria-invalid={
                !isDirty ? undefined : errors.email ? 'true' : 'false'
              }
              {...register('email', {
                required: '이메일은 필수 입력입니다.',
                pattern: {
                  value: /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
                  message: '이메일 형식에 맞지 않습니다.',
                },
              })}
            />
            <div className={styles.emailAlert}>
              {errors.email && (
                <small role="alert">{errors.email.message}</small>
              )}
            </div>
          </div>

          <div className={styles.pwdBox}>
            <label className={styles.label} htmlFor="password">
              PW
            </label>
            <input
              id={styles.inputPwd}
              type="password"
              placeholder="Please enter your password"
              aria-invalid={
                !isDirty ? undefined : errors.password ? 'true' : 'false'
              }
              {...register('password', {
                required: '비밀번호는 필수 입력입니다.',
                minLength: {
                  value: 8,
                  message: '8자리 이상 비밀번호를 사용하세요.',
                },
                pattern: {
                  value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/,
                  message: '비밀번호 형식에 맞지 않습니다.',
                },
              })}
            />
            <div className={styles.pwdAlert}>
              {errors.password && (
                <small role="alert">{errors.password.message}</small>
              )}
            </div>
          </div>
          <div className={styles.buttonBox}>
            <button
              className={styles.btn}
              type="submit"
              disabled={isSubmitting}
            >
              LOGIN
            </button>
            <button
              className={styles.btn}
              onClick={() => {
                navigate('/signUp')
              }}
            >
              SIGN UP
            </button>

            <div
              className={styles.btn}
              onClick={handleClick}
              style={{
                backgroundColor: '#FEE500',
                color: '#000000',
              }}
            >
              KAKAO
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default LoginForm
