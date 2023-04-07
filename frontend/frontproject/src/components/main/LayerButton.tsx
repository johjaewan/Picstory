import style from "../../assets/css/LayerButton.module.css";

const LayerButton = () => {
	return (
		<>
			<button className={style.layerbutton}>
				<span className={style.color_span} aria-hidden='true'>
					Create Story
				</span>
				<span className={style.color_span}></span>
				<span className={style.color_span}>Create Story</span>
			</button>
		</>
	);
};

export default LayerButton;
