
"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdditionalHoursForm } from "@/components/additional-hours-form"
import { useLanguage } from "@/context/language-context"

export default function AdditionalHoursPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold font-headline hours-text-gradient">{t.hours.title}</h1>
          <p className="text-muted-foreground">{t.hours.description}</p>
        </div>
        <AdditionalHoursForm />
      </main>

      <Footer />
    </div>
  )
}
