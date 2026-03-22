
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Clock, Send, User, Loader2, Calendar, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"

export function AdditionalHoursForm() {
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
  const [requestType, setRequestType] = useState<"Permanent" | "Temporary">("Permanent")
  const [datesFree, setDatesFree] = useState("")
  const [timesAvailable, setTimesAvailable] = useState("")

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

    if (!name || !timesAvailable || (requestType === "Temporary" && !datesFree)) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.hours.missingFields
      })
      return
    }

    setIsSubmitting(true)

    const requestId = Math.random().toString(36).substr(2, 9)
    const requestRef = doc(db, 'users', user.uid, 'additionalHoursRequests', requestId)
    const taskRef = doc(db, 'orderTasks', requestId)

    const requestData = {
      id: requestId,
      cleanerName: name,
      requestType: requestType,
      datesFree: datesFree,
      timesAvailable: timesAvailable,
      status: 'Submitted',
      ownerId: user.uid,
      managerId: managerId || "generic",
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(requestRef, requestData, { merge: true })

    const taskData = {
      id: requestId,
      stockOrderId: requestId,
      managerId: managerId || "generic",
      title: `Extra Hours: ${name}`,
      description: `Type: ${requestType === 'Permanent' ? 'Permanent Position' : 'Cover/Extra Shifts'}. Details: ${timesAvailable}. ${datesFree ? `Dates: ${datesFree}` : ""}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Additional Hours',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.hours.successTitle,
      description: t.hours.successDesc
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
            <Clock className="w-6 h-6 text-[#D946EF]" />
            {t.hours.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
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

          <div className="space-y-3">
            <Label className="text-muted-foreground">{t.hours.requestType}</Label>
            <RadioGroup 
              defaultValue="Permanent" 
              value={requestType} 
              onValueChange={(v) => setRequestType(v as "Permanent" | "Temporary")}
              className="flex flex-col gap-3"
            >
              <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group">
                <RadioGroupItem value="Permanent" id="permanent" className="border-primary text-primary mt-1" />
                <Label htmlFor="permanent" className="cursor-pointer leading-tight">
                  <div className="text-white font-bold">{t.hours.permanent}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Select this if you want a regular, set shift every week.</p>
                </Label>
              </div>
              <div className="flex items-start space-x-3 bg-white/5 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors group">
                <RadioGroupItem value="Temporary" id="temporary" className="border-primary text-primary mt-1" />
                <Label htmlFor="temporary" className="cursor-pointer leading-tight">
                  <div className="text-white font-bold">{t.hours.temporary}</div>
                  <p className="text-[10px] text-muted-foreground mt-1">Select this if you just want to earn a bit more by covering extra shifts.</p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {requestType === "Temporary" && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {t.hours.datesFree}
              </Label>
              <Input 
                placeholder={t.hours.datesPlaceholder} 
                value={datesFree} 
                onChange={(e) => setDatesFree(e.target.value)}
                className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
                suppressHydrationWarning
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> {t.hours.timesAvailable}
            </Label>
            <Textarea 
              placeholder={t.hours.timesPlaceholder} 
              value={timesAvailable} 
              onChange={(e) => setTimesAvailable(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[120px] text-white leading-relaxed"
              suppressHydrationWarning
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="hours-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(217,70,239,0.2)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.hours.submit}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
