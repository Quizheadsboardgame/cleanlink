"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { ShieldAlert, Send, Building2, UserX, Loader2, AlertCircle, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"

export function ReportConcernForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { t } = useLanguage()
  const { managerId, managerName } = useManagerContext()

  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState<"Staff Member" | "Health & Safety" | "Other">("Staff Member")
  const [site, setSite] = useState("")
  const [description, setDescription] = useState("")

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

    if (!site || !description) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.concern.missingFields
      })
      return
    }

    setIsSubmitting(true)

    const concernId = Math.random().toString(36).substr(2, 9)
    const concernRef = doc(db, 'staffConcerns', concernId)
    const taskRef = doc(db, 'orderTasks', concernId)

    const concernData = {
      id: concernId,
      type: type,
      site: site,
      description: description,
      status: 'Submitted',
      ownerId: user.uid,
      managerId: managerId || "generic",
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(concernRef, concernData, { merge: true })

    const taskData = {
      id: concernId,
      stockOrderId: concernId,
      managerId: managerId || "generic",
      title: `Private Concern: ${type}`,
      description: `Site: ${site}. Type: ${type}. Details: ${description}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Staff Concern',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.concern.successTitle,
      description: t.concern.successDesc
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
            <ShieldAlert className="w-6 h-6 text-red-500" />
            {t.concern.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-muted-foreground">{t.concern.typeLabel}</Label>
            <RadioGroup 
              defaultValue="Staff Member" 
              value={type} 
              onValueChange={(v) => setType(v as "Staff Member" | "Health & Safety" | "Other")}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <RadioGroupItem value="Staff Member" id="staff" className="border-red-500 text-red-500" />
                <Label htmlFor="staff" className="cursor-pointer text-white flex items-center gap-2">
                  <UserX className="w-4 h-4" /> {t.concern.typeStaff}
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <RadioGroupItem value="Health & Safety" id="safety" className="border-red-500 text-red-500" />
                <Label htmlFor="safety" className="cursor-pointer text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {t.concern.typeSafety}
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5">
                <RadioGroupItem value="Other" id="other" className="border-red-500 text-red-500" />
                <Label htmlFor="other" className="cursor-pointer text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> {t.concern.typeOther}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" /> {t.concern.siteLabel}
            </Label>
            <Input 
              placeholder={t.stores.sitePlaceholder} 
              value={site} 
              onChange={(e) => setSite(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-red-500/50 text-white"
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.concern.detailsLabel}</Label>
            <Textarea 
              placeholder={t.concern.detailsPlaceholder} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-red-500/50 min-h-[150px] text-white"
              suppressHydrationWarning
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="bg-gradient-to-r from-red-600 to-rose-700 text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(220,38,38,0.2)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.concern.submit}
          </Button>
        </CardFooter>
      </Card>
      
      <p className="mt-4 text-[10px] text-center text-muted-foreground/60 uppercase tracking-[0.2em]">
        SECURITY PROTOCOL: {managerName ? `SECURED TO PROFILE: ${managerName}` : "GENERIC CONNECTION"}
      </p>
    </div>
  )
}
