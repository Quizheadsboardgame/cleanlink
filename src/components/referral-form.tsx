
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { UserPlus, Send, User, Mail, Phone, Info, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"

export function ReferralForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()
  const { t } = useLanguage()
  const { managerId } = useManagerContext()

  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referrerName, setReferrerName] = useState("")
  const [friendName, setFriendName] = useState("")
  const [friendEmail, setFriendEmail] = useState("")
  const [friendPhone, setFriendPhone] = useState("")
  const [extraInfo, setExtraInfo] = useState("")

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

    if (!referrerName || !friendName || !friendEmail || !friendPhone) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.referral.missingFields
      })
      return
    }

    setIsSubmitting(true)

    const referralId = Math.random().toString(36).substr(2, 9)
    const referralRef = doc(db, 'users', user.uid, 'referrals', referralId)
    const taskRef = doc(db, 'orderTasks', referralId)

    const referralData = {
      id: referralId,
      referrerName: referrerName,
      friendName: friendName,
      friendEmail: friendEmail,
      friendPhone: friendPhone,
      extraInfo: extraInfo,
      status: 'Submitted',
      ownerId: user.uid,
      managerId: managerId || "generic",
      createdAt: new Date().toISOString()
    }

    setDocumentNonBlocking(referralRef, referralData, { merge: true })

    const taskData = {
      id: referralId,
      stockOrderId: referralId,
      managerId: managerId || "generic",
      title: `Staff Referral: ${friendName}`,
      description: `Referred by: ${referrerName}. Contact: ${friendEmail} / ${friendPhone}. Notes: ${extraInfo}`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Staff Referral',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.referral.successTitle,
      description: t.referral.successDesc
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
            <UserPlus className="w-6 h-6 text-[#FACC15]" />
            {t.referral.title}
          </CardTitle>
          <CardDescription>{t.referral.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <User className="w-4 h-4" /> {t.referral.yourName}
            </Label>
            <Input 
              placeholder={t.stores.namePlaceholder} 
              value={referrerName} 
              onChange={(e) => setReferrerName(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
              suppressHydrationWarning
            />
          </div>

          <div className="h-px bg-white/5 my-4" />

          <div className="space-y-4">
            <Label className="text-sm font-bold uppercase tracking-wider text-[#FACC15]">{t.referral.friendInfo}</Label>
            
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> {t.referral.friendName}
              </Label>
              <Input 
                placeholder={t.stores.namePlaceholder} 
                value={friendName} 
                onChange={(e) => setFriendName(e.target.value)}
                className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
                suppressHydrationWarning
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {t.referral.email}
                </Label>
                <Input 
                  type="email"
                  placeholder="friend@example.com" 
                  value={friendEmail} 
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
                  suppressHydrationWarning
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {t.referral.phone}
                </Label>
                <Input 
                  placeholder="07xxx xxxxxx" 
                  value={friendPhone} 
                  onChange={(e) => setFriendPhone(e.target.value)}
                  className="bg-secondary/50 border-white/5 focus:border-primary/50 text-white"
                  suppressHydrationWarning
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" /> {t.referral.extraInfo}
            </Label>
            <Textarea 
              placeholder={t.referral.extraPlaceholder} 
              value={extraInfo} 
              onChange={(e) => setExtraInfo(e.target.value)}
              className="bg-secondary/50 border-white/5 focus:border-primary/50 min-h-[100px] text-white"
              suppressHydrationWarning
            />
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="referral-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(250,204,21,0.2)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.referral.submit}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
