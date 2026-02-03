"use client";

import React, { useState, useEffect } from "react";
import { Lock, Mail, FolderPlus, LogOut, Plus, Trash2, Folder as FolderIcon, ChevronRight, PenSquare, Save, FileText } from "lucide-react";

interface Folder {
  id: string;
  name: string;
  children?: Folder[];
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  folderId: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"inbox" | "folders" | "editor">("inbox");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedParent, setSelectedParent] = useState<{id: string, name: string} | null>(null);
  const [error, setError] = useState("");

  // Editor State
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({ title: "", slug: "", content: "", folderId: "" });
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
      fetchFolders();
      fetchMessages();
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

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (e) { console.error(e); }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchMessages();
    } catch (e) { console.error(e); }
  };

  const createFolder = async () => {
    if (!newFolderName) return;
    try {
      await fetch("/api/admin/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName, parentId: selectedParent?.id || null }),
      });
      setNewFolderName("");
      setSelectedParent(null);
      fetchFolders();
    } catch (e) { console.error(e); }
  };

  const savePost = async () => {
    if (!currentPost.title || !currentPost.folderId) return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentPost,
          slug: currentPost.slug || currentPost.title?.toLowerCase().replace(/ /g, "-")
        }),
      });
      if (res.ok) {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      }
    } catch (e) { console.error(e); setSaveStatus("idle"); }
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
            <button type="submit" className="w-full bg-[#007acc] hover:bg-[#0062a3] text-white py-3 font-bold transition-all">
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-[#d4d4d4] font-mono flex flex-col">
      <div className="h-12 bg-[#323233] border-b border-[#111] flex items-center px-6 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          <span className="text-sm font-bold tracking-tight">Wowbagger CMS v1.0</span>
        </div>
        <button onClick={() => setIsLoggedIn(false)} className="ml-auto text-xs text-gray-500 hover:text-white flex items-center">
          <LogOut className="w-3 h-3 mr-2" /> EXIT
        </button>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-[#333333] bg-[#252526] p-4 flex flex-col shrink-0">
           <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Management</h2>
           <nav className="space-y-1 flex-1">
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
                <FolderPlus className="w-4 h-4 mr-3 text-orange-400" /> Structure
              </div>
              <div 
                onClick={() => setActiveTab("editor")}
                className={`flex items-center p-2 rounded text-sm cursor-pointer transition-colors ${activeTab === 'editor' ? 'bg-[#37373d] text-white' : 'hover:bg-[#2a2d2e] opacity-60'}`}
              >
                <PenSquare className="w-4 h-4 mr-3 text-green-400" /> New Post
              </div>
           </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
           {activeTab === "inbox" && (
             <>
               <h2 className="text-2xl font-bold mb-8 text-[#9cdcfe]">Incoming Transmissions</h2>
               <div className="space-y-4">
                  {messages.length === 0 ? <p className="text-gray-500 italic">// No messages detected.</p> : messages.map(msg => (
                    <div key={msg.id} className="bg-[#252526] border border-[#333333] p-6 rounded group relative">
                       <button onClick={() => deleteMessage(msg.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-4 h-4" />
                       </button>
                       <div className="mb-4">
                          <h3 className="text-[#9cdcfe] font-bold">{msg.name}</h3>
                          <p className="text-[#ce9178] text-xs">{msg.email} • {new Date(msg.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                    </div>
                  ))}
               </div>
             </>
           )}

           {activeTab === "folders" && (
             <>
               <h2 className="text-2xl font-bold mb-8 text-[#9cdcfe]">File System</h2>
               <div className="mb-8 p-4 bg-[#252526] border border-[#333333] rounded">
                  <div className="flex flex-col space-y-3">
                    {selectedParent && <div className="text-[10px] text-[#007acc] flex items-center"><ChevronRight className="w-3 h-3 mr-1" /> Target: <span className="font-bold ml-1">{selectedParent.name}</span><button onClick={() => setSelectedParent(null)} className="ml-2 underline">cancel</button></div>}
                    <div className="flex space-x-2">
                      <input className="bg-[#1e1e1e] border border-[#333333] p-2 text-sm outline-none focus:border-[#007acc] flex-1" placeholder="Folder name..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)} />
                      <button onClick={createFolder} className="bg-[#007acc] hover:bg-[#0062a3] text-white px-4 text-sm flex items-center"><Plus className="w-4 h-4 mr-2" /> {selectedParent ? 'Sub' : 'Root'}</button>
                    </div>
                  </div>
               </div>
               <div className="space-y-2">
                 {folders.map(f => (
                   <div key={f.id} className={`bg-[#252526] border p-4 rounded ${selectedParent?.id === f.id ? 'border-[#007acc]' : 'border-[#333333]'}`}>
                      <div className="flex items-center">
                        <FolderIcon className="w-4 h-4 mr-3 text-blue-400" />
                        <span className="font-bold text-sm">{f.name}</span>
                        <Plus onClick={() => setSelectedParent({id: f.id, name: f.name})} className="ml-auto w-4 h-4 text-gray-500 hover:text-green-400 cursor-pointer" />
                      </div>
                      {f.children?.map(c => <div key={c.id} className="ml-6 mt-2 text-xs opacity-60 flex items-center"><ChevronRight className="w-3 h-3 mr-2" />{c.name}</div>)}
                   </div>
                 ))}
               </div>
             </>
           )}

           {activeTab === "editor" && (
             <div className="h-full flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#9cdcfe]">Draft Article</h2>
                  <button 
                    onClick={savePost} 
                    disabled={saveStatus !== "idle"}
                    className="bg-[#007acc] hover:bg-[#0062a3] text-white px-6 py-2 rounded text-sm flex items-center space-x-2 transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saveStatus === "saving" ? "Compiling..." : saveStatus === "saved" ? "Success" : "Save to DB"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 tracking-widest">Article Title</label>
                    <input 
                      className="w-full bg-[#252526] border border-[#333333] p-3 text-white outline-none focus:border-[#007acc]"
                      placeholder="The Rise of the Machines..."
                      value={currentPost.title}
                      onChange={e => setCurrentPost({...currentPost, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase text-gray-500 tracking-widest">Target Folder</label>
                    <select 
                      className="w-full bg-[#252526] border border-[#333333] p-3 text-white outline-none focus:border-[#007acc] appearance-none"
                      value={currentPost.folderId}
                      onChange={e => setCurrentPost({...currentPost, folderId: e.target.value})}
                    >
                      <option value="">Select Folder...</option>
                      {folders.flatMap(f => [f, ...(f.children || [])]).map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex-1 space-y-2 flex flex-col min-h-0">
                  <label className="text-[10px] uppercase text-gray-500 tracking-widest">Content (Markdown)</label>
                  <textarea 
                    className="flex-1 w-full bg-[#252526] border border-[#333333] p-6 text-white outline-none focus:border-[#007acc] resize-none font-mono text-sm leading-relaxed"
                    placeholder="# Hello World..."
                    value={currentPost.content}
                    onChange={e => setCurrentPost({...currentPost, content: e.target.value})}
                  />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
