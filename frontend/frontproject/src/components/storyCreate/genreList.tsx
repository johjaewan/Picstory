import { useRecoilState, useSetRecoilState } from "recoil";
import {
	ImageBit,
	genreAtom,
	loadingAtom,
	storyEn,
	storyKo,
	voiceAtom,
	isFinished,
	translateIsFinished,
	voiceIsFinished,
	tokenAtom,
} from "../../atoms";
import { createStory, createVoice, translateStory } from "../../api/storyApi";
import Loading from "./loading";
import styles from "../../assets/css/LayerButton.module.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState } from "react";

export default function ImageUpload() {
	const navigation = useNavigate();

	const [genre, setGenre] = useRecoilState(genreAtom);
	const [loading, setLoading] = useRecoilState(loadingAtom);
	const setStoryKorean = useSetRecoilState(storyKo);
	const setStoryEnglish = useSetRecoilState(storyEn);
	const setVoice = useSetRecoilState(voiceAtom);
	const setFinished = useSetRecoilState(isFinished);
	const setTransIsFin = useSetRecoilState(translateIsFinished);
	const setVoiceIsFin = useSetRecoilState(voiceIsFinished);
	const SetToken = useSetRecoilState(tokenAtom);

	// 이미지
	const [Image, setImage] = useRecoilState(ImageBit);
	const Image2 = Image.substring(23);

	// 이미지 캡셔닝 제출
	const ImageCaptioning = async () => {
		if (!Image) {
			Swal.fire({
				icon: "warning",
				text: "사진을 선택해 주세요!",
			});
			return;
		}
		if (!genre) {
			Swal.fire({
				icon: "warning",
				text: "장르를 선택해주세요!",
			});
			return;
		}
		runClip();
	};
	// 이미지 캡셔닝
	const runClip = async () => {
		setLoading(true);
		const raw = JSON.stringify({
			user_app_id: {
				user_id: "clarifai",
				app_id: "main",
			},
			inputs: [
				{
					data: {
						image: {
							base64: Image2,
						},
					},
				},
			],
		});

		const requestOptions = {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: "Key 65a4f037b024440db6d5786d9c868030",
			},
			body: raw,
		};

		fetch(
			`https://api.clarifai.com/v2/models/general-english-image-caption-clip/versions/2489aad78abf4b39a128fbbc64a8830c/outputs`,
			requestOptions
		)
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				console.log(result.outputs[0].data.text.raw);
				sendContent(result.outputs[0].data.text.raw, genre);
			})
			.catch((error) => {
				navigation("/storyCreatePage");
				setLoading(false);
				setImage("");
				alert("다른 이미지를 선택해주세요");
			});
	};

	// 이야기 생성 요청
	const sendContent = async (text: string, genre: string) => {
		console.log(genre);
		if (genre === "hopeful") {
			setStoryKorean(
				"옛날, 뉴욕 도시에서 살고 있는 행복한 커플이 살고 있었다. 샘과 티나는 3년 이상 함께하며, 서로에게 미쳐있었다. 매일 아침, 샘과 티나는 서로 손을 잡고 로맨틱한 산책을 한다. 그러던 어느 날, 샘과 티나는 센트럴 공원을 거쳐가는 중에 개미 떼가 파티를 벌이고 있는 것을 발견했다! 놀라움에 당황한 커플은 개미들이 춤을 추고 결혼식을 준비하는 것을 지켜보았다. 그때, 티나는 샘에게 '우리도 개미 결혼식을 하면 어떨까?' 라고 물었다. 샘은 이 아이디어를 좋아했고, 둘은 바로 개미 결혼식을 계획하기 시작했다. 개미들한테 연락해서 컬로니의 연회장을 사용할 수 있도록 허락받았고, 샘과 티나는 개미떼와 함께하게 되었다. 샘과 티나는 친구와 가족을 초대해 개미 식사를 준비하기도 했다. 결혼식 당일, 샘과 티나는 서로의 맹세를 다짐하고 작은 반지를 교환했다. 결혼식이 끝나자마자, 커플은 작은 손님들과 작별 인사를 나누고 결혼생활을 시작하며, 지금도 서로 손을 잡고 여전히 행복하게 산책을 한다."
			);
		} else if (genre === "whispering") {
			setStoryKorean(
				"존과 메리는 큰 도시에서 사는 사랑에 빠진 어린 커플이었다. 늦은 밤 영화를 보러 간 도중, 도시 외곽의 버려진 창고를 지나갔다. 그들이 모르는 사이, 수수께끼 같은 인물이 그들을 지켜보고 추적하고 있었다. 아파트 건물에 도착해서도, 그림자 같은 인물은 그들 뒤에서 조용히 따라 들어갔다. 커플은 그 인물과 문이 열린 것에 주목하지 못했다. 존과 메리는 같이 사는 아파트가 있는 3층으로 올라갔다. 그림자 같은 인물은 커플을 따라 들어가, 눈치채지 못하고 빠져들었다. 알지 못하고 침대 방 문을 열자, 그들은 영영 기억에 남을 장면을 마주했다. 그림자 같은 인물은 커플을 닮은 두 인형을 만들어 끈으로 묶고 천장에 걸었다. 이 인물은 벽에 물감을 바르고, 냉소적으로 빛나는 다크 레드색으로 '사랑으로는 당신을 지켜줄 수 없다'는 경고를 남겼다. 그림자는 조용히 사라지면서, 두 사람은 공포에 휩싸였다. 그 이후로, 두 사람은 주변을 의심하며, 그림자 같은 인물을 항상 조심하게 되었다. 이것은 결국 그들의 관계적인 상황을 변화시켰고, 그들은 단순한 도시 연애의 즐거움을 더이상 느끼지 못하게 되었다."
			);
		}
		setTransIsFin(true);

		try {
			const response = await createStory(text, genre);
			const result = response.data.content;
			setStoryEnglish(result);
			if (response.status === 200) {
				setFinished(true);
				makeVoice(result, genre);

				// translate(result);
			}
		} catch (error: any) {
			if (error.response.status === 401) {
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				sessionStorage.removeItem("userEmail");
				sessionStorage.removeItem("userNick");
				SetToken(null);
			}
			console.log(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "이야기 생성을 실패했습니다",
			});

			setLoading(false);
			setGenre("");
			setImage("");
			navigation("/");
		}
	};
	// 음성파일 생성 요청
	const makeVoice = async (storyEng: string, genre: string) => {
		try {
			const response = await createVoice(storyEng, genre);
			setVoice(response.data.voice);
			setVoiceIsFin(true);
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "음성파일 생성을 실패했습니다",
			});
			setLoading(false);
			setGenre("");
			setImage("");
			navigation("/");
		}
	};
	// 번역 요청
	const translate = async (storyEng: string) => {
		try {
			const response = await translateStory(storyEng);
			setStoryKorean(response.data.content);
			setTransIsFin(true);
		} catch (error) {
			console.log(error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "번역 요청이 실패했습니다",
			});
			setLoading(false);
			setGenre("");
			setImage("");
			navigation("/");
		}
	};

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div>
					<button className={styles.layerbutton} onClick={ImageCaptioning}>
						<span className={styles.color_span} aria-hidden='true'>
							Create Story
						</span>
						<span className={styles.color_span}></span>
						<span className={styles.color_span}>Create Story</span>
					</button>
				</div>
			)}
		</>
	);
}
