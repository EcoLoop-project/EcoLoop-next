"use client";

import React, { useState } from 'react';
import { Edit, X, Map } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { wasteCategories } from '@/lib/constants';

export default function EditListingModal({ item, onClose, onSubmit }) {
  const { t, lang } = useAppContext();
  const [editingItem, setEditingItem] = useState(item);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          setEditingItem({ ...editingItem, address: editingItem.address ? `${editingItem.address}\n${mapsLink}` : mapsLink });
        },
        () => alert(t.locationError)
      );
    } else { alert(t.locationError); }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onSubmit(editingItem._id, { type: editingItem.type, quantity: editingItem.quantity, address: editingItem.address });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center"><Edit className="w-5 h-5 me-2 text-green-600" />{t.editListingTitle}</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{t.wasteType}</label>
            <select className="w-full rounded-xl border-slate-200 shadow-sm p-3 bg-slate-50 focus:bg-white transition-colors" value={editingItem.type} onChange={(e) => setEditingItem({...editingItem, type: e.target.value})}>
              {wasteCategories.map(cat => <option key={cat.id} value={cat.id}>{cat[lang]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">{t.quantity}</label>
            <input type="text" required className="w-full rounded-xl border-slate-200 shadow-sm p-3 bg-slate-50 focus:bg-white transition-colors" value={editingItem.quantity} onChange={(e) => setEditingItem({...editingItem, quantity: e.target.value})}/>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-bold text-slate-700">{t.address}</label>
              <button type="button" onClick={handleGetLocation} className="text-xs text-blue-600 hover:bg-blue-100 bg-blue-50 px-2 py-1 rounded-md flex items-center font-bold transition-colors"><Map className="w-3 h-3 me-1" />{t.getLocation}</button>
            </div>
            <textarea required rows="3" className="w-full rounded-xl border-slate-200 shadow-sm p-3 bg-slate-50 focus:bg-white resize-none transition-colors" value={editingItem.address} onChange={(e) => setEditingItem({...editingItem, address: e.target.value})}></textarea>
          </div>
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl mt-4 transition-colors">{t.saveChanges}</button>
        </form>
      </div>
    </div>
  );
}