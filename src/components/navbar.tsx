
"use client"

import { Boxes, Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="portal-gradient p-2 rounded-lg">
            <Boxes className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold font-headline tracking-tight portal-text-gradient">
            PortalFlow
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="hover:text-primary transition-colors text-white">Orders</a>
          <a href="#" className="hover:text-primary transition-colors">Inventory</a>
          <a href="#" className="hover:text-primary transition-colors">Reports</a>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative text-muted-foreground">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
          <div className="h-8 w-8 rounded-full portal-gradient hidden md:block border-2 border-white/20" />
        </div>
      </div>
    </nav>
  )
}
