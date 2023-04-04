import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/main.module.css";
import { useEffect, useRef, useState } from "react";
import useIntersectionObsever from "./useIntersectionObsever";
import VideoPlayer from "../../videoPlayer";
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

	const outerDivRef = useRef<HTMLDivElement>(null);
	const [scrollIndex, setScrollIndex] = useState(1);
	const DIVIDER_HEIGHT = 5;

	useEffect(() => {
		// handleChange()
		const wheelHandler = (e: any) => {
			e.preventDefault();
			const { deltaY } = e;
			const { scrollTop }: any = outerDivRef.current; // 스크롤 위쪽 끝부분 위치
			const pageHeight = window.innerHeight; // 화면 세로길이, 100vh와 같습니다.

			if (deltaY > 0) {
				// 스크롤 내릴 때
				if (scrollTop >= 0 && scrollTop < pageHeight) {
					//현재 1페이지
					outerDivRef.current?.scrollTo({
						top: pageHeight + DIVIDER_HEIGHT,
						left: 0,
						behavior: "smooth",
					});
					setScrollIndex(2);
				} else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
					//현재 2페이지
					outerDivRef.current?.scrollTo({
						top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
						left: 0,
						behavior: "smooth",
					});
					setScrollIndex(3);
				} else {
					// 현재 3페이지
					outerDivRef.current?.scrollTo({
						top: pageHeight * 2 + DIVIDER_HEIGHT * 2,
						left: 0,
						behavior: "smooth",
					});
					setScrollIndex(3);
				}
			} else {
				// 스크롤 올릴 때
				if (scrollTop >= 0 && scrollTop < pageHeight) {
					//현재 1페이지
					outerDivRef.current?.scrollTo({
						top: 0,
						left: 0,
						behavior: "smooth",
					});
					setScrollIndex(1);
				} else if (scrollTop >= pageHeight && scrollTop < pageHeight * 2) {
					//현재 2페이지
					outerDivRef.current?.scrollTo({
						top: 0,
						left: 0,
						behavior: "smooth",
					});
					setScrollIndex(1);
				} else {
					// 현재 3페이지
					outerDivRef.current?.scrollTo({
						top: pageHeight + DIVIDER_HEIGHT,
						left: 0,
						behavior: "smooth",
					});
					setScrollIndex(2);
				}
			}
		};
		const outerDivRefCurrent = outerDivRef.current;
		outerDivRefCurrent?.addEventListener("wheel", wheelHandler);
		return () => {
			outerDivRefCurrent?.removeEventListener("wheel", wheelHandler);
		};
	}, []);

	const ref = useRef<HTMLDivElement>(null);
	const isInViewport = useIntersectionObsever(ref);

	return (
		<div ref={outerDivRef} className={styles.outer}>
			<div className={styles.inner}>
				<div className={styles.section1}>
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
					<button className={styles.layerbutton} onClick={handleTry}>
						<span className={styles.color_span} aria-hidden='true'>
							Create Story
						</span>
						<span className={styles.color_span}></span>
						<span className={styles.color_span}>TRY</span>
					</button>
				</div>
			</div>
			<div className={styles.divider1}></div>
			<div className={styles.inner}>
				<div className={styles.section2}>
					<div ref={ref} className={isInViewport ? styles.test : ""}>
						<img
							className={styles.imgContent}
							src='https://cdn.pixabay.com/photo/2017/06/05/11/01/airport-2373727_960_720.jpg'
							width={500}
							alt=''
						/>
					</div>
					<div className={styles.content}>내가 찍은 사진을 업로드 해보세요</div>
					<div ref={ref} className={isInViewport ? styles.test2 : ""}>
						<img
							className={styles.imgContent}
							src='https://cdn.pixabay.com/photo/2016/08/05/02/14/girl-1571459_960_720.jpg'
							width={300}
							alt=''
						/>
					</div>
					<div ref={ref} className={isInViewport ? styles.test3 : ""}>
						<img
							className={styles.imgContent}
							src='https://cdn.pixabay.com/photo/2023/03/25/17/35/girl-7876505_960_720.jpg'
							width={400}
							alt=''
						/>
					</div>
				</div>
			</div>
			<div className={styles.divider2}></div>
			<div className={styles.inner}>
				<div className={styles.section3}>
					<div className={styles.content2}>
						장르를 선택하고 다양한 이야기를 만나보세요
					</div>
					<VideoPlayer></VideoPlayer>
				</div>
			</div>
		</div>
	);
}
