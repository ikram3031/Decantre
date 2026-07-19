import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = ({ startQuiz, addToast }) => {
  return (
    <footer id="main-footer" className="bg-black border-t border-gold/15 text-zinc-400 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-1">
            <Logo className="w-12 h-12" showText={true} />
          </div>
          <p className="text-[11px] font-sans font-light leading-relaxed text-zinc-400 mt-2">
            Crafting persistent, hand-formulated, sovereign amber fragrances since the dawn of memory. Each formulation is recorded inside our master ledger in Paris.
          </p>
          <div className="flex items-center gap-2.5 pt-1 text-gold">
            <Compass className="w-4 h-4" />
            <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-gold font-sans">Pure Gold Authenticity</span>
          </div>
        </div>

        {/* Sensory Portals */}
        <div className="space-y-4 text-left">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">Sensory Portals</h4>
          <ul className="space-y-2 text-[11px] font-sans font-light text-zinc-400">
            <li><Link to="/about-us" className="hover:text-gold transition-colors">Atelier Heritage</Link></li>
            <li><Link to="/shop" className="hover:text-gold transition-colors">The Boutique Shop</Link></li>
            <li><Link to="/catalog" className="hover:text-gold transition-colors">Decant Collection</Link></li>
            <li><button onClick={startQuiz} className="hover:text-gold transition-colors text-left font-light cursor-pointer">Olfactory Assessment Quiz</button></li>
          </ul>
        </div>

        {/* Courier & Services */}
        <div className="space-y-4 text-left">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">Client Services</h4>
          <ul className="space-y-2 text-[11px] font-sans font-light text-zinc-400">
            <li><Link to="/contact-us" className="hover:text-gold transition-colors">Book Private Salon Session</Link></li>
            <li><Link to="/return-policy" className="hover:text-gold transition-colors">Sovereign Refund Guarantee</Link></li>
            <li><Link to="/terms-and-condition" className="hover:text-gold transition-colors">Discretion & Purchase Agreements</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4 text-left">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">The Ledger Dispatch</h4>
          <p className="text-[11px] font-sans font-light text-zinc-400">
            Join the distinguished inner circle of L'Élixir for rare vintage reserves, seasonal extract previews, and member-only coupon credentials.
          </p>
          
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="noble-member@domain.com"
              className="bg-[#0c0c0c] border border-white/5 rounded-none px-3 py-2 text-xs font-light text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-gold/40 w-full"
            />
            <button 
              onClick={() => addToast('You have been officially logged in our premium client ledger.', 'success')}
              className="bg-transparent border border-gold hover:bg-gold hover:text-black text-gold font-bold uppercase tracking-wider text-[10px] px-4 rounded-none transition-all cursor-pointer"
            >
              Sign
            </button>
          </div>
        </div>

      </div>

      {/* Bottom copyright row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[9px] text-zinc-500 tracking-wider">
          © 2026 L'Élixir Perfume Atelier International. All Sovereign Rights Reserved. Designed under premium brand conditions.
        </p>
        <div className="flex gap-4 text-[9px] text-zinc-500 tracking-widest uppercase">
          <Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Charter</Link>
          <span>•</span>
          <Link to="/terms-and-condition" className="hover:text-gold transition-colors">Client Discretion Protocol</Link>
          <span>•</span>
          <Link to="/return-policy" className="hover:text-gold transition-colors">Refund Charter</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
