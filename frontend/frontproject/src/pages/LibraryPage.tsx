import { getStoryList } from "../api/libraryApi";
import { useCallback, useEffect, useState } from "react";
import Card from "../components/storyResult/card";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css/libraryPage.module.css";

export default function LibraryPage() {
	const navigate = useNavigate();

	// 이야기 리스트
	interface storyDetailsType {
		created_at: string;
		id: number;
		title: string;
		image: string;
		genre: string;
	}

	const [newlistItems, setNewListItems] = useState<storyDetailsType[]>([]);
	// 이야기 받아오기
	const handleLoad = useCallback(async () => {
		try {
			const response = await getStoryList();
			if (!response) return;

			const item = response.data;

			setNewListItems((prevItems) => [...item]);
		} catch (error: any) {
			if (error.response.status === 404) {
				return;
			}
			navigate("/404");
		}
	}, [navigate]);

	useEffect(() => {
		handleLoad();
	}, [handleLoad]);

	return (
		<div>
			{newlistItems.length === 0 ? (
				<div>저장 된 이야기가 없습니다.</div>
			) : (
				<section className={styles.container}>
					{newlistItems.map((item, idx) => {
						return (
							<div
								key={idx}
								onClick={() => {
									window.location.href = `storyDetail/${item.id}`;
								}}
							>
								<Card
									imageSrc={item.image}
									title={item.title}
									id={item.id}
								></Card>
							</div>
						);
					})}
				</section>
			)}
		</div>
	);
}
