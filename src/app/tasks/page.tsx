"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy, where, limit } from "firebase/firestore"
import { updateDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { format } from "date-fns"
import { CheckCircle2, Clock, Loader2, PlayCircle, XCircle, MessageSquare, CalendarDays, MapPin, Plus, Trash2, Users, UserPlus, BarChart3, PieChart, ShieldAlert, Bell, BellRing, Megaphone, Send, Link2, Copy, Check, LogOut, LayoutDashboard } from "lucide-react"
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
              <span className="text-[10px] text-muted-foreground">{res.createdAt ? format(new Date(res.createdAt), "MMM d, HH:mm") : '...'}</span>
            </div>
            {res.notes && <p className="text-xs text-muted-foreground italic leading-relaxed">"{res.notes}"</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsTab({ tasks }: { tasks: any[] }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

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

  const COLORS = ['#6E76F5', '#F59E0B', '#EF4444', '#D946EF', '#FACC15', '#0EA5E9', '#0284C7']

  if (!mounted) return <div className="h-[300px] flex items-center justify-center text-muted-foreground italic">Initializing visualizer...</div>

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="glass-panel border-white/5">
        <CardHeader><CardTitle className="text-lg font-headline flex items-center gap-2"><PieChart className="w-4 h-4 text-primary" /> Request Types</CardTitle></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie data={dataByType} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {dataByType.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
            </RePieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="glass-panel border-white/5">
        <CardHeader><CardTitle className="text-lg font-headline flex items-center gap-2"><BarChart3 className="w-4 h-4 text-primary" /> Top 5 Active Sites</CardTitle></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBySite}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ background: '#0a0a0c', border: '1px solid #ffffff10', borderRadius: '8px' }} />
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
    setDocumentNonBlocking(alertRef, { id: alertId, managerId, message, active: isActive, updatedAt: new Date().toISOString() }, { merge: true })
    toast({ title: "Broadcast Updated", description: "Your staff will see the new banner message." })
    setIsSubmitting(false)
  }

  return (
    <Card className="glass-panel border-white/5">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2"><Megaphone className="w-5 h-5 text-primary" /> Live Broadcast</CardTitle>
        <CardDescription>This message scrolls at the top of your staff's screens.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="space-y-2"><Label>Banner Message</Label><Input placeholder="e.g. Urgent: All sites please check storage keys." value={message} onChange={(e) => setMessage(e.target.value)} className="bg-secondary/50 border-white/5" /></div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
            <div className="space-y-0.5"><Label className="text-base">Broadcast Active</Label><p className="text-xs text-muted-foreground">Toggle visibility for your users.</p></div>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full tasks-gradient text-white h-12 rounded-xl shadow-lg font-bold">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />} Update System Banner
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ProfileTab({ displayName }: { displayName: string }) {
  const [copied, setCopied] = useState(false)
  const [staffUrl, setStaffUrl] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStaffUrl(`${window.location.origin}/?m=${encodeURIComponent(displayName)}`)
    }
  }, [displayName])

  const copyLink = () => {
    navigator.clipboard.writeText(staffUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="glass-panel border-white/5">
      <CardHeader>
        <CardTitle className="text-xl font-headline flex items-center gap-2"><Link2 className="w-5 h-5 text-primary" /> Your Exclusive Staff Link</CardTitle>
        <CardDescription>Share this link with your staff. It masks your key for security.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input readOnly value={staffUrl} className="bg-secondary/50 border-white/5 font-mono text-xs" />
          <Button onClick={copyLink} variant="outline" className="shrink-0 border-white/10">{copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}</Button>
        </div>
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Security Protocol:</strong> This link identifies your site by name instead of exposing your key.
          </p>
        </div>
      </CardContent>
    </Card>
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
  const [isReady, setIsReady] = useState(false)
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
      setIsReady(true)
    } else if (!isUserLoading) {
      const timer = setTimeout(() => {
        const retryId = sessionStorage.getItem("manager_auth_token")
        if (!retryId) router.push('/manager-login')
      }, 800)
      return () => clearTimeout(timer)
    }
    
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted')
    }
  }, [router, isUserLoading])

  const requestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return
    Notification.requestPermission().then(permission => {
      setNotificationsEnabled(permission === 'granted')
      if (permission === 'granted') toast({ title: "Alerts Enabled", description: "Notifications active." })
    })
  }

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !managerId || !user || !isReady) return null
    return query(collection(db, 'orderTasks'), where('managerId', '==', managerId))
  }, [db, managerId, user, isReady])

  const coverPostsQuery = useMemoFirebase(() => {
    if (!db || !managerId || !user || !isReady) return null
    return query(collection(db, 'coverWorkPosts'), where('managerId', '==', managerId))
  }, [db, managerId, user, isReady])

  const { data: allTasks, isLoading: isTasksLoading } = useCollection(tasksQuery)
  const { data: coverPosts, isLoading: isCoverLoading } = useCollection(coverPostsQuery)

  const sortedTasks = React.useMemo(() => {
    if (!allTasks) return []
    return [...allTasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [allTasks])

  useEffect(() => {
    if (sortedTasks && sortedTasks.length > lastTaskCountRef.current) {
      if (lastTaskCountRef.current > 0 && notificationsEnabled && typeof window !== 'undefined') {
        new Notification("New Request: " + sortedTasks[0].type, { body: sortedTasks[0].title })
      }
      lastTaskCountRef.current = sortedTasks.length
    }
  }, [sortedTasks, notificationsEnabled])

  const handleUpdateStatus = (taskId: string, status: string) => {
    const taskRef = doc(db, 'orderTasks', taskId)
    const updateData: any = { status }
    if (status === 'Completed') updateData.completedAt = new Date().toISOString()
    if (managerNotes[taskId]) updateData.managerNote = managerNotes[taskId]
    updateDocumentNonBlocking(taskRef, updateData)
    toast({ title: "Task Updated", description: `Status: ${status}` })
  }

  const handleDeleteTask = (taskId: string) => {
    deleteDocumentNonBlocking(doc(db, 'orderTasks', taskId))
    toast({ title: "Task Deleted" })
  }

  const handleCreateCover = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCover.title || !newCover.deadline) return
    const postId = Math.random().toString(36).substr(2, 9)
    const postRef = doc(db, 'coverWorkPosts', postId)
    setDocumentNonBlocking(postRef, { id: postId, managerId, ...newCover, deadline: new Date(newCover.deadline).toISOString(), createdAt: new Date().toISOString() }, { merge: true })
    toast({ title: "Cover Posted" })
    setIsCreatingCover(false)
    setNewCover({ title: "", location: "", description: "", deadline: "" })
  }

  const handleLogout = () => {
    sessionStorage.removeItem("manager_auth_token")
    sessionStorage.removeItem("manager_display_name")
    router.push('/')
  }

  if (!isReady) {
    return (
      <div className="min-h-screen flex flex-col bg-background items-center justify-center">
        <Loader2 className="animate-spin w-10 h-10 text-primary" />
        <p className="mt-4 text-muted-foreground font-headline uppercase tracking-widest text-xs">Authenticating Profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-end gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary"><LayoutDashboard className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-[0.3em]">Management Protocol</span></div>
            <h1 className="text-4xl md:text-5xl font-bold font-headline tasks-text-gradient tracking-tighter">Control Hub</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span className="uppercase tracking-widest font-bold">Manager: {displayName}</span>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={requestNotificationPermission} className={cn("rounded-xl border-white/10 h-10 gap-2 font-bold uppercase text-[10px] tracking-widest", notificationsEnabled ? "bg-green-500/10 text-green-400" : "bg-white/5")}>
              {notificationsEnabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />} {notificationsEnabled ? "Alerts: ON" : "Enable Alerts"}
            </Button>
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl h-10 text-muted-foreground hover:text-white"><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="bg-secondary/50 border border-white/5 p-1 w-full justify-start h-12 rounded-2xl overflow-x-auto no-scrollbar">
            <TabsTrigger value="tasks" className="rounded-xl flex-1 px-6">Live Tasks</TabsTrigger>
            <TabsTrigger value="broadcast" className="rounded-xl flex-1 px-6">Broadcast</TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl flex-1 px-6">Analytics</TabsTrigger>
            <TabsTrigger value="cover" className="rounded-xl flex-1 px-6">Cover Work</TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl flex-1 px-6">Connectivity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile"><ProfileTab displayName={displayName} /></TabsContent>
          <TabsContent value="broadcast"><BroadcastTab managerId={managerId!} /></TabsContent>
          <TabsContent value="analytics">{sortedTasks.length > 0 ? <AnalyticsTab tasks={sortedTasks} /> : <p className="text-center py-20 italic">Gathering data...</p>}</TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            {(isTasksLoading || isUserLoading) ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            ) : sortedTasks.length === 0 ? (
              <Card className="glass-panel border-dashed py-20 text-center"><CardContent className="text-muted-foreground">No active tasks reported.</CardContent></Card>
            ) : (
              <div className="grid gap-4">
                {sortedTasks.map((task) => (
                  <Card key={task.id} className={cn("glass-panel overflow-hidden transition-all", task.type === 'Staff Concern' && "border-red-500/20 bg-red-500/5")}>
                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className={cn("text-lg font-headline flex items-center gap-2", task.type === 'Staff Concern' && "text-red-400")}>
                            {task.type === 'Staff Referral' && <UserPlus className="w-4 h-4 text-[#FACC15]" />}
                            {task.type === 'Staff Concern' && <ShieldAlert className="w-4 h-4" />}
                            {task.type === 'Cover Interest' && <CalendarDays className="w-4 h-4 text-sky-400" />}
                            {task.type === 'Stock Order' && <Plus className="w-4 h-4 text-[#6E76F5]" />}
                            {task.title}
                          </CardTitle>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {task.createdAt ? format(new Date(task.createdAt), "PPp") : 'Just now'}</span>
                            <Badge variant="outline" className="border-white/10 uppercase tracking-tighter">{task.type}</Badge>
                            <Badge className={cn("text-[10px] h-5", task.status === 'Completed' ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary")}>{task.status}</Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <p className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5 leading-relaxed">{task.description}</p>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Feedback</Label>
                        <Input placeholder="Update staff board..." value={managerNotes[task.id] ?? task.managerNote ?? ""} onChange={(e) => setManagerNotes({...managerNotes, [task.id]: e.target.value})} className="bg-secondary/30 border-white/5 h-9 text-sm" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        {task.status !== 'Completed' && task.status !== 'Rejected' && (
                          <>
                            <Button onClick={() => handleUpdateStatus(task.id, 'In Progress')} variant="outline" className="flex-1 h-9 border-amber-500/20 text-amber-400 font-bold text-[10px] uppercase tracking-wider">Progress</Button>
                            <Button onClick={() => handleUpdateStatus(task.id, 'Completed')} className="flex-1 h-9 bg-green-500/10 text-green-500 border border-green-500/20 font-bold text-[10px] uppercase tracking-wider">Finish</Button>
                            <Button onClick={() => handleUpdateStatus(task.id, 'Rejected')} variant="outline" className="flex-1 h-9 border-red-500/20 text-red-400 font-bold text-[10px] uppercase tracking-wider">Reject</Button>
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
            <div className="flex justify-between items-center"><p className="text-sm text-muted-foreground">Manage cover work posts.</p><Dialog open={isCreatingCover} onOpenChange={setIsCreatingCover}><DialogTrigger asChild><Button className="cover-gradient text-white gap-2 rounded-xl h-10 px-6 font-bold shadow-lg"><Plus className="w-4 h-4" /> Create Post</Button></DialogTrigger><DialogContent className="glass-panel border-none text-foreground"><DialogHeader><DialogTitle className="font-headline text-2xl">New Cover Opportunity</DialogTitle></DialogHeader><form onSubmit={handleCreateCover} className="space-y-4 pt-4"><div className="space-y-2"><Label>Title</Label><Input placeholder="e.g. Office Cover" value={newCover.title} onChange={(e) => setNewCover({...newCover, title: e.target.value})} className="bg-secondary/50 border-white/5" /></div><div className="space-y-2"><Label>Deadline</Label><Input type="datetime-local" value={newCover.deadline} onChange={(e) => setNewCover({...newCover, deadline: e.target.value})} className="bg-secondary/50 border-white/5" /></div><div className="space-y-2"><Label>Details</Label><Textarea placeholder="Dates, times..." value={newCover.description} onChange={(e) => setNewCover({...newCover, description: e.target.value})} className="bg-secondary/50 border-white/5 min-h-[100px]" /></div><DialogFooter><Button type="submit" className="w-full cover-gradient text-white h-12 rounded-xl font-bold">Post Board</Button></DialogFooter></form></DialogContent></Dialog></div>
            {isCoverLoading ? <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-sky-400" /></div> : !coverPosts || coverPosts.length === 0 ? <Card className="glass-panel border-dashed py-20 text-center"><CardContent className="text-muted-foreground">No active cover posts.</CardContent></Card> : <div className="grid gap-6">{coverPosts.map((post) => (<Card key={post.id} className="glass-panel overflow-hidden border-sky-500/10"><CardHeader className="p-6 pb-2"><div className="flex justify-between items-start"><div className="space-y-1"><CardTitle className="text-xl font-headline flex items-center gap-2"><CalendarDays className="w-5 h-5 text-sky-400" /> {post.title}</CardTitle><div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Ends {post.deadline ? format(new Date(post.deadline), "PPp") : '...'}</span></div></div></div></CardHeader><CardContent className="p-6 pt-2"><p className="text-sm text-muted-foreground whitespace-pre-wrap mb-4 leading-relaxed">{post.description}</p><div className="h-px bg-white/5 w-full" /><ResponseList postId={post.id} /></CardContent></Card>))}</div>}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
