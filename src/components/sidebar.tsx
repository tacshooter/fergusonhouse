"use client";

import React, { useEffect, useState } from "react";
import { Folder, FileText, ChevronRight, ChevronDown, User, Briefcase, Mail, Cpu } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FileItem {
  id?: string;
  name: string;
  type: "file" | "folder";
  icon?: React.ReactNode;
  children?: FileItem[];
  slug?: string;
}

export function Sidebar({ activeFile, onFileSelect }: { activeFile: string; onFileSelect: (name: string) => void }) {
  const [items, setItems] = useState<FileItem[]>([]);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const res = await fetch("/api/admin/folders");
        const folders = await res.json();
        
        const mapFolder = (f: any): FileItem => ({
          id: f.id,
          name: f.name,
          type: "folder",
          children: [
            ...(f.children?.map(mapFolder) || []),
            ...(f.posts?.map((p: any) => ({
              id: p.id,
              name: `${p.slug}.md`,
              type: "file",
              slug: p.slug
            })) || [])
          ]
        });

        const dynamicItems: FileItem[] = folders.map(mapFolder);

        setItems([
          ...dynamicItems,
          {
            name: "services.ts",
            type: "file",
            icon: <Briefcase className="w-4 h-4 text-blue-400" />,
          },
          {
            name: "about.me",
            type: "file",
            icon: <User className="w-4 h-4 text-orange-400" />,
          },
          {
            name: "contact.json",
            type: "file",
            icon: <Mail className="w-4 h-4 text-yellow-400" />,
          },
          {
            name: "wowbagger.sh",
            type: "file",
            icon: <Cpu className="w-4 h-4 text-green-400" />,
          },
        ]);
      } catch (e) {
        console.error("Failed to load sidebar:", e);
      }
    };

    fetchHierarchy();
  }, [activeFile]);

  return (
    <div className="w-64 h-full bg-[#252526] text-[#cccccc] flex flex-col border-r border-[#333333] select-none flex-shrink-0">
      <div className="p-3 text-[11px] uppercase tracking-wider font-bold opacity-70">
        Explorer: FergusonHouse
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <SidebarItem key={item.name} item={item} depth={0} activeFile={activeFile} onFileSelect={onFileSelect} />
        ))}
      </div>
    </div>
  );
}

function SidebarItem({ item, depth, activeFile, onFileSelect }: { item: FileItem; depth: number; activeFile: string; onFileSelect: (name: string) => void }) {
  const [isOpen, setIsOpen] = React.useState(true);
  const isActive = activeFile === item.name;

  const handleClick = () => {
    if (item.type === "folder") {
      setIsOpen(!isOpen);
    } else {
      onFileSelect(item.name);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 hover:bg-[#2a2d2e] cursor-pointer text-sm group pr-2",
          isActive && "bg-[#37373d] text-white"
        )}
        style={{ paddingLeft: `${(depth * 12) + 12}px` }}
        onClick={handleClick}
      >
        {item.type === "folder" ? (
          <span className="mr-1 opacity-60">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        ) : (
           <div className="w-5" />
        )}
        <span className="mr-2">
          {item.icon || (item.type === "folder" ? <Folder className="w-4 h-4 text-blue-400" /> : <FileText className="w-4 h-4 text-gray-400" />)}
        </span>
        <span className={cn(item.type === "folder" ? "font-medium" : "opacity-90")}>
          {item.name}
        </span>
      </div>
      {item.type === "folder" && isOpen && item.children && (
        <div>
          {item.children.map((child) => (
            <SidebarItem key={child.name} item={child} depth={depth + 1} activeFile={activeFile} onFileSelect={onFileSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
