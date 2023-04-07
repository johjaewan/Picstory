import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSetRecoilState } from "recoil";
import styles from "../../assets/css/genreChoice.module.css";
import {
	genreAtom,
	ImageBit,
	isFinished,
	language,
	loadingAtom,
	saveImageFile,
	storyEn,
	storyKo,
	translateIsFinished,
	voiceAtom,
	voiceIsFinished,
} from "../../atoms";

export default function GenreChoice() {
	const setGenre = useSetRecoilState(genreAtom);
	const navigation = useNavigate();
	const changeGenre = (genre: string) => {
		setGenre(genre);
		navigation("/storyCreatePage");
	};

	const setLoading = useSetRecoilState(loadingAtom);
	const setLang = useSetRecoilState(language);
	const setTransIsFin = useSetRecoilState(translateIsFinished);
	const setVoiceIsFin = useSetRecoilState(voiceIsFinished);
	const setFinished = useSetRecoilState(isFinished);
	const setStoryEnglish = useSetRecoilState(storyEn);
	const setStoryKorean = useSetRecoilState(storyKo);
	const setVoice = useSetRecoilState(voiceAtom);
	const setImageFile = useSetRecoilState(saveImageFile);
	const setBitImage = useSetRecoilState(ImageBit); // 이미지 파일 base64

	useEffect(() => {
		setLoading(false);
		setLang(true);
		setVoiceIsFin(false);
		setTransIsFin(false);
		setFinished(false);
		setStoryEnglish("");
		setStoryKorean("");
		setVoice("");
		setImageFile("");
		setBitImage("");
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles["section-fluid-main"]}>
				<div className={styles["section-row"]}>
					<div
						className={styles["section-col"]}
						onClick={() => {
							changeGenre("cheerful");
						}}
					>
						<div className={styles["section"]}>
							<div className={styles["section-in"]}>
								<img src='https://assets.codepen.io/1462889/sl2.jpg' alt='' />
							</div>
						</div>
					</div>
					<div className={styles["hover-text"]}>
						<h2>Fun</h2>
					</div>

					<div
						className={styles["section-col"]}
						onClick={() => {
							changeGenre("sad");
						}}
					>
						<div className={styles["section"]}>
							<div className={styles["section-in"]}>
								<img
									src='https://cdn.pixabay.com/photo/2015/07/27/22/55/woman-863686_960_720.jpg'
									alt=''
								/>
							</div>
						</div>
					</div>
					<div className={styles["hover-text"]}>
						<h2>Sad</h2>
					</div>
					<div
						className={styles["section-col"]}
						onClick={() => {
							changeGenre("hopeful");
						}}
					>
						<div className={styles["section"]}>
							<div className={styles["section-in"]}>
								<img src='https://assets.codepen.io/1462889/sl4.jpg' alt='' />
							</div>
						</div>
					</div>
					<div className={styles["hover-text"]}>
						<h2>Romance</h2>
					</div>
					<div
						className={styles["section-col"]}
						onClick={() => {
							changeGenre("whispering");
						}}
					>
						<div className={styles["section"]}>
							<div className={styles["section-in"]}>
								<img src='https://assets.codepen.io/1462889/sl5.jpg' alt='' />
							</div>
						</div>
					</div>
					<div className={styles["hover-text"]}>
						<h2>Horror</h2>
					</div>
				</div>
			</div>
		</div>
	);
}
