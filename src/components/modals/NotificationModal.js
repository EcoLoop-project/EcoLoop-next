"use client";

import React from 'react';
import { Bell, X, Phone } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { wasteCategories } from '@/lib/constants';

export default function NotificationModal({ onClose, myNotifications }) {
  const { t, lang, dismissedAlerts, setDismissedAlerts } = useAppContext();

  const getCategoryName = (id) => {
    const cat = wasteCategories.find(c => c.id === id);
    return cat ? cat[lang] : id;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[80] flex justify-center p-4 sm:p-6 items-start sm:pt-24" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-top-10" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg text-slate-800 flex items-center">
            <Bell className="w-5 h-5 me-2 text-orange-500" /> {t.notifications}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
            {myNotifications.length === 0 ? (
              <p className="text-center text-slate-500 py-6">{t.noNotifications}</p>
            ) : (
              myNotifications.map(item => (
                <div key={item._id} className="bg-orange-50 border border-orange-200 rounded-xl p-4 relative shadow-sm">
                  <button onClick={() => setDismissedAlerts([...dismissedAlerts, item._id])} className="absolute top-2 end-2 text-orange-400 hover:bg-orange-100 rounded-full p-1 transition-colors">
                    <X className="w-4 h-4"/>
                  </button>
                  <p className="text-sm text-orange-900 leading-relaxed pe-6">
                    <strong className="font-bold">{item.collectorName}</strong> {t.collRes2} ({getCategoryName(item.type)}) {t.collRes3}
                  </p>
                  <div className="mt-3 bg-white p-2 rounded-lg border border-orange-100 flex items-center w-fit">
                    <Phone className="w-3 h-3 text-orange-600 me-2 shrink-0" />
                    <span dir="ltr" className="font-mono text-sm font-bold text-orange-700 tracking-wide">{item.collectorPhone}</span>
                  </div>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
}