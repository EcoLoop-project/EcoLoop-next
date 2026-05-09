"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function CancelModal({ onClose, onConfirm }) {
  const { t } = useAppContext();

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-8 text-center animate-in zoom-in-95 border border-white">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-3 text-slate-800">{t.cancelRes}</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">{t.confirmCancelRes}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-colors">{t.cancel}</button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-700 transition-colors">{t.yesCancel}</button>
        </div>
      </div>
    </div>
  );
}