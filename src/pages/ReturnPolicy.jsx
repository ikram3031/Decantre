import React from 'react';
import { ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

export const ReturnPolicy = () => {
  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-16 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Sovereign Scent Guarantee</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            RETURN & REFUND POLICY
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Discover our premium sillage replacement policies designed to guarantee absolute satisfaction on your personalized decanting journey.
          </p>
        </div>

        {/* Content Block */}
        <div className="bg-[#090909] border border-white/5 p-8 sm:p-10 rounded-sm space-y-8 font-sans text-xs text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              1. THE SOVEREIGN SATISFACTION ASSURANCE
            </h3>
          </div>
          <p>
            At Decantre, we recognize that purchasing natural raw perfumes online is a deeply sensory and personal decision. If, upon first spray contact, the fragrance does not perfectly dialogue with your skin chemistry or fails to meet your high standard of sillage, we will issue a secure replacement bottle.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <AlertCircle className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              2. CRITERIA FOR AN ELITE RETURN
            </h3>
          </div>
          <p>
            To qualify for a refund or scent swap, products must be returned to our Paris or London dispatch bureaus within thirty (30) calendar days from delivery. The original glass flacon must show minimal spray usage (no more than 3-4 trial sprays) and must include the original velvet jewelry presentation chest and certified tags.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              3. RETURN SHIPPING COORDINATES
            </h3>
          </div>
          <p>
            Please contact our client concierge bureau at <span className="text-gold font-mono">returns@decantre.com</span> to request a prepaid secure return shipping label. Every return package is fully insured and tracked. Our team will verify bottle status within 3 business days of receipt before finalizing credit.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              4. BESPOKE COMMISSION REPLACEMENT
            </h3>
          </div>
          <p>
            Please note that entirely bespoke fragrance formulas commissioned directly from Jean-Luc Almaric or Sophia Castiglione cannot be refunded, as these are unique creations tailored solely to one client's genetic skin chemistry records. However, we will provide up to 3 complimentary reformulations for commissions.
          </p>
        </div>

      </div>
    </div>
  );
};
export default ReturnPolicy;
