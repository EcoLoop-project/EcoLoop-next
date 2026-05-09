"use client";

import React from 'react';
import { useAppContext } from '../AppContext';

export default function ImpactModal({ data, onClose }) {
  const { t, lang } = useAppContext();

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-8 text-center relative">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-full shadow-xl border-4 border-slate-50">{data.iconBig}</div>
        <div className="mt-8 mb-6">
          <h3 className="text-2xl font-black text-slate-800 mb-2">{data.impact[lang].title}</h3>
          <p className="text-slate-600 leading-relaxed text-lg">{data.impact[lang].text}</p>
          <div className="mt-4 text-green-700 font-bold bg-green-50 py-1.5 px-4 rounded-full inline-block text-sm border border-green-200">
            {lang === 'ar' ? 'سيتم إضافة 15 نقطة لحسابك عند الاستلام' : '15 pts will be added to your account once collected'}
          </div>
        </div>
        <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors">{t.keepGiving}</button>
      </div>
    </div>
  );
}57