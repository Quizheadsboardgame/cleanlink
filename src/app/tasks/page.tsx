
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, setDoc } from "firebase/firestore"
import { updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { format } from "date-fns"
import { CheckCircle2, Clock, Package, Building2, Lock, ArrowRight, Loader2, PlayCircle, XCircle, MessageSquare, CalendarDays, MapPin, Plus, Trash2, Users, UserPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

function ResponseList({ postId }: { postId: string }) {
  const db = useFirestore()
  const responsesQuery = useMemoFirebase(() => {
    if (!db) return null
    return collection(db, 'coverWorkPosts', postId, 'responses')
  }, [db, postId])

  const { data: responses, isLoading } = useCollection(responsesQuery)

  if (isLoading) return <Loader2 className="w-4 h-4 animate-spin mx-auto my-2" />
  if (!responses || responses.length === 0) return <p className="text-[10px] text-muted-foreground italic text-center p-2">No responses yet.</p>

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-3 h-3 text-sky-400" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Responses ({responses.length})</span>
      </div>
      <div className="grid gap-2">
        {responses.map((res) => (
          <div key={res.id} className="bg-white/5 p-3 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-white">{res.cleanerName}</span>
              <span className="text-[10px] text-muted-foreground">{format(new Date(res.createdAt), "MMM d, HH:mm")}</span>
            </div>
            {res.notes && <p className="text-xs text-muted-foreground italic leading-relaxed">"{res.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TasksPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [managerNotes, setManagerNotes] = useState<Record<string, string>>({})

  // Cover Work Creation State
  const [isCreatingCover, setIsCreatingCover] = useState(false)
  const [newCover, setNewCover] = useState({ title: "", location: "", description: "", deadline: "" })

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
        toast({ title: "Access Granted", description: "Welcome back." })
      } else {
        toast({ variant: "destructive", title: "Invalid Password", description: "Try again." })
      }
      setIsChecking(false)
    }, 600)
  }

  // Data queries
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !isAuthorized || !user) return null
    return query(collection(db, 'orderTasks'))
  }, [db, isAuthorized, user])

  const coverPostsQuery = useMemoFirebase(() => {
    if (!db || !isAuthorized || !user) return null
    return query(collection(db, 'coverWorkPosts'))
  }, [db, isAuthorized, user])

  const { data: tasks, isLoading: isTasksLoading } = useCollection(tasksQuery)
  const { data: coverPosts, isLoading: isCoverLoading } = useCollection(coverPostsQuery)

  const handleUpdateStatus = (taskId: string, status: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    const updateData: any = { status }
    if (status === 'Completed') updateData.completedAt = new Date().toISOString()
    if (managerNotes[taskId]) updateData.managerNote = managerNotes[taskId]
    updateDocumentNonBlocking(taskRef, updateData)
    toast({ title: "Task Updated", description: `Status changed to ${status}` })
  }

  const handleCreateCover = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCover.title || !newCover.deadline) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Title and Deadline are required." })
      return
    }

    const postId = Math.random().toString(36).substr(2, 9)
    const postRef = doc(db, 'coverWorkPosts', postId)
    
    setDoc(postRef, {
      id: postId,
      ...newCover,
      deadline: new Date(newCover.deadline).toISOString(),
      createdAt: new Date().toISOString()
    })

    toast({ title: "Cover Posted", description: "Successfully added to the board." })
    setIsCreatingCover(false)
    setNewCover({ title: "", location: "", description: "", deadline: "" })
  }

  const handleDeleteCover = (postId: string) => {
    const postRef = doc(db, 'coverWorkPosts', postId)
    deleteDocumentNonBlocking(postRef)
    toast({ title: "Post Removed", description: "The cover work post has been deleted." })
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
              <CardDescription>Enter the management password to access.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                  type="password" 
                  placeholder="Enter Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-white/5 text-center text-lg tracking-widest text-white"
                  autoFocus
                />
                <Button type="submit" disabled={isChecking} className="w-full tasks-gradient text-white h-12 rounded-xl">
                  {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Unlock Dashboard"}
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
        <Tabs defaultValue="tasks" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-bold font-headline tasks-text-gradient">Management Portal</h1>
            <TabsList className="bg-secondary/50 border border-white/5 p-1">
              <TabsTrigger value="tasks" className="data-[state=active]:bg-primary/20">Task Board</TabsTrigger>
              <TabsTrigger value="cover" className="data-[state=active]:bg-sky-500/20">Cover Work</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tasks" className="space-y-4">
            {(isTasksLoading) ? (
              <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : !tasks || tasks.length === 0 ? (
              <Card className="glass-panel border-dashed py-20 text-center"><CardContent>No active tasks found.</CardContent></Card>
            ) : (
              <div className="grid gap-4">
                {tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((task) => (
                  <Card key={task.id} className="glass-panel overflow-hidden">
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-headline flex items-center gap-2">
                            {task.type === 'Staff Referral' && <UserPlus className="w-4 h-4 text-[#FACC15]" />}
                            {task.title}
                          </CardTitle>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(task.createdAt), "PPp")}</span>
                            <Badge variant="outline" className="border-white/10 uppercase tracking-tighter">{task.type}</Badge>
                            <Badge className={cn("text-[10px] h-5", task.status === 'Completed' ? "bg-green-500/20 text-green-400" : task.status === 'In Progress' ? "bg-amber-500/20 text-amber-400" : "bg-primary/20 text-primary")}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5">{task.description}</p>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Public Note</Label>
                        <Input placeholder="Status update for staff board..." value={managerNotes[task.id] ?? task.managerNote ?? ""} onChange={(e) => setManagerNotes({...managerNotes, [task.id]: e.target.value})} className="bg-secondary/30 border-white/5 h-9 text-sm" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        {task.status !== 'Completed' && (
                          <>
                            <Button onClick={() => handleUpdateStatus(task.id, 'In Progress')} variant="outline" className="flex-1 h-9 border-amber-500/20 text-amber-400 hover:bg-amber-500/10"><PlayCircle className="w-4 h-4 mr-2" /> Progress</Button>
                            <Button onClick={() => handleUpdateStatus(task.id, 'Completed')} className="flex-1 h-9 bg-green-500/10 text-green-500 hover:bg-green-600 hover:text-white border border-green-500/20"><CheckCircle2 className="w-4 h-4 mr-2" /> Finish</Button>
                            <Button onClick={() => handleUpdateStatus(task.id, 'Rejected')} variant="outline" className="flex-1 h-9 border-red-500/20 text-red-400 hover:bg-red-500/10"><XCircle className="w-4 h-4 mr-2" /> Reject</Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cover" className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">Manage upcoming cover work opportunities.</p>
              <Dialog open={isCreatingCover} onOpenChange={setIsCreatingCover}>
                <DialogTrigger asChild>
                  <Button className="cover-gradient text-white gap-2 rounded-xl"><Plus className="w-4 h-4" /> Create Post</Button>
                </DialogTrigger>
                <DialogContent className="glass-panel border-none text-foreground">
                  <DialogHeader><DialogTitle className="font-headline text-2xl">New Cover Opportunity</DialogTitle></DialogHeader>
                  <form onSubmit={handleCreateCover} className="space-y-4 pt-4">
                    <div className="space-y-2"><Label>Title / Role</Label><Input placeholder="e.g. Office Suite Cover - Evenings" value={newCover.title} onChange={(e) => setNewCover({...newCover, title: e.target.value})} className="bg-secondary/50 border-white/5" /></div>
                    <div className="space-y-2"><Label>Location (Optional)</Label><Input placeholder="e.g. Addenbrooke's Site C" value={newCover.location} onChange={(e) => setNewCover({...newCover, location: e.target.value})} className="bg-secondary/50 border-white/5" /></div>
                    <div className="space-y-2"><Label>Response Deadline</Label><Input type="datetime-local" value={newCover.deadline} onChange={(e) => setNewCover({...newCover, deadline: e.target.value})} className="bg-secondary/50 border-white/5" /></div>
                    <div className="space-y-2"><Label>Description & Details</Label><Textarea placeholder="Dates, times, and specific duties..." value={newCover.description} onChange={(e) => setNewCover({...newCover, description: e.target.value})} className="bg-secondary/50 border-white/5" /></div>
                    <DialogFooter><Button type="submit" className="w-full cover-gradient text-white">Post to Board</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {(isCoverLoading) ? (
              <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div>
            ) : !coverPosts || coverPosts.length === 0 ? (
              <Card className="glass-panel border-dashed py-20 text-center"><CardContent>No cover posts yet.</CardContent></Card>
            ) : (
              <div className="grid gap-6">
                {coverPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((post) => (
                  <Card key={post.id} className="glass-panel overflow-hidden border-sky-500/10">
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-xl font-headline flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-sky-400" />
                            {post.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                            {post.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-400" /> {post.location}</span>}
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Ends {format(new Date(post.deadline), "PPp")}</span>
                            {new Date(post.deadline) < new Date() && <Badge variant="destructive" className="h-4 text-[8px]">EXPIRED (Hidden from staff)</Badge>}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCover(post.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4">{post.description}</p>
                      <div className="h-px bg-white/5 w-full" />
                      <ResponseList postId={post.id} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
