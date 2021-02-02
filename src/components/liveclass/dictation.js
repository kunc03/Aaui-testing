import React, { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { toast } from "react-toastify";

const Dictation = ({newTranscript}) => {
    
  const [listening, setListening] = useState(false);
  const { transcript, resetTranscript } = useSpeechRecognition()

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    toast.warning('Browser not supported')
  }
  
  function start (){
    SpeechRecognition.startListening({ continuous: true, language: 'id' });
    setListening(true);
  }
  function stop (){
    newTranscript(transcript)
    resetTranscript();
    SpeechRecognition.stopListening();
    setListening(false);
  }
  return (
    <div>
        {!listening && 
        <button style={{padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important' }} onClick={start.bind(this)} className="btn btn-icademy-primary">
        <i className="fa fa-microphone" style={{ marginRight: '0px !important' }}></i>Start
        </button>
        }
        {listening && 
        <button style={{padding: '0px !important', height: '40px !important', width: '40px !important', borderRadius: '50px !important' }} onClick={stop.bind(this)} className="btn btn-icademy-primary">
        <i className="fa fa-stop" style={{ marginRight: '0px !important' }}></i>Stop
        </button>
        }
        {listening && <p style={{margin:10, background:'#f2f2f2', padding:10, borderRadius:4}}>{transcript.length ? transcript : 'Listening...'}</p> }
    </div>
  )
}
export default Dictation