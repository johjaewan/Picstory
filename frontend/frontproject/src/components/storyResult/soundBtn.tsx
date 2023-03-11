import type {FC} from 'react'
import styles from '../../assets/css/storyResultPage.module.css'
import classNames from 'classnames/bind';

import { TbPlayerPauseFilled } from 'react-icons/tb';
import { TbPlayerPlayFilled } from 'react-icons/tb';

const style = classNames.bind(styles);

export type SoundBtnProps = {
  onClick: () => void,
  soundType: string,
  soundState: boolean
}

const SoundBtn: FC<SoundBtnProps> = ({ onClick, soundType, soundState }) => {
  // 음성 오디오
  return (
      <button className={style('sound-btn')} onClick={onClick}>
        { (soundType === 'Audio' && soundState) ? <TbPlayerPauseFilled className={style('sound-icon')}/> : <TbPlayerPlayFilled className={style('sound-icon')}/> }
      </button>
  )
}
export default SoundBtn
