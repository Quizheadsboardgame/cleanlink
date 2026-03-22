
"use client"

import { ShieldCheck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/language-context"

export function ReviewTasksFab() {
  const pathname = usePathname()
  const { t } = useLanguage()
  
  return (
    <Link href="/control-room" className="fixed bottom-6 right-6 z-[70] group">
      <div className="flex items-center justify-center w-14 h-14 rounded-full tasks-gradient text-white shadow-[0_10px_40px_rgba(139,92,246,0.4)] transition-all hover:scale-110 active:scale-95 border border-white/20">
        <ShieldCheck className="w-6 h-6 shadow-sm" />
        <span className="absolute right-full mr-3 px-2 py-1 rounded bg-black/80 text-[10px] font-bold uppercase tracking-wider text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {t.nav.controlRoom}
        </span>
      </div>
    </Link>
  )
}
