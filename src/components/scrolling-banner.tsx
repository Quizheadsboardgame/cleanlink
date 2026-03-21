"use client"

import React from "react"
import { AlertCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function ScrollingBanner() {
  const { t } = useLanguage()
  const message = t.common.emergency

  return (
    <div className="w-full bg-white border-b border-black/10 py-2 overflow-hidden whitespace-nowrap sticky top-0 z-[60] backdrop-blur-sm">
      <div className="inline-block animate-marquee flex items-center">
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
      </div>
    </div>
  )
}
