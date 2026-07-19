import React from 'react';
import { Compass, Sparkles, Feather, HelpCircle, Award, Flame } from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-20 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Ancestral Roots</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            OUR ROYAL HERITAGE
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Unveiling L'Élixir—an continuous search for olfactory perfection. How we resurrected ancient French decant standards for the modern connoisseur.
          </p>
        </div>

        {/* Narrative columns block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium">ESTABLISHED 2012</span>
            <h2 className="text-3xl font-serif font-light text-luxury-white">
              RESURRECTING FLUID LUXURY
            </h2>
            <div className="h-[1px] w-16 bg-gold/40"></div>
            <p className="text-zinc-400 text-sm font-sans font-light leading-relaxed">
              L'Élixir was founded with a fierce, uncompromising mandate: to refuse synthetic short-cuts. We treat fragrance as a majestic piece of liquid art, capable of adapting, blending, and projecting a client's private identity into their surrounding atmosphere.
            </p>
            <p className="text-zinc-400 text-sm font-sans font-light leading-relaxed">
              Our raw materials are ethically harvested in complete harmony with natural solar cycles. From the misty high-altitude rose fields of Turkey to the ancient resin woodlands of Cambodia, we safeguard agricultural families to ensure pure, unadulterated botanical essences.
            </p>
          </div>

          <div className="bg-[#090909] border border-gold/15 p-8 rounded-sm space-y-6">
            <h3 className="text-sm font-serif text-gold font-light tracking-wide uppercase border-b border-white/5 pb-4">
              THE BRAND MANIFESTO
            </h3>
            
            <div className="space-y-4 text-xs font-sans font-light text-zinc-400 leading-relaxed">
              <div className="flex gap-3">
                <Award className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>
                  <strong className="text-zinc-200 block mb-1">UNCOMPROMISING MATURATION</strong>
                  Every raw batch is matured inside specialized protective black glass barrels under static temperature control guidelines for a minimum of six calendar months before decanting.
                </p>
              </div>

              <div className="flex gap-3 border-t border-white/5 pt-4">
                <Compass className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <p>
                  <strong className="text-zinc-200 block mb-1">CUSTODY LEDGER</strong>
                  We keep strict ledger records of bottle owners to preserve the exquisite rarity and authenticity of our global releases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Principles Bento Grid */}
        <div className="border-t border-gold/15 pt-20 mb-16">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium">Bespoke Principles</span>
            <h2 className="text-3xl font-serif font-light text-luxury-white uppercase">Sourcing & Craftsmanship</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-luxury-dark/20 p-8 border border-white/5 rounded-sm space-y-4 hover:border-gold/20 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-gold" />
              <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-200">Grasse Extraction</h3>
              <p className="text-zinc-500 text-xs font-sans font-light leading-relaxed">
                Our main flower extractions are conducted in Grasse, France using atmospheric cold-distillation techniques to keep pristine organic profiles intact.
              </p>
            </div>

            <div className="bg-luxury-dark/20 p-8 border border-white/5 rounded-sm space-y-4 hover:border-gold/20 transition-all duration-300">
              <Feather className="w-6 h-6 text-gold" />
              <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-200">Ethical Sourcing</h3>
              <p className="text-zinc-500 text-xs font-sans font-light leading-relaxed">
                We contract directly with independent local flower harvesters, paying 30% above standard trade minimums to encourage ecological preservation.
              </p>
            </div>

            <div className="bg-luxury-dark/20 p-8 border border-white/5 rounded-sm space-y-4 hover:border-gold/20 transition-all duration-300">
              <Flame className="w-6 h-6 text-gold" />
              <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-zinc-200">Bespoke Bottling</h3>
              <p className="text-zinc-500 text-xs font-sans font-light leading-relaxed">
                Each flacon is hand-inspected under high-intensity ultraviolet scanners, polished with silk cloth, and packed by elite curators.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AboutUs;
