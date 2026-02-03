"use client";

import React from "react";

export function WindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#1e1e1e] transition-all duration-300 max-w-6xl mx-auto w-full h-[85vh]">
      {/* Mac Title Bar */}
      <div className="h-10 bg-[#323233] flex items-center px-4 select-none flex-shrink-0">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-90 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:brightness-90 transition-all cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] hover:brightness-90 transition-all cursor-pointer" />
        </div>
        <div className="flex-1 text-center text-[12px] text-gray-400 font-medium tracking-wide">
          fergusonhouse — Visual Studio Code
        </div>
        <div className="w-12" /> {/* Spacer for symmetry */}
      </div>
      {/* IDE Content */}
      <div className="flex-1 flex overflow-hidden">
        {children}
      </div>
    </div>
  );
}
