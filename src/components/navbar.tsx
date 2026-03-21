"use client"

import { Boxes, PlusCircle, Hammer, AlertTriangle, Info, LayoutList, Menu, ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Stores Order", icon: PlusCircle },
    { href: "/faulty-equipment", label: "Faulty Equipment", icon: Hammer },
    { href: "/incomplete-task", label: "Incomplete Task", icon: AlertTriangle },
    { href: "/status", label: "Status Board", icon: LayoutList },
    { href: "/important-info", label: "Information", icon: Info },
  ]

  const activeItem = navItems.find(item => item.href === pathname) || navItems[0]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-24 flex items-center relative">
        {/* Menu far left */}
        <div className="z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-4 sm:px-6 rounded-xl shadow-lg hover:bg-white/5 transition-all active:scale-95">
                <Menu className="w-5 h-5 text-primary" />
                <span className="font-headline font-bold text-base hidden xs:inline-block">
                  {activeItem.label}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 glass-panel border-white/10 p-2 mt-2 shadow-2xl rounded-xl">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <DropdownMenuItem className={cn(
                    "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors mb-1 last:mb-0",
                    pathname === item.href 
                      ? "bg-primary/10 text-primary font-bold" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}>
                    <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* PortalFlow in the middle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link href="/" className="flex items-center gap-2 pointer-events-auto">
            <div className="portal-gradient p-1.5 rounded-lg">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold font-headline tracking-tight portal-text-gradient">
              PortalFlow
            </span>
          </Link>
        </div>

        {/* Placeholder for symmetry if needed, or just empty space */}
        <div className="ml-auto w-12 sm:w-24 h-12"></div>
      </div>
    </nav>
  )
}
