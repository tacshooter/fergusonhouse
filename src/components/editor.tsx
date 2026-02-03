"use client";

import React, { useEffect, useState } from "react";
import { X, Play, Send, CheckCircle2, AlertTriangle } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
}

const STATIC_CONTENT: Record<string, { title: string; subtitle: string; body: string; language: string }> = {
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
};

export function Editor({ activeFile }: { activeFile: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dynamicPost, setDynamicPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If it's a dynamic markdown file (ends in .md)
    if (activeFile.endsWith(".md") && !STATIC_CONTENT[activeFile]) {
      const slug = activeFile.replace(".md", "");
      setLoading(true);
      fetch(`/api/admin/posts?slug=${slug}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            // Find the specific post by slug if returned as list
            const post = data.find((p: any) => p.slug === slug);
            setDynamicPost(post || null);
          } else {
            setDynamicPost(data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setDynamicPost(null);
    }
  }, [activeFile]);

  const fileData = STATIC_CONTENT[activeFile] || (dynamicPost ? {
    title: activeFile,
    subtitle: `// Blog: ${dynamicPost.title}`,
    body: dynamicPost.content,
    language: "markdown"
  } : null) || STATIC_CONTENT["about.me"];

  const validate = () => {
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg("Error: All fields are mandatory.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMsg("Error: Invalid email format detected.");
      return false;
    }
    return true;
  };

  const handleRun = async () => {
    setErrorMsg("");
    if (!validate()) {
      setStatus("error");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setIsRunning(false);
          setStatus("idle");
          setFormData({ name: "", email: "", message: "" });
        }, 2000);
      } else {
        setErrorMsg(data.error || "Execution failed.");
        setStatus("error");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("Network error: Host unreachable.");
      setStatus("error");
    }
  };

  if (loading) return <div className="flex-1 bg-[#1e1e1e] flex items-center justify-center text-gray-500 font-mono">Loading dynamic content...</div>;

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
            <div className="bg-[#252526] border border-[#333333] rounded-lg p-6 animate-in fade-in zoom-in duration-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[#9cdcfe]">bash contact.json --execute</span>
                <button onClick={() => { setIsRunning(false); setStatus("idle"); setErrorMsg(""); }} className="text-gray-500 hover:text-white"><X className="w-4 h-4"/></button>
              </div>
              
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-8 text-green-400">
                  <CheckCircle2 className="w-12 h-12 mb-4" />
                  <p>Message sent successfully.</p>
                  <p className="text-xs opacity-60 mt-2">Terminating process...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {status === "error" && (
                    <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-400 text-xs flex items-center space-x-2 mb-2">
                       <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                       <span>{errorMsg}</span>
                    </div>
                  )}
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
