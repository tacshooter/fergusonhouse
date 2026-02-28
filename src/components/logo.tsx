import React from 'react';

export function Logo({ className, hideText = false }: { className?: string; hideText?: boolean }) {
  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-12 h-12 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stylized Circuit Lobster / Claw Body */}
        <path
          d="M50 20 C65 20 75 35 75 50 C75 65 65 80 50 80 C35 80 25 65 25 50 C25 35 35 20 50 20Z"
          stroke="#3b82f6"
          strokeWidth="1.5"
          className="animate-pulse"
        />
        
        {/* Top Claw (The Logic) */}
        <path
          d="M70 30 C85 15 95 30 85 45 L75 40"
          stroke="#60a5fa"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="78" y="28" width="6" height="6" fill="#60a5fa" opacity="0.6" />
        
        {/* Bottom Claw (The Time/Clock) */}
        <path
          d="M70 70 C85 85 95 70 85 55 L75 60"
          stroke="#fb923c"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="82" cy="72" r="5" stroke="#fb923c" strokeWidth="1" />
        <path d="M82 72 L82 69 M82 72 L85 72" stroke="#fb923c" strokeWidth="1" />
        
        {/* Tail (Circuit traces) */}
        <path
          d="M25 50 L10 40 M25 50 L10 50 M25 50 L10 60"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        
        {/* Inner Circuit Core */}
        <path
          d="M40 50 H60 M50 40 V60"
          stroke="#94a3b8"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <circle cx="50" cy="50" r="2" fill="#60a5fa" />
      </svg>
      
      {!hideText && (
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-[0.3em] text-white font-mono">
            FERGUSON<span className="text-blue-500">HOUSE</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.5em] text-gray-500 font-bold -mt-1">
            Wowbagger OS // v1.2
          </span>
        </div>
      )}
    </div>
  );
}
