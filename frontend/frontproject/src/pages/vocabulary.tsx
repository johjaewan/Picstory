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
	// const [previous, setPrevious] = useState("");
	// const [next, setNext] = useState("");
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

				// setPrevious(response.data.previous);
				// setNext(response.data.next);
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
				<div className={styles.total}>TOTAL {count}</div>
				<button className={styles.sortBtn} onClick={click}>
					<img src={sortIcon} alt='' width={30}></img>
					{isSortTime ? "ABC" : "TIME"}
				</button>
			</div>
			<div className={styles.box}>
				{/* 이전페이지 */}
				<img
					className={styles.btn}
					src='https://cdn-icons-png.flaticon.com/512/318/318477.png'
					alt=''
					onClick={prePage}
					width={55}
				></img>

				<div className={styles.container2}>
					{/* 시간정렬 */}
					{isSortTime ? (
						<>
							<table className={styles.firstTable}>
								<tbody>
									{wordListTime.slice(0, 5).map((item, i) => {
										return (
											<tr key={i}>
												<td>{item && item.word}</td>
												<td>{item && item.mean}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							<br />
							<table>
								<tbody>
									{wordListTime.slice(5, 10).map((item, i) => {
										return (
											<tr key={i}>
												<td>{item && item.word}</td>
												<td>{item && item.mean}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</>
					) : (
						<>
							{/* 알파벳정렬 */}
							<table className={styles.firstTable}>
								<tbody>
									{wordListAlpha.slice(0, 5).map((item, i) => {
										return (
											<tr key={i}>
												<td>{item && item.word}</td>
												<td>{item && item.mean}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
							<br />
							<table>
								<tbody>
									{wordListAlpha.slice(5, 10).map((item, i) => {
										return (
											<tr key={i}>
												<td>{item && item.word}</td>
												<td>{item && item.mean}</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</>
					)}
				</div>
				{/* 다음페이지 */}
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
