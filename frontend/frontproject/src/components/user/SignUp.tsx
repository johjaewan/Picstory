import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { signup, emailCheck, sendCode, checkCode } from "../../api/userAPI";
import styles from "../../assets/css/SignUp.module.css";

function SignUp() {
	const navigate = useNavigate();

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
		timer: 1500,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	const password = useRef<string>();
	password.current = watch("password");

	const [confirmedEmail, setConfirmedEmail] = useState<string>("");
	const [isEmailDuple, setEmailDuple] = useState<boolean>(false);
	const [isEmailConfirmed, setEmailConfirmed] = useState<boolean>(false);
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
					title: "인증코드 전송을 실패했습니다.",
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
					setConfirmedEmail(email);
				} else {
					Toast.fire({
						icon: "warning",
						title: "올바른 인증코드를 작성해주세요.",
					});
				}
			} catch (error) {
				Toast.fire({
					icon: "warning",
					title: "인증코드 전송을 실패했습니다.",
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
		if (data.email !== confirmedEmail) {
			Toast.fire({
				icon: "error",
				title: "인증된 이메일이 아닙니다.",
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
			// 회원가입 요청 성공 시 메인 페이지 이동
			if (res.status === 201) {
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
		<>
			<div className={styles.title}>Sign up</div>
			<form className={styles.formcontainer} onSubmit={handleSubmit(onSubmit)}>
				<div>
					<div className={styles.inputBox}>
						{/* 이메일 입력 */}
						<label className={styles.label} htmlFor='email'>
							E-MAIL
						</label>
						<input
							id='email'
							className={styles.inputEmail}
							type='text'
							placeholder='Please enter your e-mail'
							aria-invalid={
								!isDirty ? undefined : errors.email ? "true" : "false"
							}
							{...register("email", {
								required: "이메일은 필수 입력입니다.",
								pattern: {
									value:
										/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
									message: "이메일 형식에 맞지 않습니다.",
								},
							})}
						/>
						{/* 이메일 중복체크 버튼 */}
						<button className={styles.btn} type='button' onClick={onEmailCheck}>
							이메일 중복 체크
						</button>
						<div className={styles.emailAlert}>
							{errors.email && (
								<small role='alert'>{errors.email.message}</small>
							)}
						</div>
					</div>
					<div className={styles.inputBox}>
						{/* 이메일 인증코드 입력 */}
						<div className={styles.box}>
							<label className={styles.label} htmlFor='text'>
								E-MAIL 인증코드
							</label>
							<div className={styles.box2}>
								<input
									id='code'
									className={styles.inputCode}
									type='text'
									placeholder='email verification code.'
									aria-invalid={
										!isDirty ? undefined : errors.code ? "true" : "false"
									}
									{...register("code", {
										required: "이메일 인증코드는 필수 입력입니다.",
									})}
								/>
								{/* 사용자에게 인증코드 전송하는 버튼 */}
								<button
									className={styles.btn2}
									type='button'
									onClick={onEmailCodeSend}
								>
									<img
										className={styles.imgBtn}
										src='https://img.icons8.com/stickers/100/000000/sent.png'
										alt=''
									></img>
								</button>
								{/* 입력된 인증코드가 맞는지 확인하는 버튼 */}
								<button
									className={styles.btn2}
									type='button'
									onClick={onEmailCodeCheck}
								>
									<img
										className={styles.imgBtn}
										src='https://img.icons8.com/color/48/null/check-all--v1.png'
										alt=''
									/>
								</button>
							</div>
						</div>

						<div className={styles.alert}>
							{errors.code && <small role='alert'>{errors.code.message}</small>}
						</div>
					</div>
					<div className={styles.inputBox}>
						{/* 닉네임 입력 */}
						<label className={styles.label} htmlFor='nickname'>
							닉네임 <br />
						</label>
						<input
							id='nickname'
							className={styles.inputItem}
							type='text'
							placeholder='2글자 이상, 영어, 숫자, 한글 사용가능'
							aria-invalid={
								!isDirty ? undefined : errors.nickname ? "true" : "false"
							}
							{...register("nickname", {
								required: "닉네임은 필수 입력입니다.",
								pattern: {
									value: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{2,8}$/,
									message: "닉네임 형식에 맞지 않습니다.",
								},
							})}
						/>
						<div className={styles.alert}>
							{errors.nickname && (
								<small role='alert'>{errors.nickname.message}</small>
							)}
						</div>
					</div>
					<div className={styles.inputBox}>
						{/* 비밀번호 입력 */}
						<label className={styles.label} htmlFor='password'>
							비밀번호
							<br />
						</label>
						<input
							id='password'
							className={styles.inputItem}
							type='password'
							placeholder='특수문자, 영어, 숫자 포함 8글자 이상'
							aria-invalid={
								!isDirty ? undefined : errors.password ? "true" : "false"
							}
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
						<div className={styles.alert}>
							{errors.password && (
								<small role='alert'>{errors.password.message}</small>
							)}
						</div>
					</div>
					<div className={styles.inputBox}>
						{/* 비밀번호 확인 */}
						<label className={styles.label} htmlFor='configPassword'>
							비밀번호 확인
						</label>
						<input
							id='configPassword'
							className={styles.inputItem}
							type='password'
							placeholder='비밀번호를 한번 더 입력해주세요.'
							aria-invalid={
								!isDirty ? undefined : errors.configPassword ? "true" : "false"
							}
							{...register("configPassword", {
								required: "비밀번호는 필수 입력입니다.",
								validate: (value) => value === password.current,
							})}
						/>
						<div className={styles.alert}>
							{errors.configPassword && (
								<small role='alert'>
									{errors.configPassword.type === "required"}
									<p> 비밀번호 확인은 필수 값입니다.</p>
								</small>
							)}
							{errors.configPassword && (
								<small role='alert'>
									{errors.configPassword.type === "validate"}
									<p>위의 비밀번호와 같지 않습니다.</p>
								</small>
							)}
						</div>
					</div>

					{/* 회원가입버튼 */}
					<button
						className={styles.signbtn}
						type='submit'
						disabled={isSubmitting}
					>
						SIGN UP
					</button>
				</div>
			</form>
		</>
	);
}

export default SignUp;
