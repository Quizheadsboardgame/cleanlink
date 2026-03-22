
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { CreditCard, Plus, Trash2, Send, Building2, User, Hash, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc, collection } from "firebase/firestore"
import { setDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"

interface PayEntry {
  id: string
  date: string
  hours: string
}

export function PayErrorForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { t } = useLanguage()
  const { managerId } = useManagerContext()

  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [siteCode, setSiteCode] = useState("")
  const [entries, setEntries] = useState<PayEntry[]>([
    { id: Math.random().toString(36).substr(2, 9), date: "", hours: "" }
  ])

  useEffect(() => {
    setMounted(true)
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const addEntry = () => {
    setEntries([...entries, { id: Math.random().toString(36).substr(2, 9), date: "", hours: "" }])
  }

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(e => e.id !== id))
    }
  }

  const updateEntry = (id: string, field: keyof PayEntry, value: string) => {
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const handleSubmit = () => {
    if (!user) {
      toast({ variant: "destructive", title: t.common.wait, description: t.common.auth })
      return
    }

    if (!name || !site || !siteCode || entries.some(e => !e.date || !e.hours)) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.pay.missingFields
      })
      return
    }

    setIsSubmitting(true)

    const reportId = Math.random().toString(36).substr(2, 9)
    const reportRef = doc(db, 'users', user.uid, 'payErrors', reportId)
    const taskRef = doc(db, 'orderTasks', reportId)

    const reportData = {
      id: reportId,
      cleanerName: name,
      site: site,
      siteCode: siteCode,
      entries: entries.map(({ date, hours }) => ({ date, hours })),
      status: 'Submitted',
      ownerId: user.uid,
      managerId: managerId || "generic",
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(reportRef, reportData, { merge: true })

    const entriesSummary = entries.map(e => `${e.date}: ${e.hours}`).join(", ")
    const taskData = {
      id: reportId,
      stockOrderId: reportId,
      managerId: managerId || "generic",
      title: `Pay Inquiry: ${name}`,
      description: `Site: ${site} (${siteCode}). Details: ${entriesSummary}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Pay Inquiry',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.pay.successTitle,
      description: t.pay.successDesc
    })

    setTimeout(() => {
      router.push('/status')
    }, 1500)
  }

  if (!mounted) {
    return <div className="max-w-2xl mx-auto py-20 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden border-none shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            {t.pay.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> {t.common.name}
              </Label>
              <Input 
                placeholder={t.stores.namePlaceholder} 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
                suppressHydrationWarning
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {t.common.site}
              </Label>
              <Input 
                placeholder={t.stores.sitePlaceholder} 
                value={site} 
                onChange={(e) => setSite(e.target.value)}
                className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <Hash className="w-4 h-4" /> {t.pay.siteCode}
            </Label>
            <Input 
              placeholder={t.pay.siteCodePlaceholder} 
              value={siteCode} 
              onChange={(e) => setSiteCode(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white font-mono"
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-headline text-white">Missing Hours Log</Label>
              <Button 
                onClick={addEntry} 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/20 hover:bg-primary/10 text-primary"
              >
                <Plus className="w-4 h-4" /> {t.pay.addEntry}
              </Button>
            </div>

            <div className="space-y-3">
              {entries.map((entry) => (
                <div key={entry.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-secondary/10 rounded-xl border border-white/5">
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {t.pay.missingDate}
                    </Label>
                    <Input 
                      type="date"
                      value={entry.date}
                      onChange={(e) => updateEntry(entry.id, "date", e.target.value)}
                      className="bg-secondary/30 border-white/5 text-white"
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
                      <Hash className="w-3 h-3" /> {t.pay.missingHours}
                    </Label>
                    <Input 
                      placeholder={t.pay.hoursPlaceholder}
                      value={entry.hours}
                      onChange={(e) => updateEntry(entry.id, "hours", e.target.value)}
                      className="bg-secondary/30 border-white/5 text-white"
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="flex items-end pb-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeEntry(entry.id)}
                      disabled={entries.length <= 1}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 w-10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="tasks-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(139,92,246,0.2)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.pay.submit}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
