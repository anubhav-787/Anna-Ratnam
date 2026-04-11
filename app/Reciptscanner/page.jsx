"use client";
import { useState, useRef, useCallback, useEffect } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); 
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  function handleChange(e) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  }

  function handleDrop(e) {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setFile(droppedFile);
  }

  const handleUpload = useCallback(async () => {
    if (!file) return;

    setStatus("uploading");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResult(data);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, [file]);

  useEffect(() => {
    if (file) handleUpload();
  }, [file, handleUpload]); 

  

  return (
    <div className="flex flex-col items-center gap-4 py-3.5 bg-gray-600 h-[100vh]">
      <div
        className={`border-2 border-dashed w-[40vw] h-[40vh] rounded-3xl text-2xl font-bold text-white flex items-center justify-center cursor-pointer transition-colors ${
          status === "uploading"
            ? "bg-orange-300 cursor-wait"
            : status === "error"
            ? "bg-red-500"
            : status === "success"
            ? "bg-green-500"
            : "bg-orange-500 hover:bg-orange-600"
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => status !== "uploading" && inputRef.current?.click()}
      >
        {status === "idle" && "Upload Receipt — Click or Drop"}
        {status === "uploading" && "Scanning receipt..."}
        {status === "success" && "Done!"}
        {status === "error" && "Upload failed. Try again."}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>
    </div>
  );
}