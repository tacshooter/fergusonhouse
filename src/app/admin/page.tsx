"use client";

import React, { useState, useEffect } from "react";
import { Lock, Mail, FolderPlus, LogOut, Plus, Trash2, Folder as FolderIcon } from "lucide-react";

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "folders">("inbox");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
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
      fetchFolders();
    } else {
      setError("Access Denied: Invalid Credentials");
    }
  };

  const fetchFolders = async () => {
    try {
      const res = await fetch("/api/admin/folders");
      const data = await res.json();
      if (Array.isArray(data)) setFolders(data);
    } catch (e) { console.error(e); }
  };

  const createFolder = async (parentId: string | null = null) => {
    if (!newFolderName) return;
    try {
      await fetch("/api/admin/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName, parentId }),
      });
      setNewFolderName("");
      fetchFolders();
    } catch (e) { console.error(e); }
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
              <div 
                onClick={() => setActiveTab("inbox")}
                className={`flex items-center p-2 rounded text-sm cursor-pointer transition-colors ${activeTab === 'inbox' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] opacity-60'}`}
              >
                <Mail className="w-4 h-4 mr-3 text-blue-400" /> Inbox
              </div>
              <div 
                onClick={() => setActiveTab("folders")}
                className={`flex items-center p-2 rounded text-sm cursor-pointer transition-colors ${activeTab === 'folders' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] opacity-60'}`}
              >
                <FolderPlus className="w-4 h-4 mr-3 text-orange-400" /> Blog Folders
              </div>
           </nav>
        </div>

        {/* Admin Content */}
        <div className="flex-1 p-8 overflow-y-auto">
           {activeTab === "inbox" ? (
             <>
               <h2 className="text-2xl font-bold mb-8 text-[#9cdcfe]">Recent Messages</h2>
               <div className="space-y-4 text-gray-500 italic">
                  // No messages found in SQLite (dev.db)...
               </div>
             </>
           ) : (
             <>
               <h2 className="text-2xl font-bold mb-8 text-[#9cdcfe]">Blog Structure</h2>
               
               <div className="mb-8 flex space-x-2">
                 <input 
                    className="bg-[#252526] border border-[#333333] p-2 text-sm outline-none focus:border-[#007acc] w-64"
                    placeholder="New root folder name..."
                    value={newFolderName}
                    onChange={e => setNewFolderName(e.target.value)}
                 />
                 <button 
                    onClick={() => createFolder(null)}
                    className="bg-[#007acc] hover:bg-[#0062a3] text-white px-4 py-2 text-sm flex items-center"
                 >
                   <Plus className="w-4 h-4 mr-2" /> Add Root
                 </button>
               </div>

               <div className="space-y-2">
                 {folders.map(folder => (
                   <div key={folder.id} className="bg-[#252526] border border-[#333333] p-4 rounded group">
                      <div className="flex items-center">
                        <FolderIcon className="w-4 h-4 mr-3 text-blue-400" />
                        <span className="font-bold">{folder.name}</span>
                        <Trash2 className="w-4 h-4 ml-auto text-red-500 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-400 transition-all" />
                      </div>
                      {folder.children && folder.children.length > 0 && (
                        <div className="ml-6 mt-2 border-l border-[#333333] pl-4 space-y-1">
                          {folder.children.map(child => (
                            <div key={child.id} className="text-sm opacity-70 flex items-center">
                              <span className="mr-2 opacity-40">—</span> {child.name}
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                 ))}
               </div>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
