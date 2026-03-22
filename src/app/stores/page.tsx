import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { StockOrderForm } from "@/components/stock-order-form"
import { Suspense } from "react"

export default function StoresPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold font-headline stores-text-gradient">Stores Order</h1>
          <p className="text-muted-foreground">Submit a new stock request for your site.</p>
        </div>
        <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
          <StockOrderForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
