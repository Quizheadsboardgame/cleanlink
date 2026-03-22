"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy, where, limit } from "firebase/firestore"
import { updateDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { format } from "date-fns"
import { CheckCircle2, Clock, Loader2, PlayCircle, XCircle, MessageSquare, CalendarDays, MapPin, Plus, Trash2, Users, UserPlus, BarChart3, PieChart, ShieldAlert, Bell, BellRing, Megaphone, Send, Link2, Copy, Check, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts'
import { useRouter } from "next/navigation"

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

function AnalyticsTab({ tasks }: { tasks: any[] }) {
  const dataByType = React.useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach(t => {
      counts[t.type] = (counts[t.type] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [tasks])

  const dataBySite = React.useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.forEach(t => {
      const siteMatch = t.description?.match(/Site:\s*([^.]+)/) || t.description?.match(/at\s*([^.]+)/)
      const siteName = siteMatch ? siteMatch[1].trim() : 'Unknown'
      counts[siteName] = (counts[siteName] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  }, [tasks])

  const COLORS = ['#6E76F5', '#F59E0B', '#EF4444', '#D946EF', '#FACC15', '#0EA5E9']

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <PieChart className="w-4 h-4 text-primary" /> Request Types
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={dataByType}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dataByType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </RePieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {dataByType.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-[10px]">
                <div className="w-2 h-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                <span className="text-muted-foreground truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Top 5 Active Sites
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBySite}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                contentStyle={{ background: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '8px' }}
              />
              <Bar dataKey="value" fill="#6E76F5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function BroadcastTab({ managerId }: { managerId: string }) {
  const db = useFirestore()
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const alertQuery = useMemoFirebase(() => {
    if (!db || !managerId) return null
    return query(collection(db, 'systemAlerts'), where('managerId', '==', managerId), limit(1))
  }, [db, managerId])

  const { data: currentAlert } = useCollection(alertQuery)

  useEffect(() => {
    if (currentAlert && currentAlert.length > 0) {
      setMessage(currentAlert[0].message)
      setIsActive(currentAlert[0].active)
    }
  }, [currentAlert])

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const alertId = `alert-${managerId}`
    const alertRef = doc(db, 'systemAlerts', alertId)

    setDocumentNonBlocking(alertRef, {
      id: alertId,
      managerId,
      message,
      active: isActive,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    toast({ title: "Broadcast Updated", description: "Your staff will see the new banner message." })
    setIsSubmitting(false)
  }

  return (
    <Card className="glass-panel border-white/5">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" /> Live Broadcast
        </CardTitle>
        <CardDescription>This message scrolls at the top of your staff's screens.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2">
            <Label>Banner Message</Label>
            <Input 
              placeholder="e.g. Urgent: All sites please check your storage keys." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-secondary/50 border-white/5"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="space-y-0.5">
              <Label className="text-base">Broadcast Active</Label>
              <p className="text-xs text-muted-foreground">Toggle visibility for your users.</p>
            </div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full tasks-gradient text-white h-12 rounded-xl shadow-lg">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Update System Banner
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ProfileTab({ managerId }: { managerId: string }) {
  const [copied, setCopied] = useState(false)
  const staffUrl = typeof window !== 'undefined' ? `${window.location.origin}/?m=${managerId}` : ""

  const copyLink = () => {
    navigator.clipboard.writeText(staffUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid gap-6">
      <Card className="glass-panel border-white/5">
        <CardHeader>
          <CardTitle className="text-xl font-headline flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" /> Your Exclusive Staff Link
          </CardTitle>
          <CardDescription>Share this link with your staff. When they use it, their tasks will link directly to your dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input readOnly value={staffUrl} className="bg-secondary/50 border-white/5 font-mono text-xs" />
            <Button onClick={copyLink} variant="outline" className="shrink-0 border-white/10">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Tip:</strong> Send this link to your staff via text or messaging app. Once they open it, their browser will be automatically linked to your management profile via your unique key.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function TasksPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [managerId, setManagerId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [managerNotes, setManagerNotes] = useState<Record<string, string>>({})
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const lastTaskCountRef = useRef<number>(0)

  const [isCreatingCover, setIsCreatingCover] = useState(false)
  const [newCover, setNewCover] = useState({ title: "", location: "", description: "", deadline: "" })

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  useEffect(() => {
    const savedId = sessionStorage.getItem("manager_auth_token")
    const savedName = sessionStorage.getItem("manager_display_name")
    if (savedId) {
      setManagerId(savedId)
      setDisplayName(savedName || "Manager")
    } else if (!isUserLoading) {
      router.push('/manager-login')
    }
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [router, isUserLoading])

  const requestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    Notification.requestPermission().then(permission => {
      setNotificationsEnabled(permission === 'granted')
      if (permission === 'granted') {
        toast({ title: "Alerts Enabled", description: "You will receive desktop notifications for new tasks." })
      }
    })
  }

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !managerId || !user) return null
    return query(collection(db, 'orderTasks'), where('managerId', '==', managerId), orderBy('createdAt', 'desc'))
  }, [db, managerId, user])

  const coverPostsQuery = useMemoFirebase(() => {
    if (!db || !managerId || !user) return null
    return query(collection(db, 'coverWorkPosts'), where('managerId', '==', managerId))
  }, [db, managerId, user])

  const { data: tasks, isLoading: isTasksLoading } = useCollection(tasksQuery)
  const { data: coverPosts, isLoading: isCoverLoading } = useCollection(coverPostsQuery)

  useEffect(() => {
    if (tasks && tasks.length > lastTaskCountRef.current) {
      if (lastTaskCountRef.current > 0 && notificationsEnabled && typeof window !== 'undefined') {
        const newestTask = tasks[0]
        new Notification("New Request: " + newestTask.type, {
          body: newestTask.title,
        })
      }
      lastTaskCountRef.current = tasks.length
    }
  }, [tasks, notificationsEnabled])

  const handleUpdateStatus = (taskId: string, status: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    const updateData: any = { status }
    if (status === 'Completed') updateData.completedAt = new Date().toISOString()
    if (managerNotes[taskId]) updateData.managerNote = managerNotes[taskId]
    updateDocumentNonBlocking(taskRef, updateData)
    toast({ title: "Task Updated", description: `Status changed to ${status}` })
  }

  const handleDeleteTask = (taskId: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    deleteDocumentNonBlocking(taskRef)
    toast({ title: "Task Deleted", description: "The task has been removed from the system." })
  }

  const handleCreateCover = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCover.title || !newCover.deadline) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Title and Deadline are required." })
      return
    }

    const postId = Math.random().toString(36).substr(2, 9)
    const postRef = doc(db, 'coverWorkPosts', postId)
    
    setDocumentNonBlocking(postRef, {
      id: postId,
      managerId: managerId,
      ...newCover,
      deadline: new Date(newCover.deadline).toISOString(),
      createdAt: new Date().toISOString()
    }, { merge: true })

    toast({ title: "Cover Posted", description: "Successfully added to your board." })
    setIsCreatingCover(false)
    setNewCover({ title: "", location: "", description: "", deadline: "" })
  }

  const handleLogout = () => {
    sessionStorage.removeItem("manager_auth_token")
    sessionStorage.removeItem("manager_display_name")
    router.push('/')
  }

  if (!managerId) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="mt-4 text-muted-foreground">Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-headline tasks-text-gradient tracking-tighter">Welcome, {displayName}</h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Access Key: {managerId}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              onClick={requestNotificationPermission}
              className={cn(
                "rounded-xl border-white/10 h-10 gap-2 font-bold uppercase text-[10px] tracking-widest",
                notificationsEnabled ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-muted-foreground"
              )}
            >
              {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              {notificationsEnabled ? "Alerts: ON" : "Enable Alerts"}
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl h-10 text-muted-foreground hover:text-white">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-white/5 p-1 w-full justify-start h-12 rounded-2xl overflow-x-auto no-scrollbar">
            <TabsTrigger value="tasks" className="rounded-xl flex-1 px-6">Tasks</TabsTrigger>
            <TabsTrigger value="broadcast" className="rounded-xl flex-1 px-6">Broadcast</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl flex-1 px-6">Analytics</TabsTrigger>
            <TabsTrigger value="cover" className="rounded-xl flex-1 px-6">Cover Work</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl flex-1 px-6">Profile & Link</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab managerId={managerId} />
          </TabsContent>

          <TabsContent value="broadcast">
            <BroadcastTab managerId={managerId} />
          </TabsContent>

          <TabsContent value="analytics">
            {tasks && tasks.length > 0 ? <AnalyticsTab tasks={tasks} /> : <p className="text-center text-muted-foreground py-20">Not enough data for analytics.</p>}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            {(isTasksLoading || isUserLoading) ? (
              <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : !tasks || tasks.length === 0 ? (
              <Card className="glass-panel border-dashed py-20 text-center"><CardContent>No active tasks for your key.</CardContent></Card>
            ) : (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <Card key={task.id} className={cn("glass-panel overflow-hidden", task.type === 'Staff Concern' && "border-red-500/20 bg-red-500/5")}>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className={cn("text-lg font-headline flex items-center gap-2", task.type === 'Staff Concern' && "text-red-400")}>
                            {task.type === 'Staff Referral' && <UserPlus className="w-4 h-4 text-[#FACC15]" />}
                            {task.type === 'Staff Concern' && <ShieldAlert className="w-4 h-4" />}
                            {task.title}
                          </CardTitle>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.createdAt ? format(new Date(task.createdAt), "PPp") : 'Just now'}</span>
                            <Badge variant="outline" className="border-white/10 uppercase tracking-tighter">{task.type}</Badge>
                            <Badge className={cn("text-[10px] h-5", task.status === 'Completed' ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary")}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-muted-foreground hover:text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed">{task.description}</p>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Manager Feedback</Label>
                        <Input placeholder="Update staff board..." value={managerNotes[task.id] ?? task.managerNote ?? ""} onChange={(e) => setManagerNotes({...managerNotes, [task.id]: e.target.value})} className="bg-secondary/30 border-white/5 h-9 text-sm" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        {task.status !== 'Completed' && task.status !== 'Rejected' && (
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
              <p className="text-sm text-muted-foreground">Manage your cover work opportunities.</p>
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
                    <DialogFooter><Button type="submit" className="w-full cover-gradient text-white">Post to Your Board</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {(isCoverLoading || isUserLoading) ? (
              <div className="flex flex-col items-center justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div>
            ) : !coverPosts || coverPosts.length === 0 ? (
              <Card className="glass-panel border-dashed py-20 text-center"><CardContent>No cover posts for your key.</CardContent></Card>
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
                          </div>
                        </div>
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
