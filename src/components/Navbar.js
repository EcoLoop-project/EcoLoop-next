"use client";

import React, { useState, useEffect } from 'react';
import { Globe, Bell, User, LogOut, Loader2 } from 'lucide-react';
import { useAppContext } from './AppContext';
import NotificationModal from './modals/NotificationModal';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const { lang, setLang, userProfile, listings, dismissedAlerts, t } = useAppContext();
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Hide navbar on scroll down
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down (after 80px)
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } 
      // Show when scrolling up
      else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const myNotifications = userProfile?.role === 'household'
    ? listings.filter(l => l.authorId === userProfile._id && l.status === 'قيد الاستلام' && !dismissedAlerts.includes(l._id))
    : [];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (auth) await signOut(auth);
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
    sessionStorage.removeItem('ecoloop_userId');
    window.location.href = '/';
  };

  return (
    <>
      {showNotifModal && (
        <NotificationModal onClose={() => setShowNotifModal(false)} myNotifications={myNotifications} />
      )}
      <nav 
        className={`bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <img src="/pic/logo.png" alt="Logo" className="w-15 h-15 object-contain" />
              <span className="font-bold text-xl text-green-800 tracking-tight">{t.appTitle}</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="flex items-center text-slate-600 hover:text-green-700 font-bold bg-slate-100 hover:bg-green-50 px-3 py-1.5 rounded-full text-sm border border-slate-200 transition-colors"
              >
                <Globe className="w-4 h-4 me-1.5" /> {lang === 'ar' ? 'English' : 'عربي'}
              </button>

              {userProfile && userProfile.role === 'household' && (
                <button onClick={() => setShowNotifModal(true)} className="relative p-2 text-slate-500 hover:text-green-600 transition-colors">
                  <Bell className="w-6 h-6" />
                  {myNotifications.length > 0 && (
                    <span className="absolute top-0 end-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                      {myNotifications.length}
                    </span>
                  )}
                </button>
              )}

              {userProfile && (
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex flex-col items-end border-s ps-4 border-slate-200">
                    <div className="text-sm font-medium text-slate-600 flex items-center">
                      <User className="w-4 h-4 me-1 text-slate-400" /> {t.welcome}
                      <span className="font-bold ms-1 text-slate-800">{userProfile.name}</span>
                    </div>
                    <span dir="ltr" className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded mt-1 border border-slate-100">
                      {userProfile.phone}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="text-red-500 hover:text-red-700 font-medium text-sm flex items-center bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full border border-red-100 transition-colors"
                  >
                    {isLoggingOut ? <Loader2 className="w-4 h-4 me-1 animate-spin" /> : <LogOut className="w-4 h-4 me-1" />}
                    {isLoggingOut ? 'جاري الخروج...' : t.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}