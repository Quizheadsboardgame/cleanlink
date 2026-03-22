"use client"

import * as React from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Languages, Check, ArrowLeft, Sparkles } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { Language } from "@/lib/translations"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function LanguagePage() {
  const { language, setLanguage, t, isRTL } = useLanguage()

  const languageOptions: { id: Language; label: string; sub: string }[] = [
    { id: 'en', label: "English", sub: "Global Standard" },
    { id: 'es', label: "Español", sub: "Castellano" },
    { id: 'pt', label: "Português", sub: "Brasil / Portugal" },
    { id: 'pl', label: "Polski", sub: "Polska" },
    { id: 'ro', label: "Română", sub: "România" },
    { id: 'cs', label: "Čeština", sub: "Česko" },
    { id: 'bg', label: "Български", sub: "България" },
    { id: 'tr', label: "Türkçe", sub: "Türkiye" },
    { id: 'ar', label: "العربية", sub: "الشرق الأوسط" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-primary mb-2">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">AI-Optimization</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline portal-text-gradient tracking-tighter">
              {t.language.title}
            </h1>
            <p className="text-muted-foreground text-lg opacity-80 max-w-2xl mx-auto">
              {t.language.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {languageOptions.map((opt) => (
              <Card 
                key={opt.id}
                onClick={() => setLanguage(opt.id)}
                className={cn(
                  "glass-panel cursor-pointer transition-all hover:bg-white/[0.05] group",
                  language === opt.id ? "border-primary/50 bg-primary/5 shadow-[0_0_20px_rgba(110,118,245,0.1)]" : "border-white/5"
                )}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      language === opt.id ? "bg-primary text-white" : "bg-white/5 text-muted-foreground"
                    )}>
                      <Languages className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg font-headline">{opt.label}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{opt.sub}</p>
                    </div>
                  </div>
                  {language === opt.id && (
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Check className="w-5 h-5 text-primary" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-8 flex justify-center">
            <Link href="/">
              <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-white">
                <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
                {t.language.back}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
