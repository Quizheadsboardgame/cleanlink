
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Info, Plus, Loader2, ShieldCheck, Sparkles, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/context/language-context"

export default function ImportantInfoPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  
  const [category, setCategory] = useState("Announcements")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  useEffect(() => {
    const managerToken = sessionStorage.getItem("manager_auth_token")
    const controlToken = sessionStorage.getItem("control_room_auth")
    if (managerToken || controlToken === "true") {
      setIsAuthorized(true)
    }
  }, [])

  const infoQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, 'importantInfo'), orderBy('category', 'asc'))
  }, [db, user])

  const { data: infoItems, isLoading } = useCollection(infoQuery)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      toast({ variant: "destructive", title: "Error", description: "Please fill in all fields." })
      return
    }

    setIsSubmitting(true)
    const id = Math.random().toString(36).substr(2, 9)
    const infoRef = doc(db, 'importantInfo', id)

    setDocumentNonBlocking(infoRef, {
      id,
      category,
      title,
      content,
      updatedAt: new Date().toISOString()
    }, { merge: true })

    toast({ title: "Success", description: "Information updated successfully." })
    setIsAdding(false)
    setTitle("")
    setContent("")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-orange-500">
                <Sparkles className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Management Feed</span>
              </div>
              <h1 className="text-4xl font-bold font-headline info-text-gradient tracking-tighter">
                {t.nav.info}
              </h1>
              <p className="text-muted-foreground max-w-md">
                Stay updated with the latest news, announcements, and procedures from your management team.
              </p>
            </div>
            
            {isAuthorized && (
              <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                  <Button className="info-gradient text-white gap-2 rounded-xl shadow-lg h-12 px-6">
                    <Plus className="w-4 h-4" /> Post Update
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-panel border-none text-foreground">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">New Site Update</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select onValueChange={setCategory} defaultValue={category}>
                        <SelectTrigger className="bg-secondary/50 border-white/5 text-foreground">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10 text-foreground">
                          <SelectItem value="Announcements">Latest News & Updates</SelectItem>
                          <SelectItem value="Management">Management Contacts</SelectItem>
                          <SelectItem value="Procedures">Standard Procedures</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Subject / Title</Label>
                      <Input 
                        placeholder="e.g. New Cleaning Protocol - March" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-secondary/50 border-white/5 text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Update Details</Label>
                      <Textarea 
                        placeholder="Type the news or instruction here..." 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-secondary/50 border-white/5 min-h-[120px] text-foreground"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting} className="w-full info-gradient text-white h-12 rounded-xl">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Publish Update
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {(isLoading || isUserLoading) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-muted-foreground">Syncing feed...</p>
            </div>
          ) : !infoItems || infoItems.length === 0 ? (
            <Card className="glass-panel border-dashed py-16 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-orange-500/10 p-4 rounded-full">
                  <MessageSquare className="w-12 h-12 text-orange-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No updates yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    {isAuthorized ? "Start by posting an announcement for your cleaning team." : "Check back later for news and site updates."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-8">
              {["Announcements", "Management", "Procedures"].map((cat) => {
                const items = infoItems.filter(i => i.category === cat)
                if (items.length === 0) return null
                
                return (
                  <div key={cat} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-orange-500/30 text-orange-500 uppercase tracking-[0.2em] px-3 py-1 text-[10px] font-bold">
                        {cat === 'Announcements' ? 'Latest Updates' : cat}
                      </Badge>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      {items.map((item) => (
                        <Card key={item.id} className="glass-panel border-white/5 transition-all hover:border-orange-500/20 group">
                          <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-headline flex items-center justify-between">
                              <span className="flex items-center gap-3">
                                <div className="bg-orange-500/10 p-2 rounded-lg group-hover:scale-110 transition-transform">
                                  {cat === 'Management' ? <ShieldCheck className="w-4 h-4 text-orange-500" /> : <Info className="w-4 h-4 text-orange-500" />}
                                </div>
                                {item.title}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 pt-2 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                            {item.content}
                          </CardContent>
                          <CardFooter className="p-4 pt-2 border-t border-white/5 mt-auto flex justify-between items-center text-[9px] text-muted-foreground uppercase tracking-widest">
                            <span>{new Date(item.updatedAt).toLocaleDateString()}</span>
                            <span className="opacity-40">The Cleaners Cupboard Protocol</span>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
