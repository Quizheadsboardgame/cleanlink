"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Hammer, Send, Building2, User, Loader2, AlertCircle } from "lucide-react"
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
import { SITES } from "@/components/stock-order-form"
import { useLanguage } from "@/context/language-context"

export function FaultyEquipmentForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { t } = useLanguage()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [equipment, setEquipment] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const handleSubmit = () => {
    if (!user) {
      toast({ variant: "destructive", title: t.common.wait, description: t.common.auth })
      return
    }

    if (!name || !site || !equipment || !description) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.faulty.missingFields
      })
      return
    }

    setIsSubmitting(true)

    const reportId = Math.random().toString(36).substr(2, 9)
    const reportRef = doc(db, 'users', user.uid, 'faultyEquipmentReports', reportId)
    const taskRef = doc(db, 'orderTasks', reportId)

    const reportData = {
      id: reportId,
      cleanerName: name,
      site: site,
      equipmentName: equipment,
      faultDescription: description,
      status: 'Submitted',
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(reportRef, reportData, { merge: true })

    const taskData = {
      id: reportId,
      stockOrderId: reportId,
      title: `Faulty Equipment: ${equipment}`,
      description: `Reported by: ${name} at ${site}. Issue: ${description}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Faulty Equipment',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.faulty.successTitle,
      description: t.faulty.successDesc
    })

    setTimeout(() => {
      router.push('/tasks')
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden border-none shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Hammer className="w-6 h-6 text-[#F59E0B]" />
            {t.faulty.title}
          </CardTitle>
          <CardDescription>{t.faulty.description}</CardDescription>
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
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {t.faulty.site}
              </Label>
              <Select onValueChange={setSite} value={site}>
                <SelectTrigger className="bg-secondary/50 border-white/5 text-white">
                  <SelectValue placeholder={t.stores.sitePlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 max-h-[300px] text-white">
                  {SITES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {t.faulty.equipment}
            </Label>
            <Input 
              placeholder={t.faulty.equipmentPlaceholder} 
              value={equipment} 
              onChange={(e) => setEquipment(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">{t.faulty.faultDescription}</Label>
            <Textarea 
              placeholder={t.faulty.faultPlaceholder} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[120px] text-white"
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="faulty-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(245,158,11,0.2)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.faulty.submit}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
