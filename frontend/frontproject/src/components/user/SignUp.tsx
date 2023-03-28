import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signup, emailCheck, sendCode, checkCode } from "../../api/userAPI";
import styles from "../../assets/css/testLogin.module.css";

function SignUp() {
	const navigate = useNavigate();
	//리액트 훅 폼 등록
	const {
		register,
		handleSubmit,
		getValues,
		watch,
		trigger,
		formState: { isSubmitting, isDirty, errors },
		// isDirty는 어떤 필드든 사용자 입력이 있었는지 확인할 때 사용
	} = useForm<FormData>({
		mode: "onChange",
	});
	//알림창 등록 및 커스텀
	const Toast = Swal.mixin({
		toast: true,
		position: "top",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	const password = useRef<string>();
	password.current = watch("password");

	const [isEmailDuple, setEmailDuple] = useState(false);
	const [isEmailConfirmed, setEmailConfirmed] = useState(false);
	// FormData 타입정의
	type FormData = {
		email: string;
		password: string;
		configPassword: string;
		nickname: string;
		code: string;
	};

	//이메일 중복체크
	const onEmailCheck = async () => {
		const result = await trigger("email");
		if (result) {
			try {
				const email = getValues("email");
				const res = await emailCheck(email);
				if (res.data.result === false) {
					Toast.fire({
						icon: "success",
						title: "사용 가능한 메일입니다.😊",
					});
					setEmailDuple(true);
				} else {
					Toast.fire({
						icon: "error",
						title: "이미 등록된 메일입니다. 다시 입력해주세요.",
					});
				}
			} catch (error) {
				Toast.fire({
					icon: "error",
					title: "이메일 중복 체크 실패",
				});
				console.log(error);
			}
		}
	};

	//이메일 인증 코드 보내기
	const onEmailCodeSend = async () => {
		const result = await trigger("email");
		if (result && !isEmailDuple) {
			Toast.fire({
				icon: "error",
				title: "이메일 중복 확인을 해주세요.",
			});
			return;
		}
		if (result && isEmailDuple) {
			try {
				const email = getValues("email");
				const res = await sendCode(email);
				if (res.status === 200) {
					Toast.fire({
						icon: "success",
						title: "해당 이메일에서 인증 코드를 확인해주세요.",
					});
				}
			} catch (error) {
				Toast.fire({
					icon: "error",
					title: "인증코드 전송이 실패되었습니다.",
				});
				console.log(error);
			}
		}
	};

	//이메일 인증 코드 확인 요청
	const onEmailCodeCheck = async () => {
		const result = await trigger("code");
		if (result) {
			const email = getValues("email");
			const code = getValues("code");
			const res = await checkCode(email, code);
			try {
				if (res.data.result === true) {
					Toast.fire({
						icon: "success",
						title: "인증 되었습니다.",
					});
					setEmailConfirmed(true);
				} else {
					Toast.fire({
						icon: "warning",
						title: "올바른 인증코드를 작성해주세요.",
					});
				}
			} catch (error) {
				Toast.fire({
					icon: "warning",
					title: "인증코드 전송이 실패했습니다.",
				});
				console.log(error);
			}
		}
	};

	// 회원가입 제출
	const onSubmit = async (data: FormData) => {
		if (!isEmailConfirmed) {
			Toast.fire({
				icon: "error",
				title: "이메일 인증코드를 확인해주세요.",
			});
			return;
		}
		try {
			const res = await signup(
				data.email,
				data.password,
				data.nickname,
				data.code
			);
			console.log("res 회원가입: ", res);
			// 회원가입 요청 성공 시 메인 페이지 이동
			if (res.status === 200) {
				Toast.fire({
					icon: "success",
					title: "회원가입 완료!",
				});
				setEmailDuple(false);
				setEmailConfirmed(false);
				navigate("/");
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "회원가입 실패",
			});
			console.log(error);
		}
	};

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
				이메일 중복 체크
			</button>
			<br />
			<br />
			<label htmlFor="text">이메일 인증코드</label>
			<input
				id="code"
				type="text"
				placeholder="이메일 주소의 인증코드를 확인해주세요"
				aria-invalid={!isDirty ? undefined : errors.code ? "true" : "false"}
				{...register("code", {
					required: "이메일 인증코드는 필수 입력입니다.",
				})}
			/>
			{errors.code && <small role="alert">{errors.code.message}</small>}
			<button type="button" onClick={onEmailCodeSend}>
				이메일 인증코드 전송
			</button>
			<button type="button" onClick={onEmailCodeCheck}>
				이메일 인증코드 체크
			</button>
			<br />
			<br />
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
			<br />
			<br />
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
			<br />
			<br />
			<label htmlFor="configPassword">비밀번호 확인</label>
			<input
				id="configPassword"
				type="password"
				placeholder="특수문자, 영어 대/소문자, 숫자 포함 8글자 이상 "
				aria-invalid={
					!isDirty ? undefined : errors.configPassword ? "true" : "false"
				}
				{...register("configPassword", {
					required: "비밀번호는 필수 입력입니다.",
					validate: (value) => value === password.current,
				})}
			/>

			{errors.configPassword && (
				<small role="alert">
					{errors.configPassword.type === "required"}
					<p> 비밀번호 확인은 필수 값입니다.</p>
				</small>
			)}
			{errors.configPassword && (
				<small role="alert">
					{errors.configPassword.type === "validate"}
					<p>위의 비밀번호와 같지 않습니다.</p>
				</small>
			)}
			<br />
			<br />
			<button type="submit" disabled={isSubmitting}>
				회원가입
			</button>
		</form>
	);
}

export default SignUp;
