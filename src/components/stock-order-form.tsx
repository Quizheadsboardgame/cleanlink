
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, Send, CalendarIcon, Building2, User, Package, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc, collection, serverTimestamp } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"

interface OrderItem {
  id: string
  name: string
  quantity: number
  code?: string
}

const SITES = [
  "ANNE MCLAREN", "CEDAR", "MRC EPIDEMIOLOGY LEVEL 3", "WBIC RPU BASEMENT",
  "JOHN VAN GEEST - JVG", "HERSCHEL SMITH BUILDING - HSB", "BARTON HOUSE",
  "COTON HOUSE", "CLINICAL SCHOOLS", "GRANTCHESTER HOUSE", "BAY 13",
  "WEST FORVIE", "CLIFFORD ALLBUTT BUILDING - CAB", "ISLAND RESEARCH BUILDING - IRB",
  "OBS", "PAEDIATRICS LEVEL 8", "SURGERY LEVEL 9", "X RAY BLOCK RADIOLOGY LEVEL 5",
  "JEFFREY CHEAH OFFICE", "EAST FORVIE (IPH)", "STRAGEWAYS (SLR)",
  "MEDICINE LEVEL 5", "IMS LEVELS 4 & 5", "OLD IMS - LAB BLOCK 4",
  "NEURO SPACE", "P&A LEVEL 4", "WOLFSON BRAIN WBIC", "BIO-REPOSITORY LAB LEVEL 1",
  "ACCI LEVEL 6", "POST DOC", "HLRI BUILDING", "MRC WATERBEACH STORAGE",
  "TMS F&G LEVEL 2", "E7"
]

export function StockOrderForm() {
  const { toast } = useToast()
  const router = useRouter()
  const db = useFirestore()
  const auth = useAuth()
  const { user, isUserLoading } = useUser()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [date, setDate] = useState<Date>()
  const [needStoresDelivered, setNeedStoresDelivered] = useState(false)
  const [takenFromClinicalSchool, setTakenFromClinicalSchool] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([
    { id: Math.random().toString(36).substr(2, 9), name: "", quantity: 1, code: "" }
  ])

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: "", quantity: 1, code: "" }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleSubmit = () => {
    if (!user) {
      toast({ variant: "destructive", title: "Wait a moment", description: "Authenticating..." })
      return
    }

    if (!name || !site || !date) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in your name, select a date, and choose a site."
      })
      return
    }

    setIsSubmitting(true)

    const stockOrderId = Math.random().toString(36).substr(2, 9)
    const orderRef = doc(db, 'users', user.uid, 'stockOrders', stockOrderId)
    const taskRef = doc(db, 'orderTasks', stockOrderId)

    const orderData = {
      id: stockOrderId,
      customerName: name,
      orderDate: date.toISOString(),
      site: site,
      status: 'Submitted',
      ownerId: user.uid,
      needStoresDelivered,
      takenFromClinicalSchool,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save main order
    setDocumentNonBlocking(orderRef, orderData, { merge: true })

    // Save individual items
    items.forEach(item => {
      if (item.name && item.quantity) {
        const itemRef = doc(db, 'users', user.uid, 'stockOrders', stockOrderId, 'orderItems', item.id)
        setDocumentNonBlocking(itemRef, {
          ...item,
          stockOrderId,
          ownerId: user.uid
        }, { merge: true })
      }
    })

    // Create a review task
    const taskData = {
      id: stockOrderId,
      stockOrderId: stockOrderId,
      title: `Process Stock Order for ${name}`,
      description: `Site: ${site}. Delivered: ${needStoresDelivered ? "Yes" : "No"}. Stores: ${takenFromClinicalSchool ? "Yes" : "No"}.`,
      status: 'Pending Review',
      ownerId: user.uid,
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: "Order Submitted",
      description: "Your stock order has been saved and queued for review."
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
            <Package className="w-6 h-6 text-primary" />
            Stock Order Form
          </CardTitle>
          <CardDescription>Fill out the details below to submit your order.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> Name
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
                <CalendarIcon className="w-4 h-4" /> Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-secondary/50 border-white/5",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-white/10" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="bg-card"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
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

            <div className="grid gap-4 pt-2">
              <div className="flex items-start space-x-3 bg-secondary/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-secondary/30">
                <Checkbox 
                  id="delivered" 
                  checked={needStoresDelivered}
                  onCheckedChange={(checked) => setNeedStoresDelivered(!!checked)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="delivered"
                    className="text-sm font-medium cursor-pointer leading-tight"
                  >
                    Need stores delivered
                  </Label>
                  <p className="text-xs text-muted-foreground italic">
                    Please note stores can take 3 working days to be delivered
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-secondary/20 p-3 rounded-lg border border-white/5 transition-colors hover:bg-secondary/30">
                <Checkbox 
                  id="clinical" 
                  checked={takenFromClinicalSchool}
                  onCheckedChange={(checked) => setTakenFromClinicalSchool(!!checked)}
                />
                <Label
                  htmlFor="clinical"
                  className="text-sm font-medium cursor-pointer"
                >
                  Taken from Clinical school stores
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-headline">Items</Label>
              <Button 
                onClick={addItem} 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/20 hover:bg-primary/10 text-primary"
              >
                <Plus className="w-4 h-4" /> Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-secondary/10 rounded-lg border border-white/5">
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder="Item Name" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                    <div className="w-24">
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Qty"
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder="Code (optional)" 
                        value={item.code}
                        onChange={(e) => updateItem(item.id, "code", e.target.value)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isUserLoading}
            className="portal-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,118,245,0.3)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Submit Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
