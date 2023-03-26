
export interface CardProps {
  imageSrc: string;
  title: string;
  id: number;
}

const Card = (props: CardProps) => {

  return (
    // 카드
    <article className="hover:scale-105 hover:border-orange-500 overflow-hidden transition-all relative  flex items-center flex-col h-[300px] w-[350px] rounded-xl border border bg-gradient-to-t from-white drop-shadow-2xl">
      {/* 이미지 */}
      <img
        className="w-full h-[250px] "
        src={props.imageSrc}
        alt="storyImg"
      />
      {/* 제목 */}
      <h1 className="text-2xl font-bold leading-10 text-black/75 p-2">{props.title}</h1>
    </article>
    // </div>
  );
};

export default Card;