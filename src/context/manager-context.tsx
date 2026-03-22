"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';

interface ManagerContextType {
  managerId: string | null;
  setManagerId: (id: string) => void;
  isManagerLinked: boolean;
  isMounted: boolean;
}

const ManagerContext = createContext<ManagerContextType | undefined>(undefined);

export function ManagerProvider({ children }: { children: ReactNode }) {
  const [managerId, setManagerIdState] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsMounted(true);
    // 1. Check URL for manager ID (?m=xyz)
    const mParam = searchParams.get('m');
    if (mParam) {
      setManagerId(mParam);
      return;
    }

    // 2. Check LocalStorage for saved manager ID
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