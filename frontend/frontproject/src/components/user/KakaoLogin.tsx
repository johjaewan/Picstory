import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import styles from "../../assets/css/main.module.css";
import { kakao } from "../../api/userAPI";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

function KakaoLogin() {
	const navigate = useNavigate();
	const location = useLocation();
	const queryParams = queryString.parse(location.search);

	let code: any = queryParams.code;
	console.log("code: ", code);
	console.log("code: ", typeof code);

	const onCodeSend = async (code: string) => {
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

				// navigate("/");
			}
		} catch (error: any) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "카카오 로그인 실패! ",
			});
			navigate("/kakaologin");
			console.log(error);
		}
	};

	useEffect(() => {
		console.log("useEffect code: ", code);
		onCodeSend(code);
	}, []);

	return (
		<>
			<div
				className={`${styles["container"]}`}
				style={{
					backgroundColor: "pink",
				}}
			>
				<div className={styles.picstory}>
					<h1>
						<span>회</span>
						<span>원</span>
						<span>가</span>
						<span>입</span>
						<span>완</span>
						<span>료</span>
						<span>!</span>
						<span>😎</span>
					</h1>
				</div>
				<div className={styles.clear}></div>

				<button
					onClick={() => {
						navigate("/");
					}}
					className={styles.btn1}
				>
					HOME
				</button>
			</div>
		</>
	);
}

export default KakaoLogin;
