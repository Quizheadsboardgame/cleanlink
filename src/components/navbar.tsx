
"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Hammer, AlertTriangle, Info, LayoutList, Menu, ChevronDown, BookOpen, Clock, CalendarDays, UserPlus, Sparkles, Languages, Home, ShieldAlert } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import placeholderData from "@/app/lib/placeholder-images.json"
import { useLanguage } from "@/context/language-context"

export function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: "/", label: "Home Hub", icon: Home, color: "text-primary" },
    { href: "/stores", label: t.nav.stores, icon: PlusCircle, color: "text-[#6E76F5]" },
    { href: "/faulty-equipment", label: t.nav.faulty, icon: Hammer, color: "text-[#F59E0B]" },
    { href: "/incomplete-task", label: t.nav.incomplete, icon: AlertTriangle, color: "text-[#EF4444]" },
    { href: "/additional-hours", label: t.nav.hours, icon: Clock, color: "text-[#D946EF]" },
    { href: "/referral", label: t.nav.referral, icon: UserPlus, color: "text-[#FACC15]" },
    { href: "/cover-work", label: t.nav.cover, icon: CalendarDays, color: "text-[#0EA5E9]" },
    { href: "/report-concern", label: t.nav.concern, icon: ShieldAlert, color: "text-red-500" },
    { href: "/status", label: t.nav.status, icon: LayoutList, color: "text-white" },
    { href: "/important-info", label: t.nav.info, icon: Info, color: "text-orange-500" },
    { href: "/how-to-use", label: t.nav.guide, icon: BookOpen, color: "text-[#84CC16]" },
    { href: "/language", label: t.nav.language, icon: Languages, color: "text-primary" },
  ]

  const activeItem = navItems.find(item => item.href === pathname) || navItems[0]
  const rightLogo = placeholderData.placeholderImages.find(img => img.id === "header-right-logo")

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-32 flex items-center relative">
        {/* Menu far left */}
        <div className="flex-shrink-0 z-10">
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-4 sm:px-6 rounded-2xl shadow-lg hover:bg-white/5 transition-all active:scale-95 group">
                  <Menu className={cn("w-5 h-5 transition-transform group-hover:rotate-90", activeItem.color)} />
                  <span className={cn("font-headline font-bold text-base hidden xs:inline-block", activeItem.color)}>
                    {activeItem.label}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 glass-panel border-white/10 p-2 mt-2 shadow-2xl rounded-2xl">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <DropdownMenuItem className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors mb-1 last:mb-0",
                      pathname === item.href 
                        ? "bg-white/10 font-bold" 
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
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
            <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-4 sm:px-6 rounded-2xl opacity-50 cursor-default">
              <Menu className="w-5 h-5 text-muted-foreground" />
              <span className="font-headline font-bold text-base hidden xs:inline-block text-muted-foreground">
                Menu
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        {/* Branding Centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link href="/" className="flex flex-col items-center pointer-events-auto group">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse hidden sm:block" />
              <span className="text-3xl sm:text-5xl font-bold font-headline portal-text-gradient leading-none tracking-tighter">
                CleanLink
              </span>
            </div>
            <div className="flex flex-col items-center mt-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-px w-4 bg-primary/30" />
                <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.4em] whitespace-nowrap opacity-70 group-hover:opacity-100 transition-opacity">
                  Powered by Harley:work smarter
                </span>
                <span className="h-px w-4 bg-primary/30" />
              </div>
            </div>
          </Link>
        </div>

        {/* Right Logo */}
        <div className="flex-shrink-0 z-10 ml-auto pointer-events-auto">
          {rightLogo && (
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 animate-float">
              <Image
                src={rightLogo.imageUrl}
                alt={rightLogo.description}
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                data-ai-hint={rightLogo.imageHint}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
