import { LockClosedIcon } from "@heroicons/react/20/solid";
import styles from "../../assets/css/UserSignUp.module.css";
import React, { useState, useCallback, ChangeEvent } from "react";
// import { useRecoilState, useRecoilCallback } from "recoil";
import { nicknameCheck, signup, emailCheck } from "../../api/userAPI";
import { Route } from "react-router-dom";
import Login from "./Login";

//email 유효성 검사 양식
const validateEmail = (email: string) => {
	return email
		.toLowerCase()
		.match(
			/([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
		);
};

//password 유효성 검사 양식
const validatePwd = (password: string) => {
	return password
		.toLowerCase()
		.match(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/);
};

//nickname 유효성 검사 양식
const validateNickname = (nickname: string) => {
	return nickname.toLowerCase().match(/^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|].{1,8}$/);
};

//유효성 검사로 이메일, 비밀번호, 닉네임 필터링해주기
const UserSignUp = () => {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPwd, setConfirmPwd] = useState<string>("");
	const [nickname, setNickname] = useState<string>("");

	const [emailMsg, setEmailMsg] = useState<string>("");
	const [pwdMsg, setPwdMsg] = useState<string>("");
	const [confirmPwdMsg, setConfirmPwdMsg] = useState<string>("");
	const [nicknameMsg, setNicknameMsg] = useState<string>("");

	//위에 있는 유효성 검사 함수로 정리하기
	const isEmailValid = validateEmail(email);
	console.log("isEmailValid=", isEmailValid);
	const isPwdValid = validatePwd(password);
	const isConfirmPwd = password === confirmPwd; //입력된 비밀번호와 비밀번호 확인 검사
	const isNicknameValid = validateNickname(nickname);

	//이메일 유효성 확인
	const onChangeEmail = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const currEmail: string = e.target.value;

			if (!validateEmail(currEmail)) {
				setEmailMsg("이메일 형식이 올바르지 않습니다.");
			} else {
				setEmailMsg("올바른 이메일 형식입니다.");
				setEmail(currEmail);
			}
		},
		[setEmail, validateEmail, setEmailMsg]
	);
	//비밀번호 유효성 확인
	const onChangePwd = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const currPwd: string = e.target.value;

			if (!validatePwd(currPwd)) {
				setPwdMsg("영문, 숫자, 특수기호 조합으로 8자리 이상 입력해주세요.");
			} else {
				setPwdMsg("안전한 비밀번호입니다.");
				setPassword(currPwd);
			}
		},
		[setPassword, validatePwd, setPassword]
	);

	//비밀번호 같은 지 확인
	const onChangeConfirmPwd = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const currConfirmPwd: string = e.target.value;

			if (currConfirmPwd !== password) {
				setConfirmPwdMsg("비밀번호가 일치하지 않습니다.");
			} else {
				setConfirmPwdMsg("비밀번호가 일치합니다.");
				setConfirmPwd(currConfirmPwd);
			}
		},
		[password]
	);

	//닉네임 유효성 확인
	const onChangeNickname = useCallback((e: ChangeEvent<HTMLInputElement>) => {
		const currNickname: string = e.target.value;

		if (!validateNickname(currNickname)) {
			setNicknameMsg("1글자 이상 9글자 미만으로 입력해주세요.");
		} else {
			setNicknameMsg("올바른 닉네임 형식입니다.");
			setNickname(currNickname);
		}
	}, []);

	//이메일, 닉네임 중복 확인
	const [checkMail, setCheckMail] = useState(false);
	const [checkNickname, setCheckNickname] = useState(false);

	const onCheckEmail = async () => {
		// e.preventDefault();
		console.log(email);
		try {
			const res = await emailCheck(email);
			console.log("res.data:", res.data);
			console.log("res.data.result:", res.data.result);
			const { result } = res.data.result;
			console.log("result", result);

			if (!result) {
				setEmailMsg("이미 등록된 메일입니다. 다시 입력해주세요.");
				setCheckMail(false);
				console.log(emailMsg);
			} else {
				setEmailMsg("사용 가능한 메일입니다.😊");
				setCheckMail(true);
				console.log(emailMsg);
			}
		} catch (err) {
			console.log("email중복검사", err);
		}
	};
	//닉네임 중복검사
	const onCheckNickname = async () => {
		console.log(nickname);
		try {
			const res = await nicknameCheck(nickname);
			const { result } = res.data.result;

			if (!result) {
				setNicknameMsg("이미 등록된 닉네임입니다. 다시 입력해주세요.");
				setCheckNickname(false);
				console.log(nicknameMsg);
			} else {
				setNicknameMsg("사용 가능한 닉네임입니다 😊");
				setCheckNickname(true);
				console.log(nicknameMsg);
			}
		} catch (err) {
			console.log("닉네임 중복검사", err);
		}
	};

	//가입하기 요청
	// const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	const onSubmit = async (e: any) => {
		e.preventDefault();

		try {
			const res = await signup(email, password, nickname);
			console.log("res.data", res.data);

			const { result } = res.data;

			if (result) {
				//loginPage로 이동하기
				alert("회원가입 완료!!");
				<Route path="/" element={<Login />}></Route>;
			}
		} catch (err) {
			alert("회원가입 실패!!");
			console.log(err);
		}
	};

	//앞에서 선언한 msg들 클릭이벤트핸들러
	const onEmailMsgHandler = () => alert(emailMsg);
	const onpwdMsgHandler = () => alert(pwdMsg);
	const onConfirmPwdMsgHandler = () => alert(confirmPwdMsg);
	const onNickMsgHandler = () => alert(nicknameMsg);

	// 가입 버튼 활성화
	// 앞에 정리한 유효성 검사를 한번에 묶어주고
	// const isAllValid =
	// 	isEmailValid &&
	// 	isPwdValid &&
	// 	isConfirmPwd &&
	// 	isNicknameValid &&
	// 	checkMail &&
	// 	checkNickname;

	// return 부분에서 disabled 값으로 제어해줌
	return (
		<>
			<div
				className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8"
				style={{
					paddingTop: "80px",
					height: "100vh",
				}}
			>
				<div className="w-full max-w-md space-y-8">
					<div>
						<h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
							Picstory
						</h2>
						<div className={styles.hrSign}>Sign UP</div>
					</div>
					{/* <form className="mt-8 space-y-6" action="#" method="POST" onSubmit={onSubmit}> */}
					<form className="mt-8 space-y-6" action="#" method="POST">
						<input type="hidden" name="remember" defaultValue="true" />
						<div className="-space-y-px rounded-md shadow-sm">
							<div>
								<label htmlFor="email-address" className="sr-only">
									Email address
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Email address"
									onChange={onChangeEmail}
								/>
								<button
									onClick={() => {
										onCheckEmail();
										onEmailMsgHandler();
									}}
									className="px-4 py-2 m-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900"
								>
									이메일 중복 검사
								</button>
							</div>

							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Password"
									onChange={onChangePwd}
								/>
								<button
									onClick={onpwdMsgHandler}
									className="px-4 py-2 m-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900"
								>
									비밀번호 확인
								</button>
							</div>
							<div>
								<label htmlFor="password" className="sr-only">
									Confirm Password
								</label>
								<input
									id="confirm-password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									placeholder="Confirm Password"
									onChange={onChangeConfirmPwd}
								/>
							</div>
							<button
								onClick={onConfirmPwdMsgHandler}
								className="px-4 py-2 m-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900"
							>
								비밀번호 재 확인
							</button>
						</div>
						<div>
							<label htmlFor="nickname" className="sr-only">
								nickname
							</label>
							<input
								id="nickname"
								name="nickname"
								type="text"
								autoComplete="text"
								required
								className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
								placeholder="your nickname "
								onChange={onChangeNickname}
							/>
							<button
								onClick={() => {
									onCheckNickname();
									onNickMsgHandler();
								}}
								className="px-4 py-2 m-2 text-sm font-medium text-white bg-gray-800 rounded-md hover:bg-gray-900"
							>
								닉네임 중복 검사
							</button>
						</div>
						{/* 
						<div className={styles.divCenter}>
							<div className={styles.codeCheck}>
								<input type="text" required className={styles.input}></input>
								<label>인증코드</label>
								<span></span>
							</div>
							<button type="button" className={styles.checkBtn}>
								이메일 인증 확인
							</button>
						</div> */}
						<div>
							<button
								// type="submit"
								className="relative flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md group hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								onClick={onSubmit}
								// disabled={!isAllValid}
							>
								<span className="absolute inset-y-0 left-0 flex items-center">
									<LockClosedIcon
										className="w-5 h-5 text-indigo-500 group-hover:text-indigo-400"
										aria-hidden="true"
									/>
								</span>
								Sign Up
							</button>
						</div>

						<div className={styles.hrSect}>or</div>

						{/* 카카오 sign up 버튼 */}
						<div>
							<button
								type="submit"
								className="relative flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-yellow-600 rounded-md group hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
							>
								<span className="absolute inset-y-0 left-0 flex items-center">
									<LockClosedIcon
										className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400"
										aria-hidden="true"
									/>
								</span>
								Kakao Sign Up
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default UserSignUp;
