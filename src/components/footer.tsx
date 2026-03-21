"use client"

import Link from "next/link"
import Image from "next/image"
import placeholderData from "@/app/lib/placeholder-images.json"

export function Footer() {
  const bannerLogo = placeholderData.placeholderImages.find(img => img.id === "banner-logo")

  return (
    <footer className="border-t border-white/5 py-10 mt-auto bg-black">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo far left, 4x larger (240x240) */}
        <div className="relative w-[240px] h-[240px]">
          {bannerLogo && (
            <Image
              src={bannerLogo.imageUrl}
              alt={bannerLogo.description}
              fill
              className="object-contain opacity-90 hover:opacity-100 transition-opacity"
              data-ai-hint={bannerLogo.imageHint}
            />
          )}
        </div>

        {/* Brand info on the right */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 flex-col">
            <span className="text-xl font-bold font-headline portal-text-gradient">PortalFlow</span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Powered by HARLEY</span>
          </div>
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-2">
            © 2024 SMART HARLEY
          </span>
        </div>
      </div>
    </footer>
  )
}
