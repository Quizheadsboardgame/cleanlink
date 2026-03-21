"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Hammer, AlertTriangle, Info, LayoutList, Menu, ChevronDown, BookOpen, Clock, CalendarDays, UserPlus } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import placeholderData from "@/app/lib/placeholder-images.json"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: "/", label: "Stores Order", icon: PlusCircle, color: "text-[#6E76F5]" },
    { href: "/faulty-equipment", label: "Faulty Equipment", icon: Hammer, color: "text-[#F59E0B]" },
    { href: "/incomplete-task", label: "Incomplete Task", icon: AlertTriangle, color: "text-[#EF4444]" },
    { href: "/additional-hours", label: "Request Hours", icon: Clock, color: "text-[#D946EF]" },
    { href: "/referral", label: "Refer a Friend", icon: UserPlus, color: "text-[#FACC15]" },
    { href: "/cover-work", label: "Cover Work", icon: CalendarDays, color: "text-[#0EA5E9]" },
    { href: "/status", label: "Status Board", icon: LayoutList, color: "text-[#14ADFF]" },
    { href: "/important-info", label: "Information", icon: Info, color: "text-[#10B981]" },
    { href: "/how-to-use", label: "How to Use", icon: BookOpen, color: "text-[#10B981]" },
  ]

  const activeItem = navItems.find(item => item.href === pathname) || navItems[0]
  const headerLogo = placeholderData.placeholderImages.find(img => img.id === "header-secondary-logo")

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-32 flex items-center relative">
        {/* Menu far left */}
        <div className="z-10">
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-4 sm:px-6 rounded-xl shadow-lg hover:bg-white/5 transition-all active:scale-95">
                  <Menu className={cn("w-5 h-5", activeItem.color)} />
                  <span className={cn("font-headline font-bold text-base hidden xs:inline-block", activeItem.color)}>
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
                        ? "bg-white/5 font-bold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}>
                      <item.icon className={cn("w-5 h-5", item.color)} />
                      <span className={cn("text-sm font-medium", pathname === item.href ? item.color : "")}>
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  </Link>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-4 sm:px-6 rounded-xl opacity-50 cursor-default">
              <Menu className="w-5 h-5 text-muted-foreground" />
              <span className="font-headline font-bold text-base hidden xs:inline-block text-muted-foreground">
                Menu
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Branding in the middle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link href="/" className="flex flex-col items-center pointer-events-auto">
            {headerLogo && (
              <div className="relative w-32 h-16 sm:w-48 sm:h-20">
                <Image
                  src={headerLogo.imageUrl}
                  alt={headerLogo.description}
                  fill
                  className="object-contain"
                  data-ai-hint={headerLogo.imageHint}
                />
              </div>
            )}
            <span className="text-xl font-bold font-headline portal-text-gradient -mt-1">CleanLink</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-0.5">
              Powered by HARLEY
            </span>
          </Link>
        </div>

        {/* Right side (Empty) */}
        <div className="ml-auto flex items-center">
        </div>
      </div>
    </nav>
  )
}
