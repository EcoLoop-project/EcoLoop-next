"use client";

import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAppContext } from '@/components/AppContext';
import AuthView from '@/components/AuthView';
import HouseholdView from '@/components/HouseholdView';
import CollectorView from '@/components/CollectorView';

export default function HomePage() {
  const context = useAppContext();

  
  if (!context) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500 p-4 text-center">
        <AlertTriangle className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">خطأ في الإعدادات (Missing Provider)</h2>
        <p className="text-slate-600">
          لم يتم العثور على <code>AppProvider</code>.<br/>
          يرجى التأكد من استبدال محتوى ملف <strong>src/app/layout.js</strong> ليتضمن الـ Provider.
        </p>
      </div>
    );
  }

  const { userProfile, lang, t } = context;

  
  if (userProfile === undefined) {
    return (
      <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-[70vh] flex flex-col items-center justify-center text-green-700">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <h2 className="text-xl font-bold">{t.loading}</h2>
      </div>
    );
  }

  
  if (userProfile === null) {
    return <AuthView />;
  }

  
  if (userProfile.role === 'household') {
    return <HouseholdView />;
  }

  
  if (userProfile.role === 'collector') {
    return <CollectorView />;
  }

  return null;
}