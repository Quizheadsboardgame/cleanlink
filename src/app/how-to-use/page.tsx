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
  LayoutList
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HowToUsePage() {
  const steps = [
    {
      title: "Select Your Form",
      description: "Use the top-left menu to choose between Stores, Equipment, Tasks, or Shift requests.",
      icon: MousePointerClick,
      color: "text-emerald-400"
    },
    {
      title: "Fill in Details",
      description: "Provide your name, select your site, and add the necessary information for your specific request.",
      icon: BookOpen,
      color: "text-emerald-500"
    },
    {
      title: "Submit & Track",
      description: "Hit submit and monitor the Status Board to see exactly when management reviews your post.",
      icon: Send,
      color: "text-emerald-300"
    }
  ]

  const features = [
    {
      title: "Stores Order",
      description: "Request cleaning supplies and consumables. Note: Deliveries can take up to 3 working days.",
      icon: PlusCircle,
      color: "text-[#6E76F5]",
      bg: "bg-[#6E76F5]/10"
    },
    {
      title: "Faulty Equipment",
      description: "Report broken vacuums, mops, or buffers. Management reviews these for next-day replacement.",
      icon: Hammer,
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10"
    },
    {
      title: "Incomplete Task",
      description: "Report if access issues (locked doors) or hazards prevented you from finishing your work.",
      icon: AlertTriangle,
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10"
    },
    {
      title: "Additional Hours",
      description: "Apply for permanent shift increases or temporary extra hours when you have extra availability.",
      icon: Clock,
      color: "text-[#D946EF]",
      bg: "bg-[#D946EF]/10"
    },
    {
      title: "Cover Work",
      description: "Pick up extra shifts posted by managers. Note the countdown: interest must be logged before the deadline.",
      icon: CalendarDays,
      color: "text-[#0EA5E9]",
      bg: "bg-[#0EA5E9]/10"
    }
  ]

  const benefits = [
    {
      title: "Instant Processing",
      description: "No more paper forms. Your request is sent directly to management the moment you hit submit.",
      icon: Zap
    },
    {
      title: "Live Status Board",
      description: "Every submission includes a live countdown to its expected review time, ensuring total transparency.",
      icon: LayoutList
    },
    {
      title: "Universal Access",
      description: "Submit orders and reports from any device at any location. Works perfectly on mobile and desktop.",
      icon: Smartphone
    },
    {
      title: "Proactive Shifts",
      description: "The Cover Work board allows you to proactively find extra income opportunities across all Lot 4 sites.",
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
            <h1 className="text-4xl md:text-5xl font-bold font-headline info-text-gradient">Guide to PortalFlow</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about using our professional stock management and reporting platform for Lot 4.
            </p>
          </div>

          {/* Quick Steps */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-3 py-1">GETTING STARTED</Badge>
              <h2 className="text-2xl font-bold font-headline">How to Submit</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {steps.map((step, idx) => (
                <Card key={idx} className="glass-panel border-white/5 transition-all hover:border-emerald-500/20">
                  <CardHeader>
                    <div className={`${step.color} bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-2`}>
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
              <Badge variant="outline" className="border-primary/30 text-primary px-3 py-1">REPORTS & REQUESTS</Badge>
              <h2 className="text-2xl font-bold font-headline">What can I do?</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, idx) => (
                <Card key={idx} className="glass-panel border-white/5 hover:bg-white/[0.02] transition-colors">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className={`${feature.bg} p-2.5 rounded-lg`}>
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
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 px-3 py-1">WHY USE PORTALFLOW</Badge>
              <h2 className="text-2xl font-bold font-headline">System Benefits</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit, idx) => (
                <Card key={idx} className="glass-panel border-white/5 p-6 flex gap-4">
                  <div className="bg-emerald-500/10 p-3 rounded-full h-fit">
                    <benefit.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold font-headline">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Emergency Info Box */}
          <Card className="info-gradient border-none text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-headline">Need Emergency Help?</h2>
                <p className="max-w-xl opacity-90 leading-relaxed">
                  While PortalFlow is the fastest way to handle standard stock and equipment requests, always call your manager immediately for site emergencies, health and safety risks, or urgent access issues.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Next-Day Review by 12 PM
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Mon - Fri Coverage
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}