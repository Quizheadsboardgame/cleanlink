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
  Sparkles
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/language-context"

export default function HowToUsePage() {
  const { t } = useLanguage()

  const steps = [
    {
      title: "Select Your Interface",
      description: "Use the neural-link menu to navigate between Stores, Equipment, Tasks, or Shift modules.",
      icon: MousePointerClick,
      color: "text-lime-400"
    },
    {
      title: "Input Directives",
      description: "Specify your parameters—name, site location, and task details—for the AI to process.",
      icon: BookOpen,
      color: "text-lime-500"
    },
    {
      title: "Deploy & Monitor",
      description: "Submit your request to the central server and track real-time processing on the Status Board.",
      icon: Send,
      color: "text-lime-300"
    }
  ]

  const features = [
    {
      title: t.nav.stores,
      description: "Request cleaning supplies and consumables. Neural-log processing ensures delivery within 3 cycles.",
      icon: PlusCircle,
      color: "text-[#6E76F5]",
      bg: "bg-[#6E76F5]/10"
    },
    {
      title: t.nav.faulty,
      description: "Report localized hardware failures. The system prioritizes replacements for next-cycle deployment.",
      icon: Hammer,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      title: t.nav.incomplete,
      description: "Report access hazards or locked zones. Critical for maintaining operational site integrity.",
      icon: AlertTriangle,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10"
    },
    {
      title: t.nav.hours,
      description: "Apply for additional working hours. Temporary or permanent requests are processed via management neural-net.",
      icon: Clock,
      color: "text-[#D946EF]",
      bg: "bg-[#D946EF]/10"
    },
    {
      title: t.nav.referral,
      description: "Recommend new operatives. Provide their communication keys and the AI will initiate contact.",
      icon: UserPlus,
      color: "text-[#FACC15]",
      bg: "bg-[#FACC15]/10"
    },
    {
      title: t.nav.cover,
      description: "Access active shift opportunities. Monitor expiry countdowns for high-priority cover assignments.",
      icon: CalendarDays,
      color: "text-[#0EA5E9]",
      bg: "bg-[#0EA5E9]/10"
    },
    {
      title: t.status.title,
      description: "Real-time holographic monitoring of all system inputs. High-transparency task tracking.",
      icon: LayoutList,
      color: "text-white",
      bg: "bg-white/10"
    },
    {
      title: t.nav.info,
      description: "Access management communication keys and standard operating neural-protocols.",
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  const benefits = [
    {
      title: "AI-Powered Velocity",
      description: "Instant data transmission. Your request is analyzed and routed the moment you initiate deployment.",
      icon: Zap
    },
    {
      title: "Predictive Timelines",
      description: "Live countdowns provide definitive review windows, powered by management review cycles.",
      icon: LayoutList
    },
    {
      title: "Omni-Channel Access",
      description: "Seamlessly interact with CleanLink from any mobile or desktop interface across all locations.",
      icon: Smartphone
    },
    {
      title: "Income Optimization",
      description: "The Cover Board intelligently surfaces extra income opportunities across the entire site network.",
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
              <span className="text-xs font-bold uppercase tracking-[0.3em]">AI-Optimization</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline guide-text-gradient tracking-tighter">{t.guide.title}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-80">
              {t.guide.description}
            </p>
          </div>

          {/* Quick Steps */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-lime-500/30 text-lime-400 px-3 py-1 font-mono tracking-widest text-[10px]">SYSTEM_INITIALIZATION</Badge>
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
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-mono tracking-widest text-[10px]">MODULE_DIRECTORY</Badge>
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
              <Badge variant="outline" className="border-lime-500/30 text-lime-400 px-3 py-1 font-mono tracking-widest text-[10px]">PLATFORM_ADVANTAGES</Badge>
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
                  <Clock className="w-4 h-4" /> Next-Cycle Review by 12:00
                </div>
                <div className="bg-white/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 border border-white/10">
                  <ShieldCheck className="w-4 h-4" /> Operational Mon - Fri
                </div>
              </div>
            </div>
          </Card>

          <div className="text-center pt-12 border-t border-white/5">
            <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/60 font-bold uppercase tracking-[0.4em]">
              <Sparkles className="w-3 h-3" />
              <span>{t.guide.developer}</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
