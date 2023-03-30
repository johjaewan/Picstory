import style from "../../assets/css/LayerButton.module.css";

const LayerButton = () => {
	return (
		<>
			<button className={style.layerbutton}>
				<span aria-hidden="true">Create Story</span>
				<span></span>
				<span>Create Story</span>
			</button>
		</>
	);
};

export default LayerButton;
