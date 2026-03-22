"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { useCollection, useFirestore, useUser, useAuth, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login"
import { format } from "date-fns"
import { CheckCircle2, Clock, Building2, Loader2, ListTodo, Timer, MessageSquare, XCircle, Package, Hammer, AlertTriangle, UserPlus, ShieldAlert, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/language-context"

/**
 * Calculates the next working day (Mon-Fri) at 12:00 PM
 */
const getNextWorkingDay12pm = (createdAt: string) => {
  const date = new Date(createdAt);
  const target = new Date(date);
  
  // Move to at least the next day
  target.setDate(target.getDate() + 1);
  
  // Skip weekends (0 = Sunday, 6 = Saturday)
  while (target.getDay() === 0 || target.getDay() === 6) {
    target.setDate(target.getDate() + 1);
  }
  
  target.setHours(12, 0, 0, 0);
  return target;
};

function CountdownTimer({ createdAt, status, colorClass }: { createdAt: string, status?: string, colorClass: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const { t } = useLanguage();
  const targetDate = React.useMemo(() => getNextWorkingDay12pm(createdAt), [createdAt]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(t.status.underReview);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate, t.status.underReview]);

  if (!timeLeft) return <span className="opacity-20">---</span>;

  const isUnderReview = timeLeft === t.status.underReview;
  const isInProgress = status === 'In Progress';

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded border",
      isInProgress ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
      isUnderReview ? "bg-green-500/10 text-green-400 border-green-500/20" :
      cn("bg-white/5 border-white/10", colorClass)
    )}>
      <Timer className={cn("w-3 h-3", isInProgress && "animate-spin")} />
      <span>{isInProgress ? t.status.processing : `${t.status.reviewIn} ${timeLeft}`}</span>
    </div>
  );
}

const getTaskMeta = (type: string) => {
  switch (type) {
    case 'Stock Order':
      return { icon: Package, color: 'text-[#6E76F5]', bg: 'bg-[#6E76F5]/10', border: 'border-[#6E76F5]/20' };
    case 'Faulty Equipment':
      return { icon: Hammer, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]/20' };
    case 'Incomplete Task':
      return { icon: AlertTriangle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]/20' };
    case 'Additional Hours':
      return { icon: Clock, color: 'text-[#D946EF]', bg: 'bg-[#D946EF]/10', border: 'border-[#D946EF]/20' };
    case 'Staff Referral':
      return { icon: UserPlus, color: 'text-[#FACC15]', bg: 'bg-[#FACC15]/10', border: 'border-[#FACC15]/20' };
    case 'Staff Concern':
      return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    default:
      return { icon: Clock, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' };
  }
}

export default function StatusBoardPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const { t } = useLanguage()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("portalflow_auth")
    if (savedAuth === "true") {
      setIsAuthorized(true)
    }
  }, [])

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, 'orderTasks'), orderBy('createdAt', 'desc'), limit(50))
  }, [db, user])

  const { data: allTasks, isLoading } = useCollection(tasksQuery)

  // Filter out Staff Concerns for non-managers
  const tasks = React.useMemo(() => {
    if (!allTasks) return null;
    return allTasks.filter(task => {
      if (task.type === 'Staff Concern') {
        return isAuthorized;
      }
      return true;
    });
  }, [allTasks, isAuthorized]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-headline status-text-gradient">{t.status.title}</h1>
            <p className="text-muted-foreground">{t.status.description}</p>
            {isAuthorized && (
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20 mt-2">
                <Lock className="w-3 h-3" />
                Management View Active
              </div>
            )}
          </div>

          {(isLoading || isUserLoading) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
              <p className="text-muted-foreground">{t.status.loading}</p>
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <Card className="glass-panel border-dashed py-20 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-secondary/50 p-4 rounded-full">
                  <ListTodo className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{t.status.noTasks}</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    {t.status.noTasksDesc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => {
                const meta = getTaskMeta(task.type);
                const Icon = meta.icon;

                return (
                  <Card key={task.id} className={cn("glass-panel overflow-hidden transition-all hover:border-white/20", meta.border)}>
                    <div className="p-5 flex flex-col gap-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            task.status === 'Completed' ? "bg-green-500/10" : 
                            task.status === 'In Progress' ? "bg-amber-500/10" :
                            task.status === 'Rejected' ? "bg-red-500/10" : meta.bg
                          )}>
                            {task.status === 'Completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : task.status === 'Rejected' ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <Icon className={cn("w-5 h-5", meta.color, (task.status === 'In Progress' || task.status === 'Pending Review') && "animate-pulse")} />
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">
                                {task.type === 'Staff Concern' ? 'Confidential Report' : task.title.split(':')[0]}
                              </span>
                              <Badge variant="outline" className={cn("text-[10px] uppercase tracking-tighter h-5", meta.border, meta.color)}>
                                {task.type}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 italic">
                                <Building2 className="w-3 h-3" />
                                {task.description.split('.')[0].replace('Site: ', '').replace('Reported by: ', '')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(new Date(task.createdAt), "HH:mm")}
                              </span>
                              {task.status !== 'Completed' && task.status !== 'Rejected' && (
                                <CountdownTimer createdAt={task.createdAt} status={task.status} colorClass={meta.color} />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <Badge className={cn(
                            "rounded-lg px-3 py-1 text-xs font-bold",
                            task.status === 'Completed' ? "bg-green-500/20 text-green-400 border-green-500/20" : 
                            task.status === 'In Progress' ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                            task.status === 'Rejected' ? "bg-red-500/20 text-red-400 border-red-500/20" :
                            cn(meta.bg, meta.color, meta.border)
                          )}>
                            {task.status}
                          </Badge>
                        </div>
                      </div>

                      {task.managerNote && (
                        <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/5 flex items-start gap-3">
                          <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{t.status.managerUpdate}</p>
                            <p className="text-sm text-muted-foreground italic leading-relaxed">
                              "{task.managerNote}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <CardFooter className="p-4 pt-2 border-t border-white/5 bg-white/[0.01] flex justify-between items-center text-[8px] text-muted-foreground uppercase tracking-[0.2em]">
                      <span>The Cleaners Cupboard</span>
                      <span>{format(new Date(task.createdAt), "yyyy")}</span>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
