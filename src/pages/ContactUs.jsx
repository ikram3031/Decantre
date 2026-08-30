import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { useApp } from '../core/context/AppContext';
import { submitContactMessage } from '../core/lib/api';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LcevJ8tAAAAALl_komvYqm4vwHZ5ftyQ3F7B7Me';

// Contact Us page component providing official liaison channels and inquiry submission with reCAPTCHA v2
export const ContactUs = () => {
  const { addToast } = useApp();
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubject, setFormSubject] = useState('General Inquiry');
  const [formMessage, setFormMessage] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaContainerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaContainerRef.current) {
        if (widgetIdRef.current === null) {
          try {
            widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
              sitekey: RECAPTCHA_SITE_KEY,
              theme: 'dark',
              callback: (token) => {
                setCaptchaToken(token);
              },
              'expired-callback': () => {
                setCaptchaToken('');
              },
              'error-callback': () => {
                setCaptchaToken('');
              },
            });
          } catch (err) {
            console.error('reCAPTCHA render error:', err);
          }
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderRecaptcha();
    } else {
      const scriptId = 'google-recaptcha-v2-script';
      window.onRecaptchaLoadCallback = () => {
        renderRecaptcha();
      };
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formMessage.trim()) {
      addToast('Please fill out all required fields (Name, Email, and Message).', 'error');
      return;
    }

    if (RECAPTCHA_SITE_KEY && window.grecaptcha && !captchaToken) {
      addToast('Please complete the reCAPTCHA verification.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactMessage({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        subject: formSubject.trim(),
        message: formMessage.trim(),
        recaptchaToken: captchaToken,
      });

      addToast('Thank you! Your message has been sent successfully.', 'success');

      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormSubject('General Inquiry');
      setFormMessage('');
      setCaptchaToken('');

      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    } catch (err) {
      console.error('Contact submission failed:', err);
      addToast(err?.message || 'Failed to submit your message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const salons = [
    {
      city: 'Decantre Flagship Store',
      address: 'Ground Floor, House 20, Road 10, Sector 13, Uttara, Dhaka',
      phone: '+880 1869-151550',
      email: 'support@decantrebd.com',
      hours: 'Mon - Sun: 10:00 AM - 10:00 PM'
    }
  ];

  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-4 mb-20 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">Get in Touch</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            CONTACT DECANTRE
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Our dedicated support team is here to assist you with any inquiries, product information, or assistance you may require. Please fill out the form below, and we will respond promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium font-bold">DECANTRE</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-light text-luxury-white">OUR STORE LOCATION</h2>
              <div className="h-[1px] w-12 bg-gold/40 mt-3"></div>
            </div>

            <div className="space-y-6">
              {salons.map((salon) => (
                <div 
                  key={salon.city}
                  className="bg-zinc-900/90 border border-zinc-700/60 hover:border-gold p-8 rounded-sm space-y-5 transition-all duration-300 shadow-xl"
                >
                  <h3 className="text-base font-serif text-gold tracking-widest uppercase border-b border-white/10 pb-3 flex items-center justify-between">
                    <span>{salon.city}</span>
                    <span className="text-[9px] font-sans font-bold text-black bg-gold px-2 py-0.5 rounded-xs tracking-wider">OFFICIAL</span>
                  </h3>

                  <div className="space-y-3.5 text-xs font-sans font-light text-zinc-300">
                    <p className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                      <span className="leading-relaxed">{salon.address}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gold shrink-0" />
                      <span className="font-mono text-zinc-200">{salon.phone}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gold shrink-0" />
                      <span className="text-gold hover:underline cursor-pointer font-mono">{salon.email}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gold shrink-0" />
                      <span>{salon.hours}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-700/60 p-6 sm:p-10 rounded-sm space-y-6 shadow-xl">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-[9px] uppercase tracking-widest font-sans font-semibold">How we can help</span>
              </div>
              <h3 className="text-lg font-serif font-light text-luxury-white">
                Send us your Inquiry
              </h3>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder=""
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder=""
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Subject of Correspondence</label>
                  <select
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Private Consultation">Private Consultation</option>
                    <option value="Order Assistance">Order Assistance</option>
                    <option value="Product Information">Product Information</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Contact Phone (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-2 font-semibold">Your Message</label>
                <textarea
                  required
                  rows="5"
                  placeholder=""
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/80 focus:border-gold/60 text-zinc-200 text-xs p-4 outline-none rounded-sm font-sans leading-relaxed resize-none"
                />
              </div>

              <div className="pt-1">
                <div ref={recaptchaContainerRef} className="flex justify-start overflow-x-auto py-1"></div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 font-sans font-light flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-gold/50" /> We aim to respond within one business day.
                  </span>
                  <span className="text-[9px] text-zinc-600 font-sans font-light flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/70" /> Protected by Google reCAPTCHA
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-gold hover:bg-gold/90 text-black text-[10px] font-sans font-bold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center gap-2 shadow-lg shadow-gold/5 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                  <Send className="w-3 h-3 text-black" />
                </button>
              </div>

            </form>
          </div>

        </div>

        <div className="mt-16 sm:mt-20 w-full overflow-hidden rounded-sm border border-gold/30 bg-black shadow-2xl">
          <div className="px-6 py-4 bg-luxury-dark/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold" />
              <h3 className="text-xs uppercase tracking-[0.25em] font-serif font-light text-luxury-white">
                STORE LOCATION MAP
              </h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono">House 20, Road 10, Sector 13, Uttara, Dhaka</span>
          </div>
          <iframe 
            title="Decantre Location Map"
            src="https://maps.google.com/maps?q=House%2020,%20Road%2010,%20Sector%2013,%20Uttara,%20Dhaka&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[400px] border-0 filter grayscale contrast-125 invert opacity-90 hover:opacity-100 transition-opacity"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </div>
  );
};
export default ContactUs;
