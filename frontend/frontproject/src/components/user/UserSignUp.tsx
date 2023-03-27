import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { signup, emailCheck } from "../../api/userAPI";

import styles from "../../assets/css/testLogin.module.css";

function SignUp() {
	const navigate = useNavigate();
	const { watch } = useForm();
	// console.log(watch("password"));

	const password = useRef();
	password.current = watch("password");

	type FormData = {
		email: string;
		password: string;
		configPassword: string;
		nickname: string;
	};

	//이메일 중복체크
	const onEmailCheck = async () => {
		const email = getValues("email");
		console.log("email입니다", email);
		try {
			const res = await emailCheck(email);
			console.log("이메일중복체크응답res.data:", res.data);
			console.log("이메일중복체크응답res.data:", res);

			if (res.status === 200) {
				alert("사용 가능한 메일입니다.😊");
			}
		} catch (error) {
			alert("이미 등록된 메일입니다. 다시 입력해주세요.");
			console.log(error);
		}
	};

	// 회원가입 제출
	const onSubmit = async (data: FormData) => {
		try {
			const res = await signup(data.email, data.password, data.nickname);
			console.log("res 회원가입: ", res);
			// 회원가입 요청 성공 시 메인 페이지 이동
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
			alert("회원가입 실패");
			console.log(error);
		}
	};

	const {
		register,
		handleSubmit,
		getValues,
		formState: { isSubmitting, isDirty, errors },
		// isDirty는 어떤 필드든 사용자 입력이 있었는지 확인할 때 사용
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
						value:
							/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
						message: "이메일 형식에 맞지 않습니다.",
					},
				})}
			/>
			{errors.email && <small role="alert">{errors.email.message}</small>}
			<button type="button" onClick={onEmailCheck}>
				이메일중복확인
			</button>
			<label htmlFor="nickname">닉네임</label>
			<input
				id="nickname"
				type="text"
				placeholder="닉네임은 2글자 이상, 영어,숫자, 한글 사용가능"
				aria-invalid={!isDirty ? undefined : errors.nickname ? "true" : "false"}
				{...register("nickname", {
					required: "닉네임은 필수 입력입니다.",
					pattern: {
						value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{2,8}$/,
						message: "닉네임 형식에 맞지 않습니다.",
					},
				})}
			/>
			{errors.nickname && <small role="alert">{errors.nickname.message}</small>}

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
						message: "8자리 이상 비밀번호를 사용하세요.",
					},
					pattern: {
						value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/,
						message: "비밀번호 형식에 맞지 않습니다.",
					},
				})}
			/>
			{errors.password && <small role="alert">{errors.password.message}</small>}
			<label htmlFor="password">비밀번호 확인</label>
			<input
				id="configPassword"
				type="password"
				placeholder="특수문자, 영어대/소문자, 숫자 포함 8글자 이상 "
				aria-invalid={
					!isDirty ? undefined : errors.configPassword ? "true" : "false"
				}
				{...register("password", {
					required: "비밀번호는 필수 입력입니다.",
					validate: (value) => value === password.current,
				})}
			/>
			{errors.configPassword && (
				<small role="alert">
					{errors.configPassword.type === "required"} &&
					<p> 비밀번호 확인은 필수 값입니다.</p>
				</small>
			)}
			{errors.configPassword && (
				<small role="alert">
					{errors.configPassword.type === "validate"}&&
					<p>위의 비밀번호와 같지 않습니다.</p>
				</small>
			)}

			<button type="submit" disabled={isSubmitting}>
				회원가입
			</button>
		</form>
	);
}

export default SignUp;
