"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs, onSnapshot } from 'firebase/firestore';

interface EnabledModules {
  stores?: boolean;
  faulty?: boolean;
  incomplete?: boolean;
  hours?: boolean;
  pay?: boolean;
  referral?: boolean;
  cover?: boolean;
  kudos?: boolean;
  concern?: boolean;
  info?: boolean;
  guide?: boolean;
}

interface ManagerContextType {
  managerId: string | null;
  managerName: string | null;
  enabledModules: EnabledModules | null;
  setManagerId: (id: string, name: string, expiry?: number) => void;
  isManagerLinked: boolean;
  isManagerAuthorized: boolean;
  isMounted: boolean;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();
  const [managerId, setManagerIdState] = useState<string | null>(null);
  const [managerName, setManagerNameState] = useState<string | null>(null);
  const [enabledModules, setEnabledModules] = useState<EnabledModules | null>(null);
  const [isManagerAuthorized, setIsManagerAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const hasResolved = useRef(false);

  useEffect(() => {
    if (!managerId || !db) return;

    const q = query(collection(db, 'managerKeys'), where('key', '==', managerId), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs[0].data();
        setEnabledModules(data.enabledModules || null);
      }
    });

    return () => unsub();
  }, [managerId, db]);

  useEffect(() => {
    const resolveManager = async () => {
      if (hasResolved.current) return;
      setIsMounted(true);
      
      const authToken = sessionStorage.getItem("manager_auth_token");
      const authName = sessionStorage.getItem("manager_display_name");
      const expiry = sessionStorage.getItem("manager_expiry");

      if (authToken && expiry) {
        if (Date.now() < parseInt(expiry)) {
          setManagerIdState(authToken);
          setManagerNameState(authName || "Manager");
          setIsManagerAuthorized(true);
          hasResolved.current = true;
          return;
        } else {
          sessionStorage.clear();
        }
      }

      const mParam = searchParams.get('m');
      if (mParam && db) {
        try {
          const q = query(
            collection(db, 'managerKeys'),
            where('displayName', '==', decodeURIComponent(mParam)),
            limit(1)
          );
          const snap = await getDocs(q);
          
          if (!snap.empty) {
            const data = snap.docs[0].data();
            const midnight = new Date().setHours(23, 59, 59, 999);
            setManagerId(data.key, data.displayName, midnight); 
            hasResolved.current = true;
            return;
          }
        } catch (err) {
          console.error("Manager resolution failed:", err);
        }
      }

      const savedId = localStorage.getItem('cupboard_manager_id');
      const savedName = localStorage.getItem('cupboard_manager_name');
      if (savedId) {
        setManagerIdState(savedId);
        setManagerNameState(savedName || "Linked Manager");
      }
      hasResolved.current = true;
    };

    resolveManager();
  }, [searchParams, db]);

  const setManagerId = (id: string, name: string, expiry?: number) => {
    setManagerIdState(id);
    setManagerNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cupboard_manager_id', id);
      localStorage.setItem('cupboard_manager_name', name);
      if (expiry) {
        sessionStorage.setItem("manager_expiry", expiry.toString());
      }
    }
  };

  return (
    <ManagerContext.Provider value={{ 
      managerId, 
      managerName,
      enabledModules,
      setManagerId, 
      isManagerLinked: !!managerId,
      isManagerAuthorized,
      isMounted
    }}>
      {children}
    </ManagerContext.Provider>
  );
}

export function useManagerContext() {
  const context = useContext(ManagerContext);
  if (context === undefined) {
    throw new Error('useManagerContext must be used within a ManagerProvider');
  }
  return context;
}
