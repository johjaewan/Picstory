import azure.cognitiveservices.speech as speechsdk

from decouple import config
SPEECH_KEY = config("SPEECH_KEY")
SPEECH_REGION = config("SPEECH_REGION")

def VC2(text, genre, url):
    speech_config = speechsdk.SpeechConfig(subscription=SPEECH_KEY, region=SPEECH_REGION)#os.environ.get('SPEECH_REGION')

    speech_config.speech_synthesis_language = "en-US" 
    speech_config.speech_synthesis_voice_name ="en-US-JennyNeural"

    speech_config.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm)

    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=None)

    ssml_string = f"""<speak version="1.0" xmlns="https://www.w3.org/2001/10/synthesis" xml:lang="en-US">
    <voice name="en-US-JennyNeural" style="{genre}">
        {text}
    </voice>
    </speak>
    """
    result = speech_synthesizer.speak_ssml_async(ssml_string).get()

    stream = speechsdk.AudioDataStream(result)
    stream.save_to_wav_file(f"media/audio/{url}.wav")