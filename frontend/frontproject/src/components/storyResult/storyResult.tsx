import { useRecoilValue } from "recoil";
import { language, storyEn, storyKo } from "../../atoms";

// 이야기 결과

function StoryResult() {
	const storyResultEn = useRecoilValue(storyEn);
	const storyResultKo = useRecoilValue(storyKo);

	const lang = useRecoilValue(language);

	return <>{lang ? storyResultEn : storyResultKo}</>;
	// return <></>;
}

export default StoryResult;
