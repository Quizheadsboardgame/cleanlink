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
  CreditCard,
  Heart,
  ArrowRight
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/context/language-context"

export default function HowToUsePage() {
  const { t } = useLanguage()

  const steps = [
    {
      title: "1. Pick a Category",
      description: "Use the menu to choose between workplace tasks, staff services, or tracking modules.",
      icon: MousePointerClick,
      color: "text-primary"
    },
    {
      title: "2. Fill in the Details",
      description: "Enter your name, your site location, and the specific details of your request.",
      icon: BookOpen,
      color: "text-primary"
    },
    {
      title: "3. Send and Track",
      description: "Submit your form and track its progress in real-time on the Status Board.",
      icon: Send,
      color: "text-primary"
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
      description: "Is the equipment broken? Request a replacement as quickly as possible.",
      icon: Hammer,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      title: t.nav.incomplete,
      description: "Report issues with a whole area, a single section, or just a part of a section.",
      icon: AlertTriangle,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10"
    },
    {
      title: t.nav.pay,
      description: "Identify errors with missing hours or pay. Provide details from your payslip privately.",
      icon: CreditCard,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10"
    },
    {
      title: t.nav.hours,
      description: "Apply for more regular hours or permanent positions across our network.",
      icon: Clock,
      color: "text-[#D946EF]",
      bg: "bg-[#D946EF]/10"
    },
    {
      title: t.nav.cover,
      description: "Find and express interest in upcoming cover work shifts at various locations.",
      icon: CalendarDays,
      color: "text-[#0EA5E9]",
      bg: "bg-[#0EA5E9]/10"
    },
    {
      title: t.nav.referral,
      description: "Recommend a friend or family member to join our professional cleaning team.",
      icon: UserPlus,
      color: "text-[#FACC15]",
      bg: "bg-[#FACC15]/10"
    },
    {
      title: t.status.title,
      description: "Check the live status of all your requests and see real-time countdowns to review.",
      icon: LayoutList,
      color: "text-white",
      bg: "bg-white/10"
    },
    {
      title: "Kudos Board",
      description: "Celebrate your coworkers with public appreciation notes (Coming Soon).",
      icon: Heart,
      color: "text-rose-400",
      bg: "bg-rose-400/10"
    }
  ]

  const benefits = [
    {
      title: "Fast Responses",
      description: "Your request is sent instantly to management so they can review it by 12pm the next working day.",
      icon: Zap
    },
    {
      title: "Live Tracking",
      description: "Track your request from 'Submitted' to 'Complete' with high-precision countdown timers.",
      icon: LayoutList
    },
    {
      title: "Any Device",
      description: "Access My Tidy Tracker on your smartphone or tablet while you are at work.",
      icon: Smartphone
    },
    {
      title: "Confidentiality",
      description: "Sensitive reports like Pay Inquiries and Concerns are shared only with authorized managers.",
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
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">Work Smarter Protocol</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline portal-text-gradient tracking-tighter">How My Tidy Tracker Works</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto opacity-80">
              A professional digital environment designed to streamline site management and empower staff success.
            </p>
          </div>

          {/* Quick Steps */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-mono tracking-widest text-[10px]">EASY_WORKFLOW</Badge>
              <h2 className="text-2xl font-bold font-headline">{t.guide.workflow}</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, idx) => (
                <Card key={idx} className="glass-panel transition-all hover:border-primary/40 group">
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
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-mono tracking-widest text-[10px]">CAPABILITIES</Badge>
              <h2 className="text-2xl font-bold font-headline">What can I do?</h2>
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
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1 font-mono tracking-widest text-[10px]">KEY_BENEFITS</Badge>
              <h2 className="text-2xl font-bold font-headline">{t.guide.benefits}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="glass-panel p-6 flex gap-4 hover:border-primary/20 transition-colors">
                  <div className="bg-primary/10 p-4 rounded-full h-fit">
                    <benefit.icon className="w-5 h-5 text-primary" />
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
          <Card className="tasks-gradient border-none text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
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
                <span>Powered by Harley Infrastructure</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
