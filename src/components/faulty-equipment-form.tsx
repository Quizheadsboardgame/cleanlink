
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

export function FaultyEquipmentForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()

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
      toast({ variant: "destructive", title: "Wait a moment", description: "Authenticating..." })
      return
    }

    if (!name || !site || !equipment || !description) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to report the faulty equipment."
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
      title: "Report Submitted",
      description: "Thank you for submitting the form, this will be reviewed the next working day by 12pm."
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
            <Hammer className="w-6 h-6 text-primary" />
            Faulty Equipment Report
          </CardTitle>
          <CardDescription>Request a replacement for faulty or broken equipment.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Cleaner Name
              </Label>
              <Input 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-secondary/50 border-white/5 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Site
              </Label>
              <Select onValueChange={setSite} value={site}>
                <SelectTrigger className="bg-secondary/50 border-white/5">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 max-h-[300px]">
                  {SITES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> Equipment Name
            </Label>
            <Input 
              placeholder="e.g. Vacuum Cleaner, Mop, Floor Buffer" 
              value={equipment} 
              onChange={(e) => setEquipment(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Description of Fault</Label>
            <Textarea 
              placeholder="Please describe what is wrong with the equipment..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[120px]"
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="portal-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,118,245,0.3)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Submit Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
