"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";
import { WindowFrame } from "@/components/window-frame";

export default function Home() {
  const [activeFile, setActiveFile] = useState("about.me");

  return (
    <main className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] flex items-center justify-center p-4 md:p-8 overflow-hidden">
      <WindowFrame>
        <Sidebar activeFile={activeFile} onFileSelect={setActiveFile} />
        <div className="flex-1 flex flex-col">
          <Editor activeFile={activeFile} />
          {/* Status Bar */}
          <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] select-none">
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
