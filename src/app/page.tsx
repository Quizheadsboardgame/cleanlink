
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  PlusCircle, Hammer, AlertTriangle, Clock, UserPlus, 
  CalendarDays, LayoutList, Info, BookOpen, Sparkles, 
  ArrowRight, ShieldAlert, Heart, Link2, Lock, CreditCard 
} from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"
import { cn } from "@/lib/utils"

export default function HomeHub() {
  const { t } = useLanguage()
  const { managerName, isManagerLinked, isManagerAuthorized } = useManagerContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const services = [
    { href: "/stores", label: t.nav.stores, icon: PlusCircle, color: "stores-text-gradient", border: "hover:border-[#6E76F5]/40", bg: "bg-[#6E76F5]/5" },
    { href: "/faulty-equipment", label: t.nav.faulty, icon: Hammer, color: "faulty-text-gradient", border: "hover:border-[#F59E0B]/40", bg: "bg-[#F59E0B]/5" },
    { href: "/incomplete-task", label: t.nav.incomplete, icon: AlertTriangle, color: "incomplete-text-gradient", border: "hover:border-[#EF4444]/40", bg: "bg-[#EF4444]/5" },
    { href: "/additional-hours", label: t.nav.hours, icon: Clock, color: "hours-text-gradient", border: "hover:border-[#D946EF]/40", bg: "bg-[#D946EF]/5" },
    { href: "/pay-error", label: t.nav.pay, icon: CreditCard, color: "text-emerald-400", border: "hover:border-emerald-400/40", bg: "bg-emerald-400/5" },
    { href: "/referral", label: t.nav.referral, icon: UserPlus, color: "referral-text-gradient", border: "hover:border-[#FACC15]/40", bg: "bg-[#FACC15]/5" },
    { href: "/cover-work", label: t.nav.cover, icon: CalendarDays, color: "cover-text-gradient", border: "hover:border-[#0EA5E9]/40", bg: "bg-[#0EA5E9]/5" },
    { href: "/kudos", label: t.nav.kudos, icon: Heart, color: "text-rose-400", border: "hover:border-rose-400/40", bg: "bg-rose-400/5" },
    { href: "/status", label: t.nav.status, icon: LayoutList, color: "status-text-gradient", border: "hover:border-white/40", bg: "bg-white/5" },
    { href: "/report-concern", label: t.nav.concern, icon: ShieldAlert, color: "text-red-500", border: "hover:border-red-500/40", bg: "bg-red-500/5" },
    { href: isManagerAuthorized ? "/tasks" : "/manager-login", label: isManagerAuthorized ? "Management Hub" : t.nav.managerPortal, icon: Lock, color: "text-primary", border: "border-primary/20 bg-primary/5", bg: "bg-primary/10" },
    { href: "/important-info", label: t.nav.info, icon: Info, color: "info-text-gradient", border: "hover:border-orange-500/40", bg: "bg-orange-500/5" },
    { href: "/how-to-use", label: t.nav.guide, icon: BookOpen, color: "guide-text-gradient", border: "hover:border-[#84CC16]/40", bg: "bg-[#84CC16]/5" },
  ]

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-6xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">System Online</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-headline portal-text-gradient tracking-tighter">
              The Cleaners Cupboard
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-80">
              Select a task below to begin your digital workflow.
            </p>
            {isManagerAuthorized ? (
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full border border-primary/20 text-[10px] font-bold uppercase tracking-widest">
                <Lock className="w-3 h-3" /> Management Session Active
              </div>
            ) : isManagerLinked ? (
              <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-1.5 rounded-full border border-green-500/20 text-[10px] font-bold uppercase tracking-widest">
                <Link2 className="w-3 h-3" /> Linked to Manager: {managerName}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest">
                <ShieldAlert className="w-3 h-3" /> Generic View: No Manager Linked
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => (
              <Link key={service.href} href={service.href} className="group">
                <Card className={cn("glass-panel h-full border-white/5 transition-all duration-300 group-hover:-translate-y-1 overflow-hidden relative", service.border)}>
                  <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500", service.bg)} />
                  <CardHeader className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn("p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-300", service.color)}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    <CardTitle className={cn("text-xl font-headline font-bold", service.color)}>{service.label}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
