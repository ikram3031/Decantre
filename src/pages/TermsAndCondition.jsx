import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export const TermsAndCondition = () => {
  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-16 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Sovereign Client Covenant</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            TERMS & CONDITIONS
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Please review the mutually-binding terms governing boutique transactions, custom decant orders, and product preservation duties.
          </p>
        </div>

        {/* Content Block */}
        <div className="bg-[#090909] border border-white/5 p-8 sm:p-10 rounded-sm space-y-8 font-sans text-xs text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              1. BOUTIQUE ACQUISITION
            </h3>
          </div>
          <p>
            By finalizing your perfume order on our portal, you certify that all entered client coordinates and billing files are authentic. L'Élixir reserves the absolute right to cancel, intercept, or refuse service to any transaction flag displaying signs of currency speculation or resale intentions.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              2. HAND-DECANTED SPECIFICATIONS
            </h3>
          </div>
          <p>
            Every single flacon is meticulously decanted to order in sterile, climate-controlled labs. Small variances in liquid hue or clarity are typical for authentic organic botanical extractions. These natural characteristics certify botanical purity and do not constitute physical formulation defects.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              3. PRESERVATION & CUSTODY DUTIES
            </h3>
          </div>
          <p>
            The client agrees to maintain their purchased fragrances inside cool, sun-shielded environments (15-20°C). L'Élixir is not responsible for rapid top note evaporation, chemical bond collapse, or physical bottle degradation arising from improper storage practices.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              4. TRADEMARK & BRIP PATENTS
            </h3>
          </div>
          <p>
            The names L'ÉLIXIR, L'Élixir d'Art, and all specific perfume formulas are protected under global fragrance trade patents. Copying, re-bottling, or chemical reverse-engineering of our proprietary aromatic oil configurations is strictly prohibited.
          </p>
        </div>

      </div>
    </div>
  );
};
export default TermsAndCondition;
