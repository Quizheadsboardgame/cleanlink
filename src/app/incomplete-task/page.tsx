import { Navbar } from "@/components/navbar"
import { IncompleteTaskForm } from "@/components/incomplete-task-form"

export default function IncompleteTaskPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold font-headline incomplete-text-gradient">Incomplete Task</h1>
          <p className="text-muted-foreground">Report issues that prevented you from finishing a cleaning task.</p>
        </div>
        <IncompleteTaskForm />
      </main>

      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-headline portal-text-gradient">PortalFlow</span>
            <span className="text-xs text-muted-foreground">© 2024 Stock Management</span>
          </div>
        </div>
      </footer>
    </div>
  )
}