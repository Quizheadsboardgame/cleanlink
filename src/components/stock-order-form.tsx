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
    if (!name || !site || !date || items.some(i => !i.name || i.quantity < 1)) {
      toast({
        variant: "destructive",
        title: "Incomplete Order",
        description: "Please fill in all order details before submitting."
      })
      return
    }

    const dateStr = format(date, "yyyy-MM-dd")
    const phone = "447000000000" // Replace with your target number
    
    let message = `Stock Order\n`
    message += `Name: ${name}\n`
    message += `Date: ${dateStr}\n`
    message += `Site: ${site}\n\n`
    message += `Items:\n`
    
    items.forEach((item) => {
      if (item.name && item.quantity) {
        message += `- ${item.name}: ${item.quantity}\n`
      }
    })

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    
    toast({
      title: "Opening WhatsApp",
      description: "Your order details have been prepared for sending."
    })
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="glass-panel overflow-hidden border-none shadow-2xl animate-fade-in">
          <CardHeader className="border-b border-white/5 bg-white/[0.02]">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              Stock Order Form
            </CardTitle>
            <CardDescription>Enter order details and dispatch via WhatsApp.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" /> Full Name
                </Label>
                <Input 
                  placeholder="e.g. John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/50 border-white/5 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" /> Order Date
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

            <div className="space-y-2">
              <Label className="text-muted-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Target Site
              </Label>
              <Select onValueChange={setSite}>
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

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-headline">Order Items</Label>
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
                {items.map((item, index) => (
                  <div key={item.id} className="flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
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
          <CardFooter className="p-6 bg-white/[0.02] border-t border-white/5 flex justify-end">
            <Button 
              onClick={handleWhatsAppSubmit}
              className="portal-gradient text-white font-semibold gap-2 px-8 py-6 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(110,118,245,0.3)]"
            >
              <Send className="w-5 h-5" /> Send via WhatsApp
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="glass-panel border-none animate-fade-in delay-100">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Order Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-xs font-mono whitespace-pre-wrap leading-relaxed">
               <span className="text-accent">Stock Order</span>{"\n"}
               Name: {name || "..."}{"\n"}
               Date: {date ? format(date, "yyyy-MM-dd") : "..."}{"\n"}
               Site: {site || "..."}{"\n\n"}
               Items:{"\n"}
               {items.filter(i => i.name).map((i, idx) => (
                 <div key={idx}>- {i.name}: {i.quantity}</div>
               ))}
               {items.filter(i => i.name).length === 0 && "..."}
             </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-none overflow-hidden animate-fade-in delay-200">
          <div className="portal-gradient p-6 text-white">
            <h3 className="text-xl font-bold font-headline mb-2">Fleet Management</h3>
            <p className="text-sm opacity-80 mb-6">Your site selection is now updated with the latest campus locations.</p>
            <div className="flex items-center gap-2 text-xs bg-white/10 rounded-lg p-2 backdrop-blur-sm">
              <Building2 className="w-4 h-4" />
              <span>{SITES.length} Locations Configured</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
