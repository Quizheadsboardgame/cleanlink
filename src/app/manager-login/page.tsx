
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Loader2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"

export default function ManagerLoginPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const { t } = useLanguage()
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username || !password) return
    
    setIsChecking(true)
    
    // In a prototype, we fetch the profiles matching the username
    // and check password manually.
    try {
      const { getDocs, query, collection, where, limit } = await import("firebase/firestore")
      const q = query(collection(db, 'managerProfiles'), where('username', '==', username), limit(1))
      const snap = await getDocs(q)
      
      if (!snap.empty) {
        const profile = snap.docs[0].data()
        if (profile.password === password) {
          sessionStorage.setItem("manager_auth_token", profile.id)
          sessionStorage.setItem("manager_display_name", profile.displayName)
          toast({ title: "Login Successful", description: `Welcome, ${profile.displayName}.` })
          router.push('/tasks')
        } else {
          toast({ variant: "destructive", title: "Error", description: "Invalid password." })
        }
      } else {
        toast({ variant: "destructive", title: "Error", description: "Manager profile not found." })
      }
    } catch (err) {
      toast({ variant: "destructive", title: "Connection Error", description: "Check your internet." })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="glass-panel w-full max-w-md border-none">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">{t.nav.managerPortal}</CardTitle>
            <CardDescription>Enter your management credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="Manager ID" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-secondary/50 border-white/5 pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    type="password"
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/50 border-white/5 pl-10"
                  />
                </div>
              </div>
              <Button type="submit" disabled={isChecking} className="w-full tasks-gradient text-white h-12 rounded-xl mt-4">
                {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
