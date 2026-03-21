
"use client"

import { Boxes, PlusCircle, Hammer, AlertTriangle, Info, LayoutList, Menu, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
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
  const bannerLogo = placeholderData.placeholderImages.find(img => img.id === "banner-logo")

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
      <div className="container mx-auto px-4 h-40 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {bannerLogo && (
            <div className="relative w-[120px] h-[120px] overflow-hidden">
              <Image
                src={bannerLogo.imageUrl}
                alt={bannerLogo.description}
                fill
                className="object-contain"
                data-ai-hint={bannerLogo.imageHint}
              />
            </div>
          )}
          
          <Link href="/" className="flex items-center gap-2">
            <div className="portal-gradient p-1.5 rounded-lg">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-headline tracking-tight portal-text-gradient hidden sm:inline-block">
              PortalFlow
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass-panel border-white/10 gap-2 h-12 px-6 rounded-xl shadow-lg hover:bg-white/5 transition-all active:scale-95">
                <Menu className="w-5 h-5 text-primary" />
                <span className="font-headline font-bold text-base hidden xs:inline-block">
                  {activeItem.label}
                </span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 glass-panel border-white/10 p-2 mt-2 shadow-2xl rounded-xl">
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
      </div>
    </nav>
  )
}
