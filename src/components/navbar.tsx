
"use client"

import { Boxes, ClipboardList, PlusCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="portal-gradient p-1.5 rounded-lg">
            <Boxes className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-headline tracking-tight portal-text-gradient hidden sm:inline-block">
            PortalFlow
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          <Link href="/">
            <button className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}>
              <PlusCircle className="w-4 h-4" />
              <span>New Order</span>
            </button>
          </Link>
          <Link href="/tasks">
            <button className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === "/tasks" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}>
              <ClipboardList className="w-4 h-4" />
              <span>Review Tasks</span>
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
