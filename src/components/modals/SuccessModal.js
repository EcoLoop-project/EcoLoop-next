"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function SuccessModal({ onClose }) {
  const { t } = useAppContext();

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl p-8 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-100">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">تهانينا!</h3>
        <p className="text-slate-600 leading-relaxed mb-8">{t.redeemSuccess}</p>
        <button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors">{t.okay}</button>
      </div>
    </div>
  );
}