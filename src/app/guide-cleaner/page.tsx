"use client"

import * as React from "react"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles, CheckCircle2, Zap, LayoutList, UserPlus, ShieldCheck, Download, Printer } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

export default function GuideCleanerPage() {
  const { t, isRTL } = useLanguage()
  const searchParams = useSearchParams()
  const autoDownload = searchParams.get('download') === 'true'

  useEffect(() => {
    if (autoDownload) {
      const timer = setTimeout(() => {
        window.print()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [autoDownload])

  const sections = [
    { title: t.sheetCleaner.section1Title, desc: t.sheetCleaner.section1Desc, icon: Zap },
    { title: t.sheetCleaner.section2Title, desc: t.sheetCleaner.section2Desc, icon: LayoutList },
    { title: t.sheetCleaner.section3Title, desc: t.sheetCleaner.section3Desc, icon: UserPlus },
    { title: t.sheetCleaner.section4Title, desc: t.sheetCleaner.section4Desc, icon: ShieldCheck },
  ]

  const handleDownload = () => {
    window.print()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-full flex justify-between items-center no-print">
              <Link href="/how-to-use">
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-white">
                  <ArrowLeft className={isRTL ? "rotate-180" : ""} /> {t.common.back}
                </Button>
              </Link>
              
              <Button 
                onClick={handleDownload}
                className="guide-gradient text-white rounded-xl shadow-lg gap-2 h-10 px-6 font-bold"
              >
                <Download className="w-4 h-4" /> {t.common.downloadPdf}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-lime-500/30 text-lime-400 font-mono tracking-[0.3em] uppercase text-[10px] px-4 py-1">
                Cleaner Edition
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-headline guide-text-gradient tracking-tighter">
                {t.sheetCleaner.title}
              </h1>
              <p className="text-xl font-medium text-white/90 italic tracking-tight">
                "{t.sheetCleaner.tagline}"
              </p>
            </div>
            
            <div className="max-w-2xl bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t.sheetCleaner.intro}
              </p>
            </div>
          </div>

          {/* Core Content */}
          <div className="grid gap-8">
            {sections.map((section, idx) => (
              <div key={idx} className="flex flex-col md:flex-row gap-6 items-start group">
                <div className="w-16 h-16 shrink-0 guide-gradient rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-headline flex items-center gap-3">
                    {section.title}
                    <CheckCircle2 className="w-5 h-5 text-lime-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {section.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer of the sheet */}
          <div className="pt-16 border-t border-white/5 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-primary">
              <Sparkles className="w-5 h-5 animate-pulse no-print" />
              <span className="font-headline font-bold uppercase tracking-[0.2em]">{t.sheetCleaner.footer}</span>
            </div>
            <p className="text-xs text-muted-foreground/40 uppercase tracking-[0.5em] font-bold">
              The Cleaners Cupboard: Work Smarter
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
