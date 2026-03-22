
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { addDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { CalendarDays, MapPin, Clock, Send, Loader2, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"

function CountdownTimer({ deadline }: { deadline: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date(deadline);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-mono bg-red-500/10 text-red-400 px-2 py-1 rounded border border-red-500/20">
      <Clock className="w-3 h-3" />
      <span>{timeLeft}</span>
    </div>
  );
}

export default function CoverWorkPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()

  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [cleanerName, setCleanerName] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const postsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, 'coverWorkPosts'), orderBy('createdAt', 'desc'))
  }, [db, user])

  const { data: allPosts, isLoading } = useCollection(postsQuery)

  // Filter out expired posts for cleaners
  const activePosts = allPosts?.filter(post => new Date(post.deadline) > new Date())

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cleanerName || !respondingTo) {
      toast({ variant: "destructive", title: "Error", description: "Please enter your name." })
      return
    }

    const post = allPosts?.find(p => p.id === respondingTo)
    if (!post) return

    setIsSubmitting(true)
    
    // 1. Log response in the post's subcollection
    const colRef = collection(db, 'coverWorkPosts', respondingTo, 'responses')
    addDocumentNonBlocking(colRef, {
      postId: respondingTo,
      cleanerName,
      notes,
      ownerId: user?.uid || "anonymous",
      createdAt: new Date().toISOString()
    })

    // 2. Feed it through to the manager's task board
    const taskId = Math.random().toString(36).substr(2, 9)
    const taskRef = doc(db, 'orderTasks', taskId)
    setDocumentNonBlocking(taskRef, {
      id: taskId,
      managerId: post.managerId,
      title: `Cover Interest: ${post.title}`,
      description: `Staff: ${cleanerName}. Notes: ${notes || "None"}. Location: ${post.location || "N/A"}`,
      status: 'Pending Review',
      ownerId: user?.uid || "anonymous",
      type: 'Cover Interest',
      createdAt: new Date().toISOString()
    }, { merge: true })

    toast({ title: "Interest Logged", description: "Manager has been notified of your interest via their task board." })
    setRespondingTo(null)
    setCleanerName("")
    setNotes("")
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold font-headline cover-text-gradient">Upcoming Cover Work</h1>
            <p className="text-muted-foreground">Pick up extra shifts and support different locations.</p>
          </div>

          {(isLoading || isUserLoading) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-sky-400 animate-spin" />
              <p className="text-muted-foreground">Fetching opportunities...</p>
            </div>
          ) : !activePosts || activePosts.length === 0 ? (
            <Card className="glass-panel border-dashed py-20 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-secondary/50 p-4 rounded-full">
                  <CalendarDays className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No active cover work</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Check back later for new opportunities posted by management.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {activePosts.map((post) => (
                <Card key={post.id} className="glass-panel overflow-hidden transition-all hover:border-sky-500/30">
                  <CardHeader className="p-6 pb-2">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-headline flex items-center gap-2">
                          <CalendarDays className="w-5 h-5 text-sky-400" />
                          {post.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          {post.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-sky-400" />
                              {post.location}
                            </span>
                          )}
                          <CountdownTimer deadline={post.deadline} />
                        </div>
                      </div>
                      
                      <Dialog open={respondingTo === post.id} onOpenChange={(open) => !open && setRespondingTo(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            className="cover-gradient text-white rounded-xl shadow-lg gap-2"
                            onClick={() => setRespondingTo(post.id)}
                          >
                            <Send className="w-4 h-4" /> I'm Interested
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="glass-panel border-none text-foreground">
                          <DialogHeader>
                            <DialogTitle className="font-headline text-2xl">Express Interest</DialogTitle>
                            <DialogDescription>Let management know you can cover this work.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleResponseSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label>Your Full Name</Label>
                              <Input 
                                placeholder="Enter your name" 
                                value={cleanerName}
                                onChange={(e) => setCleanerName(e.target.value)}
                                className="bg-secondary/50 border-white/5 text-foreground"
                                autoFocus
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Notes (Optional)</Label>
                              <Textarea 
                                placeholder="Any extra info (e.g. availability, travel)..." 
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="bg-secondary/50 border-white/5 min-h-[80px] text-foreground"
                              />
                            </div>
                            <DialogFooter>
                              <Button type="submit" disabled={isSubmitting} className="w-full cover-gradient text-white">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Submit Response
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 pt-2">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {post.description}
                    </p>
                  </CardContent>
                  <CardFooter className="bg-white/[0.02] border-t border-white/5 p-4 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest">
                    <span>Posted {new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Expires {new Date(post.deadline).toLocaleString()}
                    </div>
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
