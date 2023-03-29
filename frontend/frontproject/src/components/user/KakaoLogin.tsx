import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import styles from "../../assets/css/KakaoLogin.module.css";
import { kakao } from "../../api/userAPI";
import Swal from "sweetalert2";
import { useCallback, useEffect } from "react";

function KakaoLogin() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = queryString.parse(location.search);

	let code: any = queryParams.code;
	console.log(code);

	const onCodeSend = useCallback(
		async (code: string) => {
			try {
				const res = await kakao(code);
				console.log("res 카카오로그인", res);

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
					const Toast = Swal.mixin({
						toast: true,
						position: "top-end",
						showConfirmButton: false,
						timer: 3000,
						timerProgressBar: true,
						didOpen: (toast) => {
							toast.addEventListener("mouseenter", Swal.stopTimer);
							toast.addEventListener("mouseleave", Swal.resumeTimer);
						},
					});

					Toast.fire({
						icon: "success",
						title: `${result.nickname}님 안녕하세요!`,
					});
					navigate("/");
				}
			} catch (error: any) {
				const Toast = Swal.mixin({
					toast: true,
					position: "top-end",
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
					didOpen: (toast) => {
						toast.addEventListener("mouseenter", Swal.stopTimer);
						toast.addEventListener("mouseleave", Swal.resumeTimer);
					},
				});

				Toast.fire({
					icon: "success",
					title: `카카오로그인 실패! 다시 로그인해주세요`,
				});
				navigate("/login");
				console.log(error);
			}
		},
		[navigate]
	);

	useEffect(() => {
		onCodeSend(code);
	}, [code, onCodeSend]);

	return (
		<>
			<div
				className={`${styles["container"]}`}
				style={{
					backgroundColor: "#FAF4C0",
				}}
			>
				<div
					style={{
						margin: "auto",
					}}
				>
					<h2>
						<span>카</span>
						<span>카</span>
						<span>오</span>
						<span>로</span>
						<span>그</span>
						<span>인</span>
						<span>완</span>
						<span>료</span>
					</h2>
				</div>
			</div>
		</>
	);
}

export default KakaoLogin;
