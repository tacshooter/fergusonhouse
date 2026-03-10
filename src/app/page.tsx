"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { WindowFrame } from "@/components/window-frame";
import { Logo } from "@/components/logo";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [activeFile, setActiveFile] = useState("about.me");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update URL when active file changes
  const handleFileSelect = (name: string, slug?: string) => {
    setActiveFile(name);
    
    // Use the provided slug if available, otherwise derive it from the name
    let newSlug = slug || name.replace(/\.md$/, "");
    
    if (newSlug === "about.me") newSlug = "about-me";
    if (newSlug === "contact.md") newSlug = "contact";
    if (newSlug === "wowbagger.sh") newSlug = "wowbagger";
    
    router.push(`/${newSlug}`, { scroll: false });
  };

  return (
    <main className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="w-full max-w-6xl mb-6 animate-in fade-in slide-in-from-top-4 duration-1000">
        <Logo />
      </div>
      
      <WindowFrame>
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-4 shrink-0 border-r border-black/20">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
          </button>
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex shrink-0 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <div className="flex flex-col w-full h-full">
            <div className="h-12 bg-[#252526] border-b border-[#333333] flex items-center px-4">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ferguson House</span>
            </div>
            <Sidebar activeFile={activeFile} onFileSelect={handleFileSelect} />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Editor activeFile={activeFile} onFileSelect={handleFileSelect} />
          <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] select-none shrink-0">
            <div className="flex items-center space-x-4">
              <span>main*</span>
              <span>0 ⚠ 0 ⓧ</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span>UTF-8</span>
              <span>{activeFile.endsWith('.md') ? 'Markdown' : activeFile.endsWith('.ts') ? 'TypeScript' : 'JSON'}</span>
              <span>Wowbagger OS v1.2</span>
            </div>
          </div>
        </div>
      </WindowFrame>
    </main>
  );
}
