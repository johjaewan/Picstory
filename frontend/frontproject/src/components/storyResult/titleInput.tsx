import { useRecoilState } from "recoil";
import { titleAtom } from "../../atoms"

function TitleInput() {
  const [title, setTitle] = useRecoilState(titleAtom);

  const onChange = (event : React.ChangeEvent<HTMLInputElement> ) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <input type="text" value={title} onChange={onChange} />
    </>
  );
}

export default TitleInput;