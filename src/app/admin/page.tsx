"use client";

import React, { useState, useEffect } from "react";
import { Lock, Mail, FolderPlus, LogOut, ChevronRight } from "lucide-react";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
      fetchMessages();
    } else {
      setError("Access Denied: Invalid Credentials");
    }
  };

  const fetchMessages = async () => {
    // This would be a real API call to fetch messages from SQLite
    setMessages([]); 
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-mono">
        <div className="bg-[#1e1e1e] border border-[#333333] p-8 rounded-lg shadow-2xl w-full max-w-md">
          <div className="flex items-center space-x-3 mb-8 text-[#007acc]">
            <Lock className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-gray-200">Wowbagger OS // Admin Auth</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Principal</label>
              <input 
                type="text"
                className="w-full bg-[#252526] border border-[#333333] p-3 text-white outline-none focus:border-[#007acc] transition-colors"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Credential</label>
              <input 
                type="password"
                className="w-full bg-[#252526] border border-[#333333] p-3 text-white outline-none focus:border-[#007acc] transition-colors"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button className="w-full bg-[#007acc] hover:bg-[#0062a3] text-white py-3 font-bold transition-all">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono flex flex-col">
      <div className="h-12 bg-[#323233] border-b border-[#111] flex items-center px-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="text-sm font-bold">Admin Dashboard</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="ml-auto text-xs text-gray-500 hover:text-white flex items-center">
          <LogOut className="w-3 h-3 mr-2" /> EXIT
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <div className="w-64 border-r border-[#333333] bg-[#252526] p-4">
           <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Management</h2>
           <nav className="space-y-2">
              <div className="flex items-center p-2 bg-[#37373d] rounded text-sm cursor-pointer text-white">
                <Mail className="w-4 h-4 mr-3 text-blue-400" /> Inbox
              </div>
              <div className="flex items-center p-2 hover:bg-[#2a2d2e] rounded text-sm cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                <FolderPlus className="w-4 h-4 mr-3 text-orange-400" /> Blog Folders
              </div>
           </nav>
        </div>

        {/* Admin Content */}
        <div className="flex-1 p-8 overflow-y-auto">
           <h2 className="text-2xl font-bold mb-8 text-[#9cdcfe]">Recent Messages</h2>
           <div className="space-y-4">
              <p className="text-gray-500 italic">// No messages found in SQLite (dev.db)...</p>
              <p className="text-xs text-gray-600 mt-12 opacity-50 select-none italic text-center">
                 "In the end, it's just bits and pieces of a life that was too short to matter anyway." — W.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
