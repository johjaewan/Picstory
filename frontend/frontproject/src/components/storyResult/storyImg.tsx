import { useState, useEffect } from "react";
import axios from "axios";

import classNames from "classnames/bind";
import styles from "../../assets/css/storyResultPage.module.css";

const style = classNames.bind(styles);

// 이야기 결과

function GetImg() {
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImg = async () => {
      try {
        // 요청이 시작 할 때에는 error 와 users 를 초기화하고
        setError(null);
        setImg("");
        // loading 상태를 true 로 바꿉니다.
        setLoading(true);

        const response = await axios.get("https://");
        setImg(response.data); // 데이터는 response.data 안에 들어있습니다.
      } catch (e:any) {
        setError(e);
      }
      setLoading(false);
    };

    fetchImg();
  }, []);

  if (loading) return <div className={style("story-result-text")}>로딩중..</div>;
  if (error) return <div className={style("story-result-text")}>에러가 발생했습니다</div>;
  if (!img) return null;
  return (
    <>
      <img className={style("story-result-image")} src={img} alt="testimg" />
    </>
  );
}

export default GetImg;