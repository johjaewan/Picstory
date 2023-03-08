import SoundBtn from '../components/storyResult/soundBtn'
import '../assets/css/storyResultPage.css'
import { useState, useCallback  } from "react";

import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'



export default function StoryResultPage() {

  const [open, setOpen] = useState(false)

  const cancelButtonRef = useRef(null)

  const onClickToggleModal = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const [isOnBGM, setOnBGM] = useState(false);
  const [isOnAudio, setOnAudio] = useState(false);

  const clickedBGM = () => {
    setOnBGM((prev) => !prev);
  };

  const clickedAudio = () => {
    setOnAudio((prev) => !prev);
  };

  const saveStory = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    console.log('save story')
    setOpen(false);
  }

  const transLang = () => {
    console.log('한영 번역')
  }
  
  const src = "https://src.hidoc.co.kr/image/lib/2022/5/12/1652337370806_0.jpg"
  const text = "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iure, impedit? Cupiditate fugit quam distinctio obcaecati labore repellendus earum blanditiis unde impedit reiciendis sit sunt perspiciatis, aliquam eveniet voluptatem ipsa. Impedit?" 

  return (
    <div className='story-result-container'>

<Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <form onSubmit={saveStory} method="POST">
                
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        이야기 저장
                      </Dialog.Title>

                      <div className="mt-2">
                          <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900">
                            이야기 제목
                          </label>
                          <input
                            type="text"
                            name="street-address"
                            id="street-address"
                            placeholder='제목을 입력해주세요'
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-neutral-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-neutral-500 sm:ml-3 sm:w-auto"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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















      <div className='story-img-container'>
        <img className="story-result-image" src={src} alt="testimg" />
        <div className='story-result-btns'>
          <SoundBtn onClick={clickedBGM} soundType='BGM' soundState={isOnBGM} />
          <SoundBtn onClick={clickedAudio} soundType='Audio' soundState={isOnAudio} />
          <button className='story-result-button' onClick={transLang}>Korean</button>
          <button className='story-result-button' onClick={onClickToggleModal}>저장</button>

        </div>
      </div>
      <p className='story-result-text'>{text}</p>
    </div>
  )
}
