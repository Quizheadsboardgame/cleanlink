
"use client"

import React, { useState, useEffect } from "react"
import { AlertCircle, Megaphone } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useManagerContext } from "@/context/manager-context"
import { useFirestore, useCollection, useMemoFirebase, useUser, useAuth, initiateAnonymousSignIn } from "@/firebase"
import { collection, query, where, limit } from "firebase/firestore"

export function ScrollingBanner() {
  const { t } = useLanguage()
  const { managerId } = useManagerContext()
  const { user, isUserLoading } = useUser()
  const auth = useAuth()
  const db = useFirestore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ensure user is signed in to access alerts protected by security rules
  useEffect(() => {
    if (!isUserLoading && !user && mounted) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth, mounted])
  
  const alertQuery = useMemoFirebase(() => {
    // Only query if DB and USER are ready
    if (!db || !user) return null
    
    // If we have a linked manager, show their alert. Otherwise generic.
    const currentM = managerId || "generic"
    return query(
      collection(db, 'systemAlerts'), 
      where('active', '==', true), 
      where('managerId', '==', currentM), 
      limit(1)
    )
  }, [db, managerId, user])

  const { data: alerts } = useCollection(alertQuery)
  
  const activeAlert = alerts && alerts.length > 0 ? alerts[0].message : t.common.emergency

  if (!mounted) {
    return (
      <div className="w-full bg-white border-b border-black/10 py-2 overflow-hidden whitespace-nowrap sticky top-0 z-[60] backdrop-blur-sm h-[37px]">
        {/* Placeholder to prevent layout shift */}
      </div>
    )
  }

  return (
    <div className="w-full bg-white border-b border-black/10 py-2 overflow-hidden whitespace-nowrap sticky top-0 z-[60] backdrop-blur-sm">
      <div className="inline-block animate-marquee flex items-center">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <span key={i} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-black px-8 uppercase tracking-wider">
            {alerts && alerts.length > 0 ? <Megaphone className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {activeAlert}
          </span>
        ))}
      </div>
    </div>
  )
}
