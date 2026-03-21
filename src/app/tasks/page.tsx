
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc } from "firebase/firestore"
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { format } from "date-fns"
import { CheckCircle2, Clock, Package, Building2, Lock, ArrowRight, Loader2, PlayCircle, XCircle, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [managerNotes, setManagerNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("portalflow_auth")
    if (savedAuth === "true") {
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

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !isAuthorized || !user) return null
    return query(collection(db, 'orderTasks'))
  }, [db, isAuthorized, user])

  const { data: tasks, isLoading } = useCollection(tasksQuery)

  const handleUpdateStatus = (taskId: string, status: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    const updateData: any = { status }
    
    if (status === 'Completed') {
      updateData.completedAt = new Date().toISOString()
    }
    
    if (managerNotes[taskId]) {
      updateData.managerNote = managerNotes[taskId]
    }

    updateDocumentNonBlocking(taskRef, updateData)
    
    toast({
      title: "Task Updated",
      description: `Status changed to ${status}`,
    })
  }

  const handleNoteChange = (taskId: string, note: string) => {
    setManagerNotes(prev => ({ ...prev, [taskId]: note }))
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
        <Footer />
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

          {(isLoading || isUserLoading) ? (
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
                  <div className="flex flex-col">
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
                            <Badge className={cn(
                              "text-[10px] h-5",
                              task.status === 'Completed' ? "bg-green-500/20 text-green-400" : 
                              task.status === 'In Progress' ? "bg-amber-500/20 text-amber-400" :
                              task.status === 'Rejected' ? "bg-red-500/20 text-red-400" : "bg-primary/20 text-primary"
                            )}>
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

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> Public Manager Note (Visible on Status Board)
                        </Label>
                        <Input 
                          placeholder="e.g. Processing order, will be ready by 4 PM"
                          value={managerNotes[task.id] ?? task.managerNote ?? ""}
                          onChange={(e) => handleNoteChange(task.id, e.target.value)}
                          className="bg-secondary/30 border-white/5 text-white text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.02] border-t border-white/5 p-4 flex flex-wrap items-center justify-center gap-3">
                      {task.status !== 'Completed' && task.status !== 'Rejected' && (
                        <>
                          <Button 
                            onClick={() => handleUpdateStatus(task.id, 'In Progress')}
                            variant="outline"
                            className="flex-1 min-w-[140px] gap-2 border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                          >
                            <PlayCircle className="w-4 h-4" />
                            In Progress
                          </Button>
                          <Button 
                            onClick={() => handleUpdateStatus(task.id, 'Completed')}
                            className="flex-1 min-w-[140px] gap-2 bg-green-500/10 hover:bg-green-600 text-green-500 hover:text-white border border-green-500/20 transition-all"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            Complete
                          </Button>
                          <Button 
                            onClick={() => handleUpdateStatus(task.id, 'Rejected')}
                            variant="outline"
                            className="flex-1 min-w-[140px] gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                      {(task.status === 'Completed' || task.status === 'Rejected') && (
                        <div className={cn(
                          "flex items-center gap-2 font-medium",
                          task.status === 'Completed' ? "text-green-500" : "text-red-500"
                        )}>
                          {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                          {task.status}
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

      <Footer />
    </div>
  )
}
