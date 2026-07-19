import React, { useEffect } from 'react';
import {
  ShieldCheck as IconShield,
  CheckCircle as IconCheck,
  ArrowLeft as IconBack,
  Loader2 as IconLoader,
  Award as IconAward,
  Lock as IconLock,
  Calendar as IconCalendar,
  ChevronDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatBDT as fmtBDT } from '../utils/formatCurrency';
import { useApp } from '../context/AppContext';
import { DISTRICTS as districtData } from '../lib/districts.js';

export const Checkout = () => {
  const {
    cart,
    shippingInfo,
    setShippingInfo,
    shippingAddress,
    setShippingAddress,
    paymentMethod,
    setPaymentMethod,
    sameAsBilling,
    setSameAsBilling,
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

  const [isDistrictOpen, setIsDistrictOpen] = React.useState(false);
  const [isShipDistrictOpen, setIsShipDistrictOpen] = React.useState(false);

  const {
    fullName,
    phone,
    email,
    address,
    city,
    thana,
    district,
    zip,
    giftWrap
  } = shippingInfo;

  const {
    address: shipAddress,
    thana: shipThana,
    district: shipDistrict,
    zip: shipZip
  } = shippingAddress;

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
                <IconBack className="w-4 h-4 text-gold" /> Back to Cart
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
                      value={fullName}
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
                      value={email}
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
                      value={address}
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
                      value={city}
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
                      value={zip}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4 pt-4">
                <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-300 border-b border-white/5 pb-2">
                  2. Preferred Handover Method
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer rounded-sm border px-4 py-3 text-[10px] uppercase tracking-widest font-semibold ${paymentMethod === 'cod' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-black/40 text-zinc-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="sr-only"
                      />
                      Cash on Delivery
                    </label>
                    <label className={`cursor-pointer rounded-sm border px-4 py-3 text-[10px] uppercase tracking-widest font-semibold ${paymentMethod === 'instore' ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 bg-black/40 text-zinc-300'}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="instore"
                        checked={paymentMethod === 'instore'}
                        onChange={() => setPaymentMethod('instore')}
                        className="sr-only"
                      />
                      Instore Pickup
                    </label>
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    {paymentMethod === 'cod'
                      ? 'Select Cash on Delivery to receive your order directly at your address. A shipping fee applies unless the order qualifies for complimentary courier transport.'
                      : 'Select Instore Pickup to collect your order from our boutique. Courier shipping is waived and you will receive pickup details by email.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1XXX XXX XXX"
                      value={phone}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Thana / Subdistrict</label>
                    <input
                      type="text"
                      required
                      placeholder="Dhanmondi"
                      value={thana}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, thana: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">District</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Dhaka"
                        value={district}
                        onFocus={() => setIsDistrictOpen(true)}
                        onBlur={() => setIsDistrictOpen(false)}
                        onChange={(e) => {
                          setShippingInfo({ ...shippingInfo, district: e.target.value });
                          setIsDistrictOpen(true);
                        }}
                        className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans pr-10"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    {isDistrictOpen && (
                      <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-950 border border-white/10 rounded-sm z-50 py-1 shadow-2xl divide-y divide-white/5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                        {districtData
                          .filter(d => d.name.toLowerCase().includes((district || '').toLowerCase()))
                          .map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setShippingInfo({ ...shippingInfo, district: d.name });
                                setIsDistrictOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-gold/15 text-xs transition-colors font-sans cursor-pointer"
                            >
                              {d.name}
                            </button>
                          ))}
                        {districtData.filter(d => d.name.toLowerCase().includes((district || '').toLowerCase())).length === 0 && (
                          <div className="px-4 py-2 text-zinc-500 text-xs font-sans">
                            No districts found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Postal Code</label>
                    <input
                      type="text"
                      required
                      placeholder="1207"
                      value={zip}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zip: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                    />
                  </div>
                </div>

                {paymentMethod === 'cod' && (
                  <div className="pt-4 border-t border-white/10">
                    <label className="flex items-center gap-3 text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={sameAsBilling}
                        onChange={(e) => setSameAsBilling(e.target.checked)}
                        className="h-4 w-4 rounded-sm border border-white/10 bg-black text-gold focus:ring-gold"
                      />
                      Use billing address as shipping address
                    </label>
                  </div>
                )}

                {paymentMethod === 'cod' && !sameAsBilling && (
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">Shipping Address</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Shipping Street Address</label>
                        <input
                          type="text"
                          required
                          placeholder="House 24, Road 18"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Thana / Subdistrict</label>
                        <input
                          type="text"
                          required
                          placeholder="Gulshan"
                          value={shippingAddress.thana}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, thana: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                        />
                      </div>

                      <div className="relative">
                        <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">District</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            placeholder="Dhaka"
                            value={shippingAddress.district}
                            onFocus={() => setIsShipDistrictOpen(true)}
                            onBlur={() => setIsShipDistrictOpen(false)}
                            onChange={(e) => {
                              setShippingAddress({ ...shippingAddress, district: e.target.value });
                              setIsShipDistrictOpen(true);
                            }}
                            className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans pr-10"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                        {isShipDistrictOpen && (
                          <div className="absolute left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-950 border border-white/10 rounded-sm z-50 py-1 shadow-2xl divide-y divide-white/5 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {districtData
                              .filter(d => d.name.toLowerCase().includes((shippingAddress.district || '').toLowerCase()))
                              .map((d) => (
                                <button
                                  key={d.id}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setShippingAddress({ ...shippingAddress, district: d.name });
                                    setIsShipDistrictOpen(false);
                                  }}
                                  className="w-full text-left px-4 py-2 text-zinc-300 hover:text-white hover:bg-gold/15 text-xs transition-colors font-sans cursor-pointer"
                                >
                                  {d.name}
                                </button>
                              ))}
                            {districtData.filter(d => d.name.toLowerCase().includes((shippingAddress.district || '').toLowerCase())).length === 0 && (
                              <div className="px-4 py-2 text-zinc-500 text-xs font-sans">
                                No districts found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-zinc-400 block mb-1.5 font-semibold">Postal Code</label>
                        <input
                          type="text"
                          required
                          placeholder="1212"
                          value={shippingAddress.zip}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                          className="w-full bg-black/40 border border-white/10 focus:border-gold/60 text-zinc-200 text-xs px-4 py-3 outline-none rounded-sm font-sans"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 bg-black/30 border border-white/10 rounded-sm mt-2">
                  <input
                    type="checkbox"
                    id="gift-wrap-checkbox"
                    checked={giftWrap}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, giftWrap: e.target.checked })}
                    className="rounded-sm text-gold focus:ring-gold h-4 w-4 bg-black border-white/10"
                  />
                  <label htmlFor="gift-wrap-checkbox" className="text-[11px] text-zinc-400 font-sans font-light cursor-pointer select-none">
                    <strong className="text-gold font-medium">Include Presentation Box (+{fmtBDT(15)})</strong>
                    <br />Hand-finish your order inside a black velvet case with custom wax seal.
                  </label>
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
                      <IconLoader className="w-4 h-4 animate-spin text-black" />
                      COMPILING SECURITY LEDGER...
                    </>
                      ) : (
                        <>
                          AUTHORIZE SECURE PURCHASE — {fmtBDT(cartTotal)}
                        </>
                      )}
                </button>

                <div className="flex items-center justify-center gap-6 text-[10px] text-zinc-500 font-sans font-medium py-2">
                  <span className="flex items-center gap-1.5">
                    <IconShield className="w-4 h-4 text-gold/60" /> SSL SECURED
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <IconLock className="w-3.5 h-3.5 text-gold/60" /> 256-BIT ENCRYPTION
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <IconAward className="w-4 h-4 text-gold/60" /> INSURED COURIER
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
                  <span className="font-mono text-gold font-semibold">{fmtBDT(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-white/5 pt-4 space-y-2.5 font-sans text-xs">
                <div className="flex justify-between text-zinc-400 font-light">
                <span>Subtotal</span>
                <span className="font-mono text-zinc-300">{fmtBDT(cartSubtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-light">
                  <span>Sovereign Discount</span>
                  <span className="font-mono">-{fmtBDT(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-zinc-400 font-light">
                <span>Courier Shipping</span>
                <span className="font-mono text-zinc-300">
                  {shippingFee === 0 ? 'Complimentary' : fmtBDT(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400 font-light">
                <span>Luxury Duties & Customs</span>
                <span className="font-mono text-zinc-300">{fmtBDT(luxuryTax)}</span>
              </div>

              {giftWrap && (
                <div className="flex justify-between text-gold/80 font-light">
                  <span>Velvet Presentation Wrapping</span>
                  <span className="font-mono">+{fmtBDT(15)}</span>
                </div>
              )}

              <div className="border-t border-gold/20 pt-4 flex justify-between items-end">
                <span className="text-xs font-sans font-bold uppercase text-zinc-300 tracking-wider">Total Charge</span>
                <span className="text-lg font-serif text-gold font-semibold font-mono">{fmtBDT(cartTotal)}</span>
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
