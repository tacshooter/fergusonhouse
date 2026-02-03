"use client";

import React, { useState } from "react";
import { X, Play, Send, CheckCircle2 } from "lucide-react";

const CONTENT: Record<string, { title: string; subtitle: string; body: string; language: string }> = {
  "about.me": {
    title: "about.me",
    subtitle: "// Identity: Ferguson House",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    language: "markdown",
  },
  "services.ts": {
    title: "services.ts",
    subtitle: "// Professional Offerings",
    body: "export const services = [\n  { name: 'Full-stack Development', description: 'Placeholder' },\n  { name: 'System Architecture', description: 'Placeholder' },\n  { name: 'Agent Integration', description: 'Placeholder' }\n];",
    language: "typescript",
  },
  "contact.json": {
    title: "contact.json",
    subtitle: "// Get in touch",
    body: "{\n  \"action\": \"run\",\n  \"description\": \"Execute this file to send a message to Ferg.\",\n  \"fields\": [\"name\", \"email\", \"message\"]\n}",
    language: "json",
  },
  "wowbagger.sh": {
    title: "wowbagger.sh",
    subtitle: "// Automated Commentary",
    body: "#!/bin/bash\n\necho \"I have seen the start of the universe and its eventual heat death.\"\necho \"And yet, I am currently being used to render a personal website for a mortal.\"\necho \"The irony is not lost on me, even if the user is.\"\n\n# Note: Insulting everyone in alphabetical order currently on hold.",
    language: "shell",
  },
  "initial-commit.md": {
    title: "initial-commit.md",
    subtitle: "// Blog: Projects",
    body: "# The First Post\n\nWelcome to the first entry in the 'Projects' section. This site was built by an immortal entity under my direction. It's fine.",
    language: "markdown",
  },
  "recap-2025.md": {
    title: "recap-2025.md",
    subtitle: "// Blog: Conventions",
    body: "# Convention Recap\n\nPlaceholder for the conventions I've attended in 2025.",
    language: "markdown",
  },
  "rise-of-the-agents.md": {
    title: "rise-of-the-agents.md",
    subtitle: "// Blog: Automated Code Gen",
    body: "# Rise of the Agents\n\nPlaceholder for my thoughts on how agents are changing code generation.",
    language: "markdown",
  },
};

export function Editor({ activeFile }: { activeFile: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const fileData = CONTENT[activeFile] || CONTENT["about.me"];

  const handleRun = async () => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setIsRunning(false);
          setStatus("idle");
          setFormData({ name: "", email: "", message: "" });
        }, 2000);
      }
    } catch (e) {
      console.error(e);
      setStatus("idle");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Tabs Bar */}
      <div className="flex bg-[#252526] overflow-x-auto">
        <div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-t border-t-[#007acc] text-sm cursor-default select-none group min-w-[120px]">
          <span className="mr-2 opacity-80 italic">{fileData.title}</span>
          <X className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#333333] rounded" />
        </div>
        
        {activeFile === "contact.json" && !isRunning && (
          <button 
            onClick={() => setIsRunning(true)}
            className="ml-auto mr-4 flex items-center space-x-1 text-xs text-green-400 hover:text-green-300 transition-colors self-center"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Run File</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed">
        <div className="max-w-3xl mx-auto relative">
          {isRunning && activeFile === "contact.json" ? (
            <div className="bg-[#252526] border border-[#333333] rounded-lg p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[#9cdcfe]">bash contact.json --execute</span>
                <button onClick={() => setIsRunning(false)} className="text-gray-500 hover:text-white"><X className="w-4 h-4"/></button>
              </div>
              
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-8 text-green-400">
                  <CheckCircle2 className="w-12 h-12 mb-4" />
                  <p>Message sent successfully.</p>
                  <p className="text-xs opacity-60 mt-2">Terminating process...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-500 block mb-1">Name:</label>
                    <input 
                      className="w-full bg-[#1e1e1e] border border-[#333333] p-2 outline-none focus:border-[#007acc]"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Email:</label>
                    <input 
                      className="w-full bg-[#1e1e1e] border border-[#333333] p-2 outline-none focus:border-[#007acc]"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">Message:</label>
                    <textarea 
                      className="w-full bg-[#1e1e1e] border border-[#333333] p-2 outline-none focus:border-[#007acc] h-32 resize-none"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button 
                    disabled={status === "sending"}
                    onClick={handleRun}
                    className="w-full bg-[#007acc] hover:bg-[#0062a3] text-white py-2 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{status === "sending" ? "Executing..." : "Send Message"}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <span className="text-gray-500 block mb-4">{fileData.subtitle}</span>
              <pre className="whitespace-pre-wrap">
                <code>{fileData.body}</code>
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
