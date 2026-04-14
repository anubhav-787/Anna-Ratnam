import React, { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Mic } from "lucide-react"
import {useState,useRef} from "react"

const Assistant = () => {
    const[message,setmessage]=useState("");
    const [sendstatus,setsendstatus]=useState("false");
    const[chat,setchat]=useState([]);
    const [mic,setmic]=useState(false);
    const [showLangModal, setShowLangModal] = useState(false);
    const [langPref, setLangPref] = useState('en');
    const [text, setText] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1);
  const[speaker,setspeaker]=useState(false);
  const [pitch, setPitch] = useState(1);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);

    useEffect(()=>{
         if (!localStorage.getItem('langPref')) {
      setShowLangModal(true);
    } else {
      setLangPref(localStorage.getItem('langPref'));
    }
  }, []);
    const setLanguage = (lang) => {
    localStorage.setItem('langPref', lang);
    setLangPref(lang);
    setShowLangModal(false);
  };
  
      const sendmessage=async ()=>{
        try{

        if(!message){
            return;
        }
        const res=await fetch("/api/chat",{
            method:"POST",body:JSON.stringify({message,langPref})
        });
        const data= await res.json();
        setchat([...chat,{user:message,bot:data.reply}]);
        setmessage("");
        

   
    }
    catch(err){
      console.error("Error Sending Message : ",err);
    }
      finally{
    setsendstatus("false");
  }
   };

    const startListening = () => {
    const SpeechRecognition =
      (window).SpeechRecognition || (window).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    if(langPref === 'en'){recognition.lang = "en-US";}
    else if(langPref==='hi'){recognition.lang='hi-IN'}
    else if(langPref==='ml'){recognition.lang='ml-IN'}

    recognition.start();
    setIsListening(true);

recognition.onresult = (event) => {
  let finalText = "";
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      finalText += event.results[i][0].transcript + " ";
    }
  }
  if (finalText) {
    setmessage((prev) => prev + finalText);
  }
};

    recognition.onerror = (event) => {
      console.error("Error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };


  //speech synthesis
  useEffect(() => {
    const loadVoices = () => {
      const voicesList = window.speechSynthesis.getVoices();
      setVoices(voicesList);
      setSelectedVoice(voicesList[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speakText = () => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
 

   };

  return (
    
    <div className='bg-gray-600'>
        {showLangModal&&(<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white p-5 rounded-2xl w-[40vw] mx-4 text-center'>
                <h3 className='text-2xl font-bold mt-0.5'>Choose Language</h3>
                <div className='space-y-2 flex flex-col '>
                    <button onClick={()=>setLanguage('en')} className='bg-blue-500 p-1 w-1/2 mx-auto rounded-2xl'>English</button>
<button onClick={()=>setLanguage('hi')} className='bg-blue-500 p-1 w-1/2 mx-auto rounded-2xl'>Hindi</button>
<button onClick={()=>setLanguage('ml')} className='bg-blue-500 p-1 w-1/2 mx-auto rounded-2xl'>Malayalam</button>
                </div>
                
            </div>

        </div>)}
        <h3 className='font-bold text-4xl bg-gradient-to-r text-center from-green-500 via-green-600 to-orange-500 text-transparent bg-clip-text mt-1'>
  Ask To Assistant
</h3>
<div className='m-6 py-'>{chat.map((c, i) => (
        <div key={i} className="chat-box py-2">
          <p className='ml-2 bg-blue-500 w-fit p-2 rounded-xl'><b>You:</b> {c.user}</p>

          <div className="bot ml-4 mt-5 bg-emerald-600 p-2 text-white rounded-lg text-left"><button className='p-2' onClick={()=>{if(!speaker){setText(c.bot);speakText();setspeaker(true);}else{stopSpeech();setspeaker(false);}}}>🔊</button>
            <ReactMarkdown>{c.bot}</ReactMarkdown>
          </div>

          <hr />
        </div>
      ))}</div>
<div className=' flex justify-center p-4 w-full'>
      <input
  value={message}
  onChange={(e) => setmessage(e.target.value)}
  placeholder={mic ? "Listening..." : "Ask something..."}
  className="border text-black bg-blue-200 rounded-2xl text-lg p-1 h-[7vh] w-[45vw]"
/>

      <div className='bg-gray-600 p-2.5 gap-2 flex'>
        <button onClick={()=>{
          if(isListening){
            stopListening();
            setmic(false);
          }
          else{
            startListening();
            setmic(true);
          }
          }}>{isListening?"stop":<Mic className='text-white'/>}</button>
  <button
  onClick={()=>{if(sendstatus==="false"){sendmessage();setsendstatus("true");}}}

    className={`bg-orange-400 ml-3.5 p-2.5 px-3 rounded-2xl ${sendstatus==="true"? "bg-orange-300" : "hover:bg-orange-400"} hover:pointer text-white font-bold`}

    
  >
    {sendstatus==="true"?"Sending...":"Send"}
  </button>
</div>

</div>

</div>
  )
}

export default Assistant
