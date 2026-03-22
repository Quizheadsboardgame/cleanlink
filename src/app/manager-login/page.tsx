"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { collection, query, where, limit, getDocs } from "firebase/firestore"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, Loader2, ShieldCheck } from "lucide-react"
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
  
  const [mounted, setMounted] = useState(false)
  const [accessKey, setAccessKey] = useState("")
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth, mounted])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanKey = accessKey.trim().toUpperCase()
    if (!cleanKey) return
    
    setIsChecking(true)
    
    try {
      const q = query(
        collection(db, 'managerKeys'), 
        where('key', '==', cleanKey), 
        limit(1)
      )
      
      const snap = await getDocs(q)
      
      if (!snap.empty) {
        const data = snap.docs[0].data()
        
        // Calculate midnight expiry
        const midnight = new Date().setHours(23, 59, 59, 999);
        
        sessionStorage.setItem("manager_auth_token", data.key)
        sessionStorage.setItem("manager_display_name", data.displayName)
        sessionStorage.setItem("manager_expiry", midnight.toString())
        
        toast({ title: "Access Granted", description: `Welcome, ${data.displayName}. Session valid until midnight.` })
        
        setTimeout(() => {
          router.push('/tasks')
        }, 100)
      } else {
        toast({ variant: "destructive", title: "Denied", description: "Invalid access key. Please check and try again." })
      }
    } catch (err: any) {
      console.error("Login Error:", err)
      toast({ variant: "destructive", title: "System Error", description: "Could not connect to security servers." })
    } finally {
      setIsChecking(false)
    }
  }

  if (!mounted) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="glass-panel w-full max-w-md border-none">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-headline">{t.nav.managerPortal}</CardTitle>
            <CardDescription>Enter your unique site access key. Sessions expire at midnight.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4" suppressHydrationWarning>
              <div className="space-y-2">
                <Label>Security Access Key</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder="e.g. ALPHA-77" 
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="bg-secondary/50 border-white/5 pl-10 uppercase font-mono h-12"
                    disabled={isChecking}
                    autoFocus
                    suppressHydrationWarning
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isChecking} 
                className="w-full tasks-gradient text-white h-12 rounded-xl mt-4 font-bold shadow-lg"
              >
                {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Access Dashboard"}
              </Button>
              
              <div className="pt-4 text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  Secure access for authorised site managers only.<br/>
                  Powered by Harley Infrastructure.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
