"use client"

import { ClipboardList } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function ReviewTasksFab() {
  const pathname = usePathname()
  
  // Optionally hide on the tasks page itself, or keep it for absolute consistency
  // if (pathname === "/tasks") return null

  return (
    <Link href="/tasks" className="fixed bottom-6 right-6 z-[70] group">
      <div className="flex items-center gap-2 px-5 py-3.5 rounded-2xl tasks-gradient text-white shadow-[0_10px_40px_rgba(139,92,246,0.4)] transition-all hover:scale-105 active:scale-95 border border-white/20">
        <ClipboardList className="w-5 h-5 shadow-sm" />
        <span className="font-bold text-sm tracking-wide">Review Tasks</span>
      </div>
    </Link>
  )
}
