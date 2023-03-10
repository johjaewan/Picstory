import { useRecoilState } from "recoil";
import { modalState } from "../../atoms"
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { atom } from 'recoil'
import { useNavigate } from "react-router-dom";
import { postSaveStory } from "../../api/storyApi";
import { storyResultAtom, genreAtom, ImageFile } from "../../atoms"


export default function Modal() {

  //저장할 이야기 제목
  const titleAtom = atom({
    key: "titleAtom",
    default: '',
  });
  const [title, setTitle] = useRecoilState(titleAtom);
  // 이야기 제목 인풋 연동
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  // 모달 열기
  const [modalOpen, setModalOpen] = useRecoilState(modalState);
  const cancelButtonRef = useRef(null);
  const handleClick = () => {
    setModalOpen(false);
  };
  // 이야기 저장 
  const [storyResult, setStoryResult]  = useRecoilState(storyResultAtom);
  const [imageFile, setImageFile] = useRecoilState(ImageFile);
  const [genre, setGenre] = useRecoilState(genreAtom);
  const navigate = useNavigate();

  const saveStory = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('image', imageFile);
    formData.append('voice_kr', storyResult.voice_kr);
    formData.append('voice_en', storyResult.voice_en);

    let datas = {
      // user_pk: data,
      title: title,
      genre: genre,
      content_kr: storyResult.content_kr,
      content_en: storyResult.content_en,
    }

    formData.append("data", new Blob([JSON.stringify(datas)], {type: "application/json"}))

    const result = await postSaveStory(formData);
    if (!result) return;
    // 실패 시 알림 띄워주기
    //인풋 리셋
    //저장 후 모달 닫고 서재로 이동
    setTitle('')
    setGenre('')
    setImageFile('')
    setStoryResult({
      content_kr: '',
      content_en: '',
      voice_kr: '',
      voice_en: '',
    })
    setModalOpen(false);
    navigate('/library');    
  }

  return (
    <Transition.Root show={modalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleClick}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                <form onSubmit={saveStory} method="POST">
                  <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          이야기 저장
                        </Dialog.Title>

                        <div className="mt-2">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            이야기 제목
                          </label>
                          <input
                            required
                            maxLength={55}
                            value={title}
                            onChange={onChange}
                            type="text"
                            name="street-address"
                            id="street-address"
                            autoComplete="off"
                            placeholder="  제목을 입력해주세요"
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white rounded-md shadow-sm bg-neutral-600 hover:bg-neutral-500 sm:ml-3 sm:w-auto"
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => handleClick()}
                      ref={cancelButtonRef}
                    >
                      취소
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
