import { useState, useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import { getWordList } from "../api/vocabularyApi";
import styles from "../assets/css/vocabulary.module.css";
import { colorAtom } from "../atoms";

export default function Vocabulary() {
	const navigation = useNavigate();

	const color = useRecoilValue(colorAtom);
	// 정렬기준: 시간, 단어
	const [isSortTime, setIsSortTime] = useState<boolean>(true);

	interface vocabularyType {
		word: string;
		mean: string;
	}
	const [wordListTime, setWordListTime] = useState<vocabularyType[]>([]);
	const [wordListAlpha, setWordListAlpha] = useState<vocabularyType[]>([]);

	// 정렬
	const click = () => {
		getList(!isSortTime);
		setIsSortTime(!isSortTime);
	};
	// 단어 리스트 가져오기
	const getList = useCallback(
		async (isSortTime: boolean) => {
			try {
				const response = await getWordList(isSortTime ? "" : "alpha");
				const item = response.data;
				if (!response) return;
				//시간순 정렬
				if (isSortTime) {
					setWordListTime((prevItems) => [...item]);

					// 알파벳순 정렬
				} else if (!isSortTime) {
					setWordListAlpha((prevItems) => [...item]);
				}
			} catch (err) {
				navigation("/404");
			}
		},
		[navigation]
	);

	useEffect(() => {
		getList(true);
	}, [getList]);

	return (
		<div className={styles.container}>
			{wordListTime.length === 0 ? (
				<div>저장 된 단어가 없습니다.</div>
			) : (
				<div>
					{/* 단어 정렬 버튼 */}
					<button
						className={`${styles.sortBtn} ${styles[color]}`}
						onClick={click}
					>
						{isSortTime ? "알파벳순 정렬" : "시간순 정렬"}
					</button>

					<div className={styles.clear}></div>
					<table className={styles.word_table}>
						{isSortTime
							? wordListTime.map((item, idx) => {
									return (
										<tbody key={idx}>
											<tr className={styles.table_row}>
												<td className={styles.word}>{item.word}</td>
												<td className={styles.mean}>{item.mean}</td>
											</tr>
										</tbody>
									);
							  })
							: wordListAlpha.map((item, idx) => {
									return (
										<tbody key={idx}>
											<tr>
												<td className={styles.word}>{item.word}</td>
												<td className={styles.mean}>{item.mean}</td>
											</tr>
										</tbody>
									);
							  })}
					</table>
				</div>
			)}
		</div>
	);
}
