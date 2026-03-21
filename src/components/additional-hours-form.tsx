
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Clock, Send, Building2, User, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { SITES } from "@/components/stock-order-form"

export function AdditionalHoursForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [requestType, setRequestType] = useState<"Permanent" | "Temporary">("Permanent")
  const [datesFree, setDatesFree] = useState("")
  const [timesAvailable, setTimesAvailable] = useState("")

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

    if (!name || !site || !timesAvailable || (requestType === "Temporary" && !datesFree)) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all mandatory fields to request additional hours."
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
      site: site,
      requestType: requestType,
      datesFree: datesFree,
      timesAvailable: timesAvailable,
      status: 'Submitted',
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(requestRef, requestData, { merge: true })

    const taskData = {
      id: requestId,
      stockOrderId: requestId,
      title: `Extra Hours: ${name}`,
      description: `Type: ${requestType}. Site: ${site}. Availability: ${timesAvailable}. ${datesFree ? `Dates: ${datesFree}` : ""}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Additional Hours',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: "Request Submitted",
      description: "Thank you for submitting your request, this will be reviewed the next working day by 12pm."
    })

    setTimeout(() => {
      router.push('/status')
    }, 1500)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden border-none shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#D946EF]" />
            Additional Hours Request
          </CardTitle>
          <CardDescription>Submit a request for extra hours (permanent or temporary).</CardDescription>
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

          <div className="space-y-3">
            <Label className="text-muted-foreground">Request Type</Label>
            <RadioGroup 
              defaultValue="Permanent" 
              value={requestType} 
              onValueChange={(v) => setRequestType(v as "Permanent" | "Temporary")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Permanent" id="permanent" className="border-primary text-primary" />
                <Label htmlFor="permanent" className="cursor-pointer text-white">Permanent Hours</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Temporary" id="temporary" className="border-primary text-primary" />
                <Label htmlFor="temporary" className="cursor-pointer text-white">Temporary Hours</Label>
              </div>
            </RadioGroup>
          </div>

          {requestType === "Temporary" && (
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Specific Dates
              </Label>
              <Input 
                placeholder="e.g. Next Monday to Wednesday, July 15th-20th" 
                value={datesFree} 
                onChange={(e) => setDatesFree(e.target.value)}
                className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-muted-foreground">Times You Are Free to Work</Label>
            <Textarea 
              placeholder="e.g. Monday to Friday 4 PM - 8 PM, Saturdays all day" 
              value={timesAvailable} 
              onChange={(e) => setTimesAvailable(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[100px] text-white"
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
            Submit Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
