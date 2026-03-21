
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReportConcernForm } from "@/components/report-concern-form"
import { Sparkles } from "lucide-react"

export default function ReportConcernPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-red-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Confidential Protocol</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-white tracking-tighter">Report a Concern</h1>
          <p className="text-muted-foreground max-w-xl mx-auto opacity-80">
            Submit a private report about staff or safety. This information is shared only with management.
          </p>
        </div>
        <ReportConcernForm />
      </main>

      <Footer />
    </div>
  )
}
