"use client"

import * as React from "react"
import { useState } from "react"
import { Plus, Trash2, Send, CalendarIcon, Building2, User, Package } from "lucide-react"
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

interface OrderItem {
  id: string
  name: string
  quantity: number
}

const SITES = [
  "ANNE MCLAREN",
  "CEDAR",
  "MRC EPIDEMIOLOGY LEVEL 3",
  "WBIC RPU BASEMENT",
  "JOHN VAN GEEST - JVG",
  "HERSCHEL SMITH BUILDING - HSB",
  "BARTON HOUSE",
  "COTON HOUSE",
  "CLINICAL SCHOOLS",
  "GRANTCHESTER HOUSE",
  "BAY 13",
  "WEST FORVIE",
  "CLIFFORD ALLBUTT BUILDING - CAB",
  "ISLAND RESEARCH BUILDING - IRB",
  "OBS",
  "PAEDIATRICS LEVEL 8",
  "SURGERY LEVEL 9",
  "X RAY BLOCK RADIOLOGY LEVEL 5",
  "JEFFREY CHEAH OFFICE",
  "EAST FORVIE (IPH)",
  "STRAGEWAYS (SLR)",
  "MEDICINE LEVEL 5",
  "IMS LEVELS 4 & 5",
  "OLD IMS - LAB BLOCK 4",
  "NEURO SPACE",
  "P&A LEVEL 4",
  "WOLFSON BRAIN WBIC",
  "BIO-REPOSITORY LAB LEVEL 1",
  "ACCI LEVEL 6",
  "POST DOC",
  "HLRI BUILDING",
  "MRC WATERBEACH STORAGE",
  "TMS F&G LEVEL 2",
  "E7"
]

export function StockOrderForm() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [date, setDate] = useState<Date>()
  const [needStoresDelivered, setNeedStoresDelivered] = useState(false)
  const [takenFromClinicalSchool, setTakenFromClinicalSchool] = useState(false)
  const [items, setItems] = useState<OrderItem[]>([
    { id: Math.random().toString(36).substr(2, 9), name: "", quantity: 1 }
  ])

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: "", quantity: 1 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleWhatsAppSubmit = () => {
    if (!name || !site || !date) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in your name, select a date, and choose a site."
      })
      return
    }

    const dateStr = format(date, "yyyy-MM-dd")
    const phone = "447000000000"
    
    let message = `Stock Order\nName: ${name}\nDate: ${dateStr}\nSite: ${site}\n\n`
    
    message += `Delivery Details:\n`
    message += `- Need stores delivered: ${needStoresDelivered ? "Yes" : "No"}\n`
    message += `- Taken from Clinical school stores: ${takenFromClinicalSchool ? "Yes" : "No"}\n\n`
    
    message += `Items:\n`
    
    items.forEach((item) => {
      if (item.name && item.quantity) {
        message += `- ${item.name}: ${item.quantity}\n`
      }
    })

    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${phone}?text=${encodedMessage}`
    
    window.open(url, '_blank')
    
    toast({
      title: "Opening WhatsApp",
      description: "Redirecting to dispatch your order."
    })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="glass-panel overflow-hidden border-none shadow-2xl">
        <CardHeader className="border-b border-white/5 bg-white/[0.02]">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Package className="w-6 h-6 text-primary" />
            Stock Order Form
          </CardTitle>
          <CardDescription>Fill out the details below to prepare your order.</CardDescription>
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
                <div key={item.id} className="flex gap-3">
                  <div className="flex-1">
                    <Input 
                      placeholder="Item (e.g. Hand towels)" 
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
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-center">
          <Button 
            onClick={handleWhatsAppSubmit}
            className="portal-gradient text-white font-semibold gap-2 px-12 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,118,245,0.3)] w-full sm:w-auto"
          >
            <Send className="w-5 h-5" /> Send via WhatsApp
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
