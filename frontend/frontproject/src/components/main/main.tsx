import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/main.module.css";

export default function Main() {
	const navigation = useNavigate();

	const user: string | null = localStorage.getItem("access_token");

	// 로그인하면 이야기 생성페이지 / 로그인 안하면 로그인 페이지
	const handleTry = () => {
		if (user) {
			navigation("/genreChoice");
		} else {
			navigation("/login");
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.picstory}>
				<h1>
					<span>p</span>
					<span>i</span>
					<span>c</span>
					<span>s</span>
					<span>t</span>
					<span>o</span>
					<span>r</span>
					<span>y</span>
				</h1>
			</div>
			<div className={styles.clear}></div>

			<button onClick={handleTry} className={styles.btn1}>
				TRY
			</button>
		</div>
	);
}
