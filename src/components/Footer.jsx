import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Facebook, Mail, Instagram } from 'lucide-react';

export const Footer = ({ startQuiz, addToast }) => {
  return (
    <footer id="main-footer" className="bg-black border-t border-gold/15 text-zinc-400 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand Column */}
        <div className="space-y-4 text-left">
          <h3 className="text-sm font-serif font-light tracking-[0.35em] text-gold uppercase">
            Decantre
          </h3>
          <p className="text-[11px] font-sans font-light leading-relaxed text-zinc-400">
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
            <li><Link to="/about-us" className="hover:text-gold transition-colors">Decantre Heritage</Link></li>
            <li><Link to="/shop" className="hover:text-gold transition-colors">The Boutique Shop</Link></li>
            <li><Link to="/catalog" className="hover:text-gold transition-colors">Decant Collection</Link></li>
            <li><button onClick={startQuiz} className="hover:text-gold transition-colors text-left font-light cursor-pointer">Olfactory Assessment Quiz</button></li>
          </ul>
        </div>

        {/* Courier & Services */}
        <div className="space-y-4 text-left">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">Client Services</h4>
          <ul className="space-y-2 text-[11px] font-sans font-light text-zinc-400">
            <li><Link to="/privacy-policy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-condition" className="hover:text-gold transition-colors">Terms and Conditions</Link></li>
            <li><Link to="/return-policy" className="hover:text-gold transition-colors">Return & Refund Policy</Link></li>
            <li><Link to="/contact-us" className="hover:text-gold transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4 text-left">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-200 font-sans">The Ledger Dispatch</h4>
          <p className="text-[11px] font-sans font-light text-zinc-400">
            Join the distinguished inner circle of Decantre for rare vintage reserves, seasonal extract previews, and member-only coupon credentials.
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
          © 2026 Decantre. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="text-[9px] text-zinc-500 tracking-widest uppercase hidden sm:inline">Connect with us</span>
          <div className="flex items-center gap-3">
            <button className="text-zinc-400 hover:text-gold transition-colors" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </button>
            <button className="text-zinc-400 hover:text-gold transition-colors" aria-label="Email">
              <Mail className="w-4 h-4" />
            </button>
            <button className="text-zinc-400 hover:text-gold transition-colors" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
