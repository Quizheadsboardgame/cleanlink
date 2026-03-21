
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useMemoFirebase } from "@/firebase"
import { collection, query, doc, orderBy } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, Mail, User, Info, Plus, Trash2, Loader2, ShieldCheck, Edit2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ImportantInfoPage() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  
  // Form state
  const [category, setCategory] = useState("Management")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("portalflow_auth")
    if (auth === "true") {
      setIsAuthorized(true)
    }
  }, [])

  const infoQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, 'importantInfo'), orderBy('category', 'asc'))
  }, [db])

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
            <div className="space-y-1">
              <h1 className="text-3xl font-bold font-headline portal-text-gradient">Important Information</h1>
              <p className="text-muted-foreground">Management contacts and essential procedures.</p>
            </div>
            
            {isAuthorized && (
              <Dialog open={isAdding} onOpenChange={setIsAdding}>
                <DialogTrigger asChild>
                  <Button className="portal-gradient text-white gap-2 rounded-xl shadow-lg">
                    <Plus className="w-4 h-4" /> Add Information
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-panel border-none">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">New Information Entry</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select onValueChange={setCategory} defaultValue={category}>
                        <SelectTrigger className="bg-secondary/50 border-white/5">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-white/10">
                          <SelectItem value="Management">Management Contacts</SelectItem>
                          <SelectItem value="Procedures">Standard Procedures</SelectItem>
                          <SelectItem value="Announcements">Announcements</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input 
                        placeholder="e.g. Area Manager - Jane Doe" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-secondary/50 border-white/5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content / Details</Label>
                      <Textarea 
                        placeholder="Enter contact details or instruction text..." 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="bg-secondary/50 border-white/5 min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting} className="w-full portal-gradient text-white">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Save Information
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-muted-foreground">Retrieving information...</p>
            </div>
          ) : !infoItems || infoItems.length === 0 ? (
            <Card className="glass-panel border-dashed py-16 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <Info className="w-12 h-12 text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No information entries yet</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    {isAuthorized ? "Start by adding contact details for the management team." : "There is no information to display at this time."}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {["Management", "Procedures", "Announcements"].map((cat) => {
                const items = infoItems.filter(i => i.category === cat)
                if (items.length === 0) return null
                
                return (
                  <div key={cat} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-wider px-3 py-1">
                        {cat}
                      </Badge>
                      <div className="h-px flex-1 bg-white/5" />
                    </div>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      {items.map((item) => (
                        <Card key={item.id} className="glass-panel border-white/5 transition-all hover:border-primary/20">
                          <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-lg font-headline flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                {cat === 'Management' ? <ShieldCheck className="w-4 h-4 text-primary" /> : <Info className="w-4 h-4 text-primary" />}
                                {item.title}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-5 pt-2 whitespace-pre-wrap text-sm text-muted-foreground leading-relaxed">
                            {item.content}
                          </CardContent>
                          <CardFooter className="p-4 pt-0 border-t border-white/5 mt-auto flex justify-end text-[10px] text-white/20 italic">
                            Updated {new Date(item.updatedAt).toLocaleDateString()}
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

      <footer className="border-t border-white/5 py-8 mt-auto">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-headline portal-text-gradient">PortalFlow</span>
            <span className="text-xs text-muted-foreground">© 2024 Stock Management</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
