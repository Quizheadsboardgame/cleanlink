"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

interface ManagerContextType {
  managerId: string | null;
  setManagerId: (id: string) => void;
  isManagerLinked: boolean;
  isManagerAuthorized: boolean;
  isMounted: boolean;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();
  const [managerId, setManagerIdState] = useState<string | null>(null);
  const [isManagerAuthorized, setIsManagerAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const resolveManager = async () => {
      setIsMounted(true);
      
      // 1. Check for logged-in manager session (takes priority)
      const authToken = sessionStorage.getItem("manager_auth_token");
      if (authToken) {
        setManagerIdState(authToken);
        setIsManagerAuthorized(true);
        return;
      }

      // 2. Check URL for manager identifier (?m=Site%20Supervisor)
      const mParam = searchParams.get('m');
      if (mParam && db) {
        try {
          // Resolve Display Name to the actual internal Key (managerId)
          // This keeps the Key secret and only exposes the public Name in the link
          const q = query(
            collection(db, 'managerKeys'),
            where('displayName', '==', decodeURIComponent(mParam)),
            limit(1)
          );
          const snap = await getDocs(q);
          
          if (!snap.empty) {
            const data = snap.docs[0].data();
            setManagerId(data.key); // Use the internal key for data siloing
            return;
          }
        } catch (err) {
          console.error("Failed to resolve manager name:", err);
        }
      }

      // 3. Check LocalStorage for saved internal ID (linked cleaner persistence)
      const saved = localStorage.getItem('cupboard_manager_id');
      if (saved) {
        setManagerIdState(saved);
      }
    };

    resolveManager();
  }, [searchParams, db]);

  const setManagerId = (id: string) => {
    setManagerIdState(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cupboard_manager_id', id);
    }
  };

  return (
    <ManagerContext.Provider value={{ 
      managerId, 
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
