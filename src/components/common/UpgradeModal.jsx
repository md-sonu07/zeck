import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const UpgradeModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [show, setShow] = useState(false);
  const [render, setRender] = useState(false);
  const location = useLocation();

  // Automatically reopen popup when moving into the admin route
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      setIsOpen(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const timer = setTimeout(() => setShow(true), 10);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
      const timer = setTimeout(() => setRender(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (show) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [show]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    if (show) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, handleClose]);

  if (!render) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-250 ease-out p-2 sm:p-4 ${show ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className={`w-full max-w-[1100px] max-h-[96vh] bg-black border border-white/10 rounded-[12px] shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] relative transition-all duration-250 ease-out flex flex-col overflow-hidden ${show ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
        role="dialog" 
        aria-modal="true"
      >
        {/* Subtle grid background like Vercel */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        {/* Top Header - Condensed Padding */}
        <div className="relative flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 116 24" height="20" className="text-white fill-current">
              <path d="M12 0L0 27.71h24L12 0z" fill="currentColor"/>
              <text x="32" y="21" fontFamily="Inter, sans-serif" fontSize="26" fontWeight="600" fill="white" letterSpacing="-1px">Vercel</text>
            </svg>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Body - Condensed Spacing */}
        <div className="relative px-5 py-4 md:px-8 md:py-6 overflow-y-auto">
          <div className="mb-6 text-center max-w-2xl mx-auto shrink-0">
            <h2 className="text-white text-2xl font-semibold tracking-tight">Your free plan is over</h2>
            <p className="text-[#a1a1aa] text-sm md:text-base mt-2">
              Your 40 days free plan is over now. Upgrade to enjoy a popup-free website experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full relative">
            
            {/* Monthly Plan Card */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-5 md:p-6 flex flex-col hover:border-white/20 transition-colors">
              <h3 className="text-white text-xl font-semibold mb-1">Monthly</h3>
              <p className="text-[#888] text-sm mb-4 leading-snug">Perfect for short-term access and flexibility.</p>
              
              <div className="mb-5 border-b border-white/10 pb-4">
                <span className="text-white text-3xl font-bold tracking-tight">₹1,800</span>
                <span className="text-[#888] text-sm ml-1">/ month</span>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {['Popup-free experience', 'Standard community support', 'Basic performance insights', 'Cancel anytime'].map((feature, i) => (
                  <li key={i} className="flex items-start text-[#888] text-sm gap-2 leading-tight">
                    <svg className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#fafafa] text-black text-sm font-semibold py-2.5 rounded-lg hover:bg-gray-200 transition-colors">
                Start Monthly Plan
              </button>
            </div>

            {/* 6-Month Plan Card (Popular) */}
            <div className="relative bg-[#0a0a0a] border border-[#0070f3] rounded-xl p-5 md:p-6 flex flex-col shadow-[0_0_20px_rgba(0,112,243,0.15)]">
              {/* Popular Tab */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0070f3] text-white text-[11px] uppercase tracking-wider font-bold px-3 py-0.5 rounded-full shadow-lg">
                Popular
              </div>

              <h3 className="text-white text-xl font-semibold mb-1">6 Months</h3>
              <p className="text-[#888] text-sm mb-4 leading-snug">A sweet spot. Save with a discounted mid-term plan.</p>
              
              <div className="mb-5 flex flex-col border-b border-white/10 pb-4">
                <div className="flex items-baseline">
                  <span className="text-white text-3xl font-bold tracking-tight">₹7,500</span>
                  <span className="text-[#888] text-sm ml-1">/ 6 mo</span>
                </div>
                <span className="text-[#0070f3] text-xs font-medium mt-1">Save ₹3,300 overall</span>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {['All Monthly features, plus:', 'Priority 24/7 support', 'Advanced performance insights', 'Priority queueing'].map((feature, i) => (
                  <li key={i} className="flex items-start text-[#a1a1aa] text-sm gap-2 leading-tight">
                    <svg className="w-4 h-4 text-[#0070f3] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i === 0 ? "0" : "2"} d={i === 0 ? "" : "M5 13l4 4L19 7"} />
                    </svg>
                    <span className={i === 0 ? "text-white font-medium" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#0070f3] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#0060d1] transition-colors shadow-[0_4px_14px_0_rgba(0,118,255,0.39)]">
                Upgrade now
              </button>
            </div>

            {/* 12-Month Plan Card (Best Value) */}
            <div className="relative bg-[#0a0a0a] border border-white/10 hover:border-emerald-500/50 rounded-xl p-5 md:p-6 flex flex-col transition-colors group">
              {/* Best Value Tab */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[11px] uppercase tracking-wider font-bold px-3 py-0.5 rounded-full shadow-lg">
                Best Value
              </div>

              <h3 className="text-white text-xl font-semibold mb-1">12 Months</h3>
              <p className="text-[#888] text-sm mb-4 leading-snug">Maximum value structure for long-term growth.</p>
              
              <div className="mb-5 flex flex-col border-b border-white/10 pb-4">
                <div className="flex items-baseline">
                  <span className="text-white text-3xl font-bold tracking-tight">₹13,000</span>
                  <span className="text-[#888] text-sm ml-1">/ 12 mo</span>
                </div>
                <span className="text-emerald-400 text-xs font-medium mt-1">Huge discount! Save ₹8,600!</span>
              </div>

              <ul className="space-y-3 mb-6 flex-grow">
                {['All 6-Month features, plus:', 'Dedicated Account Manager', 'White-glove onboarding', 'Exclusive early access features'].map((feature, i) => (
                  <li key={i} className="flex items-start text-[#a1a1aa] text-sm gap-2 leading-tight">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i === 0 ? "0" : "2"} d={i === 0 ? "" : "M5 13l4 4L19 7"} />
                    </svg>
                    <span className={i === 0 ? "text-white font-medium" : ""}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="w-full bg-white/10 text-white text-sm font-semibold py-2.5 rounded-lg group-hover:bg-emerald-500 transition-colors">
                Get Best Value
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
