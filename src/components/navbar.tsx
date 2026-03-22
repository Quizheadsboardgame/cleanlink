
"use client"

import { useState, useEffect } from "react"
import { 
  PlusCircle, 
  Hammer, 
  AlertTriangle, 
  Info, 
  LayoutList, 
  Menu, 
  ChevronDown, 
  BookOpen, 
  Clock, 
  CalendarDays, 
  UserPlus, 
  Sparkles, 
  Languages, 
  Home, 
  ShieldAlert, 
  Heart, 
  Lock, 
  LayoutDashboard,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import placeholderData from "@/app/lib/placeholder-images.json"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"

export function Navbar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { t } = useLanguage()
  const { isManagerAuthorized } = useManagerContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  const rightLogo = placeholderData.placeholderImages.find(img => img.id === "header-right-logo")

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl h-32">
        <div className="container mx-auto px-4 h-full flex items-center justify-between" />
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-32 flex items-center relative">
        {/* Menu far left */}
        <div className="flex-shrink-0 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-4 sm:px-6 rounded-2xl shadow-lg hover:bg-white/5 transition-all active:scale-95 group">
                <Menu className="w-5 h-5 transition-transform group-hover:rotate-90 text-primary" />
                <span className="font-headline font-bold text-base hidden xs:inline-block text-primary">
                  Menu
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 glass-panel border-white/10 p-0 mt-2 shadow-2xl rounded-2xl overflow-hidden">
              <ScrollArea className="h-full max-h-[85vh]">
                <div className="p-2 space-y-1">
                  {/* Home Hub always at the top */}
                  <Link href="/">
                    <DropdownMenuItem className={cn(
                      "flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors",
                      pathname === "/" ? "bg-white/10 font-bold" : "text-muted-foreground hover:bg-white/5"
                    )}>
                      <Home className="w-5 h-5 text-primary" />
                      <span className={cn("text-sm", pathname === "/" ? "text-primary" : "")}>Home Hub</span>
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator className="bg-white/5" />

                  {/* Daily Tasks Group */}
                  <DropdownMenuLabel className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                    {t.nav.groupOps}
                  </DropdownMenuLabel>
                  <Link href="/stores">
                    <DropdownMenuItem className={cn(
                      "flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl mb-0.5",
                      pathname === "/stores" ? "bg-white/10" : "hover:bg-white/5"
                    )}>
                      <PlusCircle className="w-4 h-4 text-[#6E76F5]" />
                      <span className="text-sm">{t.nav.stores}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/faulty-equipment">
                    <DropdownMenuItem className={cn(
                      "flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl mb-0.5",
                      pathname === "/faulty-equipment" ? "bg-white/10" : "hover:bg-white/5"
                    )}>
                      <Hammer className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-sm">{t.nav.faulty}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/incomplete-task">
                    <DropdownMenuItem className={cn(
                      "flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl",
                      pathname === "/incomplete-task" ? "bg-white/10" : "hover:bg-white/5"
                    )}>
                      <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
                      <span className="text-sm">{t.nav.incomplete}</span>
                    </DropdownMenuItem>
                  </Link>

                  {/* Staff Services Group */}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuLabel className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                    {t.nav.groupStaff}
                  </DropdownMenuLabel>
                  <Link href="/additional-hours">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 mb-0.5">
                      <Clock className="w-4 h-4 text-[#D946EF]" />
                      <span className="text-sm">{t.nav.hours}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/cover-work">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 mb-0.5">
                      <CalendarDays className="w-4 h-4 text-[#0EA5E9]" />
                      <span className="text-sm">{t.nav.cover}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/referral">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 mb-0.5">
                      <UserPlus className="w-4 h-4 text-[#FACC15]" />
                      <span className="text-sm">{t.nav.referral}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/kudos">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span className="text-sm">{t.nav.kudos}</span>
                    </DropdownMenuItem>
                  </Link>

                  {/* Tracking & Privacy Group */}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuLabel className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                    {t.nav.groupTrack}
                  </DropdownMenuLabel>
                  <Link href="/status">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 mb-0.5">
                      <LayoutList className="w-4 h-4 text-white" />
                      <span className="text-sm">{t.nav.status}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/report-concern">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5">
                      <ShieldAlert className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{t.nav.concern}</span>
                    </DropdownMenuItem>
                  </Link>

                  {/* Info & Support Group */}
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuLabel className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/60">
                    {t.nav.groupInfo}
                  </DropdownMenuLabel>
                  <Link href="/important-info">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 mb-0.5">
                      <Info className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">{t.nav.info}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/how-to-use">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5 mb-0.5">
                      <BookOpen className="w-4 h-4 text-[#84CC16]" />
                      <span className="text-sm">{t.nav.guide}</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/language">
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-2.5 cursor-pointer rounded-xl hover:bg-white/5">
                      <Languages className="w-4 h-4 text-primary" />
                      <span className="text-sm">{t.nav.language}</span>
                    </DropdownMenuItem>
                  </Link>

                  {/* Management at the very bottom */}
                  <DropdownMenuSeparator className="bg-white/10 h-px my-4" />
                  <DropdownMenuLabel className="px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary/60">
                    {t.nav.groupAdmin}
                  </DropdownMenuLabel>
                  <Link href={isManagerAuthorized ? "/tasks" : "/manager-login"}>
                    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl hover:bg-primary/5 transition-colors border border-primary/10">
                      {isManagerAuthorized ? <LayoutDashboard className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-primary" />}
                      <span className="text-sm font-bold text-primary">
                        {isManagerAuthorized ? "Manager Dashboard" : t.nav.managerPortal}
                      </span>
                    </DropdownMenuItem>
                  </Link>
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Branding Centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link href="/" className="flex flex-col items-center pointer-events-auto group">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse hidden sm:block" />
              <span className="text-2xl sm:text-4xl lg:text-5xl font-bold font-headline portal-text-gradient leading-none tracking-tighter text-center">
                The Cleaners Cupboard
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
