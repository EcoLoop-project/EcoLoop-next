"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Home, Truck, Loader2, MessageSquare, ArrowRight, Leaf, Gift, ShieldCheck, Users, Phone, Mail, Globe, Menu, X } from 'lucide-react';
import { useAppContext } from './AppContext';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function AuthView() {
  const { t, setUserProfile, lang, setLang } = useAppContext();
  const router = useRouter();
  const loginRef = useRef(null);

  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (e) {}
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (e) {
        console.error("Recaptcha Init Error:", e);
      }
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!role) { setErrorMsg(t.errorRole); return; }

    let formatPhone = phone.trim().replace(/\s/g, '');
    if (!formatPhone.startsWith('+')) formatPhone = '+' + formatPhone;

    if (formatPhone.length < 10) {
      setErrorMsg(t.phoneFormatHelp);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const checkRes = await fetch('/api/auth/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formatPhone, name, role }),
      });

      if (!checkRes.ok) {
        const data = await checkRes.json();
        setErrorMsg(data.error || t.phoneFormatHelp);
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      setErrorMsg(t.phoneFormatHelp);
      setIsSubmitting(false);
      return;
    }

    setPhone(formatPhone);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formatPhone, appVerifier);
      window.confirmationResult = confirmation;
      setIsSubmitting(false);
      setStep(2);
    } catch (error) {
      console.error("Firebase Error:", error);
      setErrorMsg(t.phoneFormatHelp);
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    if (otp.length === 6) {
      try {
        await window.confirmationResult.confirm(otp);
        const finalPhone = phone.trim().replace(/\s/g, '');

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone: finalPhone, role }),
        });

        if (res.ok) {
          const user = await res.json();
          sessionStorage.setItem('ecoloop_userId', user._id);
          setUserProfile(user);
          router.push('/');
        } else {
          const data = await res.json();
          setErrorMsg(data.error || t.invalidOtp);
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setErrorMsg(t.invalidOtp);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrorMsg(t.invalidOtp);
      setIsSubmitting(false);
    }
  };

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#FCFAF7] flex flex-col animate-in fade-in duration-500 font-sans w-full overflow-x-hidden">
      <div id="recaptcha-container"></div>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2B3A2E]/95 backdrop-blur-md border-b border-[#3A7D5E]/30">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/pic/logo.png" alt="Ecoloop Logo" className="w-20 h-20 object-contain" />
              <span className="font-black text-xl text-white tracking-tight">{t.appTitle}</span>
            </div>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection('about')} className="text-[#E7F5EC] hover:text-white font-bold text-sm transition-colors">{t.navAbout}</button>
              <button onClick={() => scrollToSection('contact')} className="text-[#E7F5EC] hover:text-white font-bold text-sm transition-colors">{t.navContact}</button>
              <button onClick={() => scrollToSection('login')} className="text-[#E7F5EC] hover:text-white font-bold text-sm transition-colors">{t.navLogin}</button>
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className="flex items-center text-[#E7F5EC] hover:text-white font-bold bg-[#3A7D5E]/50 hover:bg-[#3A7D5E] px-3 py-1.5 rounded-full text-sm border border-[#3A7D5E] transition-colors"
              >
                <Globe className="w-4 h-4 me-1.5" /> {lang === 'ar' ? 'English' : 'عربي'}
              </button>
            </div>
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#2B3A2E] border-t border-[#3A7D5E]/30 px-4 py-4 space-y-3">
            <button onClick={() => scrollToSection('about')} className="block w-full text-right text-[#E7F5EC] font-bold py-2">{t.navAbout}</button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-right text-[#E7F5EC] font-bold py-2">{t.navContact}</button>
            <button onClick={() => scrollToSection('login')} className="block w-full text-right text-[#E7F5EC] font-bold py-2">{t.navLogin}</button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="flex items-center text-[#E7F5EC] font-bold py-2">
              <Globe className="w-4 h-4 me-2" /> {lang === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full min-h-screen">
        <img
          src="https://images.stockcake.com/public/c/f/9/cf9ba934-a671-449d-8067-90076a64e076_large/sorting-recyclable-materials-stockcake.jpg"
          alt="Waste Recycling"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B3A2E] via-[#2B3A2E]/70 to-[#2B3A2E]/40"></div>
        <div className="relative flex flex-col items-center justify-center text-center px-4 pt-4 pb-16 min-h-screen">
          <img
            src="/pic/ecoloop-logo.png"
            alt="EcoLoop Logo"
           className="w-50 h-50 sm:w-64 sm:h-64 object-contain mb-1 bg-white/10 rounded-full p-2 backdrop-blur-sm drop-shadow-[0_15px_60px_rgba(0,0,0,0.9)]"
          />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight max-w-4xl">
            {t.heroTitle}
          </h1>
          <p className="text-white/90 text-lg sm:text-xl max-w-2xl mb-6 leading-relaxed font-medium">
            {t.heroDesc}
          </p>
          <button
            onClick={scrollToLogin}
            className="bg-[#3A7D5E] hover:bg-[#10B981] text-white font-black text-lg px-10 py-4 rounded-2xl transition-all shadow-[0_8px_30px_rgba(58,125,94,0.4)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 flex items-center gap-3"
          >
            <Leaf className="w-6 h-6" />
            {t.heroBtn}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ===== ABOUT + CONTACT SECTION ===== */}
      <section id="about" className="w-full bg-[#F5EFE6] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-[#2B3A2E] mb-4">{t.aboutSectionTitle}</h2>
            <div className="w-24 h-1.5 bg-[#3A7D5E] rounded-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* About Card */}
            <div className="bg-[#FCFAF7] rounded-3xl p-8 lg:p-10 shadow-xl border border-[#F5EFE6] hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#3A7D5E] rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#2B3A2E]">{t.navAbout}</h3>
                  <p className="text-[#3A7D5E] font-medium">About Us</p>
                </div>
              </div>
              <p className="text-[#2B3A2E]/80 leading-relaxed text-base mb-8">
                {t.aboutDesc}
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#E7F5EC] rounded-xl p-4 text-center border border-[#10B981]/20 hover:border-[#10B981] transition-colors">
                  <div className="w-12 h-12 bg-[#3A7D5E] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-[#2B3A2E]">{t.featureSustainTitle}</p>
                  <p className="text-xs text-[#2B3A2E]/80 mt-1">{t.featureSustainDesc}</p>
                </div>
                <div className="bg-[#E7F5EC] rounded-xl p-4 text-center border border-[#10B981]/20 hover:border-[#10B981] transition-colors">
                  <div className="w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-[#2B3A2E]">{t.featureRewardsTitle}</p>
                  <p className="text-xs text-[#2B3A2E]/70 mt-1">{t.featureRewardsDesc}</p>
                </div>
                <div className="bg-[#E7F5EC] rounded-xl p-4 text-center border border-[#10B981]/20 hover:border-[#10B981] transition-colors">
                  <div className="w-12 h-12 bg-[#2B3A2E] rounded-full flex items-center justify-center mx-auto mb-2">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-bold text-[#2B3A2E]">{t.featureSafeTitle}</p>
                  <p className="text-xs text-[#2B3A2E]/70 mt-1">{t.featureSafeDesc}</p>
                </div>
              </div>
            </div>
            {/* Contact Card */}
            <div id="contact" className="bg-[#FCFAF7] rounded-3xl p-8 lg:p-10 shadow-xl border border-[#F5EFE6] hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#2B3A2E]">{t.contactTitle}</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#F5EFE6] hover:border-[#3A7D5E] transition-colors group">
                  <div className="w-12 h-12 bg-[#3A7D5E] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#3A7D5E] font-bold mb-1">{t.contactPhone}</p>
                    <p dir="ltr" className="text-[#2B3A2E] font-bold text-base">+962 78 612 3915</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-[#F5EFE6] hover:border-[#10B981] transition-colors group">
                  <div className="w-12 h-12 bg-[#10B981] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#3A7D5E] font-bold mb-1">{t.contactEmail}</p>
                    <p dir="ltr" className="text-[#2B3A2E] font-bold text-base">ecoloop.connection@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGIN SECTION ===== */}
      <section id="login" ref={loginRef} className="w-full bg-[#FCFAF7] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#E7F5EC] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#3A7D5E]">
              <img src="/pic/ecoloop-logo.png" alt="Logo" className="w-16 h-16 object-contain" />
            </div>
            <h2 className="text-3xl font-black text-[#2B3A2E] mb-2">{t.navLogin}</h2>
            <p className="text-[#3A7D5E] text-sm">{t.authSub}</p>
          </div>
          {/* Error */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl flex items-center gap-3 mb-6 text-sm font-semibold">
              <span className="text-lg">⚠️</span>
              <p>{errorMsg}</p>
            </div>
          )}
          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#2B3A2E] mb-3 text-center">{t.roleLabel}</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('household')}
                    className={`relative flex-1 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-200 group
                      ${role === 'household'
                        ? 'border-[#3A7D5E] bg-[#E7F5EC] shadow-lg'
                        : 'border-[#F5EFE6] bg-white hover:border-[#3A7D5E] hover:bg-[#FCFAF7]'}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all
                      ${role === 'household' ? 'bg-[#3A7D5E] text-white scale-110' : 'bg-[#E7F5EC] text-[#3A7D5E]'}`}>
                      <Home className="w-6 h-6" />
                    </div>
                    <h3 className={`font-bold text-sm ${role === 'household' ? 'text-[#3A7D5E]' : 'text-[#2B3A2E]'}`}>
                      {t.houseRole}
                    </h3>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('collector')}
                    className={`relative flex-1 aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all duration-200 group
                      ${role === 'collector'
                        ? 'border-[#3A7D5E] bg-[#E7F5EC] shadow-lg'
                        : 'border-[#F5EFE6] bg-white hover:border-[#3A7D5E] hover:bg-[#FCFAF7]'}`}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all
                      ${role === 'collector' ? 'bg-[#3A7D5E] text-white scale-110' : 'bg-[#E7F5EC] text-[#3A7D5E]'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <h3 className={`font-bold text-sm ${role === 'collector' ? 'text-[#3A7D5E]' : 'text-[#2B3A2E]'}`}>
                      {t.collRole}
                    </h3>
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder={t.fullName}
                  className="w-full rounded-2xl border border-[#F5EFE6] bg-white px-5 py-4 text-[#2B3A2E] placeholder-[#3A7D5E]/50 focus:border-[#3A7D5E] focus:outline-none focus:ring-4 focus:ring-[#3A7D5E]/10 transition-all font-medium shadow-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="tel"
                  required
                  placeholder="+962 79 000 0000"
                  className="w-full rounded-2xl border border-[#F5EFE6] bg-white px-5 py-4 text-[#2B3A2E] placeholder-[#3A7D5E]/50 focus:border-[#3A7D5E] focus:outline-none focus:ring-4 focus:ring-[#3A7D5E]/10 transition-all font-mono text-left font-medium shadow-sm"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !role}
                className="w-full bg-[#3A7D5E] hover:bg-[#2B3A2E] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : t.submitAuth}
              </button>
            </form>
          )}
          {/* STEP 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-left-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#E7F5EC] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#3A7D5E]">
                  <MessageSquare className="w-9 h-9 text-[#3A7D5E]" />
                </div>
                <h2 className="text-2xl font-bold text-[#2B3A2E] mb-2">{t.enterOtpTitle}</h2>
                <p className="text-[#3A7D5E] text-sm">
                  {t.enterOtpDesc} <span dir="ltr" className="font-bold text-[#3A7D5E]">{phone}</span>
                </p>
              </div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="••••••"
                className="w-full rounded-2xl border border-[#F5EFE6] bg-white p-5 text-center text-4xl tracking-[0.5em] font-black text-[#2B3A2E] placeholder-[#3A7D5E]/30 focus:border-[#3A7D5E] focus:outline-none focus:ring-4 focus:ring-[#3A7D5E]/10 transition-all shadow-md"
                dir="ltr"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <button
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full bg-[#3A7D5E] hover:bg-[#2B3A2E] text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : t.verifyBtn}
              </button>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); }}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold text-[#3A7D5E] hover:text-[#2B3A2E] transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                {t.backToPhone}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#2B3A2E] py-8 text-center w-full border-t border-[#3A7D5E]/30">
        <p className="text-[#7BA38D] text-sm font-medium">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}