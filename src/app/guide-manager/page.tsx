"use client"

import * as React from "react"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShieldCheck, BarChart3, Package, Lock, FileText, Sparkles, Download } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useSearchParams } from "next/navigation"

export default function GuideManagerPage() {
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
    { title: t.sheetManager.section1Title, desc: t.sheetManager.section1Desc, icon: BarChart3 },
    { title: t.sheetManager.section2Title, desc: t.sheetManager.section2Desc, icon: Package },
    { title: t.sheetManager.section3Title, desc: t.sheetManager.section3Desc, icon: Lock },
    { title: t.sheetManager.section4Title, desc: t.sheetManager.section4Desc, icon: FileText },
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
                className="tasks-gradient text-white rounded-xl shadow-lg gap-2 h-10 px-6 font-bold"
              >
                <Download className="w-4 h-4" /> {t.common.downloadPdf}
              </Button>
            </div>
            
            <div className="space-y-2">
              <Badge variant="outline" className="border-primary/30 text-primary font-mono tracking-[0.3em] uppercase text-[10px] px-4 py-1">
                Managerial Strategy
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold font-headline tasks-text-gradient tracking-tighter">
                {t.sheetManager.title}
              </h1>
              <p className="text-xl font-medium text-white/90 italic tracking-tight">
                "{t.sheetManager.tagline}"
              </p>
            </div>
            
            <div className="max-w-2xl bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
              <p className="text-muted-foreground leading-relaxed text-lg">
                {t.sheetManager.intro}
              </p>
            </div>
          </div>

          {/* Strategic Columns */}
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((section, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-[2rem] border-white/5 hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 tasks-gradient rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-6 transition-transform">
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold font-headline mb-4 text-white">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {section.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Footer of the sheet */}
          <div className="pt-16 border-t border-white/5 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-primary">
              <ShieldCheck className="w-5 h-5 no-print" />
              <span className="font-headline font-bold uppercase tracking-[0.2em]">{t.sheetManager.footer}</span>
            </div>
            <p className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.8em] font-bold">
              The Cleaners Cupboard infrastructure v2.5
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
