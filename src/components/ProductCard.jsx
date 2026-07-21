import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { formatBDT } from '../utils/formatCurrency';
import { useApp } from '../context/AppContext';

export const ProductCard = ({
  product,
  currentSel,
  onSizeChange,
  onConcentrationChange,
  wishlist,
  toggleWishlist,
  handleOpenProductDetail,
  handleAddToCart,
  calculateItemPrice,
  hideMobileVariations = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { currentTheme } = useApp();
  const isLight = currentTheme === 'light';

  // determine base price from selected variation if available
  const variationPrice = (product.variations && product.variations.find(v => v.size === currentSel.size))
    ? product.variations.find(v => v.size === currentSel.size).price
    : product.basePrice;
  const currentPrice = calculateItemPrice(variationPrice, currentSel.size, currentSel.concentration);

  return (
    <div 
      id={`product-card-${product.id}`}
      className={`group flex flex-col h-full ${
        isLight ? 'bg-white border-zinc-200 hover:border-gold/60 text-black shadow-md' : 'bg-luxury-dark border-gold/15 hover:border-gold/45 text-white shadow-2xl'
      } rounded-[4px] pt-13 pb-1.5 px-5 transition-all duration-500 relative`}
    >
      {/* Badge Row */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-1.5">
        {(product.badges || []).map((badge) => {
          const badgeClass = badge.color && badge.color.startsWith('bg-') ? badge.color : 'bg-gold';
          const badgeStyle = badge.color && !badge.color.startsWith('bg-') ? { backgroundColor: badge.color } : undefined;
          return (
            <span
              key={`${badge.name || badge.text}-${badge.priority || 0}`}
              className={`${badgeClass} text-black font-semibold uppercase text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-[4px] shadow-md font-sans ${badgeClass === 'bg-gold' ? 'text-black' : 'text-white'}`}
              style={badgeStyle}
            >
              {badge.text || badge.name}
            </span>
          );
        })}
        {(!product.badges || product.badges.length === 0) && product.isBestSeller && (
          <span className="bg-gold text-black font-semibold uppercase text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-[4px] shadow-md font-sans">
            BESTSELLER
          </span>
        )}
        {(!product.badges || product.badges.length === 0) && product.isFeatured && (
          <span className="bg-luxury-black border border-gold/40 text-gold font-semibold uppercase text-[8px] tracking-[0.2em] px-2.5 py-1 rounded-[4px] shadow-md font-sans">
            DECANTRE CHOICE
          </span>
        )}
      </div>

      {/* Wishlist toggle */}
      <button 
        onClick={() => toggleWishlist(product.id)}
        className="absolute top-8 right-8 z-20 p-2 bg-black/60 border border-gold/40 hover:border-gold rounded-full text-zinc-400 hover:text-gold transition-all shadow-md cursor-pointer"
      >
        <Heart 
          className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-gold text-gold' : ''}`} 
        />
      </button>

      {/* Image container with high-fidelity skeleton loading state */}
      <div className="relative aspect-square rounded-sm overflow-hidden bg-[#0a0a0a] mb-6 flex-shrink-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-900/80 animate-pulse z-10" />
        )}
        <Link to={`/product?did=${product.id}`} className="block w-full h-full">
          <img
            src={product.image || (product.raw && product.raw.image) || '/src/assets/images/perfume_for_him_1784311883603.jpg'}
            alt={product.name}
            className={`w-full h-full object-cover object-center scale-95 group-hover:scale-100 transition-all duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/src/assets/images/perfume_for_him_1784311883603.jpg'; setImageLoaded(true); }}
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6 pointer-events-none">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleOpenProductDetail(product);
            }}
            className="bg-luxury-dark border border-gold/40 text-gold hover:text-black hover:bg-gold text-[10px] font-sans font-bold uppercase tracking-widest py-2.5 px-6 rounded-[4px] transition-all flex items-center gap-2 shadow-2xl pointer-events-auto cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Quick Atelier View
          </button>
        </div>
      </div>

      {/* Details (with flex-grow to push footer elements to bottom alignment) */}
      <div className="flex-1 flex flex-col justify-between mb-4">
        <div className="space-y-1.5">
          {/* Category Display Justified-Between */}
          <div className="flex items-center justify-between gap-2 text-[9px] uppercase tracking-[0.2em] font-sans font-medium w-full">
            <span className="text-gold truncate max-w-[48%]" title={product.category || 'Luxury'}>
              {product.category || 'Luxury'}
            </span>
            <span className="text-zinc-500 truncate max-w-[48%] text-right" title={product.scentFamily || 'Scent'}>
              {product.scentFamily || 'Scent'}
            </span>
          </div>

          {/* Centered Product Name */}
          <Link to={`/product?did=${product.id}`} className="block hover:opacity-80 transition-opacity">
            <h3 className={`text-lg sm:text-xl font-serif font-light ${isLight ? 'text-zinc-900' : 'text-luxury-white'} hover:text-gold tracking-wider truncate w-full block text-center transition-colors`} title={product.name}>
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* SELECTION CONTROLS (Size & Concentration) */}
      <div className={`${hideMobileVariations ? 'hidden sm:block' : 'block'} border-t border-white/5 pt-4 space-y-3 flex-shrink-0`}>
        
        {/* Size selector pills */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {Array.from(new Set(
            (product.variations && product.variations.length > 0
              ? product.variations.map(v => v.size)
              : ['50ml', '100ml', '200ml']
            ).filter(Boolean)
          )).map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`px-2.5 py-1 rounded-[4px] text-[14px] font-sans font-medium transition-all duration-300 border ${
                  currentSel.size === size
                    ? (isLight ? 'bg-black text-white border-black shadow-sm' : 'bg-black text-gold border-gold shadow-[0_0_12px_rgba(197,160,89,0.15)]')
                    : (isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200' : 'bg-[#0d0d0d]/90 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700')
                }`}
              >
                {size}
              </button>
            ))}
        </div>

      </div>

      {/* Add to Cart & Price Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 mt-3 border-t border-white/5 flex-shrink-0">
        <div className="text-left">
          <span className="text-[8px] sm:text-[9px] font-sans uppercase text-zinc-500 block tracking-wider font-light">Price Estimate</span>
          <span className="text-base sm:text-2xl font-serif font-light text-gold">
            {formatBDT(currentPrice)}
          </span>
        </div>

        <div className="w-full sm:w-auto">
          {/* Mobile: Select Option button */}
          {hideMobileVariations && (
            <button
              onClick={() => handleOpenProductDetail(product)}
              className="sm:hidden font-bold uppercase tracking-widest text-[9px] px-3 py-2.5 rounded-[4px] transition-all flex items-center justify-center gap-1 font-sans border w-full cursor-pointer border-[#C5A059] hover:bg-[#C5A059] hover:text-black bg-transparent text-[#C5A059]"
            >
              Select Option
            </button>
          )}

          {/* Add to Chest button */}
          <button
            onClick={() => handleAddToCart(product, currentSel.size, currentSel.concentration, 1)}
            className={`${hideMobileVariations ? 'hidden sm:flex' : 'flex'} font-bold uppercase tracking-widest text-[9px] px-4 py-2.5 rounded-[4px] transition-all items-center justify-center gap-1.5 font-sans border w-full sm:w-auto cursor-pointer ${
              isLight 
                ? 'bg-black text-white hover:bg-zinc-800 border-black' 
                : 'border-[#C5A059] hover:bg-[#C5A059] hover:text-black bg-transparent text-[#C5A059]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Chest
          </button>
        </div>
      </div>

    </div>
  );
};
