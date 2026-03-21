import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { FaultyEquipmentForm } from "@/components/faulty-equipment-form"

export default function FaultyEquipmentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold font-headline faulty-text-gradient">Equipment Replacement</h1>
          <p className="text-muted-foreground">Report faulty equipment to request a replacement.</p>
        </div>
        <FaultyEquipmentForm />
      </main>

      <Footer />
    </div>
  )
}
