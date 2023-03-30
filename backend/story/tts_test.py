import os
import azure.cognitiveservices.speech as speechsdk

from decouple import config
SPEECH_KEY = config("SPEECH_KEY")
SPEECH_REGION = config("SPEECH_REGION")

def VC2(text, genre, url):
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)#os.environ.get('SPEECH_REGION')
    # audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

    # # The language of the voice that speaks.
    # speech_config.speech_synthesis_voice_name='en-US-JennyNeural'

    # Set either the `SpeechSynthesisVoiceName` or `SpeechSynthesisLanguage`.
    speech_config.speech_synthesis_language = "en-US" 
    speech_config.speech_synthesis_voice_name ="en-US-JennyNeural"

    audio_config = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)

    speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm)
    # speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

    # result = speech_synthesizer.speak_text_async("I'm excited to try text-to-speech").get()
    # stream = speechsdk.AudioDataStream(result)
    # stream.save_to_wav_file('audio/file.wav')

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

    
    if genre == '재미' :
        style = 'cheerful'
        pass
    elif genre == '공포' :
        style = 'whispering'
        pass
    elif genre == '슬픔' :
        style = 'sad'
        pass
    elif genre == '로맨스' :
        style = 'hopeful'
    
    ssml_string = f"""<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural" style="{style}" role="SeniorMale">
        {text}
    </voice>
    </speak>
    """
    result = speech_synthesizer.speak_ssml_async(ssml_string).get()

    stream = speechsdk.AudioDataStream(result)
    stream.save_to_wav_file(f"media/audio/{url}.wav")