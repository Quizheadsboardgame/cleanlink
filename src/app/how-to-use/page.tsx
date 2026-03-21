"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MousePointerClick, Zap, ShieldCheck, Clock, MessageSquare, Smartphone } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function HowToUsePage() {
  const steps = [
    {
      title: "Select Your Form",
      description: "Use the top-left menu to choose between Stores Order, Faulty Equipment, or Incomplete Task reports.",
      icon: MousePointerClick,
      color: "text-emerald-400"
    },
    {
      title: "Fill in Details",
      description: "Provide your name, select your site, and add the necessary items or descriptions for your request.",
      icon: BookOpen,
      color: "text-emerald-500"
    },
    {
      title: "Submit & Track",
      description: "Hit the submit button and head to the Status Board to see your request's progress in real-time.",
      icon: SendIcon,
      color: "text-emerald-300"
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
      icon: Clock
    },
    {
      title: "Universal Access",
      description: "Submit orders and reports from any device at any location. Works perfectly on mobile and desktop.",
      icon: Smartphone
    },
    {
      title: "Digital Reliability",
      description: "All submissions are stored securely in the cloud, meaning nothing gets lost or overlooked.",
      icon: ShieldCheck
    }
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold font-headline info-text-gradient">Guide to PortalFlow</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Everything you need to know about using our professional stock management and reporting platform.
            </p>
          </div>

          {/* How to Submit Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
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

          {/* Benefits Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
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
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl font-bold font-headline">Need Emergency Help?</h2>
              <p className="max-w-xl opacity-90">
                While PortalFlow is the fastest way to handle standard stock and equipment requests, always call your manager immediately for site emergencies or health and safety risks.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold">
                  Next-Day Review by 12 PM
                </div>
                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-bold">
                  Mon - Fri Coverage
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

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}