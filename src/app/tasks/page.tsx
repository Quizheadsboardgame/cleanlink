
"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, where, doc } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { format } from "date-fns"
import { CheckCircle2, Clock, Package, User, Building2, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TasksPage() {
  const { user } = useUser()
  const db = useFirestore()

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    // Query for tasks owned by the current user
    return query(collection(db, 'orderTasks'), where('ownerId', '==', user.uid))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection(tasksQuery)

  const handleComplete = (taskId: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    updateDocumentNonBlocking(taskRef, {
      status: 'Completed',
      completedAt: new Date().toISOString()
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold font-headline portal-text-gradient">Review Tasks</h1>
            <p className="text-muted-foreground">Manage and track your submitted stock orders.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading tasks...</p>
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <Card className="glass-panel border-dashed py-20 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-secondary/50 p-4 rounded-full">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No tasks found</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    You haven't submitted any stock orders yet. Go to "New Order" to get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((task) => (
                <Card key={task.id} className="glass-panel overflow-hidden transition-all hover:border-primary/30">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-headline flex items-center gap-2">
                            {task.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(task.createdAt), "PPP")}
                            </span>
                            <Badge variant={task.status === 'Completed' ? "secondary" : "default"} className="text-[10px] h-5">
                              {task.status}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-md">
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="truncate">{task.description.split('.')[0]}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-md">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="truncate">Ref: {task.stockOrderId}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.02] border-t sm:border-t-0 sm:border-l border-white/5 p-6 flex items-center justify-center">
                      {task.status !== 'Completed' ? (
                        <Button 
                          onClick={() => handleComplete(task.id)}
                          className="w-full sm:w-auto gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Completed
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 text-green-500 font-medium">
                          <CheckCircle2 className="w-5 h-5" />
                          Finished
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
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
