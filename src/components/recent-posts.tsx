"use client";

import React, { useEffect, useState } from "react";
import { FileText, ChevronRight, Clock } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
}

export function RecentPosts({ onPostSelect }: { onPostSelect: (name: string, slug?: string) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/admin/posts");
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data.slice(0, 5));
        }
      } catch (e) {
        console.error("Failed to load recent posts:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  if (loading) return (
    <div className="w-full h-full bg-[#252526] p-4 text-[11px] text-gray-500 font-mono italic">
      Loading recent...
    </div>
  );

  return (
    <div className="w-full h-full bg-[#252526] text-[#cccccc] flex flex-col select-none border-l border-[#333333]">
      <div className="p-3 text-[10px] uppercase tracking-wider font-bold opacity-70 flex items-center justify-between">
        Recent Blog Entries
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {posts.map((post) => (
          <div 
            key={post.id}
            onClick={() => onPostSelect(`${post.slug}.md`, post.slug)}
            className="group px-4 py-3 hover:bg-[#2a2d2e] cursor-pointer border-b border-[#333333]/50 transition-colors"
          >
            <div className="flex items-start space-x-2 mb-1">
              <FileText className="w-3.5 h-3.5 mt-0.5 text-blue-400 opacity-70 group-hover:opacity-100" />
              <span className="text-[12px] font-medium leading-tight group-hover:text-blue-300">
                {post.title}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 line-clamp-2 pl-5 font-mono leading-relaxed group-hover:text-gray-400">
              {post.content.replace(/[#*`]/g, '').substring(0, 100)}...
            </div>
            <div className="flex items-center space-x-1 mt-2 pl-5 opacity-40 group-hover:opacity-60 text-[9px] font-mono">
              <Clock className="w-2.5 h-2.5" />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="p-4 text-[11px] text-gray-500 italic text-center">
            No entries found.
          </div>
        )}
      </div>

      <div className="p-3 bg-[#1e1e1e] border-t border-[#333333] text-center">
         <button 
           onClick={() => onPostSelect("blog.html", "category-blog")}
           className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-bold uppercase tracking-widest"
         >
           View All Posts
         </button>
      </div>
    </div>
  );
}
