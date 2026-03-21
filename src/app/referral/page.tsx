
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReferralForm } from "@/components/referral-form"

export default function ReferralPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold font-headline referral-text-gradient">Refer a Friend</h1>
          <p className="text-muted-foreground">Help grow our team by referring potential new staff members.</p>
        </div>
        <ReferralForm />
      </main>

      <Footer />
    </div>
  )
}
