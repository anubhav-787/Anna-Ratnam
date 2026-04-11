"use client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function History() {
  const [chats, setchats] = useState([]);
  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/chat/history");
        if (!res.ok) { setloading(false); return; }
        const data = await res.json();
        setchats(data.chats || []);
        setuser(data.user || null);
      } catch (err) {
        console.error(err);
      } finally {
        setloading(false);
      }
    };
    load();
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const grouped = (chats || []).reduce((acc, chat) => {
    const day = new Date(chat.createAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(chat);
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-full bg-blue-400">


      <div className="bg-green-300 p-2.5">
        <h1 className="text-3xl font-bold text-center">Chat History</h1>
      </div>

      {user && (
        <p className="text-sm text-center mt-2 text-white">
          {user.name} - {user.email}
        </p>
      )}


      <div className="flex justify-end w-full">
        <Link
          href="/"
          className="bg-[#e8d5a0] text-[#1a3a1a] px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#f0e0b0] transition mr-2.5 mt-1.5"
        >
          Back to Home
        </Link>
      </div>


      {loading && (
        <p className="text-center text-3xl font-black text-white">....Loading Chat</p>
      )}


      {!loading && chats.length === 0 && (
        <p className="text-center text-lg mt-10 text-white">No chats found</p>
      )}


      {!loading && Object.entries(grouped).map(([day, daychats]) => (
        <div key={day} className="mb-10 px-4">

          <div className="flex items-center gap-3 mb-5 mt-4">
            <div className="flex-1 h-px bg-green-300" />
            <span className="text-xs font-bold tracking-widest text-white uppercase px-3">
              {day}
            </span>
            <div className="flex-1 h-px bg-green-300" />
          </div>


          <div className="space-y-6">
            {daychats.map((c) => (
              <div key={c.id} className="space-y-2">

                {/* User Message */}
                <div className="bg-blue-500 text-white p-2 px-4 rounded-xl w-fit ml-auto">
                  <p>{c.userMessage}</p>
                  <p className="text-xs text-blue-100 mt-1 text-right">
                   
                    {formatDate(c.createAt)}
                  </p>
                </div>


                <div className="bg-emerald-600 text-white p-3 rounded-xl w-fit max-w-[80%]">
                  <ReactMarkdown>{c.reply}</ReactMarkdown>
                </div>

              </div>
            ))}
          </div>
        </div>
      ))}


      {!loading && chats.length > 0 && (
        <p className="text-center text-xs text-gray-300 mt-4 pb-6">
          {chats.length} conversation{chats.length !== 1 ? "s" : ""} total
        </p>
      )}

    </div>
  );
}
