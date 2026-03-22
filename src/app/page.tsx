"use client"

import * as React from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  PlusCircle, 
  Hammer, 
  AlertTriangle, 
  Clock, 
  UserPlus, 
  CalendarDays, 
  LayoutList, 
  Info, 
  BookOpen, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Heart
} from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { cn } from "@/lib/utils"

export default function HomeHub() {
  const { t } = useLanguage()

  const services = [
    { href: "/stores", label: t.nav.stores, icon: PlusCircle, color: "stores-text-gradient", border: "hover:border-[#6E76F5]/40", bg: "bg-[#6E76F5]/5", desc: "Request cleaning supplies and materials." },
    { href: "/faulty-equipment", label: t.nav.faulty, icon: Hammer, color: "faulty-text-gradient", border: "hover:border-[#F59E0B]/40", bg: "bg-[#F59E0B]/5", desc: "Report broken tools for replacement." },
    { href: "/incomplete-task", label: t.nav.incomplete, icon: AlertTriangle, color: "incomplete-text-gradient", border: "hover:border-[#EF4444]/40", bg: "bg-[#EF4444]/5", desc: "Log reasons for unfinished cleaning." },
    { href: "/additional-hours", label: t.nav.hours, icon: Clock, color: "hours-text-gradient", border: "hover:border-[#D946EF]/40", bg: "bg-[#D946EF]/5", desc: "Apply for extra shifts or permanent hours." },
    { href: "/referral", label: t.nav.referral, icon: UserPlus, color: "referral-text-gradient", border: "hover:border-[#FACC15]/40", bg: "bg-[#FACC15]/5", desc: "Invite others to join the team." },
    { href: "/cover-work", label: t.nav.cover, icon: CalendarDays, color: "cover-text-gradient", border: "hover:border-[#0EA5E9]/40", bg: "bg-[#0EA5E9]/5", desc: "Find and pick up available cover shifts." },
    { href: "/kudos", label: t.nav.kudos, icon: Heart, color: "text-rose-400", border: "hover:border-rose-400/40", bg: "bg-rose-400/5", desc: "Say thank you to a fellow teammate." },
    { href: "/status", label: t.nav.status, icon: LayoutList, color: "status-text-gradient", border: "hover:border-white/40", bg: "bg-white/5", desc: "Track your submitted forms and requests." },
    { href: "/report-concern", label: t.nav.concern, icon: ShieldAlert, color: "text-red-500", border: "hover:border-red-500/40", bg: "bg-red-500/5", desc: "Submit a private concern to management." },
    { href: "/important-info", label: t.nav.info, icon: Info, color: "info-text-gradient", border: "hover:border-orange-500/40", bg: "bg-orange-500/5", desc: "Contact details and site procedures." },
    { href: "/how-to-use", label: t.nav.guide, icon: BookOpen, color: "guide-text-gradient", border: "hover:border-[#84CC16]/40", bg: "bg-[#84CC16]/5", desc: "Learn how to use our system." },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="space-y-12">
          {/* Hero Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">System Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-headline portal-text-gradient tracking-tighter">
              The Cleaners Cupboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-80">
              Welcome to your digital workspace. Select a task below to begin.
            </p>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service, idx) => (
              <Link key={service.href} href={service.href} className="group">
                <Card className={cn(
                  "glass-panel h-full border-white/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/[0.03] overflow-hidden relative",
                  service.border
                )}>
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", service.bg)} />
                  <CardHeader className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-300", service.color)}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className={cn("text-xl font-headline font-bold", service.color)}>
                      {service.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 p-6 pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.desc}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Info Bar */}
          <div className="pt-12 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.5em] font-bold opacity-40">
              Secure Connection: ESTABLISHED
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
