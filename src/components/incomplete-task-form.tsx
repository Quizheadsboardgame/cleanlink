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
import { SITES } from "@/components/stock-order-form"

const REASONS = [
  "Door was locked / No access",
  "Area occupied",
  "Maintenance in progress",
  "Health & Safety concern",
  "Other (please specify below)"
]

export function IncompleteTaskForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [reason, setReason] = useState("")
  const [details, setDetails] = useState("")

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

    if (!name || !site || !reason) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all mandatory fields to report the incomplete task."
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
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(reportRef, reportData, { merge: true })

    const taskData = {
      id: reportId,
      stockOrderId: reportId,
      title: `Incomplete Task: ${site}`,
      description: `Reported by: ${name}. Reason: ${reason}. ${details ? `Details: ${details}` : ""}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Incomplete Task',
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
            <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
            Incomplete Task Report
          </CardTitle>
          <CardDescription>Report why a cleaning task could not be completed at your site.</CardDescription>
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
                className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Site
              </Label>
              <Select onValueChange={setSite} value={site}>
                <SelectTrigger className="bg-secondary/50 border-white/5 text-white">
                  <SelectValue placeholder="Select a site" />
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
              <Info className="w-4 h-4" /> Reason for Incomplete Task
            </Label>
            <Select onValueChange={setReason} value={reason}>
              <SelectTrigger className="bg-secondary/50 border-white/5 text-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10 text-white">
                {REASONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Additional Details (Optional)</Label>
            <Textarea 
              placeholder="Provide more context (e.g. room number, specific staff member)..." 
              value={details} 
              onChange={(e) => setDetails(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[120px] text-white"
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
            Submit Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}