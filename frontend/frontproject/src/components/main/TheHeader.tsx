import styles from "../../assets/css/TheHeader.module.css";
import { colorAtom, menuState } from "../../atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import menuIcon from "../../assets/menu.png";
import Swal from "sweetalert2";
import { deleteUser } from "../../api/userAPI";

// 회원정보
export const myInfo = () => {
	const userEmail = sessionStorage.getItem("userEmail");
	const userNick = sessionStorage.getItem("userNick");
	Swal.fire({
		title: `${userNick}`,
		text: `${userEmail}`,
		showCancelButton: true,
		confirmButtonColor: "#3085d6",
		cancelButtonColor: "#d33",
		confirmButtonText: "회원탈퇴",
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: "탈퇴하시겠습니까?",
				text: "이야기와 단어장 정보가 모두 사라집니다!",
				icon: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "회원 탈퇴",
			}).then(async (result) => {
				if (result.isConfirmed) {
					try {
						const response = await deleteUser();
						if (response.data.status === 200) {
							Swal.fire(
								"탈퇴성공!",
								"Your file has been deleted.",
								"success"
							);
						}
					} catch (error) {
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: "탈퇴실패했습니다.",
						});
					}
				}
			});
		}
	});
};

const TheHeader = () => {
	const navigation = useNavigate();
	const color = useRecoilValue(colorAtom);
	const setMenu = useSetRecoilState(menuState);

	// 로그아웃
	const logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		sessionStorage.removeItem("userEmail");
		sessionStorage.removeItem("userNick");

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
			title: "로그아웃 성공",
		});

		navigation("/");
	};

	return (
		<header className={`${styles["header"]} ${styles[color]}`}>
			<div className={styles.contents}>
				<div
					className={styles.logo}
					onClick={() => {
						navigation("/");
					}}
				>
					picstory
				</div>

				<nav className={styles.navigation}>
					<ul>
						<li className={styles.list} onClick={logout}>
							Logout
						</li>
						<li className={styles.list} onClick={myInfo}>
							MyInfo
						</li>
						<li
							className={styles.list}
							onClick={() => {
								navigation("/library");
							}}
						>
							이야기들
						</li>
						<li
							className={styles.list}
							onClick={() => {
								navigation("/vocabulary");
							}}
						>
							단어장
						</li>
						<li
							onClick={() => {
								setMenu(true);
							}}
						>
							<img
								src={menuIcon}
								className={styles.menuIcon}
								width={30}
								alt=""
							/>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	);
};

export default TheHeader;
