"use client"

import React from "react"
import { AlertCircle } from "lucide-react"

export function ScrollingBanner() {
  const message = "Submitted forms will be reviewed the next working day, if an emergency please call your manager."

  return (
    <div className="w-full bg-primary border-b border-white/5 py-2 overflow-hidden whitespace-nowrap sticky top-0 z-[60] backdrop-blur-sm">
      <div className="inline-block animate-marquee flex items-center">
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
        <span className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white px-8 uppercase tracking-wider">
          <AlertCircle className="w-3 h-3" />
          {message}
        </span>
      </div>
    </div>
  )
}
