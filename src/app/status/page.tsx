
"use client"

import * as React from "react"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { format } from "date-fns"
import { CheckCircle2, Clock, Building2, Loader2, ListTodo } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function StatusBoardPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    // Show all tasks ordered by newest first, limited to 50 for performance
    return query(collection(db, 'orderTasks'), orderBy('createdAt', 'desc'), limit(50))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection(tasksQuery)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-headline info-text-gradient">Public Status Board</h1>
            <p className="text-muted-foreground">Track the progress of all submitted orders and reports.</p>
          </div>

          {(isLoading || isUserLoading) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground">Syncing status board...</p>
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <Card className="glass-panel border-dashed py-20 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-secondary/50 p-4 rounded-full">
                  <ListTodo className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No active tasks</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    There are no submissions currently in the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="glass-panel overflow-hidden transition-all hover:border-primary/20">
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl",
                        task.status === 'Completed' ? "bg-green-500/10" : "bg-primary/10"
                      )}>
                        {task.status === 'Completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-primary animate-pulse" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{task.title.split(':')[0]}</span>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-tighter h-5 border-white/10">
                            {task.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 italic">
                            <Building2 className="w-3 h-3" />
                            {task.description.split('.')[0].replace('Site: ', '').replace('Reported by: ', '')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(task.createdAt), "HH:mm")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <Badge className={cn(
                        "rounded-lg px-3 py-1 text-xs font-bold",
                        task.status === 'Completed' ? "bg-green-500/20 text-green-400 border-green-500/20" : "bg-primary/20 text-primary border-primary/20"
                      )}>
                        {task.status}
                      </Badge>
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
