import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getWordList } from "../api/vocabularyApi";
import styles from "../assets/css/vocabulary.module.css";
import sortIcon from "../assets/sort.png";

export default function Vocabulary() {
	const navigation = useNavigate();

	// 정렬기준: 시간, 단어
	const [isSortTime, setIsSortTime] = useState<boolean>(true);
	const [pageCount, setPageCount] = useState(0);
	interface vocabularyType {
		word: string;
		mean: string;
	}
	const [wordListTime, setWordListTime] = useState<vocabularyType[]>([]);
	const [wordListAlpha, setWordListAlpha] = useState<vocabularyType[]>([]);
	const [count, setCount] = useState(0);
	const [previous, setPrevious] = useState("");
	const [next, setNext] = useState("");
	const [page, setPage] = useState(1);

	// 정렬
	const click = () => {
		setIsSortTime(!isSortTime);
		setPage(1);
		getList(!isSortTime, 1);
	};
	// 단어 리스트 가져오기
	const getList = useCallback(
		async (isSortTime: boolean, page: number) => {
			try {
				const response = await getWordList(isSortTime ? "" : "alpha", page);

				const item = response.data.results;
				setCount(response.data.count);
				setPageCount(Math.floor(response.data.count / 10) + 1);

				setPrevious(response.data.previous);
				setNext(response.data.next);
				setList(item, isSortTime);
				if (!response) return;
			} catch (error: any) {
				if (error.response.status === 404) {
					return;
				}
				navigation("/404");
			}
		},
		[navigation]
	);

	const setList = (data: [], check: boolean) => {
		if (check) {
			setWordListTime(() => [...data]);
		} else {
			setWordListAlpha(() => [...data]);
		}
	};

	const prePage = () => {
		if (page === 1) return;
		getList(isSortTime, page - 1);
		setPage(page - 1);
	};
	const nextPage = () => {
		if (page === pageCount) return;
		getList(isSortTime, page + 1);
		setPage(page + 1);
	};

	useEffect(() => {
		getList(true, 1);
		setPage(1);
	}, [getList]);

	return (
		<div className={styles.container}>
			<div className={styles.title}>WORD</div>
			<div className={styles.btns}>
				<div>TOTAL {count}</div>
				<button className={styles.sortBtn} onClick={click}>
					<img src={sortIcon} alt='' width={30}></img>
					{isSortTime ? "ABC" : "TIME"}
				</button>
			</div>
			<div className={styles.box}>
				<img
					className={styles.btn}
					src='https://cdn-icons-png.flaticon.com/512/318/318477.png'
					alt=''
					onClick={prePage}
					width={55}
				></img>

				<div className={styles.container2}>
					{isSortTime ? (
						<table className={styles.word_table}>
							<td>
								<div className={styles.list}>
									{wordListTime[0] ? wordListTime[0].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[1] ? wordListTime[1].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[2] ? wordListTime[2].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[3] ? wordListTime[3].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[4] ? wordListTime[4].word : <br />}
								</div>
							</td>
							<td className={styles.col}>
								<div className={styles.list}>
									{wordListTime[0] ? wordListTime[0].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[1] ? wordListTime[1].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[2] ? wordListTime[2].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[3] ? wordListTime[3].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[4] ? wordListTime[4].mean : <br />}
								</div>
							</td>
							<td>
								<div className={styles.list}>
									{wordListTime[5] ? wordListTime[5].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[6] ? wordListTime[6].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[7] ? wordListTime[7].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[8] ? wordListTime[8].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[9] ? wordListTime[9].word : <br />}
								</div>
							</td>
							<td>
								<div className={styles.list}>
									{wordListTime[5] ? wordListTime[5].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[6] ? wordListTime[6].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[7] ? wordListTime[7].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[8] ? wordListTime[8].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListTime[9] ? wordListTime[9].mean : <br />}
								</div>
							</td>
						</table>
					) : (
						<table className={styles.word_table}>
							<td>
								<div className={styles.list}>
									{wordListAlpha[0] ? wordListAlpha[0].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[1] ? wordListAlpha[1].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[2] ? wordListAlpha[2].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[3] ? wordListAlpha[3].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[4] ? wordListAlpha[4].word : <br />}
								</div>
							</td>
							<td className={styles.col}>
								<div className={styles.list}>
									{wordListAlpha[0] ? wordListAlpha[0].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[1] ? wordListAlpha[1].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[2] ? wordListAlpha[2].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[3] ? wordListAlpha[3].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[4] ? wordListAlpha[4].mean : <br />}
								</div>
							</td>
							<td>
								<div className={styles.list}>
									{wordListAlpha[5] ? wordListAlpha[5].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[6] ? wordListAlpha[6].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[7] ? wordListAlpha[7].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[8] ? wordListAlpha[8].word : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[9] ? wordListAlpha[9].word : <br />}
								</div>
							</td>
							<td>
								<div className={styles.list}>
									{wordListAlpha[5] ? wordListAlpha[5].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[6] ? wordListAlpha[6].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[7] ? wordListAlpha[7].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[8] ? wordListAlpha[8].mean : <br />}
								</div>
								<div className={styles.list}>
									{wordListAlpha[9] ? wordListAlpha[9].mean : <br />}
								</div>
							</td>
						</table>
					)}
				</div>
				<img
					className={styles.btn}
					src='https://cdn-icons-png.flaticon.com/512/318/318476.png'
					alt=''
					onClick={nextPage}
					width={55}
				></img>
			</div>
			<div>
				{page}/{pageCount}
			</div>
		</div>
	);
}
