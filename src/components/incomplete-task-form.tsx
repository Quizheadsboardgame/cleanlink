
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AlertTriangle, Send, Building2, User, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"

export function IncompleteTaskForm() {
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
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

  useEffect(() => {
    setMounted(true)
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const handleSubmit = () => {
    if (!user) {
      toast({ variant: "destructive", title: t.common.wait, description: t.common.auth })
      return
    }

    if (!name || !site || !reason) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.incomplete.missingFields
      })
      return
    }

    setIsSubmitting(true)

    const reportId = Math.random().toString(36).substr(2, 9)
    const reportRef = doc(db, 'users', user.uid, 'incompleteTaskReports', reportId)
    const taskRef = doc(db, 'orderTasks', reportId)

    const reportData = {
      id: reportId,
      cleanerName: name,
      site: site,
      reason: reason,
      details: details,
      status: 'Submitted',
      ownerId: user.uid,
      managerId: managerId || "generic",
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(reportRef, reportData, { merge: true })

    const taskData = {
      id: reportId,
      stockOrderId: reportId,
      managerId: managerId || "generic",
      title: `Incomplete Task: ${site}`,
      description: `Reported by: ${name}. Reason: ${reason}. ${details ? `Details: ${details}` : ""}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Incomplete Task',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.incomplete.successTitle,
      description: t.incomplete.successDesc
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
            <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
            {t.incomplete.title}
          </CardTitle>
          <CardDescription>{t.incomplete.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> {t.faulty.cleanerName}
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
                <Building2 className="w-4 h-4" /> {t.incomplete.site || t.faulty.site}
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
              <Info className="w-4 h-4" /> {t.incomplete.reason}
            </Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="bg-secondary/50 border-white/5 text-white">
                <SelectValue placeholder={t.common.select || "Select a reason"} />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10 text-white">
                {t.incomplete.reasons.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.incomplete.details}</Label>
            <Textarea 
              placeholder={t.incomplete.detailsPlaceholder} 
              value={details} 
              onChange={(e) => setDetails(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[120px] text-white"
              suppressHydrationWarning
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="incomplete-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(239,68,68,0.2)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.incomplete.submit}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
