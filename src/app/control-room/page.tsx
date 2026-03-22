"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy, getDocs, writeBatch } from "firebase/firestore"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Key, Trash2, Edit2, ShieldCheck, LogOut, Plus, AlertTriangle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ControlRoomPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  
  const [mounted, setMounted] = useState(false)
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const [isAdding, setIsAdding] = useState(false)
  const [editingKey, setEditingKey] = useState<any>(null)
  const [formData, setFormData] = useState({ key: "", displayName: "" })

  useEffect(() => {
    setMounted(true)
    const saved = sessionStorage.getItem("control_room_auth")
    if (saved === "true") setIsAuthorized(true)
  }, [])

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth, mounted])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsChecking(true)
    setTimeout(() => {
      if (password === "Harley") {
        setIsAuthorized(true)
        sessionStorage.setItem("control_room_auth", "true")
        toast({ title: "Authorized", description: "Welcome to the Control Room." })
      } else {
        toast({ variant: "destructive", title: "Denied", description: "Incorrect access code." })
      }
      setIsChecking(false)
    }, 600)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("control_room_auth")
    setIsAuthorized(false)
    setPassword("")
    toast({ title: "Logged Out", description: "You have left the Control Room." })
  }

  const keysQuery = useMemoFirebase(() => {
    if (!db || !isAuthorized || !user || !mounted) return null
    return query(collection(db, 'managerKeys'), orderBy('createdAt', 'desc'))
  }, [db, isAuthorized, user, mounted])

  const { data: keys, isLoading } = useCollection(keysQuery)

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.key || !formData.displayName) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all fields." })
      return
    }

    const keyId = editingKey?.id || Math.random().toString(36).substr(2, 9)
    const keyRef = doc(db, 'managerKeys', keyId)

    setDocumentNonBlocking(keyRef, {
      ...formData,
      id: keyId,
      createdAt: editingKey?.createdAt || new Date().toISOString()
    }, { merge: true })

    toast({ title: "Success", description: `Access key for ${formData.displayName} saved.` })
    setIsAdding(false)
    setEditingKey(null)
    setFormData({ key: "", displayName: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this manager access?")) {
      deleteDocumentNonBlocking(doc(db, 'managerKeys', id))
      toast({ title: "Removed", description: "Access key deleted." })
    }
  }

  const handleResetAllData = async () => {
    const confirmation = prompt("Type 'RESET' to delete all site data (Tasks, Alerts, and Keys):")
    if (confirmation !== "RESET") return

    setIsResetting(true)
    try {
      const collections = ['orderTasks', 'systemAlerts', 'managerKeys', 'staffConcerns', 'importantInfo', 'kudos', 'coverWorkPosts']
      for (const colName of collections) {
        const snap = await getDocs(collection(db, colName))
        const batch = writeBatch(db)
        snap.docs.forEach((doc) => batch.delete(doc.ref))
        await batch.commit()
      }
      toast({ title: "System Reset", description: "All database collections have been cleared." })
      if (typeof window !== 'undefined') window.location.reload()
    } catch (err) {
      console.error(err)
      toast({ variant: "destructive", title: "Reset Failed", description: "Could not clear all collections." })
    } finally {
      setIsResetting(false)
    }
  }

  // Defer rendering until mounted to prevent hydration mismatch from sessionStorage or extension-injected attributes
  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="glass-panel w-full max-w-md border-none">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">Control Room</CardTitle>
              <CardDescription>Enter code to manage keys.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
                <Input 
                  type="password" 
                  placeholder="Access Code" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-white/5 text-center text-lg tracking-widest"
                  autoFocus
                  suppressHydrationWarning
                />
                <Button type="submit" disabled={isChecking} className="w-full tasks-gradient text-white">
                  {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Access System"}
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
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-headline portal-text-gradient">Access Key Management</h1>
            <p className="text-muted-foreground">Manage unique keys for the Managers Portal.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl h-10 text-muted-foreground hover:text-white">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Dialog open={isAdding} onOpenChange={(o) => { setIsAdding(o); if(!o) setEditingKey(null); }}>
              <DialogTrigger asChild>
                <Button className="tasks-gradient text-white gap-2 h-10 rounded-xl">
                  <Plus className="w-4 h-4" /> New Key
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel border-none text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">{editingKey ? "Edit Key" : "Generate New Access Key"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveKey} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Manager Name</Label>
                    <Input 
                      value={formData.displayName} 
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="e.g. Site Supervisor A"
                      className="bg-secondary/50 border-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unique Access Key</Label>
                    <div className="flex gap-2">
                      <Input 
                        value={formData.key} 
                        onChange={(e) => setFormData({...formData, key: e.target.value})}
                        placeholder="e.g. ALPHA-77"
                        className="bg-secondary/50 border-white/5"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="border-white/10"
                        onClick={() => setFormData({...formData, key: Math.random().toString(36).substring(2, 8).toUpperCase()})}
                      >
                        Gen
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full tasks-gradient text-white h-12 rounded-xl">
                      Save Access Key
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : !keys || keys.length === 0 ? (
          <Card className="glass-panel border-dashed py-20 text-center text-muted-foreground mb-8">
            No access keys found. Create one above.
          </Card>
        ) : (
          <div className="grid gap-4 mb-12">
            {keys.map((k) => (
              <Card key={k.id} className="glass-panel border-white/5 hover:border-primary/20 transition-all">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <Key className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl font-headline">{k.displayName}</h3>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>Access Key: <span className="text-white font-mono font-bold">{k.key}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      className="border-white/10 flex-1 sm:flex-none"
                      onClick={() => {
                        setEditingKey(k);
                        setFormData({ key: k.key, displayName: k.displayName });
                        setIsAdding(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/10 text-red-400 hover:bg-red-500/10 flex-1 sm:flex-none"
                      onClick={() => handleDelete(k.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Accordion type="single" collapsible className="mt-12">
          <AccordionItem value="danger-zone" className="border-red-500/20">
            <AccordionTrigger className="text-red-400 hover:text-red-300 hover:no-underline">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>System Danger Zone</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-red-400">Reset All System Data</h4>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all tasks, keys, alerts, and kudos across the entire platform. 
                      Use this only if you want to start from a clean slate.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto gap-2"
                    onClick={handleResetAllData}
                    disabled={isResetting}
                  >
                    {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    Delete All Collections
                  </Button>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
      <Footer />
    </div>
  )
}
