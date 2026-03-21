
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
  "North Campus Warehouse",
  "South Distribution Center",
  "Central Hub Plaza",
  "Eastern Logistics Park",
  "West Coast Station"
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

    const dateStr = format(date, "PPP")
    let message = `📦 *New Stock Order - PortalFlow*\n\n`
    message += `👤 *User:* ${name}\n`
    message += `📅 *Date:* ${dateStr}\n`
    message += `📍 *Site:* ${site}\n\n`
    message += `📝 *Items:*\n`
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.quantity})\n`
    })

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
    
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
              New Stock Order
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
                  <SelectValue placeholder="Select warehouse or campus" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
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
                        placeholder="Item name" 
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        className="bg-secondary/30 border-white/5"
                      />
                    </div>
                    <div className="w-24">
                      <Input 
                        type="number" 
                        min="1" 
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
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
              <Send className="w-5 h-5" /> Submit via WhatsApp
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="glass-panel border-none animate-fade-in delay-100">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-white/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Package className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Order #PF-202{i}</p>
                  <p className="text-xs text-muted-foreground">North Warehouse • 12 Items</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-accent">Pending</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel border-none overflow-hidden animate-fade-in delay-200">
          <div className="portal-gradient p-6 text-white">
            <h3 className="text-xl font-bold font-headline mb-2">Pro Analytics</h3>
            <p className="text-sm opacity-80 mb-6">Track your logistics performance across all sites in real-time.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-xs opacity-70">Deliveries</p>
                <p className="text-2xl font-bold">124</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-xs opacity-70">Efficiency</p>
                <p className="text-2xl font-bold">98%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
