import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactUs = () => {
  const { addToast } = useApp();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('Boutique Appointment');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      addToast('Please satisfy all inquiry coordinates.', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      addToast('Inquiry received. A sovereign liaison will reply in 12 hours.', 'success');
      
      // Reset form
      setFormName('');
      setFormEmail('');
      setFormMessage('');
    }, 1500);
  };

  const salons = [
    {
      city: 'Paris Salon',
      address: '14 Avenue Montaigne, 75008 Paris',
      phone: '+33 1 42 68 53 00',
      email: 'paris@decantre.com',
      hours: 'Mon - Sat: 10:00 AM - 7:00 PM'
    },
    {
      city: 'London Atelier',
      address: '28 Bruton Place, Mayfair, London W1J 6NP',
      phone: '+44 20 7493 0000',
      email: 'london@decantre.com',
      hours: 'Mon - Sat: 11:00 AM - 6:30 PM'
    },
    {
      city: 'Monaco Private Vault',
      address: '6 Boulevard des Moulins, 98000 Monaco',
      phone: '+377 97 97 00 00',
      email: 'monaco@decantre.com',
      hours: 'By Elite Appointment Only'
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-20 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Private Liaison Bureau</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            CONTACT DECANTRE
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Reach out to our VIP concierge team. Book private fragrance blending sessions or inquire about bespoke commission bottles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Salons Location Info list */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium">Bespoke Salons</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-luxury-white">OUR WORLDWIDE COORDINATES</h2>
              <div className="h-[1px] w-12 bg-gold/40 mt-3"></div>
            </div>

            <div className="space-y-6">
              {salons.map((salon) => (
                <div 
                  key={salon.city}
                  className="bg-luxury-dark/20 border border-white/5 hover:border-gold/20 p-6 rounded-sm space-y-4 transition-all duration-300"
                >
                  <h3 className="text-sm font-serif text-gold tracking-wide uppercase border-b border-white/5 pb-2">
                    {salon.city}
                  </h3>

                  <div className="space-y-2 text-xs font-sans font-light text-zinc-400">
                    <p className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-gold/60 shrink-0 mt-0.5" />
                      <span>{salon.address}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-gold/60 shrink-0" />
                      <span>{salon.phone}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-gold/60 shrink-0" />
                      <span className="text-gold/80 hover:underline cursor-pointer">{salon.email}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-gold/60 shrink-0" />
                      <span>{salon.hours}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive contact booking form */}
          <div className="lg:col-span-7 bg-luxury-dark/30 border border-gold/15 p-6 sm:p-10 rounded-sm space-y-6">
            <div className="space-y-2 border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-sans font-semibold">Concierge Dispatch</span>
              </div>
              <h3 className="text-lg font-serif font-light text-luxury-white">
                TRANSMIT AN ENCRYPTED INQUIRY
              </h3>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Countess Anastasia"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Digital Correspondence Email</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. anastasia@noble.ru"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Subject of Correspondence</label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-300 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                >
                  <option value="Boutique Appointment">Schedule Private Salon Appointment</option>
                  <option value="Custom Formula Commission">Bespoke Fragrance Commission</option>
                  <option value="Sovereign Registry Inquiries">Custody & Order Ledger Discretion</option>
                  <option value="General Art Inquiries">Sourcing & Sillage Preservation Inquiry</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Your Message / Request coordinates</label>
                <textarea
                  required
                  rows="5"
                  placeholder="Describe your requested scent parameters, preferred consultation times, or specific questions..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs p-4 outline-none rounded-sm font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] text-zinc-500 font-sans font-light flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-gold/50" /> Fully Encrypted Communication Protocol
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gold hover:bg-gold/90 text-black text-[10px] font-sans font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold/5 disabled:opacity-50"
                >
                  {isSubmitting ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'}
                  <Send className="w-3 h-3 text-black" />
                </button>
              </div>

            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
export default ContactUs;
