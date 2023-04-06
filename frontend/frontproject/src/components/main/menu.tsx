import { useRecoilState, useSetRecoilState } from "recoil";
import { menuState, tokenAtom } from "../../atoms";
import styles from "../../assets/css/menu.module.css";
import closeIcon from "../../assets/close.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { deleteUser } from "../../api/userAPI";

const Menu = () => {
	const [menu, setMenu] = useRecoilState(menuState);
	const navigation = useNavigate();
	const SetToken = useSetRecoilState(tokenAtom);

	const myInfoMenu = () => {
		setMenu(false);

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
							await deleteUser();
							Swal.fire("탈퇴성공!", "Your file has been deleted.", "success");
							navigation("/");
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

	// 로그아웃
	const logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		sessionStorage.removeItem("userEmail");
		sessionStorage.removeItem("userNick");

		SetToken(null);
		const Toast = Swal.mixin({
			toast: true,
			position: "top-end",
			showConfirmButton: false,
			timer: 1500,
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

		setMenu(false);
		navigation("/");
	};

	return (
		<div className={menu ? `${styles["openModal"]}` : styles.closeModal}>
			<div className={styles.iconBox}>
				<img
					className={styles.closeIcon}
					src={closeIcon}
					alt=''
					onClick={() => {
						setMenu(false);
					}}
				></img>
			</div>
			<div className={styles.container}>
				<div className={styles.items}>
					<div>
						<div
							className={styles.item}
							onClick={() => {
								navigation("/library");
								setMenu(false);
							}}
						>
							이야기들
						</div>
						<div
							className={styles.item}
							onClick={() => {
								navigation("/vocabulary");
								setMenu(false);
							}}
						>
							단어장
						</div>
						<div className={styles.item} onClick={myInfoMenu}>
							My Info
						</div>
						<div className={styles.item} onClick={logout}>
							Logout
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Menu;
