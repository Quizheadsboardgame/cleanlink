"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, doc } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { format } from "date-fns"
import { CheckCircle2, Clock, Package, Building2, Lock, ArrowRight, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export default function TasksPage() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("portalflow_auth")
    if (auth === "true") {
      setIsAuthorized(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsChecking(true)
    
    setTimeout(() => {
      if (password === "Harley") {
        setIsAuthorized(true)
        sessionStorage.setItem("portalflow_auth", "true")
        toast({
          title: "Access Granted",
          description: "Welcome back to the management portal.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Password",
          description: "Please check your credentials and try again.",
        })
      }
      setIsChecking(false)
    }, 600)
  }

  // Changed to query ALL tasks in the collection for management overview
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !isAuthorized) return null
    return query(collection(db, 'orderTasks'))
  }, [db, isAuthorized])

  const { data: tasks, isLoading } = useCollection(tasksQuery)

  const handleComplete = (taskId: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    updateDocumentNonBlocking(taskRef, {
      status: 'Completed',
      completedAt: new Date().toISOString()
    })
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="glass-panel w-full max-w-md border-none shadow-2xl">
            <CardHeader className="text-center space-y-1">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <Lock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline tasks-text-gradient">Protected Area</CardTitle>
              <CardDescription>Enter the management password to review all submitted orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Input 
                    type="password" 
                    placeholder="Enter Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 border-white/5 text-center text-lg tracking-widest text-white"
                    autoFocus
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isChecking}
                  className="w-full tasks-gradient text-white gap-2 h-12 rounded-xl shadow-lg"
                >
                  {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                  Unlock Dashboard
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold font-headline tasks-text-gradient">Global Review Tasks</h1>
            <p className="text-muted-foreground">Manage and track all stock orders submitted across the organization.</p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground animate-pulse">Loading all tasks...</p>
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
                    There are no submissions currently pending review in the database.
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
                          <span className="truncate">Type: {task.type}</span>
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