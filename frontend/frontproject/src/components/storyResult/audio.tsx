import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, atom } from "recoil";
import { voiceAtom } from "../../atoms";
import styles from "../../assets/css/storyResultPage.module.css";
import classNames from "classnames/bind";


//버튼 아이콘
import { TbPlayerPauseFilled } from "react-icons/tb";
import { TbPlayerPlayFilled } from "react-icons/tb";
import React from "react";

const style = classNames.bind(styles);

//음성파일 플레이, 일시정지
export const audioState = atom<boolean>({
	key: "audioState",
	default: false,
});

function AudioPlayer() {
	// 재생 상태
	const myRef = useRef<HTMLAudioElement>(null);
	const [play, setPlay] = useRecoilState(audioState);
	//오디오 파일
	const voice = useRecoilValue(voiceAtom);
	//테스트 오디오 
	
// 	const getModule = (moduleName: string) => {
//     const module = React.lazy(() => import(moduleName));
//     return module;
// };

//   const useCustomModule = (moduleName : string ) => {
//     return getModule(moduleName);
// };











	// 재생
	const start = () => {
		if (myRef.current) {
			myRef.current.play();
		}
		setPlay(true);
	};
	// 일시 정지
	const stop = () => {
		if (myRef.current) {
			myRef.current.pause();
		}
		setPlay(false);
	};

	const [voiceAudio, setVoiceAudio] = useState(undefined)

	useEffect(() => {
		if (!myRef.current) return;
	
		if (voice) {
			const voiceFile = require(voice)
			setVoiceAudio(voiceFile)
		}else{
			return;
		}

		if (play) {
			myRef.current.play();
		} else myRef.current.pause();
	}, [play,voice]);

	return (
		<>
			<audio ref={myRef} 
			// src = {useCustomModule}
			src={voiceAudio} loop></audio>
			{play ? (
				// 일시정지 버튼
				<button
					disabled={voice ? false : true}
					className={style("sound-btn")}
					onClick={stop}
				>
					<TbPlayerPauseFilled className={style("sound-icon")} />
				</button>
			) : (
				// 재생 버튼
				<button
					disabled={voice ? false : true}
					className={style("sound-btn")}
					onClick={start}
				>
					<TbPlayerPlayFilled className={style("sound-icon")} />
				</button>
			)}
		</>
	);
}

export default AudioPlayer;
