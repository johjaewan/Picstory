import sys
TTS_PATH = "/home/sung/samsung/TTS"

# add libraries into environment
sys.path.append(TTS_PATH) # set this if TTS is not installed globally
print(sys.path)
import time

from scipy.io.wavfile import write
import numpy as np
from config import settings

import torch

from TTS.tts.models import setup_model
from TTS.config import load_config
from TTS.tts.models.vits import *

from TTS.tts.utils.speakers import SpeakerManager
import librosa


def VC(src_file, genre):
  """Voice Conversion 코드

  :param str src_file: VC 적용시킬 음성 파일명
  :param str genre: 이야기 장르
  """
  start_time = time.time()
  CONFIG_SE_PATH = "config_se.json"
  CHECKPOINT_SE_PATH = "SE_checkpoint.pth.tar"

  # model vars 
  MODEL_PATH = 'best_model.pth.tar'
  CONFIG_PATH = 'config.json'
  TTS_LANGUAGES = "language_ids.json"
  TTS_SPEAKERS = "speakers.json"
  SAMPLING_RATE=16000
  USE_CUDA = torch.cuda.is_available()

  # load the config
  C = load_config(CONFIG_PATH)

  C.model_args['d_vector_file'] = TTS_SPEAKERS
  C.model_args['use_speaker_encoder_as_loss'] = False

  model = setup_model(C)
  model.language_manager.set_language_ids_from_file(TTS_LANGUAGES)

  cp = torch.load(MODEL_PATH, map_location=torch.device('cpu'))
  # remove speaker encoder
  model_weights = cp['model'].copy()
  for key in list(model_weights.keys()):
    if "speaker_encoder" in key:
      del model_weights[key]

  model.load_state_dict(model_weights)
  model.eval()

  if USE_CUDA:
      model = model.cuda()

  SE_speaker_manager = SpeakerManager(encoder_model_path=CHECKPOINT_SE_PATH, encoder_config_path=CONFIG_SE_PATH, use_cuda=USE_CUDA)

  def compute_spec(ref_file):
    # Spectrogram을 생성
    sig, sr = librosa.load(ref_file, sr=16000)
    stft = librosa.stft(y=sig, n_fft=1024, hop_length=256, win_length=1024, window='hann', pad_mode='reflect')
    
    magnitude = np.abs(stft)
    spec = torch.FloatTensor(magnitude)

    return spec

  def source_target_embedding(target_files, driving_file, SE_speaker_manager):
      target_emb = SE_speaker_manager.compute_d_vector_from_clip(target_files)
      target_emb = torch.FloatTensor(target_emb)

      driving_emb = SE_speaker_manager.compute_d_vector_from_clip(driving_file)
      driving_emb = torch.FloatTensor(driving_emb)
      return target_emb, driving_emb

  # 서버 로컬 폴더
  target_files = [f"/usr/src/app/story/source/{genre}/tar.wav",
                  f"/usr/src/app/story/source/{genre}/tar1.wav",
                  ]
  # 서버에 저장된 기본 음성 파일
  driving_file = f"/usr/src/app/media/audio/{src_file}.wav"
  driving_file = [driving_file]
  driving_spec = compute_spec(driving_file[0])

  y_lengths = torch.tensor([driving_spec.size(-1)])
  target_emb, driving_emb = source_target_embedding(target_files, driving_file, SE_speaker_manager)

  if USE_CUDA:
      ref_wav_voc, _, _ = model.voice_conversion(driving_spec.cuda(), y_lengths.cuda(), driving_emb.cuda(), target_emb.cuda())
      ref_wav_voc = ref_wav_voc.squeeze().cpu().detach().numpy()
  else:
      ref_wav_voc, _, _ = model.voice_conversion(driving_spec, y_lengths, driving_emb, target_emb)
      ref_wav_voc = ref_wav_voc.squeeze().detach().numpy()

  end_time = time.time()
  print(f'loading time: {end_time - start_time}')

  # VC 적용된 파일 저장
  write(f"media/audio/{src_file}.wav", SAMPLING_RATE, ref_wav_voc)

