import { Link } from "react-router-dom";
import styles from "../assets/css/main.module.css";

const NotFound = () => {
	return (
		<div className={styles.container}>
			<div className={styles.picstory}>
				<h1>
					<span>P</span>
					<span>a</span>
					<span>g</span>
					<span>e</span>
					<span>N</span>
					<span>o</span>
					<span>t</span>
					<span>F</span>
					<span>o</span>
					<span>u</span>
					<span>n</span>
					<span>d</span>
				</h1>
			</div>
			<div className={styles.clear}></div>
			<Link to='/'>
				<button className={styles.btn1}>HOME</button>
			</Link>

			<h3 style={{ color: "white", margin: "2em" }}>
				죄송합니다. 요청하신 페이지를 찾을 수 없습니다.
			</h3>
		</div>
	);
};

export default NotFound;
