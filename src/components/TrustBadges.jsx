import React from 'react';
import { ShieldCheck, Truck, Gift, Award } from 'lucide-react';

export const TrustBadges = () => {
  return (
    <section id="trust-badges" className="bg-[#0A0A0A] py-10 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div className="flex flex-col items-center p-3 space-y-2">
          <ShieldCheck className="w-7 h-7 text-gold" />
          <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-zinc-200">100% Authentic Atelier</span>
          <span className="text-[11px] text-zinc-500 font-sans font-light">Directly from Parisian perfumers</span>
        </div>
        <div className="flex flex-col items-center p-3 space-y-2">
          <Truck className="w-7 h-7 text-gold" />
          <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-zinc-200">Complimentary Courier</span>
          <span className="text-[11px] text-zinc-500 font-sans font-light">Fully insured premium white glove dispatch</span>
        </div>
        <div className="flex flex-col items-center p-3 space-y-2">
          <Gift className="w-7 h-7 text-gold" />
          <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-zinc-200">Signature Wrapping</span>
          <span className="text-[11px] text-zinc-500 font-sans font-light">Black velvet presentation chest and seal</span>
        </div>
        <div className="flex flex-col items-center p-3 space-y-2">
          <Award className="w-7 h-7 text-gold" />
          <span className="text-[10px] uppercase font-sans font-semibold tracking-widest text-zinc-200">Signature Longevity</span>
          <span className="text-[11px] text-zinc-500 font-sans font-light">Exceptional concentration lasting over 16h</span>
        </div>
      </div>
    </section>
  );
};
