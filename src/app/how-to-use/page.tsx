
"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  MousePointerClick, 
  Zap, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Smartphone,
  PlusCircle,
  Hammer,
  AlertTriangle,
  CalendarDays,
  Send,
  LayoutList,
  UserPlus,
  Sparkles,
  FileDown,
  ArrowRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export default function HowToUsePage() {
  const { t } = useLanguage()

  const steps = [
    {
      title: "1. Pick a Category",
      description: "Use the menu to choose between Stores, Equipment, Tasks, or Shift modules.",
      icon: MousePointerClick,
      color: "text-lime-400"
    },
    {
      title: "2. Fill in the Details",
      description: "Enter your name, your site location, and what you need help with.",
      icon: BookOpen,
      color: "text-lime-500"
    },
    {
      title: "3. Send and Track",
      description: "Submit your form and track its progress in real-time on the Status Board.",
      icon: Send,
      color: "text-lime-300"
    }
  ]

  const features = [
    {
      title: t.nav.stores,
      description: "Request cleaning supplies. They are usually delivered within 3 working days.",
      icon: PlusCircle,
      color: "text-[#6E76F5]",
      bg: "bg-[#6E76F5]/10"
    },
    {
      title: t.nav.faulty,
      description: "Report broken equipment to get a replacement as quickly as possible.",
      icon: Hammer,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      title: t.nav.incomplete,
      description: "Let us know if you couldn't finish a task due to access or safety issues.",
      icon: AlertTriangle,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10"
    },
    {
      title: t.nav.hours,
      description: "Apply for extra shifts or more permanent hours at your location.",
      icon: Clock,
      color: "text-[#D946EF]",
      bg: "bg-[#D946EF]/10"
    },
    {
      title: t.nav.referral,
      description: "Recommend a friend or family member to join our cleaning team.",
      icon: UserPlus,
      color: "text-[#FACC15]",
      bg: "bg-[#FACC15]/10"
    },
    {
      title: t.nav.cover,
      description: "Find available shifts you can pick up at different sites for extra pay.",
      icon: CalendarDays,
      color: "text-[#0EA5E9]",
      bg: "bg-[#0EA5E9]/10"
    },
    {
      title: t.status.title,
      description: "Check the live status of all your requests and see when they are done.",
      icon: LayoutList,
      color: "text-white",
      bg: "bg-white/10"
    },
    {
      title: t.nav.info,
      description: "Find contact details for management and important site guides.",
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  const benefits = [
    {
      title: "Fast Responses",
      description: "Your request is sent instantly to management so they can review it quickly.",
      icon: Zap
    },
    {
      title: "Live Updates",
      description: "Track your request from 'Submitted' to 'Complete' in real-time.",
      icon: LayoutList
    },
    {
      title: "Works on Any Phone",
      description: "Access CleanLink on your smartphone or tablet while you are at work.",
      icon: Smartphone
    },
    {
      title: "Earn More",
      description: "Easily find and apply for extra cover shifts across our entire network.",
      icon: ShieldCheck
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="space-y-16">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-lime-400 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">User Friendly Interface</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline guide-text-gradient tracking-tighter">{t.guide.title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-80">
              {t.guide.description}
            </p>
          </div>

          {/* Quick Steps */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-lime-500/30 text-lime-400 px-3 py-1 font-mono tracking-widest text-[10px]">EASY_WORKFLOW</Badge>
              <h2 className="text-2xl font-bold font-headline">{t.guide.workflow}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, idx) => (
                <Card key={idx} className="glass-panel transition-all hover:border-lime-500/40 group">
                  <CardHeader>
                    <div className={`${step.color} bg-white/5 w-12 h-12 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg font-headline">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Feature Directory */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-mono tracking-widest text-[10px]">WHAT_YOU_CAN_DO</Badge>
              <h2 className="text-2xl font-bold font-headline">{t.guide.capabilities}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <Card key={idx} className="glass-panel hover:bg-white/[0.03] transition-all group">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className={`${feature.bg} p-2.5 rounded-xl group-hover:rotate-6 transition-transform`}>
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-base font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-lime-500/30 text-lime-400 px-3 py-1 font-mono tracking-widest text-[10px]">KEY_BENEFITS</Badge>
              <h2 className="text-2xl font-bold font-headline">{t.guide.benefits}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="glass-panel p-6 flex gap-4 hover:border-lime-500/20 transition-colors">
                  <div className="bg-lime-500/10 p-4 rounded-full h-fit">
                    <benefit.icon className="w-5 h-5 text-lime-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold font-headline text-lg">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Downloadable Resources - MOVED TO BOTTOM */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-mono tracking-widest text-[10px]">RESOURCE_CENTER</Badge>
              <h2 className="text-2xl font-bold font-headline">{t.guide.resourcesTitle}</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Cleaner Guide */}
              <Card className="glass-panel overflow-hidden group hover:border-lime-500/30 transition-all border-white/5">
                <div className="h-2 w-full guide-gradient" />
                <CardHeader className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-headline flex items-center gap-3">
                        <FileDown className="w-6 h-6 text-lime-400" />
                        {t.guide.cleanerGuideTitle}
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed">
                        {t.guide.cleanerGuideDesc}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Button className="w-full guide-gradient text-white h-12 rounded-xl group-hover:scale-[1.02] transition-transform font-bold tracking-tight">
                    {t.guide.viewSheet}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Manager Guide */}
              <Card className="glass-panel overflow-hidden group hover:border-primary/30 transition-all border-white/5">
                <div className="h-2 w-full tasks-gradient" />
                <CardHeader className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl font-headline flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        {t.guide.managerGuideTitle}
                      </CardTitle>
                      <p className="text-muted-foreground leading-relaxed">
                        {t.guide.managerGuideDesc}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Button className="w-full tasks-gradient text-white h-12 rounded-xl group-hover:scale-[1.02] transition-transform font-bold tracking-tight">
                    {t.guide.viewSheet}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Emergency Info Box */}
          <Card className="guide-gradient border-none text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-1000">
              <Sparkles className="w-48 h-48" />
            </div>
            <div className="relative z-10 space-y-8">
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tighter">{t.guide.emergencyTitle}</h2>
                <p className="max-w-xl text-lg opacity-90 leading-relaxed font-medium">
                  {t.guide.emergencyDesc}
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 border border-white/10">
                  <Clock className="w-4 h-4" /> Next-Day Review
                </div>
                <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 border border-white/10">
                  <ShieldCheck className="w-4 h-4" /> Management Mon - Fri
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center pt-12 border-t border-white/5">
            <div className="inline-flex flex-col items-center gap-2 text-xs text-muted-foreground/60 font-bold uppercase tracking-[0.4em]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span>Made by Smart Harley Technology</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
