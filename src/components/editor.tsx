"use client";

import React, { useEffect, useState } from "react";
import { X, Play, Send, CheckCircle2, AlertTriangle, FileText, Code } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownLink = (props: any) => {
  const { href, children } = props;
  const isExternal = href?.startsWith('http') || href?.startsWith('//');
  
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  
  return <a href={href}>{children}</a>;
};

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
}

export function Editor({ activeFile }: { activeFile: string }) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dynamicPost, setDynamicPost] = useState<Post | null>(null);
  const [staticPage, setStaticPage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isStatic = ["about.me", "services.md", "contact.md", "wowbagger.sh"].includes(activeFile);
    
    if (isStatic) {
      setLoading(true);
      fetch('/api/admin/static-pages?id=' + activeFile)
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setStaticPage(data);
          } else {
            setStaticPage(null);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
      setDynamicPost(null);
    } else if (activeFile.endsWith(".md")) {
      const slug = activeFile.replace(".md", "");
      setLoading(true);
      fetch('/api/admin/posts?slug=' + slug)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const post = data.find((p: any) => p.slug === slug);
            setDynamicPost(post || null);
          } else {
            setDynamicPost(data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
      setStaticPage(null);
    } else {
      setDynamicPost(null);
      setStaticPage(null);
    }
  }, [activeFile]);

  const fileData = staticPage ? {
    title: staticPage.id,
    subtitle: staticPage.subtitle,
    body: staticPage.content,
    language: staticPage.id.endsWith(".sh") ? "shell" : "markdown"
  } : (dynamicPost ? {
    title: activeFile,
    subtitle: "// Blog: " + (dynamicPost?.title || ""),
    body: dynamicPost?.content || "",
    language: "markdown"
  } : {
    title: "error.log",
    subtitle: "// Content not found",
    body: "The requested file could not be retrieved.",
    language: "text"
  });

  const isContactPage = activeFile === "contact.md";

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

  if (loading) return <div className="flex-1 bg-[#1e1e1e] flex items-center justify-center text-gray-500 font-mono">Loading content...</div>;

  const showPreviewToggle = activeFile.endsWith('.md') || activeFile === 'about.me';

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Tabs Bar */}
      <div className="flex bg-[#252526] overflow-x-auto items-center">
        <div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-t border-t-[#007acc] text-sm cursor-default select-none group min-w-[120px]">
          <span className="mr-2 opacity-80 italic">{fileData.title}</span>
          <X className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#333333] rounded" />
        </div>
        
        <div className="ml-auto mr-4 flex items-center space-x-4">
          {showPreviewToggle && (
            <button 
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isPreview ? (
                <>
                  <Code className="w-3 h-3" />
                  <span>Show Source</span>
                </>
              ) : (
                <>
                  <FileText className="w-3 h-3" />
                  <span>Preview Page</span>
                </>
              )}
            </button>
          )}

          {isContactPage && !isRunning && (
            <button 
              onClick={() => setIsRunning(true)}
              className="ml-auto flex items-center space-x-1 text-xs text-green-400 hover:text-green-300 transition-colors self-center"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Run File</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed">
        <div className="max-w-3xl mx-auto relative">
          {isRunning && isContactPage ? (
            <div className="bg-[#252526] border border-[#333333] rounded-lg p-6 animate-in fade-in zoom-in duration-200 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[#9cdcfe]">bash contact.md --execute</span>
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
          ) : isPreview ? (
            <div className="max-w-none text-[#d4d4d4] leading-relaxed">
              <style jsx global>{`
                .preview-container h1 { font-size: 1.875rem; font-weight: 700; color: #9cdcfe; border-bottom: 1px solid #333; padding-bottom: 0.5rem; margin-top: 2rem; margin-bottom: 1rem; }
                .preview-container h2 { font-size: 1.5rem; font-weight: 700; color: #9cdcfe; border-bottom: 1px solid #333; padding-bottom: 0.25rem; margin-top: 1.5rem; margin-bottom: 1rem; }
                .preview-container h3 { font-size: 1.25rem; font-weight: 600; color: #9cdcfe; margin-top: 1.25rem; margin-bottom: 0.75rem; }
                .preview-container p { margin-bottom: 1rem; }
                .preview-container a { color: #3794ff; text-decoration: none; }
                .preview-container a:hover { text-decoration: underline; color: #4da0ff; }
                .preview-container strong { font-weight: 700; color: #fff; }
                .preview-container code { color: #ce9178; background: #252526; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-family: monospace; }
                .preview-container ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
                .preview-container ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
                .preview-container li { margin-bottom: 0.25rem; }
                .preview-container hr { border: 0; border-top: 1px solid #333; margin: 2rem 0; }
              `}</style>
              <div className="preview-container">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: MarkdownLink
                  }}
                >
                  {fileData.body}
                </ReactMarkdown>
              </div>
            </div>
          ) : (
            <div className="font-mono text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
              <span className="text-gray-500 block mb-4">{fileData.subtitle}</span>
              <code>{fileData.body}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
