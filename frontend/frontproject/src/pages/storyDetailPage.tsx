import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getStory, deleteStory } from "../api/storyApi";
import styles from "../assets/css/storyDetailPage.module.css";
import BGMPlayer from "../components/storyResult/bgm";
import AudioPlayer from "../components/storyResult/audio";
import { voiceAtom, genreAtom } from "../atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

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

	useEffect(() => {
		getStoryItem();
	}, []);

	const [lang, setLang] = useState(true);
	// 이야기 상세 불러오기
	const getStoryItem = async () => {
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
	};
	// 번역
	const transLang = () => {
		setLang((prev) => !prev);
	};
	// 이야기 삭제
	const clickDelete = async () => {
		const response = await deleteStory(id);
		if (response.status === 200) {
			alert("삭제가 완료되었습니다.");
			navigate("/library");
		}
	};

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>{storyInfo.title}</h1>
			<div className={styles.left_container}>
				{/* 이미지 */}
				<img
					className={styles.image}
					src={storyInfo.image}
					alt={storyInfo.title}
				></img>
				{/* 버튼 */}
				<div className={styles.btnBox}>
					{genre ? <BGMPlayer /> : null}
					<AudioPlayer />
					<button className={styles.langBtn} onClick={transLang}>
						{lang ? "Korean" : "영어"}
					</button>
				</div>
			</div>
			<div className={styles.clear}></div>
			<div className={styles.right_container}>
				{/* 번역 이야기 */}
				{lang ? (
					<div className={styles.story}>{storyInfo.content_en}</div>
				) : (
					<div className={styles.story}>{storyInfo.content_ko}</div>
				)}
				{/* 삭제 */}
				<button className={styles.deleteBtn} onClick={clickDelete}>
					삭제
				</button>
			</div>
		</div>
	);
}
