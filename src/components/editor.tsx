"use client";

import React from "react";
import { X } from "lucide-react";

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
    body: "{\n  \"email\": \"ferg@example.com\",\n  \"twitter\": \"@fergusonhouse\",\n  \"status\": \"Available for new projects\"\n}",
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
  const fileData = CONTENT[activeFile] || CONTENT["about.me"];

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e1e] text-[#d4d4d4] overflow-hidden">
      {/* Tabs Bar */}
      <div className="flex bg-[#252526] overflow-x-auto">
        <div className="flex items-center px-4 py-2 bg-[#1e1e1e] border-t border-t-[#007acc] text-sm cursor-default select-none group min-w-[120px]">
          <span className="mr-2 opacity-80 italic">{fileData.title}</span>
          <X className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 hover:bg-[#333333] rounded" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto font-mono text-sm leading-relaxed">
        <div className="max-w-3xl mx-auto">
          <span className="text-gray-500 block mb-4">{fileData.subtitle}</span>
          <pre className="whitespace-pre-wrap">
            <code>{fileData.body}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
