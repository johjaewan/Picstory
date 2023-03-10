import { useState, useCallback } from "react";
import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import SoundBtn from "../components/storyResult/soundBtn";
import GetStory from "../components/storyResult/storyResult";
import ResultImg from "../components/storyResult/storyImg";
import classNames from "classnames/bind";
import styles from "../assets/css/storyResultPage.module.css";

const style = classNames.bind(styles);

export default function StoryResultPage() {
  // 이야기 저장 모달
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  // 모달 열고 닫기
  const onClickToggleModal = useCallback(() => {
    setOpen(!open);
  }, [open]);
  // 이야기 저장 함수
  const saveStory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("save story");
    setOpen(false);
  };

  // 오디오 파일 설정
  // isOnBGM : 배경음악, isOnAudio: 음성파일
  const [isOnBGM, setOnBGM] = useState(false);
  const [isOnAudio, setOnAudio] = useState(false);

  const clickedBGM = () => {
    setOnBGM((prev) => !prev);
  };

  const clickedAudio = () => {
    setOnAudio((prev) => !prev);
  };

  //언어설정
  const transLang = () => {
    console.log("한영 번역");
  };

  const src = "https://src.hidoc.co.kr/image/lib/2022/5/12/1652337370806_0.jpg";
  const text =
    "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?";

  return (
    <div className="story-result-container">
      {/* 모달 */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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
                              type="text"
                              name="street-address"
                              id="street-address"
                              placeholder="제목을 입력해주세요"
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
                        onClick={() => setOpen(false)}
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

      <div className={style("story-img-container")}>
        {/* 이미지 */}
        {/* <ResultImg/> */}
        <img className={style("story-result-image")} src={src} alt="testimg" />
        {/* 설정 버튼 */}
        <div className={style("story-result-btns")}>
          {/* 배경음악 */}
          <SoundBtn onClick={clickedBGM} soundType="BGM" soundState={isOnBGM} />
          {/* 음성파일 */}
          <SoundBtn
            onClick={clickedAudio}
            soundType="Audio"
            soundState={isOnAudio}
          />
          {/* 언어설정 */}
          <button className={style("story-result-button")} onClick={transLang}>
            Korean
          </button>
          {/* 저장 모달 */}
          <button
            className={style("story-result-button")}
            onClick={onClickToggleModal}
          >
            저장
          </button>
        </div>
      </div>
      {/* 이야기 결과 */}
      {/* <GetStory/> */}
      <p className={style("story-result-text")}>{text}</p>
    </div>
  );
}
