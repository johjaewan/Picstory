import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styles from "../../assets/css/loading.module.css";
import loadingIcon from "../../assets/loading.gif";
import { ImageBit, isFinished, loadingAtom } from "../../atoms";
import { list } from "./wordList";

export default function Loading() {
	const [idx, setIdx] = useState(Math.floor(Math.random() * 998));
	const [input, setInput] = useState("");
	const [correct, setCorrect] = useState(false);
	const [incorrect, setIncorrect] = useState(false);
	const [finished, setFinished] = useRecoilState(isFinished);
	const setLoading = useSetRecoilState(loadingAtom);
	const navigation = useNavigate();
	const setBitImage = useSetRecoilState(ImageBit); // 이미지 파일 base64

	const submit = () => {
		if (list[idx].mean === input) {
			setCorrect(true);
		} else {
			setIncorrect(true);
		}
	};

	const next = () => {
		let n = Math.floor(Math.random() * 998);
		setIdx(n);
		setCorrect(false);
		setIncorrect(false);
	};

	const move = () => {
		setCorrect(false);
		setIncorrect(false);
		setLoading(false);
		setFinished(false);
		setBitImage("");
		navigation("/storyResult");
	};
	return (
		<div className={styles.loadingContainer}>
			<div className={styles.topBox}>
				{finished ? (
					<>
						<div className={styles.text}>이야기 생성 완료</div>
						<button className={styles.resultBtn} onClick={move}>
							<img
								className={styles.nextIcon}
								src='https://cdn-icons-png.flaticon.com/512/2985/2985034.png'
								alt=''
							></img>
						</button>
					</>
				) : (
					<>
						<img className={styles.spinner} src={loadingIcon} alt='' />
						<div className={styles.text}>이야기 생성 중</div>
					</>
				)}
			</div>

			<div className={styles.container}>
				{!correct && !incorrect ? (
					<div className={styles.box}>
						<div className={styles.word}>{list[idx].word}</div>
						<div className={styles.notice}>단어의 뜻을 입력하세요</div>
						<input
							className={styles.input}
							type='text'
							onChange={(e) => {
								setInput(e.target.value);
							}}
						/>
						<button className={styles.submit} onClick={submit}>
							정답 확인
						</button>
					</div>
				) : null}

				{correct ? (
					<div className={styles.box}>
						<div className={styles.word}>정답</div>
						<div className={styles.answer}>
							{list[idx].word} {list[idx].mean}
						</div>
						<button
							className={`${styles["submit"]} ${styles["nextBtn"]}`}
							onClick={next}
						>
							다음 문제
						</button>
					</div>
				) : null}
				{incorrect ? (
					<div className={styles.box}>
						<div className={styles.word}>오답</div>
						<div className={styles.answer}>
							{list[idx].word} {list[idx].mean}
						</div>

						<button
							className={`${styles["submit"]} ${styles["nextBtn"]}`}
							onClick={next}
						>
							다음 문제
						</button>
					</div>
				) : null}
			</div>
		</div>
	);
}
