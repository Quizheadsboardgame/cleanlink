
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
import { CheckCircle2, Clock, Building2, Loader2, ListTodo, Timer, MessageSquare, XCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

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

function CountdownTimer({ createdAt, status }: { createdAt: string, status?: string }) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const targetDate = React.useMemo(() => getNextWorkingDay12pm(createdAt), [createdAt]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Under review");
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
  }, [targetDate]);

  if (!timeLeft) return <span className="opacity-20">---</span>;

  const isUnderReview = timeLeft === "Under review";
  const isInProgress = status === 'In Progress';

  return (
    <div className={cn(
      "flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded border",
      isInProgress ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : 
      isUnderReview ? "bg-green-500/10 text-green-400 border-green-500/20" :
      "bg-cyan-500/5 text-cyan-400 border-cyan-500/10"
    )}>
      <Timer className={cn("w-3 h-3", isInProgress && "animate-spin")} />
      <span>{isInProgress ? "Currently Processing" : `Review in: ${timeLeft}`}</span>
    </div>
  );
}

export default function StatusBoardPage() {
  const { user, isUserLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth)
    }
  }, [user, isUserLoading, auth])

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, 'orderTasks'), orderBy('createdAt', 'desc'), limit(50))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection(tasksQuery)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold font-headline status-text-gradient">Public Status Board</h1>
            <p className="text-muted-foreground">Track the progress of all submitted orders and reports.</p>
          </div>

          {(isLoading || isUserLoading) ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              <p className="text-muted-foreground">Syncing status board...</p>
            </div>
          ) : !tasks || tasks.length === 0 ? (
            <Card className="glass-panel border-dashed py-20 text-center">
              <CardContent className="flex flex-col items-center gap-4">
                <div className="bg-secondary/50 p-4 rounded-full">
                  <ListTodo className="w-12 h-12 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">No active tasks</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    There are no submissions currently in the system.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task.id} className="glass-panel overflow-hidden transition-all hover:border-cyan-500/20">
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-3 rounded-xl",
                          task.status === 'Completed' ? "bg-green-500/10" : 
                          task.status === 'In Progress' ? "bg-amber-500/10" :
                          task.status === 'Rejected' ? "bg-red-500/10" : "bg-cyan-500/10"
                        )}>
                          {task.status === 'Completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : task.status === 'Rejected' ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : task.status === 'In Progress' ? (
                            <AlertCircle className="w-5 h-5 text-amber-400 animate-pulse" />
                          ) : (
                            <Clock className="w-5 h-5 text-cyan-400 animate-pulse" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg">{task.title.split(':')[0]}</span>
                            <Badge variant="outline" className="text-[10px] uppercase tracking-tighter h-5 border-white/10">
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
                              <CountdownTimer createdAt={task.createdAt} status={task.status} />
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
                          "bg-cyan-500/20 text-cyan-400 border-cyan-500/20"
                        )}>
                          {task.status}
                        </Badge>
                      </div>
                    </div>

                    {task.managerNote && (
                      <div className="mt-2 p-3 bg-primary/5 rounded-lg border border-primary/10 flex items-start gap-3">
                        <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Manager Update</p>
                          <p className="text-sm text-muted-foreground italic leading-relaxed">
                            "{task.managerNote}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
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
