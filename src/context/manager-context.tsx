
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface ManagerContextType {
  managerId: string | null;
  setManagerId: (id: string) => void;
  isManagerLinked: boolean;
  isManagerAuthorized: boolean;
  isMounted: boolean;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const [managerId, setManagerIdState] = useState<string | null>(null);
  const [isManagerAuthorized, setIsManagerAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    
    // 1. Check for logged-in manager session
    const authToken = sessionStorage.getItem("manager_auth_token");
    if (authToken) {
      setManagerIdState(authToken);
      setIsManagerAuthorized(true);
      return;
    }

    // 2. Check URL for manager ID (?m=xyz)
    const mParam = searchParams.get('m');
    if (mParam) {
      setManagerId(mParam);
      return;
    }

    // 3. Check LocalStorage for saved manager ID (linked cleaner)
    const saved = localStorage.getItem('cupboard_manager_id');
    if (saved) {
      setManagerIdState(saved);
    }
  }, [searchParams]);

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
