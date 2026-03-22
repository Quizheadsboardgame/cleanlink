"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

interface ManagerContextType {
  managerId: string | null;
  managerName: string | null;
  setManagerId: (id: string, name: string) => void;
  isManagerLinked: boolean;
  isManagerAuthorized: boolean;
  isMounted: boolean;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const db = useFirestore();
  const [managerId, setManagerIdState] = useState<string | null>(null);
  const [managerName, setManagerNameState] = useState<string | null>(null);
  const [isManagerAuthorized, setIsManagerAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();
  const hasResolved = useRef(false);

  useEffect(() => {
    const resolveManager = async () => {
      if (hasResolved.current) return;
      setIsMounted(true);
      
      // 1. Check for logged-in manager session (takes priority)
      const authToken = sessionStorage.getItem("manager_auth_token");
      const authName = sessionStorage.getItem("manager_display_name");
      if (authToken) {
        setManagerIdState(authToken);
        setManagerNameState(authName || "Manager");
        setIsManagerAuthorized(true);
        hasResolved.current = true;
        return;
      }

      // 2. Check URL for manager identifier (?m=Site%20Supervisor)
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
            setManagerId(data.key, data.displayName); 
            hasResolved.current = true;
            return;
          }
        } catch (err) {
          console.error("Manager resolution failed:", err);
        }
      }

      // 3. Check LocalStorage for saved internal ID
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

  const setManagerId = (id: string, name: string) => {
    setManagerIdState(id);
    setManagerNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cupboard_manager_id', id);
      localStorage.setItem('cupboard_manager_name', name);
    }
  };

  return (
    <ManagerContext.Provider value={{ 
      managerId, 
      managerName,
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
