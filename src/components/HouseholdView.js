"use client";

import React, { useState } from 'react';
import { Home, Plus, MapPin, Package, Loader2, Leaf, Map, Edit, Trash2, Gift, Star, Phone, User } from 'lucide-react';
import { useAppContext } from './AppContext';
import { wasteCategories, tipsData, rewardsData } from '@/lib/constants';
import EditListingModal from './modals/EditListingModal';
import ImpactModal from './modals/ImpactModal';
import RedeemModal from './modals/RedeemModal';
import SuccessModal from './modals/SuccessModal';

export default function HouseholdView() {
  const { t, lang, userProfile, setUserProfile, listings, fetchData } = useAppContext();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'plastic', quantity: '', address: '' });

  const [editModal, setEditModal] = useState({ isOpen: false, item: null });
  const [impactModal, setImpactModal] = useState({ isOpen: false, data: null });
  const [redeemModal, setRedeemModal] = useState({ isOpen: false, item: null });
  const [successModal, setSuccessModal] = useState(false);

  const myListings = listings.filter(l => l.authorId === userProfile?._id);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          setNewItem(prev => ({ ...prev, address: prev.address ? `${prev.address}\n${mapsLink}` : mapsLink }));
        },
        () => alert(t.locationError)
      );
    } else {
      alert(t.locationError);
    }
  };

  const handleAddListing = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch('/api/adv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          authorId: userProfile._id,
          authorName: userProfile.name,
          authorPhone: userProfile.phone,
        }),
      });
      if (res.ok) {
        const category = wasteCategories.find(c => c.id === newItem.type);
        setNewItem({ type: 'plastic', quantity: '', address: '' });
        await fetchData();
        const userRes = await fetch(`/api/auth/otp?userId=${userProfile._id}`);
        if (userRes.ok) {
          const updatedUser = await userRes.json();
          setUserProfile(updatedUser);
        }
        if (category) {
          setImpactModal({ isOpen: true, data: category });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditSubmit = async (id, data) => {
    try {
      await fetch(`/api/adv/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setEditModal({ isOpen: false, item: null });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return;
    try {
      await fetch(`/api/adv/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedeem = async () => {
    if (!redeemModal.item) return;
    if (userProfile.points < redeemModal.item.cost) {
      alert(t.insufficientPts);
      return;
    }

    const newPoints = userProfile.points - redeemModal.item.cost;

    try {
      const res = await fetch('/api/user/points', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userProfile._id,
          points: newPoints,
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUserProfile(updatedUser); 
        setRedeemModal({ isOpen: false, item: null });
        setSuccessModal(true);
      } else {
        alert('حدث خطأ أثناء استبدال النقاط، حاول مجدداً.');
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ في الاتصال.');
    }
  };

  const getCategoryName = (id) => {
    const cat = wasteCategories.find(c => c.id === id);
    return cat ? cat[lang] : id;
  };

  const getStatusStyle = (status) => {
    if (status === 'متاح') return 'bg-[#E7F5EC] text-[#3A7D5E] border-[#10B981]';
    if (status === 'قيد الاستلام') return 'bg-[#F5EFE6] text-[#3A7D5E] border-[#3A7D5E]';
    return 'bg-[#FCFAF7] text-[#2B3A2E] border-[#F5EFE6]';
  };

  const getStatusLabel = (status) => {
    if (status === 'متاح') return t.waiting;
    if (status === 'قيد الاستلام') return t.reserved;
    return status;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {editModal.isOpen && (
        <EditListingModal
          item={editModal.item}
          onClose={() => setEditModal({ isOpen: false, item: null })}
          onSubmit={handleEditSubmit}
        />
      )}

      {impactModal.isOpen && (
        <ImpactModal
          data={impactModal.data}
          onClose={() => setImpactModal({ isOpen: false, data: null })}
        />
      )}

      {redeemModal.isOpen && (
        <RedeemModal
          item={redeemModal.item}
          onClose={() => setRedeemModal({ isOpen: false, item: null })}
          onConfirm={handleRedeem}
        />
      )}

      {successModal && (
        <SuccessModal onClose={() => setSuccessModal(false)} />
      )}

      <div className="bg-[#3A7D5E] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-1 flex items-center">
              <Home className="w-8 h-8 me-3 text-[#E7F5EC]" />
              {t.housePortal}
            </h2>
            <p className="text-[#E7F5EC] text-sm">{t.housePortalDesc}</p>
          </div>
          <div className="flex items-center gap-3 bg-[#2B3A2E]/50 px-6 py-3 rounded-2xl border border-[#10B981]">
            <Star className="w-6 h-6 text-[#10B981]" />
            <div>
              <p className="text-xs text-[#E7F5EC] font-medium">{t.myPoints}</p>
              <p className="text-3xl font-black text-white">{userProfile?.points ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 end-0 opacity-10 pointer-events-none">
          <Leaf className="w-80 h-80" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#F5EFE6] w-fit shadow-sm gap-1">
        <button onClick={() => setActiveTab('dashboard')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'dashboard' ? 'bg-[#3A7D5E] text-white shadow-md' : 'text-[#2B3A2E] hover:bg-[#FCFAF7]'}`}>{t.dashboardTab}</button>
        <button onClick={() => setActiveTab('rewards')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'rewards' ? 'bg-[#10B981] text-white shadow-md' : 'text-[#2B3A2E] hover:bg-[#FCFAF7]'}`}>{t.rewardsTab}</button>
        <button onClick={() => setActiveTab('tips')} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'tips' ? 'bg-[#3A7D5E] text-white shadow-md' : 'text-[#2B3A2E] hover:bg-[#FCFAF7]'}`}>{t.tipsNav}</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-white rounded-[2rem] border border-[#F5EFE6] shadow-sm p-8">
            <h3 className="text-xl font-bold text-[#2B3A2E] mb-6 flex items-center">
              <Plus className="w-6 h-6 me-2 text-[#3A7D5E]" /> {t.addNew}
            </h3>
            <form onSubmit={handleAddListing} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-[#2B3A2E] mb-1">{t.wasteType}</label>
                <select className="w-full rounded-xl border border-[#F5EFE6] p-3 bg-[#FCFAF7] outline-none focus:border-[#3A7D5E] transition-all" value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}>
                  {wasteCategories.map(cat => (<option key={cat.id} value={cat.id}>{cat[lang]}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#2B3A2E] mb-1">{t.quantity}</label>
                <input type="text" required placeholder="مثال: كيسان كبيران من الزجاج" className="w-full rounded-xl border border-[#F5EFE6] p-3 bg-[#FCFAF7] outline-none focus:border-[#3A7D5E] transition-all" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
              </div>
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-bold text-[#2B3A2E]">{t.address}</label>
                  <button type="button" onClick={handleGetLocation} className="text-xs text-[#3A7D5E] hover:bg-[#E7F5EC] bg-[#FCFAF7] px-2 py-1 rounded-md flex items-center font-bold transition-colors">
                    <Map className="w-3 h-3 me-1" /> {t.getLocation}
                  </button>
                </div>
                <textarea required rows="3" placeholder="مثال: عمان، الرابية، شارع الجامعة، بناية رقم 5" className="w-full rounded-xl border border-[#F5EFE6] p-3 bg-[#FCFAF7] outline-none focus:border-[#3A7D5E] resize-none transition-all" value={newItem.address} onChange={(e) => setNewItem({ ...newItem, address: e.target.value })} />
              </div>
              <button type="submit" disabled={isAdding} className="w-full bg-[#3A7D5E] hover:bg-[#2B3A2E] text-white font-bold py-4 rounded-2xl transition-all shadow-lg flex justify-center items-center">
                {isAdding ? <Loader2 className="w-6 h-6 animate-spin" /> : t.postBtn}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#2B3A2E] mb-4 flex items-center">
              <Package className="w-6 h-6 me-2 text-[#3A7D5E]" /> {t.currentListings}
            </h3>
            {myListings.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-[#F5EFE6] shadow-sm">
                <Package className="w-20 h-20 mx-auto mb-4 text-[#E7F5EC]" />
                <h3 className="text-2xl font-bold text-[#2B3A2E] mb-2">{t.noListings}</h3>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListings.map(item => (
                  <div key={item._id} className={`bg-white rounded-[2rem] border-2 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow ${item.status === 'قيد الاستلام' ? 'border-[#3A7D5E]' : 'border-[#F5EFE6]'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${wasteCategories.find(c => c.id === item.type)?.color || 'bg-[#FCFAF7]'}`}>
                          {wasteCategories.find(c => c.id === item.type)?.icon || <Package />}
                        </div>
                        <h3 className="text-lg font-bold text-[#2B3A2E]">{getCategoryName(item.type)}</h3>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${getStatusStyle(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <div className="bg-[#FCFAF7] rounded-xl p-3 border border-[#F5EFE6] mb-3">
                      <p className="text-sm text-[#2B3A2E]/70">{item.quantity}</p>
                    </div>

                    <div className="flex items-start text-sm text-[#3A7D5E] mb-4">
                      <MapPin className="w-4 h-4 me-2 text-[#3A7D5E] mt-0.5 shrink-0" />
                      <span className="whitespace-pre-line leading-relaxed">{item.address}</span>
                    </div>

                    {item.status === 'قيد الاستلام' && item.collectorName && (
                      <div className="bg-[#E7F5EC] border border-[#10B981] rounded-2xl p-4 mb-4 space-y-3">
                        <p className="text-sm font-black text-[#3A7D5E]">{t.greatNews}</p>
                        <div className="flex items-center text-sm text-[#2B3A2E]">
                          <User className="w-4 h-4 me-2 text-[#3A7D5E] shrink-0" />
                          <span>{t.collRes1}: </span>
                          <span className="font-bold ms-1 text-[#2B3A2E]">{item.collectorName}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 me-2 text-[#3A7D5E] shrink-0" />
                          <span dir="ltr" className="font-mono font-bold text-[#3A7D5E] bg-white px-3 py-1 rounded-lg border border-[#10B981] text-sm">
                            {item.collectorPhone}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      {item.status === 'متاح' && (
                        <button onClick={() => setEditModal({ isOpen: true, item })} className="flex-1 flex items-center justify-center bg-[#E7F5EC] hover:bg-[#10B981] hover:text-white text-[#3A7D5E] font-bold py-2.5 rounded-xl transition-colors text-sm">
                          <Edit className="w-4 h-4 me-1" /> {t.edit}
                        </button>
                      )}
                      <button onClick={() => handleDelete(item._id)} className="flex-1 flex items-center justify-center bg-[#F5EFE6] hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-xl transition-colors text-sm">
                        <Trash2 className="w-4 h-4 me-1" /> {t.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rewards Tab */}
      {activeTab === 'rewards' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {rewardsData.map(item => (
            <div key={item.id} className="bg-white rounded-[2rem] border border-[#F5EFE6] shadow-sm p-8 flex flex-col hover:shadow-md transition-shadow">
              <div className="bg-[#E7F5EC] w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-[#10B981]">{item.icon}</div>
              <h3 className="text-xl font-bold text-[#2B3A2E] mb-2">{item[lang].title}</h3>
              <p className="text-[#3A7D5E] text-sm mb-6 flex-grow leading-relaxed">{item[lang].desc}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F5EFE6]">
                <span className="bg-[#E7F5EC] text-[#3A7D5E] font-black text-lg px-4 py-1.5 rounded-xl border border-[#10B981]">
                  {item.cost} {t.pts}
                </span>
                <button
                  onClick={() => {
                    if (userProfile.points < item.cost) { alert(t.insufficientPts); return; }
                    setRedeemModal({ isOpen: true, item });
                  }}
                  className={`font-bold py-2.5 px-5 rounded-xl transition-colors flex items-center text-sm ${userProfile?.points >= item.cost ? 'bg-[#3A7D5E] hover:bg-[#2B3A2E] text-white' : 'bg-[#F5EFE6] text-[#3A7D5E]/50 cursor-not-allowed'}`}
                >
                  <Gift className="w-4 h-4 me-1.5" /> {t.redeemBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {tipsData.map(tip => (
            <div key={tip.id} className="bg-white rounded-[2rem] border border-[#F5EFE6] shadow-sm p-8 hover:shadow-md transition-shadow">
              <div className="bg-[#E7F5EC] w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border border-[#10B981]">{tip.icon}</div>
              <h3 className="text-lg font-bold text-[#2B3A2E] mb-3">{tip[lang].title}</h3>
              <p className="text-[#3A7D5E] text-sm leading-relaxed">{tip[lang].summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}