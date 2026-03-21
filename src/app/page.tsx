
import { Navbar } from "@/components/navbar"
import { StockOrderForm } from "@/components/stock-order-form"
import { ArrowUpRight, ShieldCheck, Zap, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <header className="max-w-3xl mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="w-3 h-3" /> System Operational
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight mb-6">
            Logistics flow, <span className="portal-text-gradient">simplified.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            Streamline your stock management with PortalFlow. Rapid order entry, 
            dynamic item lists, and direct WhatsApp dispatch designed for modern fleets.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in delay-100">
          <FeatureCard 
            icon={<ShieldCheck className="w-5 h-5 text-accent" />}
            title="Secure Data"
            desc="Encrypted order transmission for fleet security."
          />
          <FeatureCard 
            icon={<Zap className="w-5 h-5 text-accent" />}
            title="Instant Sync"
            desc="Ready for instant WhatsApp submission."
          />
          <FeatureCard 
            icon={<Globe className="w-5 h-5 text-accent" />}
            title="Site Unified"
            desc="Manage multiple locations from one dashboard."
          />
          <FeatureCard 
            icon={<ArrowUpRight className="w-5 h-5 text-accent" />}
            title="Real-time Analytics"
            desc="Deep insights into your stock velocity."
          />
        </div>

        <section className="relative">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 blur-[120px] rounded-full -z-10" />
          <StockOrderForm />
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold font-headline portal-text-gradient">PortalFlow</span>
            <span className="text-xs text-muted-foreground">© 2024 Logistics Hub</span>
          </div>
          <div className="flex gap-8 text-sm text-muted-foreground">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card/40 border border-white/5 hover:border-primary/20 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}
