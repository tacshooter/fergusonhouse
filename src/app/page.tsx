import { Sidebar } from "@/components/sidebar";
import { Editor } from "@/components/editor";

export default function Home() {
  return (
    <main className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Editor />
        {/* Status Bar */}
        <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-[11px] select-none">
          <div className="flex items-center space-x-4">
            <span>main*</span>
            <span>0 ⚠ 0 ⓧ</span>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <span>UTF-8</span>
            <span>TypeScript JSX</span>
            <span>Wowbagger OS v1.0</span>
          </div>
        </div>
      </div>
    </main>
  );
}
