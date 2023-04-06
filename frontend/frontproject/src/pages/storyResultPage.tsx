import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	modalState,
	language,
	storyEn,
	storyKo,
	voiceAtom,
	translateIsFinished,
	voiceIsFinished,
	ImageFile,
} from "../atoms";
import styles from "../assets/css/storyResultPage.module.css";
import TypeIt from "typeit-react";
import StoryResult from "../components/storyResult/storyResult";
import Modal from "../components/storyResult/modal";
import BGMPlayer from "../components/storyResult/bgm";
import AudioPlayer from "../components/storyResult/audio";
import WordSearch from "../components/storyResult/wordSearch";
import { useNavigate } from "react-router-dom";

export default function StoryResultPage() {
	const navigation = useNavigate();
	const handleOut = () => {
		navigation("/");
	};
	// 모달
	const setModalOpen = useSetRecoilState(modalState);
	const handleRegister = () => {
		setModalOpen(true);
	};

	//언어설정
	const [lang, setLang] = useRecoilState(language);
	const storyResultEn = useRecoilValue(storyEn);
	const storyResultKo = useRecoilValue(storyKo);

	const transIsFin = useRecoilValue(translateIsFinished);
	const voiceIsFin = useRecoilValue(voiceIsFinished);

	// 처음에만(cnt==0) typeIt 적용
	const [cnt, setCnt] = useState(0);

	const transLang = () => {
		setLang((prev) => !prev);
		setCnt(cnt + 1);
	};

	// 음성 파일
	const voice = useRecoilValue(voiceAtom);

	// 이미지
	const resultmage = useRecoilValue(ImageFile);

	return (
		<div className={styles.container}>
			{/* 이미지 */}
			<div className={styles.story_result_image}>
				<img src={resultmage} alt='testimg' />
			</div>

			{/* 설정 버튼 */}
			<div className={styles.story_result_btns}>
				{/* 배경음악 */}
				<AudioPlayer />
				<BGMPlayer />
				{/* 언어설정 */}
				<button
					disabled={transIsFin ? false : true}
					className={styles.story_result_button}
					onClick={transLang}
				>
					{lang ? "Korean" : "영어"}
				</button>
				<button
					className={`${styles.story_result_button} ${styles.inSaveBtn}`}
					onClick={handleOut}
				>
					나가기
				</button>
				{/* 저장 모달 */}
				<button
					disabled={transIsFin && voice ? false : true}
					className={`${styles.story_result_button} ${styles.inSaveBtn}`}
					onClick={handleRegister}
				>
					저장
				</button>
				<Modal />
			</div>

			{/* 이야기 결과 */}
			<div className={styles.content}>
				{cnt === 0 ? (
					<TypeIt
						options={{
							speed: 30,
							waitUntilVisible: true,
						}}
					>
						{storyResultEn}
					</TypeIt>
				) : (
					<StoryResult />
				)}
			</div>
			<div className={styles.wordsearch}>
				<WordSearch></WordSearch>
			</div>
			<div className={styles.saveBtn}>
				<button className={styles.story_result_button} onClick={handleOut}>
					나가기
				</button>
				<button
					disabled={storyResultKo && voiceIsFin ? false : true}
					className={styles.story_result_button}
					onClick={handleRegister}
				>
					저장
				</button>
			</div>
		</div>
	);
}
