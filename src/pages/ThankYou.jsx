import React, { useEffect } from 'react';
import { ShieldCheck, Calendar, Compass, ArrowRight, FileText, Sparkles, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../core/context/AppContext';
import { pixelPurchase } from '../utils/fbPixel';

export const ThankYou = () => {
  const location = useLocation();
  const {
    shippingInfo,
    orderNumber: apiOrderNumber,
    handleResetCheckout,
    addToast,
    currentTheme,
    cart,
    cartTotal,
  } = useApp();

  const isLight = currentTheme === 'light';

  const searchParams = new URLSearchParams(location.search);
  const orderIdFromUrl = searchParams.get('orderId') || searchParams.get('orderNumber') || searchParams.get('id');
  const persistedOrderNumber = typeof window !== 'undefined' ? window.localStorage.getItem('luxury_last_order_number') : null;
  const rawOrderNumber = orderIdFromUrl || apiOrderNumber || persistedOrderNumber || "";
  const orderNumber = rawOrderNumber ? (rawOrderNumber.toString().startsWith('D') ? rawOrderNumber : `D${rawOrderNumber}`) : "";
  const formattedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Greet client elegantly
  useEffect(() => {
    addToast('Your order has been placed successfully!', 'success');
  }, [addToast]);

  // Facebook Pixel – Purchase event (fires once per order)
  useEffect(() => {
    if (!rawOrderNumber) return;
    const flagKey = `fb_pixel_purchase_${rawOrderNumber}`;
    if (sessionStorage.getItem(flagKey)) return; // prevent duplicate fires
    const savedCart = (() => {
      try {
        return JSON.parse(localStorage.getItem('luxury_last_order_cart') || '[]');
      } catch { return []; }
    })();
    const savedTotal = Number(localStorage.getItem('luxury_last_order_total') || cartTotal || 0);
    const itemsToReport = (savedCart.length ? savedCart : cart) || [];
    pixelPurchase(rawOrderNumber, itemsToReport, savedTotal);
    sessionStorage.setItem(flagKey, '1');
  }, [rawOrderNumber]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`py-12 sm:py-20 ${isLight ? 'bg-white text-zinc-900' : 'bg-luxury-black text-luxury-white'} animate-fade-in text-left`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Header Card */}
        <div className={`border p-8 sm:p-12 rounded-sm text-center space-y-6 relative overflow-hidden shadow-2xl ${isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-200'}`}>
          <div className="absolute -inset-px bg-gradient-to-b from-gold/5 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Success Check Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-gold/30 to-gold/5 border-2 border-gold rounded-full mx-auto flex items-center justify-center shadow-xl shadow-gold/5 relative group hover:scale-105 transition-transform duration-300">
            <CheckCircle className="w-10 h-10 text-gold" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">Order Confirmed</span>
            <h1 className={`text-3xl sm:text-4xl font-serif font-light tracking-wide ${isLight ? 'text-black' : 'text-luxury-white'}`}>
              THANK YOU FOR YOUR ORDER
            </h1>
            <p className={`text-xs sm:text-sm font-sans font-light max-w-md mx-auto leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              We have received your order and are processing it. A confirmation details summary is shown below.
            </p>
          </div>

          <div className="h-[1px] w-24 bg-gold/20 mx-auto"></div>

          {/* Order metadata */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-[10px] uppercase tracking-widest text-zinc-400 font-mono font-semibold pt-2">
            <div className={`border p-3 rounded-sm ${isLight ? 'border-zinc-200 bg-white text-zinc-800' : 'border-zinc-700/50 bg-zinc-800/80 text-zinc-400'}`}>
              <span className="block text-[8px] text-zinc-400 mb-1">Order No</span>
              <span className="text-gold font-bold">{orderNumber}</span>
            </div>
            <div className={`border p-3 rounded-sm ${isLight ? 'border-zinc-200 bg-white text-zinc-800' : 'border-zinc-700/50 bg-zinc-800/80 text-zinc-400'}`}>
              <span className="block text-[8px] text-zinc-400 mb-1">Order Date</span>
              <span className={isLight ? 'text-zinc-800' : 'text-zinc-200'}>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className={`mt-10 border p-6 sm:p-8 rounded-sm space-y-6 shadow-xl ${isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-200'}`}>
          <div className={`flex items-center gap-2.5 border-b pb-4 ${isLight ? 'border-zinc-200' : 'border-zinc-700/50'}`}>
            <Sparkles className="w-5 h-5 text-gold shrink-0" />
            <h3 className={`text-xs font-sans font-bold uppercase tracking-widest ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>
              DELIVERY INFORMATION
            </h3>
          </div>

          <div className={`space-y-4 text-xs font-sans font-light leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
            {shippingInfo.fullName ? (
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold block">Shipping Address</span>
                <p className={`font-mono ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>
                  {shippingInfo.fullName}<br />
                  {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.zip}<br />
                  <span className="text-gold/80 italic">{shippingInfo.phone} ({shippingInfo.email})</span>
                </p>
              </div>
            ) : (
              <p>Your order details and tracking status will be communicated to your contact phone number.</p>
            )}
          </div>
        </div>

        {/* Next steps */}
        <div className={`mt-10 border p-6 rounded-sm space-y-4 shadow-xl ${isLight ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-200'}`}>
          <h4 className={`text-xs font-sans font-bold uppercase tracking-wider ${isLight ? 'text-zinc-800' : 'text-zinc-200'}`}>WHAT HAPPENS NEXT</h4>
          <ul className={`space-y-3 text-xs font-sans font-light ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
            <li className="flex gap-2">
              <span className="text-gold font-mono">•</span>
              <span>Our team will prepare and pack your order within 24 hours.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold font-mono">•</span>
              <span>Our delivery partner will contact you prior to delivery.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gold font-mono">•</span>
              <span>For Cash on Delivery, please pay the amount to the rider upon receiving your package.</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            onClick={handleResetCheckout}
            className="inline-flex items-center gap-2 bg-gold text-black text-xs font-sans font-bold uppercase tracking-widest px-10 py-4 rounded-sm hover:bg-gold/90 transition-all duration-300 shadow-lg shadow-gold/5"
          >
            Continue Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
export default ThankYou;
