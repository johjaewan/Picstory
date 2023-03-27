import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/userAPI";

import styles from '../../assets/css/testLogin.module.css'

function LoginForm(){

  type FormData = {
    email: string;
    password: string;
  };
  
  const navigate = useNavigate();
  // 로그인 제출
  const onSubmit = async (data: FormData) => {

    try {
      const res = await login(data.email, data.password);
      console.log("res 로그인", res);
      // 로그인 요청 성공 시 토큰과 유저정보 저장 후 페이지 이동
      const result = res.data;
      if (res.status === 200) {
        // sessionStorage에 이메일과 닉네임 저장
        sessionStorage.setItem("userEmail", result.email);
        sessionStorage.setItem("userNick", result.nickname);
        // localStorage에 토큰 저장
        localStorage.setItem(
          "access_token",
          JSON.stringify(result.access_token)
        );
        localStorage.setItem(
          "refresh_token",
          JSON.stringify(result.refresh_token)
        );
        //mainPage로 이동하기
        navigate("/");
      }
    } catch (error) {
      alert("존재하지 않는 회원입니다.에러따라 메세지다르게");
      console.log(error);
    }
  }

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty, errors }
  } = useForm<FormData>();

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="text"
        placeholder="이메일을 입력해주세요."
        aria-invalid={!isDirty ? undefined : errors.email ? "true" : "false"}
        {...register("email", {
          required: "이메일은 필수 입력입니다.",
          pattern: {
            value: /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
            message: "이메일 형식에 맞지 않습니다."
          }
        })}
      />
      {errors.email && <small role="alert">{errors.email.message}</small>}
      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        type="password"
        placeholder="비밀번호를 입력해주세요."
        aria-invalid={!isDirty ? undefined : errors.password ? "true" : "false"}
        {...register("password", {
          required: "비밀번호는 필수 입력입니다.",
          minLength: {
            value: 8,
            message: "8자리 이상 비밀번호를 사용하세요."
          },
          pattern: {
            value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/,
            message: "비밀번호 형식에 맞지 않습니다."
          }
        })}
      />
      {errors.password && <small role="alert">{errors.password.message}</small>}
      <button type="submit" disabled={isSubmitting}>
        로그인
      </button>
    </form>
  );
}

export default LoginForm;
