
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy, limit, where } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Heart, Send, Loader2, Sparkles, User, Users, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useLanguage } from "@/context/language-context"
import { format } from "date-fns"

export default function KudosPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  const [isAdding, setIsAdding] = useState(false)
  const [senderName, setSenderName] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const kudosQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    // Show only authorized kudos
    return query(
      collection(db, 'kudos'), 
      where('status', '==', 'Authorized'),
      orderBy('createdAt', 'desc'), 
      limit(30)
    )
  }, [db, user])

  const { data: kudosItems, isLoading } = useCollection(kudosQuery)

  // Client side filter for 14-day expiry
  const activeKudos = React.useMemo(() => {
    if (!kudosItems) return []
    const now = new Date().getTime()
    return kudosItems.filter(k => {
      if (!k.expiresAt) return true // Fallback for old records
      return new Date(k.expiresAt).getTime() > now
    })
  }, [kudosItems])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!senderName || !recipientName || !message) {
      toast({ variant: "destructive", title: "Error", description: t.common.missingInfo })
      return
    }

    setIsSubmitting(true)
    const id = Math.random().toString(36).substr(2, 9)
    const kudosRef = doc(db, 'kudos', id)

    setDocumentNonBlocking(kudosRef, {
      id,
      senderName,
      recipientName,
      message,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    }, { merge: true })

    toast({ 
      title: t.kudos.successTitle, 
      description: "Submitted for moderation. It will appear on the board once approved by a manager." 
    })
    setIsAdding(false)
    setRecipientName("")
    setMessage("")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-rose-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">Morale Protocol</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold font-headline portal-text-gradient tracking-tighter">
                {t.kudos.title}
              </h1>
              <p className="text-muted-foreground text-lg max-w-md opacity-80">
                Celebrate your coworkers! Notes are reviewed by management and stay on the board for 14 days.
              </p>
            </div>

            <Dialog open={isAdding} onOpenChange={setIsAdding}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white gap-2 rounded-2xl shadow-xl h-14 px-8 font-bold text-lg group active:scale-95 transition-all">
                  <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" /> 
                  {t.kudos.submit}
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-panel border-none text-foreground max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-headline text-3xl flex items-center gap-3">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> 
                    Say Thanks
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" /> {t.kudos.senderLabel}
                    </Label>
                    <Input 
                      placeholder="Your name" 
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="bg-secondary/50 border-white/5 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" /> {t.kudos.recipientLabel}
                    </Label>
                    <Input 
                      placeholder="Their name" 
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="bg-secondary/50 border-white/5 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-muted-foreground">
                      <Heart className="w-4 h-4" /> {t.kudos.messageLabel}
                    </Label>
                    <Textarea 
                      placeholder={t.kudos.messagePlaceholder} 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-secondary/50 border-white/5 min-h-[120px]"
                    />
                  </div>
                  <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 flex items-start gap-3">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                      To keep the board friendly, all messages are checked by a manager before they appear publicly.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-rose-500 hover:bg-rose-600 text-white h-12 rounded-xl font-bold">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                      Submit for Moderation
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Grid of Kudos */}
          {(isLoading || isUserLoading) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-rose-400 animate-spin" />
              <p className="text-muted-foreground">Syncing Board...</p>
            </div>
          ) : !activeKudos || activeKudos.length === 0 ? (
            <Card className="glass-panel border-dashed py-20 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-rose-500/10 p-6 rounded-full">
                  <Heart className="w-16 h-16 text-rose-400 opacity-20" />
                </div>
                <p className="text-muted-foreground italic">{t.kudos.noKudos}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeKudos.map((item) => (
                <Card key={item.id} className="glass-panel border-rose-500/10 hover:border-rose-500/30 transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Heart className="w-24 h-24 fill-rose-500" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="bg-rose-500/10 p-2 rounded-lg">
                        <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {item.authorizedAt ? format(new Date(item.authorizedAt), "MMM d") : format(new Date(item.createdAt), "MMM d")}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-headline mt-4 flex items-center gap-2">
                      <span className="text-rose-400">To:</span> {item.recipientName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-4">
                    <p className="text-muted-foreground leading-relaxed italic">
                      "{item.message}"
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <User className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <span className="text-xs font-bold text-white/60">From: {item.senderName}</span>
                    </div>
                    <Badge variant="outline" className="border-rose-500/20 text-rose-400 text-[8px] uppercase">Manager Approved</Badge>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
