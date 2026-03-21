
"use client"

import { ClipboardList } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ReviewTasksFab() {
  const pathname = usePathname()
  
  return (
    <Link href="/tasks" className="fixed bottom-6 right-6 z-[70] group">
      <div className="flex items-center justify-center w-14 h-14 rounded-full tasks-gradient text-white shadow-[0_10px_40px_rgba(139,92,246,0.4)] transition-all hover:scale-110 active:scale-95 border border-white/20">
        <ClipboardList className="w-6 h-6 shadow-sm" />
        <span className="absolute right-full mr-3 px-2 py-1 rounded bg-black/80 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Management Portal
        </span>
      </div>
    </Link>
  )
}
