"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Trash2, Send, CalendarIcon, Building2, User, Package, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useFirestore, useUser, useAuth } from "@/firebase"
import { doc } from "firebase/firestore"
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"

interface OrderItem {
  id: string
  name: string
  quantity: number
  code?: string
}

export const SITES = [
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
  const { t } = useLanguage()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [dateStr, setDateStr] = useState("")
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
      toast({ variant: "destructive", title: t.common.wait, description: t.common.auth })
      return
    }

    if (!name || !site || !dateStr) {
      toast({
        variant: "destructive",
        title: t.common.missingInfo,
        description: t.stores.missingFields
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
      orderDate: new Date(dateStr).toISOString(),
      site: site,
      status: 'Submitted',
      ownerId: user.uid,
      needStoresDelivered,
      takenFromClinicalSchool,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setDocumentNonBlocking(orderRef, orderData, { merge: true })

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

    const taskData = {
      id: stockOrderId,
      stockOrderId: stockOrderId,
      title: `Stock Order: ${name}`,
      description: `Site: ${site}. Delivered: ${needStoresDelivered ? "Yes" : "No"}. Stores: ${takenFromClinicalSchool ? "Yes" : "No"}.`,
      status: 'Pending Review',
      ownerId: user.uid,
      type: 'Stock Order',
      createdAt: new Date().toISOString()
    }
    setDocumentNonBlocking(taskRef, taskData, { merge: true })

    toast({
      title: t.stores.successTitle,
      description: t.stores.successDesc
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
            {t.stores.title}
          </CardTitle>
          <CardDescription>{t.stores.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" /> {t.stores.nameLabel}
              </Label>
              <Input 
                placeholder={t.stores.namePlaceholder} 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-secondary/50 border-white/5 focus:border-primary/50 text-white w-full"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> {t.stores.dateLabel}
              </Label>
              <Input 
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="h-12 bg-secondary/50 border-white/5 focus:border-primary/50 text-white w-full appearance-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {t.stores.siteLabel}
              </Label>
              <Select onValueChange={setSite} value={site}>
                <SelectTrigger className="h-12 bg-secondary/50 border-white/5 text-white">
                  <SelectValue placeholder={t.stores.sitePlaceholder} />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 max-h-[300px] text-white">
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
                    className="text-sm font-medium cursor-pointer leading-tight text-white"
                  >
                    {t.stores.deliveredLabel}
                  </Label>
                  <p className="text-xs text-muted-foreground italic">
                    {t.stores.deliveredSub}
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
                  className="text-sm font-medium cursor-pointer text-white"
                >
                  {t.stores.clinicalLabel}
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-headline text-white">{t.stores.itemsTitle}</Label>
              <Button 
                onClick={addItem} 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary/20 hover:bg-primary/10 text-primary"
              >
                <Plus className="w-4 h-4" /> {t.stores.addItem}
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 p-3 bg-secondary/10 rounded-lg border border-white/5">
                  <div className="flex-1 flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder={t.stores.itemNamePlaceholder} 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        className="bg-secondary/30 border-white/5 text-white"
                      />
                    </div>
                    <div className="w-24">
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder={t.stores.qtyPlaceholder}
                        value={item.quantity || ""}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        className="bg-secondary/30 border-white/5 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input 
                        placeholder={t.stores.codePlaceholder} 
                        value={item.code}
                        onChange={(e) => updateItem(item.id, "code", e.target.value)}
                        className="bg-secondary/30 border-white/5 text-white"
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
            className="stores-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,118,245,0.3)] w-full sm:w-auto"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {t.stores.submit}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
