"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { trans } from '@/lib/Translations';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ar');
  const [userProfile, setUserProfile] = useState(undefined);
  const [listings, setListings] = useState([]);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const router = useRouter();
  const pathname = usePathname();
  const t = trans[lang];
  const pollingRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/adv');
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const startPolling = () => {
    if (pollingRef.current) return;
    pollingRef.current = setInterval(() => {
      fetchData();
    }, 10000);
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      
      const storedUserId = sessionStorage.getItem('ecoloop_userId');
      if (storedUserId) {
        try {
          const res = await fetch(`/api/auth/otp?userId=${storedUserId}`);
          if (res.ok) {
            const userData = await res.json();
            setUserProfile(userData);
          } else {
            sessionStorage.removeItem('ecoloop_userId');
            setUserProfile(null);
          }
        } catch (err) {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };
    initAuth();

    return () => stopPolling();
  }, []);

  useEffect(() => {
    if (userProfile === undefined) return;

    if (userProfile) {
      fetchData();
      startPolling();
      if (pathname !== '/') {
        router.replace('/');
      }
    } else {
      stopPolling();
    }
  }, [userProfile]);

  const logout = async () => {
    stopPolling();
    try {
      if (auth) await signOut(auth);
    } catch (e) {
      console.error('Firebase logout error', e);
    }
    sessionStorage.removeItem('ecoloop_userId');
    setUserProfile(null);
    router.push('/');
  };

  return (
    <AppContext.Provider
      value={{
        lang, setLang, t,
        userProfile, setUserProfile,
        listings, setListings, fetchData,
        dismissedAlerts, setDismissedAlerts,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);