import React from 'react';
import { Star, Heart, Eye, ShoppingCart } from 'lucide-react';
import { formatBDT } from '../utils/formatCurrency';

export const ProductCard = ({
  product,
  currentSel,
  onSizeChange,
  onConcentrationChange,
  wishlist,
  toggleWishlist,
  handleOpenProductDetail,
  handleAddToCart,
  calculateItemPrice
}) => {
  // determine base price from selected variation if available
  const variationPrice = (product.variations && product.variations.find(v => v.size === currentSel.size))
    ? product.variations.find(v => v.size === currentSel.size).price
    : product.basePrice;
  const currentPrice = calculateItemPrice(variationPrice, currentSel.size, currentSel.concentration);

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group flex flex-col bg-luxury-dark border border-gold/15 hover:border-gold/45 rounded-sm p-5 transition-all duration-500 shadow-2xl relative"
    >
      {/* Badge Row */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-1.5">
        {(product.badges || []).map((badge) => {
          const badgeClass = badge.color && badge.color.startsWith('bg-') ? badge.color : 'bg-gold';
          const badgeStyle = badge.color && !badge.color.startsWith('bg-') ? { backgroundColor: badge.color } : undefined;
          return (
            <span
              key={`${badge.name || badge.text}-${badge.priority || 0}`}
              className={`${badgeClass} text-black font-semibold uppercase text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-sm shadow-md font-sans ${badgeClass === 'bg-gold' ? 'text-black' : 'text-white'}`}
              style={badgeStyle}
            >
              {badge.text || badge.name}
            </span>
          );
        })}
        {(!product.badges || product.badges.length === 0) && product.isBestSeller && (
          <span className="bg-gold text-black font-semibold uppercase text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-sm shadow-md font-sans">
            BESTSELLER
          </span>
        )}
        {(!product.badges || product.badges.length === 0) && product.isFeatured && (
          <span className="bg-luxury-black border border-gold/40 text-gold font-semibold uppercase text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-sm shadow-md font-sans">
            DECANTRE CHOICE
          </span>
        )}
      </div>

      {/* Wishlist toggle */}
      <button 
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-8 right-8 z-20 p-2 bg-black/60 border border-white/5 hover:border-gold rounded-full text-zinc-400 hover:text-gold transition-all shadow-md"
        title="Add to Vanity List"
      >
        <Heart 
          className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-gold text-gold' : ''}`} 
        />
      </button>

      {/* Image container */}
      <div className="relative aspect-square rounded-sm overflow-hidden bg-black/40 mb-6">
        <img
          src={product.image || (product.raw && product.raw.image) || '/src/assets/images/perfume_for_him_1784311883603.jpg'}
          alt={product.name}
          className="w-full h-full object-cover object-center scale-95 group-hover:scale-100 transition-all duration-700"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/src/assets/images/perfume_for_him_1784311883603.jpg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
          <button 
            onClick={() => handleOpenProductDetail(product)}
            className="bg-luxury-dark border border-gold/40 text-gold hover:text-black hover:bg-gold text-[10px] font-sans font-bold uppercase tracking-widest py-2.5 px-6 rounded-sm transition-all flex items-center gap-2 shadow-2xl"
          >
            <Eye className="w-4 h-4" />
            Quick Atelier View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-sans font-medium">
            {product.category} • {product.scentFamily}
          </span>
          {/* Interactive Rating */}
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 ${i < product.longevity ? 'fill-gold text-gold' : 'text-zinc-800'}`} 
              />
            ))}
          </div>
        </div>

        <h3 className="text-xl font-serif font-light text-luxury-white tracking-wider">
          {product.name}
        </h3>
      </div>

      {/* SELECTION CONTROLS (Size & Concentration) */}
      <div className="border-t border-white/5 pt-4 mt-4 space-y-3">
        
        {/* Size selector pills */}
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          {(product.variations && product.variations.length > 0
            ? product.variations.map(v => v.size)
            : ['50ml', '100ml', '200ml']
          ).map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-2 py-1 rounded-sm text-[9px] font-sans font-medium transition-all ${
                  currentSel.size === size
                    ? 'bg-black text-gold border border-gold'
                    : 'bg-luxury-black border border-white/5 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {size}
              </button>
            ))}
        </div>

      </div>

      {/* Add to Cart & Price Row */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
        <div className="text-left">
          <span className="text-[9px] font-sans uppercase text-zinc-500 block tracking-wider">Price Estimate</span>
          <span className="text-2xl font-serif font-light text-gold">
            {formatBDT(currentPrice)}
          </span>
        </div>

        <button
          onClick={() => handleAddToCart(product, currentSel.size, currentSel.concentration, 1)}
          className="border border-gold hover:bg-gold hover:text-black bg-transparent text-gold font-bold uppercase tracking-widest text-[9px] px-4 py-2.5 rounded-sm transition-all flex items-center gap-1.5 font-sans"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Add to Chest
        </button>
      </div>

    </div>
  );
};
