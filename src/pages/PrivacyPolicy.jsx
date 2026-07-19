import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-16 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Client Discretion Protocol</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            PRIVACY CHARTER
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Please read our official guidelines regarding how Decantre protects confidential client purchase history, delivery logs, and premium credentials.
          </p>
        </div>

        {/* Content Block */}
        <div className="bg-[#090909] border border-white/5 p-8 sm:p-10 rounded-sm space-y-8 font-sans text-xs text-zinc-400 leading-relaxed">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              1. CONFIDENTIALITY PROTOCOL
            </h3>
          </div>
          <p>
            At Decantre Perfume Atelier, our clients' privacy is paramount. We maintain high-end secure servers and localized, physical ledger backups in our Paris headquarters. Your digital logs, private consult requests, and olfactory quiz results are strictly used to curate custom decant recommendations.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              2. SECURED TRANSACTIONS
            </h3>
          </div>
          <p>
            All financial transactions are routed through fully encrypted 256-bit secure gateway sockets. Decantre does not save raw credit card files or CVV hashes in its database. All transaction keys are tokens stored in premium merchant bank vaults complying with standard PCI-DSS guidelines.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              3. COOKIES & TRACKING CHARTER
            </h3>
          </div>
          <p>
            We utilize subtle browser session storage objects and cookies solely to keep your virtual perfume collection chest (shopping cart) and vanity favorites lists active between visits. We strictly forbid third-party data-selling or telemetry sharing.
          </p>

          <div className="flex items-center gap-3 border-b border-white/5 pb-4 pt-4">
            <ShieldCheck className="w-5 h-5 text-gold" />
            <h3 className="text-sm font-serif text-gold tracking-wide uppercase">
              4. ACCESS & DELETION REQUESTS
            </h3>
          </div>
          <p>
            Distinguished members have the absolute sovereign right to request complete erasure of their transaction profiles, billing addresses, and digital correspondances. Please contact our private concierge bureau at <span className="text-gold font-mono">discretion@decantre.com</span> to execute a total data dispersion protocol.
          </p>
        </div>

      </div>
    </div>
  );
};
export default PrivacyPolicy;
