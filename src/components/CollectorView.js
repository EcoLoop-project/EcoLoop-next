"use client";

import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  ListChecks,
  Package,
  User,
  Phone,
  AlertTriangle,
  Navigation2,
  CheckCircle2
} from 'lucide-react';

import { useAppContext } from './AppContext';
import { wasteCategories, recyclingCenters } from '@/lib/constants';

import ReserveModal from './modals/ReserveModal';
import CancelModal from './modals/CancelModal';

// ─── Color Palette ───────────────────────────────────────────────────────────
// Main Green      #3A7D5E
// Emerald Accent  #10B981
// Soft Green      #E7F5EC
// Warm Beige      #F5EFE6
// Cream           #FCFAF7
// Dark Olive Text #2B3A2E
// ─────────────────────────────────────────────────────────────────────────────

export default function CollectorView() {

  const { t, lang, userProfile, listings, fetchData } = useAppContext();

  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('available');

  const [reserveModal, setReserveModal] = useState({
    isOpen: false,
    data: null
  });

  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    id: null
  });

  const [completingId, setCompletingId] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => console.log(error)
    );
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const sortedCenters = [...recyclingCenters]
    .map(center => ({
      ...center,
      distance: userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            center.lat,
            center.lng
          )
        : null
    }))
    .sort((a, b) => (a.distance || 999) - (b.distance || 999));

  const availableListings = listings.filter(l => l.status === 'متاح');

  const filteredAvailable =
    filter === 'all'
      ? availableListings
      : availableListings.filter(l => l.type === filter);

  const myReservations = listings.filter(
    l => l.collectorId === userProfile?._id && l.status === 'قيد الاستلام'
  );

  const getCategoryName = (id) => {
    const cat = wasteCategories.find(c => c.id === id);
    return cat ? cat[lang] : id;
  };

  const handleConfirmReservation = async () => {
    if (reserveModal.data) {
      try {
        await fetch(`/api/adv/${reserveModal.data._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'accept',
            collectorId: userProfile._id,
            collectorName: userProfile.name,
            collectorPhone: userProfile.phone
          })
        });
        setReserveModal({ isOpen: false, data: null });
        setActiveTab('my_reservations');
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleConfirmCancel = async () => {
    if (cancelModal.id) {
      try {
        await fetch(`/api/adv/${cancelModal.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'cancel' })
        });
        setCancelModal({ isOpen: false, id: null });
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleComplete = async (itemId) => {
    setCompletingId(itemId);
    try {
      await fetch(`/api/adv/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete' })
      });
      fetchData();
    } catch (error) {
      console.error(error);
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" style={{ background: '#FCFAF7', minHeight: '100vh' }}>

      {reserveModal.isOpen && (
        <ReserveModal
          data={reserveModal.data}
          categoryName={getCategoryName(reserveModal.data?.type)}
          onClose={() => setReserveModal({ isOpen: false, data: null })}
          onConfirm={handleConfirmReservation}
        />
      )}

      {cancelModal.isOpen && (
        <CancelModal
          onClose={() => setCancelModal({ isOpen: false, id: null })}
          onConfirm={handleConfirmCancel}
        />
      )}

      {/* ── Header ── */}
      <div
        className="rounded-2xl p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden"
        style={{ background: '#3A7D5E' }}
      >
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              <Truck className="w-8 h-8 me-3" style={{ color: '#A7E8CC' }} />
              {t.collPortal}
            </h2>
          </div>
          <div
            className="flex p-1.5 rounded-xl flex-wrap justify-center gap-1 border"
            style={{ background: 'rgba(0,0,0,0.18)', borderColor: 'rgba(255,255,255,0.15)' }}
          >
            <button
              onClick={() => setActiveTab('available')}
              className="px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center"
              style={
                activeTab === 'available'
                  ? { background: '#2E6449', color: '#fff' }
                  : { color: 'rgba(255,255,255,0.8)' }
              }
            >
              {t.map}
            </button>
            <button
              onClick={() => setActiveTab('my_reservations')}
              className="px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center"
              style={
                activeTab === 'my_reservations'
                  ? { background: '#D97706', color: '#fff' }
                  : { color: 'rgba(255,255,255,0.8)' }
              }
            >
              {t.myRes}
              {myReservations.length > 0 && (
                <span
                  className="ms-1.5 px-2 py-0.5 rounded-md text-xs"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  {myReservations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('centers')}
              className="px-4 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center"
              style={
                activeTab === 'centers'
                  ? { background: '#2563EB', color: '#fff' }
                  : { color: 'rgba(255,255,255,0.8)' }
              }
            >
              {t.centers}
            </button>
          </div>
        </div>
        <div className="absolute top-0 end-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
          <MapPin className="w-80 h-80" />
        </div>
      </div>

      {/* ── Available Tab ── */}
      {activeTab === 'available' && (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          {/* Filter Bar */}
          <div
            className="flex flex-wrap gap-2 mb-8 p-2 rounded-2xl border w-fit shadow-sm"
            style={{ background: '#FCFAF7', borderColor: '#DDD5C8' }}
          >
            <button
              onClick={() => setFilter('all')}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={
                filter === 'all'
                  ? { background: '#3A7D5E', color: '#fff' }
                  : { color: '#2B3A2E' }
              }
            >
              {t.all}
            </button>
            {wasteCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={
                  filter === cat.id
                    ? { background: '#3A7D5E', color: '#fff' }
                    : { color: '#2B3A2E' }
                }
              >
                {cat[lang]}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailable.length === 0 ? (
              <div
                className="col-span-full rounded-[2rem] p-12 text-center border shadow-sm"
                style={{ background: '#FCFAF7', borderColor: '#DDD5C8' }}
              >
                <MapPin className="w-20 h-20 mx-auto mb-4" style={{ color: '#A7C4B0' }} />
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B3A2E' }}>
                  {t.noAvailable}
                </h3>
              </div>
            ) : (
              filteredAvailable.map(item => (
                <div
                  key={item._id}
                  className="rounded-[2rem] border shadow-sm p-6 sm:p-8 flex flex-col hover:shadow-md transition-shadow"
                  style={{ background: '#fff', borderColor: '#DDD5C8' }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          background: wasteCategories.find(c => c.id === item.type)?.color
                            ? undefined
                            : '#E7F5EC',
                        }}
                      >
                        <div
                          className={`p-3 rounded-xl ${wasteCategories.find(c => c.id === item.type)?.color || ''}`}
                          style={
                            !wasteCategories.find(c => c.id === item.type)?.color
                              ? { background: '#E7F5EC', color: '#3A7D5E' }
                              : {}
                          }
                        >
                          {wasteCategories.find(c => c.id === item.type)?.icon || <Package />}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: '#2B3A2E' }}>
                        {getCategoryName(item.type)}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border"
                      style={{ background: '#E7F5EC', color: '#3A7D5E', borderColor: '#A7D9BC' }}
                    >
                      {t.available}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8 flex-grow">
                    <div
                      className="rounded-xl p-4 border"
                      style={{ background: '#FCFAF7', borderColor: '#DDD5C8' }}
                    >
                      <p className="text-sm font-medium" style={{ color: '#4B6358' }}>
                        {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-start text-sm" style={{ color: '#4B6358' }}>
                      <MapPin className="w-4 h-4 me-2 mt-0.5 shrink-0" style={{ color: '#E05252' }} />
                      <span className="whitespace-pre-line leading-relaxed">{item.address}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setReserveModal({ isOpen: true, data: item })}
                    className="w-full font-bold py-3.5 rounded-2xl mt-auto transition-colors text-white"
                    style={{ background: '#3A7D5E' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#2E6449')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#3A7D5E')}
                  >
                    {t.bookBtn}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── My Reservations Tab ── */}
      {activeTab === 'my_reservations' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {myReservations.length === 0 ? (
            <div
              className="col-span-full rounded-[2rem] p-12 text-center border shadow-sm"
              style={{ background: '#FCFAF7', borderColor: '#DDD5C8' }}
            >
              <ListChecks className="w-20 h-20 mx-auto mb-4" style={{ color: '#A7C4B0' }} />
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#2B3A2E' }}>
                {t.noRes}
              </h3>
            </div>
          ) : (
            myReservations.map(item => (
              <div
                key={item._id}
                className="rounded-[2rem] shadow-sm p-6 sm:p-8 flex flex-col relative overflow-hidden hover:shadow-md transition-shadow"
                style={{ background: '#fff', border: '2px solid #FCD34D' }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full z-0 opacity-50"
                  style={{ background: '#FFFBEB' }}
                />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl ${wasteCategories.find(c => c.id === item.type)?.color || ''}`}
                        style={
                          !wasteCategories.find(c => c.id === item.type)?.color
                            ? { background: '#E7F5EC', color: '#3A7D5E' }
                            : {}
                        }
                      >
                        {wasteCategories.find(c => c.id === item.type)?.icon || <Package />}
                      </div>
                      <h3 className="text-xl font-bold" style={{ color: '#2B3A2E' }}>
                        {getCategoryName(item.type)}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1.5 rounded-lg border"
                      style={{ background: '#FFFBEB', color: '#92400E', borderColor: '#FDE68A' }}
                    >
                      {t.resForYou}
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4 border mb-4"
                    style={{ background: '#FCFAF7', borderColor: '#DDD5C8' }}
                  >
                    <p className="text-sm font-medium" style={{ color: '#4B6358' }}>
                      {item.quantity}
                    </p>
                  </div>

                  <div
                    className="p-5 rounded-2xl text-sm space-y-4 mb-6 flex-grow border"
                    style={{ background: '#FFFBEB', borderColor: '#FDE68A', color: '#2B3A2E' }}
                  >
                    <p className="flex items-start break-words">
                      <MapPin className="w-4 h-4 shrink-0 me-3 mt-0.5" style={{ color: '#D97706' }} />
                      <span className="whitespace-pre-line leading-relaxed">{item.address}</span>
                    </p>
                    <div className="h-px w-full" style={{ background: '#FDE68A' }} />
                    <p className="flex items-center font-medium">
                      <User className="w-4 h-4 shrink-0 me-3" style={{ color: '#D97706' }} />
                      {t.family}
                      <span className="ms-1 font-bold" style={{ color: '#2B3A2E' }}>
                        {item.authorName}
                      </span>
                    </p>
                    <p className="flex items-center font-medium">
                      <Phone className="w-4 h-4 shrink-0 me-3" style={{ color: '#D97706' }} />
                      {t.phone}:
                      <span
                        dir="ltr"
                        className="ms-2 font-mono font-bold px-2 py-1 rounded-md border"
                        style={{ color: '#92400E', background: '#fff', borderColor: '#FDE68A' }}
                      >
                        {item.authorPhone}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleComplete(item._id)}
                    disabled={completingId === item._id}
                    className="w-full text-white font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center mb-3"
                    style={{ background: '#059669' }}
                  >
                    {completingId === item._id ? (
                      <span className="flex items-center">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin me-2" />
                        {lang === 'ar' ? 'جاري التأكيد...' : 'Confirming...'}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 me-2" />
                        {lang === 'ar' ? 'تم الاستلام ✓' : 'Pickup Complete ✓'}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setCancelModal({ isOpen: true, id: item._id })}
                    className="w-full font-bold py-3 rounded-2xl transition-colors flex items-center justify-center text-sm border"
                    style={{ background: '#fff', color: '#DC2626', borderColor: '#FECACA' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#FFF1F1')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
                  >
                    <AlertTriangle className="w-4 h-4 me-2" />
                    {t.cancelRes}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Centers Tab ── */}
      {activeTab === 'centers' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
          {sortedCenters.map(center => (
            <div
              key={center.id}
              className="rounded-[2rem] border shadow-sm p-6 sm:p-8 flex flex-col hover:shadow-md transition-shadow"
              style={{ background: '#fff', borderColor: '#DDD5C8' }}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl" style={{ background: '#EFF6FF' }}>
                  <MapPin className="w-8 h-8" style={{ color: '#2563EB' }} />
                </div>
                <span
                  className="text-sm font-bold px-4 py-2 rounded-xl border"
                  style={{ background: '#EFF6FF', color: '#1D4ED8', borderColor: '#BFDBFE' }}
                >
                  {center.distance ? `${center.distance} km` : (center[lang]?.dist || '...')}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3" style={{ color: '#2B3A2E' }}>
                {center[lang].name}
              </h3>

              <iframe
                src={`https://maps.google.com/maps?q=${center.lat},${center.lng}&z=15&output=embed`}
                width="100%"
                height="220"
                className="rounded-2xl border mb-5"
                style={{ borderColor: '#DDD5C8' }}
                loading="lazy"
              />

              <p
                className="text-base mb-6 font-medium p-3 rounded-xl border"
                style={{ color: '#4B6358', background: '#FCFAF7', borderColor: '#DDD5C8' }}
              >
                <MapPin className="w-4 h-4 inline me-2" style={{ color: '#A7C4B0' }} />
                {center[lang].address}
              </p>

              <div className="mt-auto pt-6 border-t" style={{ borderColor: '#DDD5C8' }}>
                <p
                  className="text-xs font-bold mb-3 uppercase tracking-wider"
                  style={{ color: '#6B8C7A' }}
                >
                  {t.accepts}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {center[lang].accepts.map((type, idx) => (
                    <span
                      key={idx}
                      className="font-bold text-sm px-3 py-1.5 rounded-lg border"
                      style={{ background: '#F5EFE6', color: '#2B3A2E', borderColor: '#DDD5C8' }}
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <a
                  href={center.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center"
                  style={{ background: '#EFF6FF', color: '#1D4ED8' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#2563EB';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#EFF6FF';
                    e.currentTarget.style.color = '#1D4ED8';
                  }}
                >
                  <Navigation2 className="w-5 h-5 me-2" />
                  {t.getDirs}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}