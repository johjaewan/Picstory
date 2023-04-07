import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getStory, deleteStory } from "../api/storyApi";
import styles from "../assets/css/storyResultPage.module.css";
import BGMPlayer from "../components/storyResult/bgm";
import AudioPlayer from "../components/storyResult/audio";
import { voiceAtom, genreAtom } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import Swal from "sweetalert2";
import WordSearch from "../components/storyResult/wordSearch";

export default function StoryDetailPage() {
	// 로그인된 유저
	const params = useParams();
	const id: number = Number(params.id);

	const navigate = useNavigate();

	const setVoice = useSetRecoilState(voiceAtom);
	const [genre, setGenre] = useRecoilState(genreAtom);
	const [storyInfo, setStoryInfo] = useState({
		title: "",
		image: "",
		genre: "",
		content_ko: "",
		content_en: "",
		voice: "",
	});

	const [lang, setLang] = useState(true);
	// 이야기 상세 불러오기
	const getStoryItem = useCallback(async () => {
		try {
			const response = await getStory(id);
			const result = response.data;
			setVoice(result.voice);
			setGenre(result.genre);

			setStoryInfo((prevState) => {
				return {
					...prevState,
					title: result.title,
					image: result.image,
					genre: result.genre,
					content_ko: result.content_ko,
					content_en: result.content_en,
					voice: result.voice,
				};
			});
		} catch (err) {
			navigate("/404");
		}
	}, [id, navigate, setGenre, setVoice]);

	useEffect(() => {
		getStoryItem();
	}, [getStoryItem]);

	// 번역
	const transLang = () => {
		setLang((prev) => !prev);
	};
	// 이야기 삭제
	const clickDelete = () => {
		Swal.fire({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it!",
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await deleteStory(id);
					if (response.status === 200) {
						Swal.fire("Deleted!", "Your file has been deleted.", "success");
						navigate("/library");
					}
				} catch (error) {
					console.log(error);
					Swal.fire({
						icon: "error",
						title: "Oops...",
						text: "이야기 삭제를 실패했습니다",
					});
				}
			}
		});
	};

	return (
		<>
			<div className={styles.title}>{storyInfo.title}</div>
			<div className={styles.detailContainer}>
				{/* 이미지 */}
				<div className={styles.story_result_image}>
					<img
						className={styles.story_result_image}
						src={storyInfo.image}
						alt={storyInfo.title}
					></img>
				</div>
				{/* 버튼 */}
				<div className={styles.story_result_btns}>
					{genre ? <BGMPlayer /> : null}
					<AudioPlayer />
					<button className={styles.story_result_button} onClick={transLang}>
						{lang ? "Korean" : "영어"}
					</button>
					{/* 삭제 */}
					<button className={styles.story_result_button} onClick={clickDelete}>
						삭제
					</button>
				</div>
				{/* 번역 이야기 */}
				{lang ? (
					<div className={styles.content}>{storyInfo.content_en}</div>
				) : (
					<div className={styles.content}>{storyInfo.content_ko}</div>
				)}
				<div className={styles.wordsearch}>
					<WordSearch></WordSearch>
				</div>
			</div>
		</>
	);
}
