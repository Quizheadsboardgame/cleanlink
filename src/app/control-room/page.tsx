
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy } from "firebase/firestore"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, UserPlus, Trash2, Edit2, ShieldCheck, Check, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"

export default function ControlRoomPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  
  const [password, setPassword] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  const [isAdding, setIsAdding] = useState(false)
  const [editingProfile, setEditingProfile] = useState<any>(null)
  const [formData, setFormData] = useState({ username: "", password: "", displayName: "" })

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  useEffect(() => {
    const saved = sessionStorage.getItem("control_room_auth")
    if (saved === "true") setIsAuthorized(true)
  }, [])

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

  const profilesQuery = useMemoFirebase(() => {
    if (!db || !isAuthorized) return null
    return query(collection(db, 'managerProfiles'), orderBy('createdAt', 'desc'))
  }, [db, isAuthorized])

  const { data: profiles, isLoading } = useCollection(profilesQuery)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username || !formData.password || !formData.displayName) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all fields." })
      return
    }

    const profileId = editingProfile?.id || Math.random().toString(36).substr(2, 9)
    const profileRef = doc(db, 'managerProfiles', profileId)

    setDocumentNonBlocking(profileRef, {
      ...formData,
      id: profileId,
      createdAt: editingProfile?.createdAt || new Date().toISOString()
    }, { merge: true })

    toast({ title: "Success", description: `Manager ${formData.displayName} saved.` })
    setIsAdding(false)
    setEditingProfile(null)
    setFormData({ username: "", password: "", displayName: "" })
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this manager?")) {
      deleteDocumentNonBlocking(doc(db, 'managerProfiles', id))
      toast({ title: "Removed", description: "Manager profile deleted." })
    }
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
              <CardDescription>Enter code to manage the infrastructure.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input 
                  type="password" 
                  placeholder="Access Code" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50 border-white/5 text-center text-lg tracking-widest"
                  autoFocus
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
            <h1 className="text-4xl font-bold font-headline portal-text-gradient">Manager Administration</h1>
            <p className="text-muted-foreground">Manage accounts and credentials for the Managers Portal.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" onClick={handleLogout} className="rounded-xl h-10 text-muted-foreground hover:text-white">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <Dialog open={isAdding} onOpenChange={(o) => { setIsAdding(o); if(!o) setEditingProfile(null); }}>
              <DialogTrigger asChild>
                <Button className="tasks-gradient text-white gap-2 h-10 rounded-xl">
                  <UserPlus className="w-4 h-4" /> Add Manager
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel border-none text-foreground">
                <DialogHeader>
                  <DialogTitle className="font-headline text-2xl">{editingProfile ? "Edit Manager" : "Create New Manager"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveProfile} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Manager Name (e.g. Site Supervisor A)</Label>
                    <Input 
                      value={formData.displayName} 
                      onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      placeholder="Display Name"
                      className="bg-secondary/50 border-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Login Username</Label>
                    <Input 
                      value={formData.username} 
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="Username"
                      className="bg-secondary/50 border-white/5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Login Password</Label>
                    <Input 
                      value={formData.password} 
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Password"
                      className="bg-secondary/50 border-white/5"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full tasks-gradient text-white h-12 rounded-xl">
                      Save Profile
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : !profiles || profiles.length === 0 ? (
          <Card className="glass-panel border-dashed py-20 text-center text-muted-foreground">
            No manager profiles found. Create one above.
          </Card>
        ) : (
          <div className="grid gap-4">
            {profiles.map((p) => (
              <Card key={p.id} className="glass-panel border-white/5 hover:border-primary/20 transition-all">
                <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                      <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl font-headline">{p.displayName}</h3>
                      <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                        <span>User: <span className="text-white">{p.username}</span></span>
                        <span>Pass: <span className="text-white">{p.password}</span></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                      variant="outline" 
                      className="border-white/10 flex-1 sm:flex-none"
                      onClick={() => {
                        setEditingProfile(p);
                        setFormData({ username: p.username, password: p.password, displayName: p.displayName });
                        setIsAdding(true);
                      }}
                    >
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-white/10 text-red-400 hover:bg-red-500/10 flex-1 sm:flex-none"
                      onClick={() => handleDelete(p.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
