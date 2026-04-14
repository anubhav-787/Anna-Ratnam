"use client"
import React, { useRef, useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { useplantpredict } from "@/hooks/usePlantPredict"

export default function PlantDiseaseDetector() {
  const { predict, result, loading, error } = useplantpredict();
  const [plantname, setPlantname] = useState("");
  const [preview, setPreview] = useState(null);
  const [chat, setChat] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [voices, setVoices] = useState([]);
  const [text, setText] = useState("");
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [rate, setRate] = useState(1);
    const[speaker,setspeaker]=useState(false);
    const [pitch, setPitch] = useState(1);
  const inputRef = useRef(null);

  function handleFile(file) {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setPendingFile(file);
  }

  const [pendingFile, setPendingFile] = useState(null);

  function handleChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handlePredict() {
    if (!pendingFile) {
      alert("Please upload an image first.");
      return;
    }
    predict(pendingFile);
  }

  async function chatbotResponse() {
    if (!result) {
      alert("Please predict a disease first.");
      return;
    }

    setChatLoading(true);
    setChatError(null);

    try {
      const res = await fetch("/api/plantchatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
       
        body: JSON.stringify({ result, plantname }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      setChat((prev) => [
        ...prev,
        {
          user: plantname || result.plant || "Farmer",
          bot: data.reply,
        },
      ]);
    } catch (err) {
      setChatError("Failed to get advice. Please try again.");
      console.error("Chatbot error:", err);
    } finally {
      setChatLoading(false);
    }
  }

  function formatConfidence(confidence) {
    if (confidence == null) return "N/A";

    if (confidence > 1) {
      return `${confidence.toFixed(2)} `;
    }
    return `${(confidence * 100).toFixed(2)}%`;
  }

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
    <div className="bg-gray-600 h-[100vh]">
      
      <div className="max-w-xl mx-auto p-6 font-sans bg-gray-600">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed bg-orange-400 border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
        {preview ? (
          <img
            src={preview}
            alt="Uploaded crop"
            className="mx-auto max-h-64 rounded-lg object-contain"
          />
        ) : (
          <div className="text-white">
            <p className="text-lg font-medium">Upload Crop Image</p>
            <p className="text-sm mt-1">Drag & drop or click to browse</p>
          </div>
        )}
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <p className="text-lg text-green-600 font-bold">
          Enter Plant Name For Better Prediction
        </p>
        <div className="flex items-center gap-3">
          <input
            placeholder="e.g. Apple, Tomato, Wheat"
            value={plantname}
            onChange={(e) => setPlantname(e.target.value)}
            className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            onClick={handlePredict}
            disabled={loading || !pendingFile}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Predicting..." : "Predict Disease"}
          </button>
        </div>
      </div>
      {loading && (
        <p className="font-bold italic text-center mt-4 text-gray-500 animate-pulse">
          Analyzing your crop image...
        </p>
      )}      
    </div>

    {result && (
        <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-5 w-1/2 grid place-items-center mx-auto">
          <h2 className="text-xl font-bold mb-3 text-center text-green-800">
            Prediction Result
          </h2>
          <p className="text-base">
            <span className="font-bold">Plant:</span> {result.plant}
          </p>
         
          <p className="text-base">
            <span className="font-bold">Confidence:</span>{" "}
            {formatConfidence(result.confidence)}
          </p>

          <button
            onClick={chatbotResponse}
            disabled={chatLoading}
            className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {chatLoading ? "Getting advice..." : "💬 Get Farming Advice"}
          </button>
        </div>
      )}
      {chatError && (
        <p className="text-red-500 mt-3 text-center text-sm">{chatError}</p>
      )}

      {chat.length > 0 && (
        <div className=" bg-gray-600">
          {chat.map((c, index) => (
            <div key={index} className="space-y-2">
              
                <p className="ml-2 bg-blue-500 w-fit p-2 rounded-xl text-white">
                  {c.user}
                </p>

              
                <div className="bot ml-4 mt-5 bg-emerald-600 p-2 text-white rounded-lg text-left"><button className='p-2' onClick={()=>{if(!speaker){setText(c.bot);speakText();setspeaker(true);}else{stopSpeech();setspeaker(false);}}}>🔊</button>
                  <ReactMarkdown>{c.bot}</ReactMarkdown>
                </div>
              
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
      )}
    </div>
    
  );
}
