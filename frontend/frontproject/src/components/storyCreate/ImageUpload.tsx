import { useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ImageBit, ImageFile, loadingAtom, saveImageFile } from "../../atoms";
import styles from "../../assets/css/ImageUpload.module.css";
import Swal from "sweetalert2";

export default function ImageUpload() {
	const [bitImage, setBitImage] = useRecoilState(ImageBit); // 이미지 파일 base64
	const [imageName, setImageName] = useState(""); // 이미지 파일 base64
	const setImageFile = useSetRecoilState(ImageFile); // 이미지 파일 base64
	const setSaveImageFile = useSetRecoilState(saveImageFile); // 이미지 파일 base64
	const loading = useRecoilValue(loadingAtom);

	const setImageFromFile = (e: any): Promise<void> => {
		let file = e.target.files[0];
		setSaveImageFile(file);
		const reader = new FileReader();
		reader.readAsDataURL(file);

		if (
			file.type !== "image/jpg" &&
			file.type !== "image/png" &&
			file.type !== "image/jpeg" &&
			file.type !== "image/JPG" &&
			file.type !== "image/PNG" &&
			file.type !== "image/JPEG"
		) {
			Swal.fire({
				icon: "warning",
				text: "이미지 파일을 업로드 해주세요!",
			});
			return new Promise(() => {});
		}
		if (file.size > 1024 * 1024) {
			Swal.fire({
				icon: "warning",
				text: "첨부파일 사이즈는 1MB 이내로 등록 가능합니다.",
			});
			return new Promise(() => {});
		}

		return new Promise((resolve) => {
			reader.onload = () => {
				if (typeof reader.result === "string") {
					setBitImage(reader.result);
					setImageFile(reader.result);
					setImageName(e.target.files[0].name);
					resolve();
				}
			};
		});
	};

	return (
		<>
			{loading ? null : (
				<div className={styles.filebox}>
					<div className={styles.container}>
						{bitImage !== "" ? (
							<div className={styles.image_box}>
								<img id={styles.image} src={bitImage} alt='createImg' />
							</div>
						) : (
							<div className={styles.image_box}>
								<label id={styles.image_label} htmlFor='file'>
									<img
										id={styles.upload_icon}
										src='https://cdn-icons-png.flaticon.com/512/3097/3097412.png'
										alt='createImg'
									></img>
								</label>
							</div>
						)}
					</div>
					<input
						className={styles.upload_name}
						value={imageName}
						placeholder={"Please upload the photo you want"}
						disabled
					/>
					<label id={styles.bottom_label} htmlFor='file'>
						FIND
					</label>
					<input type='file' id='file' onChange={setImageFromFile} />
				</div>
			)}
		</>
	);
}
