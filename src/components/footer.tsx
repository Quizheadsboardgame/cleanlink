"use client"

import Link from "next/link"
import Image from "next/image"
import placeholderData from "@/app/lib/placeholder-images.json"
import { Sparkles } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()
  const bannerLogo = placeholderData.placeholderImages.find(img => img.id === "banner-logo")

  return (
    <footer className="border-t border-white/5 py-12 mt-auto bg-black/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo far left */}
        <div className="relative w-[200px] h-[200px] group">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          {bannerLogo && (
            <Image
              src={bannerLogo.imageUrl}
              alt={bannerLogo.description}
              fill
              className="object-contain opacity-70 hover:opacity-100 transition-all duration-500 filter grayscale hover:grayscale-0 scale-95 hover:scale-100"
              data-ai-hint={bannerLogo.imageHint}
            />
          )}
        </div>

        {/* Brand info on the right */}
        <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
          <div className="flex flex-col gap-1">
            <span className="text-3xl font-bold font-headline portal-text-gradient tracking-tighter">CleanLink</span>
            <div className="flex items-center justify-center md:justify-end gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" />
              <span>{t.footer.tagline}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium opacity-50">
              {t.footer.copyright}
            </p>
            <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em]">
              {t.footer.subtext}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}