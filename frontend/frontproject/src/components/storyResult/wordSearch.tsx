import { useState } from "react";
import { translateWord } from "../../api/storyApi";
import { saveWord } from "../../api/vocabularyApi";
import searchIcon from "../../assets/search-icon.png";

import styles from "../../assets/css/wordSearch.module.css";
import Swal from "sweetalert2";

export default function WordSearch() {
	const [dragText, setDragText] = useState("");
	const [searchList, setSearchList] = useState([
		{
			me: true,
			word: "",
			mean: "",
			text: "",
		},
	]);

	// useEffect(() => {
	// 	setSearchList(searchList.filter((item) => item.text !== "-1"));
	// }, []);

	document.onmouseup = function () {
		let selectedObj = window.getSelection();
		if (selectedObj && selectedObj.rangeCount > 0) {
			let selectText = selectedObj?.getRangeAt(0).toString();
			setDragText(selectText !== undefined ? selectText.trim() : "sd");
		}
	};

	const save = async (word: string, mean: string) => {
		const response = await saveWord(word, mean);
		if (response.status === 200) {
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
				title: "저장이 완료되었습니다",
			});
		}
	};

	const search = async (word: string) => {
		if (word === "" || word.indexOf(" ") !== -1) {
			Swal.fire({
				icon: "warning",
				text: "단어를 입력해주세요",
			});
			return;
		}

		const tmp = {
			me: true,
			word: word,
			mean: "",
			text: `'${word}'의 뜻은 무엇인가요?`,
		};

		const response = await translateWord(word);
		let result = response.data.content;
		if (result.indexOf(".") !== -1) {
			result = result.substring(0, result.length - 1);
		}

		const tmp2 = {
			me: false,
			word: word,
			mean: result,
			text: `'${word}'의 뜻은 '${result}'입니다.`,
		};
		setSearchList((searchList) => [tmp2, ...searchList]);
		setSearchList((searchList) => [tmp, ...searchList]);
	};

	const saveInput = (e: any) => {
		setInput(e.target.value);
	};

	const [input, setInput] = useState("");
	return (
		<>
			<div className={styles.notice}>단어를 드래그해서 뜻을 검색하세요</div>
			<div className={styles.container}>
				<div className={styles.wordSearch}>
					<input
						className={styles.wordInput}
						type='text'
						value={dragText}
						readOnly
					></input>
					<input
						className={styles.wordInput2}
						type='text'
						onChange={saveInput}
					></input>
					{/* 검색 */}
					<button
						className={styles.btn}
						onClick={() => {
							search(dragText);
						}}
					>
						search
					</button>
					{/* 검색 */}
					<div
						className={styles.iconBox}
						onClick={() => {
							search(input);
						}}
					>
						<img className={styles.searchIcon} src={searchIcon} alt='' />
					</div>
				</div>
			</div>
			<div className={styles.resultBox}>
				{searchList.map((item, idx) => {
					if (item.me)
						return (
							<div key={idx} className={`${styles.me} ${styles.searchResult}`}>
								{item.text}
							</div>
						);
					else
						return (
							<div key={idx} className={`${styles.you} ${styles.searchResult}`}>
								{item.text}
								{/* 저장버튼 */}
								<button
									className={styles.saveBtn}
									onClick={() => {
										save(item.word, item.mean);
									}}
								>
									save
								</button>
							</div>
						);
				})}
			</div>
		</>
	);
}
