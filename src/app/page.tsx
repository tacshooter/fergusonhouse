"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { WindowFrame } from "@/components/window-frame";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function Home() {
  const [activeFile, setActiveFile] = useState("about.me");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <main className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <WindowFrame>
        {/* Activity Bar (Mini Sidebar) */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-4 space-y-4 shrink-0 border-r border-black/20">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-400 hover:text-white transition-colors"
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="w-6 h-6" /> : <PanelLeftOpen className="w-6 h-6" />}
          </button>
        </div>

        {/* Collapsible Sidebar */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex shrink-0 ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <Sidebar activeFile={activeFile} onFileSelect={setActiveFile} />
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <Editor activeFile={activeFile} />
          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] select-none shrink-0">
            <div className="flex items-center space-x-4">
              <span>main*</span>
              <span>0 ⚠ 0 ⓧ</span>
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <span>UTF-8</span>
              <span>{activeFile.endsWith('.md') ? 'Markdown' : activeFile.endsWith('.ts') ? 'TypeScript' : 'JSON'}</span>
              <span>Wowbagger OS v1.0</span>
            </div>
          </div>
        </div>
      </WindowFrame>
    </main>
  );
}
