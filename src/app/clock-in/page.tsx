
"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useFirestore, useUser, useAuth, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, doc, limit, orderBy } from "firebase/firestore"
import { setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Clock, MapPin, Play, Square, Map as MapIcon, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"
import { format } from "date-fns"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// Helper to calculate distance between two GPS coordinates in metres
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth's radius in metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function ClockingPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { toast } = useToast()
  const { t } = useLanguage()
  const { managerId } = useManagerContext()

  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [user, isUserLoading, auth])

  // Get current location
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geolocation error:", err),
        { enableHighAccuracy: true }
      )
    }
  }, [])

  const activeQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, 'clockLogs'),
      where('ownerId', '==', user.uid),
      where('status', '==', 'Active'),
      limit(1)
    )
  }, [db, user])

  const { data: activeLogs, isLoading: isLogLoading } = useCollection(activeQuery)
  const activeLog = activeLogs && activeLogs.length > 0 ? activeLogs[0] : null

  const handleClockIn = () => {
    if (!name || !site) {
      toast({ variant: "destructive", title: t.common.error, description: "Please enter your name and site." })
      return
    }
    if (!coords) {
      toast({ variant: "destructive", title: "Location Error", description: t.clocking.locationRequired })
      return
    }

    setIsProcessing(true)
    const logId = Math.random().toString(36).substr(2, 9)
    const logRef = doc(db, 'clockLogs', logId)

    setDocumentNonBlocking(logRef, {
      id: logId,
      cleanerName: name,
      site: site,
      clockInTime: new Date().toISOString(),
      inLocation: coords,
      status: 'Active',
      ownerId: user?.uid || "anonymous",
      managerId: managerId || "generic",
      createdAt: new Date().toISOString()
    }, { merge: true })

    toast({ title: t.clocking.successClockIn })
    setIsProcessing(false)
  }

  const handleClockOut = () => {
    if (!activeLog) return
    if (!coords) {
      toast({ variant: "destructive", title: "Location Error", description: t.clocking.locationRequired })
      return
    }

    const distance = getDistance(
      activeLog.inLocation.lat, activeLog.inLocation.lng,
      coords.lat, coords.lng
    )

    if (distance > 10) {
      toast({ 
        variant: "destructive", 
        title: "Out of Range", 
        description: `${t.clocking.outOfRange} (Current distance: ${Math.round(distance)}m)` 
      })
      return
    }

    setIsProcessing(true)
    const logRef = doc(db, 'clockLogs', activeLog.id)
    updateDocumentNonBlocking(logRef, {
      clockOutTime: new Date().toISOString(),
      outLocation: coords,
      status: 'Completed'
    })

    toast({ title: t.clocking.successClockOut })
    setIsProcessing(false)
  }

  if (!mounted) return <div className="min-h-screen bg-background" />

  const duration = activeLog 
    ? Math.floor((currentTime.getTime() - new Date(activeLog.clockInTime).getTime()) / 1000)
    : 0
  const formatDuration = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${h}h ${m}m ${sec}s`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-2xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold font-headline portal-text-gradient tracking-tighter">
              {t.clocking.title}
            </h1>
            <p className="text-muted-foreground">{t.clocking.description}</p>
          </div>

          {(isLogLoading || isUserLoading) ? (
            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
          ) : activeLog ? (
            <Card className="glass-panel border-green-500/20 overflow-hidden animate-in fade-in zoom-in duration-500">
              <CardHeader className="bg-green-500/10 border-b border-green-500/10 p-6">
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-500 text-white uppercase tracking-widest text-[10px]">
                    {t.clocking.activeSession}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                    <Clock className="w-3 h-3" />
                    {format(new Date(activeLog.clockInTime), "HH:mm:ss")}
                  </div>
                </div>
                <CardTitle className="text-3xl font-headline mt-4">{activeLog.site}</CardTitle>
                <CardDescription className="text-white/60">Staff: {activeLog.cleanerName}</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">{t.clocking.timer}</p>
                  <div className="text-5xl font-mono font-bold text-white tabular-nums">
                    {formatDuration(duration)}
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video relative group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps?q=${activeLog.inLocation.lat},${activeLog.inLocation.lng}&z=18&output=embed`}
                    allowFullScreen
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-primary" /> {t.clocking.mapPin}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="h-16 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-xl shadow-red-500/20 group">
                        <Square className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        {t.clocking.clockOut}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-panel border-none">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t.common.areYouSure}</AlertDialogTitle>
                        <AlertDialogDescription>{t.clocking.confirmClockOut}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-white/5 border-white/10">{t.common.cancel}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClockOut} className="bg-red-500 text-white hover:bg-red-600">
                          {t.common.confirm}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <p className="text-[10px] text-center text-muted-foreground italic">
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    {t.clocking.outOfRange}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-panel border-white/5 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary fill-primary" />
                  Start Shift
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t.common.name}</Label>
                    <Input 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-secondary/50 border-white/5 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">{t.common.site}</Label>
                    <Input 
                      placeholder="Enter site location" 
                      value={site}
                      onChange={(e) => setSite(e.target.value)}
                      className="bg-secondary/50 border-white/5 h-12"
                    />
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                  <MapIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong>Note:</strong> We will securely record your GPS location when you clock in. You must be in this location to clock out later.
                  </p>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button disabled={isProcessing} className="w-full h-16 rounded-2xl tasks-gradient text-white font-bold text-lg shadow-xl">
                      {isProcessing ? <Loader2 className="animate-spin" /> : <><Play className="w-5 h-5 mr-2" /> {t.clocking.clockIn}</>}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-panel border-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.common.areYouSure}</AlertDialogTitle>
                      <AlertDialogDescription>{t.clocking.confirmClockIn}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white/5 border-white/10">{t.common.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClockIn} className="tasks-gradient text-white">
                        {t.common.confirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
              <CardFooter className="bg-white/[0.02] border-t border-white/5 p-4 justify-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" /> System Ready
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
