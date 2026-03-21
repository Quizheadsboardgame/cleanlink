"use client"

import { Boxes } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="portal-gradient p-1.5 rounded-lg">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-headline tracking-tight portal-text-gradient">
            PortalFlow
          </span>
        </div>
      </div>
    </nav>
  )
}
