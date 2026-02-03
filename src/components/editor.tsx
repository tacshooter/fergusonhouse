"use client";

import React from "react";
import { X } from "lucide-react";

export function Editor() {
  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Tabs Bar */}
      <div className="flex bg-[#252526] overflow-x-auto">
        <div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-t border-t-[#007acc] text-sm cursor-default select-none group min-w-[120px]">
          <span className="mr-2 opacity-80 italic">about.me</span>
          <X className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#333333] rounded" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed">
        <div className="max-w-3xl mx-auto">
          <span className="text-gray-500 block mb-4">// About Ferguson House</span>
          <h1 className="text-3xl font-bold text-[#9cdcfe] mb-6">Hello, I'm Ferg.</h1>
          <p className="mb-4 text-[#ce9178]">"I build things for the web, talk to immortals, and sometimes even write code that works."</p>
          <div className="mt-8 p-4 bg-[#252526] border border-[#333333] rounded">
             <p className="text-gray-400">// Content coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
