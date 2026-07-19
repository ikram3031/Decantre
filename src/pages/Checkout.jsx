import React, { useEffect } from 'react';
import { ShieldCheck, Calendar, Lock, CheckCircle, ArrowLeft, Loader2, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Checkout = () => {
  const {
    cart,
    shippingInfo,
    setShippingInfo,
    isProcessingOrder,
    handleCheckoutSubmit,
    orderCompleted,
    cartSubtotal,
    discountAmount,
    shippingFee,
    luxuryTax,
    cartTotal,
    addToast
  } = useApp();

  const navigate = useNavigate();

  // If cart is empty, send them back to shop
  useEffect(() => {
    if (cart.length === 0 && !orderCompleted) {
      addToast('Your shopping chest is empty. Scent sourcing required.', 'info');
      navigate('/shop');
    }
  }, [cart, navigate, orderCompleted]);

  // Reactive redirect to thank you page on success
  useEffect(() => {
    if (orderCompleted) {
      navigate('/thank-you');
    }
  }, [orderCompleted, navigate]);

  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="text-center space-y-4 mb-16 relative py-12 border-b border-gold/15">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">Secured Sourcing Ledger</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            SECURE CHECKOUT
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Specify shipping destinations and exclusive client billing credentials to initiate decant bottling and insured courier transport.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Checkout Form */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-3">
              <Link to="/cart" className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-gold transition-colors font-semibold">
                <ArrowLeft className="w-4 h-4 text-gold" /> Back to Cart
              </Link>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-6">
              
              {/* Shipping Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-300 border-b border-white/5 pb-2">
                  1. Shipping & Handover Coordinates
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Recipient Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Baron Jean-Pierre"
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Sovereign Client Email</label>
                    <input 
                      type="email" 
                      required
                      placeholder="client@noble-regency.com"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Delivery Address</label>
                    <input 
                      type="text" 
                      required
                      placeholder="14 Avenue Montaigne"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">City</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Paris"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Postal Code</label>
                    <input 
                      type="text" 
                      required
                      placeholder="75008"
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-300 border-b border-white/5 pb-2">
                  2. Luxury Secure Payment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Cardholder Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="JEAN PIERRE"
                      value={shippingInfo.cardName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, cardName: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans uppercase"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Credit Card Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        maxLength="19"
                        placeholder="4111 2222 3333 4444"
                        value={shippingInfo.cardNumber}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, cardNumber: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 pl-10 outline-none rounded-sm font-sans"
                      />
                      <Lock className="w-3.5 h-3.5 text-gold/40 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Expiration Date</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        maxLength="5"
                        placeholder="12/28"
                        value={shippingInfo.cardExpiry}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, cardExpiry: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 pl-10 outline-none rounded-sm font-sans"
                      />
                      <Calendar className="w-3.5 h-3.5 text-gold/40 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">CVV Code</label>
                    <input 
                      type="password" 
                      required
                      maxLength="4"
                      placeholder="•••"
                      value={shippingInfo.cardCvv}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, cardCvv: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons and Security badges */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <button
                  type="submit"
                  disabled={isProcessingOrder}
                  className="w-full bg-gold text-black text-xs font-sans font-bold uppercase tracking-widest py-4 rounded-sm hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gold/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      COMPILING SECURITY LEDGER...
                    </>
                  ) : (
                    <>
                      AUTHORIZE SECURE PURCHASE — ${cartTotal}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-6 text-[10px] text-zinc-500 font-sans font-medium py-2">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-gold/60" /> SSL SECURED
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-gold/60" /> 256-BIT ENCRYPTION
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-gold/60" /> INSURED COURIER
                  </span>
                </div>
              </div>

            </form>
          </div>

          {/* Checkout Order Sidebar Summary */}
          <div className="lg:col-span-5 bg-luxury-dark/20 border border-gold/15 p-6 rounded-sm space-y-6 h-fit">
            <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-300 border-b border-white/5 pb-4">
              COUTURE SELECTION LEDGER
            </h3>

            {/* Product list */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <h4 className="font-serif font-light text-zinc-200">{item.product.name}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono block">
                      {item.size} • {item.concentration} • Qty {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono text-gold font-semibold">${item.unitPrice * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-white/5 pt-4 space-y-2.5 font-sans text-xs">
              <div className="flex justify-between text-zinc-400 font-light">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-300">${cartSubtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-light">
                  <span>Sovereign Discount</span>
                  <span className="font-mono">-${discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400 font-light">
                <span>Courier Shipping</span>
                <span className="font-mono text-zinc-300">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400 font-light">
                <span>Luxury Duties & Customs</span>
                <span className="font-mono text-zinc-300">${luxuryTax}</span>
              </div>

              {shippingInfo.giftWrap && (
                <div className="flex justify-between text-gold/80 font-light">
                  <span>Velvet Presentation Wrapping</span>
                  <span className="font-mono">+$15</span>
                </div>
              )}

              <div className="border-t border-gold/20 pt-4 flex justify-between items-end">
                <span className="text-xs font-sans font-bold uppercase text-zinc-300 tracking-wider">Total Charge</span>
                <span className="text-lg font-serif text-gold font-semibold font-mono">${cartTotal}</span>
              </div>
            </div>

            {/* Quality Creed */}
            <div className="border-t border-white/5 pt-5 space-y-2 text-center sm:text-left">
              <span className="text-[9px] uppercase tracking-widest text-gold font-mono block font-semibold">THE SOVEREIGN PROMISE</span>
              <p className="text-[10px] text-zinc-500 font-sans font-light leading-relaxed">
                If the sillage does not command absolute awe on first contact, our private returns department will initiate a sovereign replacements protocol within thirty calendar days.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default Checkout;
