"use client";

import React from 'react';
import { Gift } from 'lucide-react';
import { useAppContext } from '../AppContext';

export default function RedeemModal({ item, onClose, onConfirm }) {
  const { t, lang } = useAppContext();

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl p-6 text-center animate-in zoom-in-95">
        <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-100">
          <Gift className="w-10 h-10 text-yellow-500" />
        </div>
        <h3 className="text-2xl font-bold mb-2 text-slate-800">{t.redeemConfirmTitle}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">{t.redeemConfirmQ} <strong className="text-green-700 px-1">{item[lang].title}</strong> {t.redeemConfirmSub} <strong className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md mx-1">{item.cost} {t.pts}</strong>؟</p>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors">{t.cancel}</button>
          <button onClick={onConfirm} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors">{t.yesRedeem}</button>
        </div>
      </div>
    </div>
  );
}