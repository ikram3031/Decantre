import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { formatBDT } from '../core/utils/formatCurrency';
import { useApp } from '../core/context/AppContext';
import { resolveBrandName, resolveCategoryName, normalizeProductImage } from '../core/store/productHelpers';

// Fallback image URL for missing product card assets
const defaultPerfumeImage = 'https://server.decantrebd.com/uploads/product-placeholder.webp';

export const ProductCard = ({
  product,
  currentSel,
  onSizeChange,
  onConcentrationChange,
  wishlist = [],
  toggleWishlist,
  handleOpenProductDetail,
  handleAddToCart,
  calculateItemPrice,
  hideMobileVariations = false,
  isLargeCard = false,
  showProductName = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { currentTheme, brands, categories } = useApp();
  const isLight = currentTheme === 'light';

  const rawVariations = Array.isArray(product?.variations) ? product.variations : [];
  
  // Extract only genuine variations (excluding default placeholders like 'Full Bottle' or 'Standard')
  const genuineVariations = rawVariations.filter(
    (v) => v && v.size && v.size !== 'Full Bottle' && v.size !== 'Standard'
  );
  
  const hasMultipleVariations = genuineVariations.length > 1;
  const availableVariations = genuineVariations.length > 0 ? genuineVariations : rawVariations;

  // Active variation resolution: match user selection or default to first actual variation
  const selectedTerm = String(currentSel?.size || currentSel?.slug || '').trim().toLowerCase();

  const activeVariation = availableVariations.length > 0
    ? (availableVariations.find((v) => {
        const vSize = String(v.size || '').trim().toLowerCase();
        const vSlug = String(v.slug || '').trim().toLowerCase();
        return selectedTerm && (vSize === selectedTerm || vSlug === selectedTerm);
      }) || availableVariations[0])
    : null;

  const activeSize = activeVariation ? activeVariation.size : (currentSel?.size || 'Full Bottle');

  const normalizedStatus = String(product?.stockStatus || '').toLowerCase().trim();
  const isOutOfStock = normalizedStatus === 'outofstock' || normalizedStatus === 'out of stock';

  // Card button disabled strictly when truly out of stock
  const isBtnDisabled = isOutOfStock;

  // Effective unit price for the currently active variation
  const variationPrice = activeVariation
    ? (activeVariation.price ?? activeVariation.offerPrice ?? product?.basePrice ?? product?.price ?? 0)
    : (product?.offerPrice ?? product?.price ?? product?.basePrice ?? 0);

  const currentPrice = typeof calculateItemPrice === 'function'
    ? calculateItemPrice(variationPrice, activeSize, currentSel?.concentration)
    : Number(variationPrice || 0);

  const productImage = normalizeProductImage(product?.image || (product?.raw && product.raw.image) || defaultPerfumeImage);

  return (
    <div 
      id={`product-card-${product.id}`}
      className={`group flex flex-col h-full ${
        isLight ? 'bg-white border-zinc-200 hover:border-gold/60 text-black shadow-sm hover:shadow-md' : 'bg-luxury-dark/90 border-gold/20 hover:border-gold/60 text-white shadow-xl hover:shadow-gold/10'
      } rounded-[6px] p-2 sm:p-3 transition-all duration-300 relative`}
    >
      {/* Wishlist toggle */}
      <button 
        type="button"
        onClick={() => toggleWishlist && toggleWishlist(product.id)}
        className="absolute top-4 sm:top-5 right-4 sm:right-5 z-20 p-1.5 bg-black/60 border border-gold/40 hover:border-gold rounded-full text-zinc-300 hover:text-gold transition-all shadow-md cursor-pointer"
        aria-label="Toggle wishlist"
      >
        <Heart 
          className={`w-3.5 h-3.5 ${Array.isArray(wishlist) && wishlist.includes(product.id) ? 'fill-gold text-gold' : ''}`} 
        />
      </button>

      {/* Image container */}
      <div className="relative aspect-square rounded-sm overflow-hidden bg-[#0a0a0a] mb-1 flex-shrink-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-zinc-900/80 animate-pulse z-10" />
        )}
        {isOutOfStock && (
          <div className="absolute top-2 left-2 z-20 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-md">
            Out of Stock
          </div>
        )}
        <Link to={`/product/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={productImage}
            alt={product.name || 'Perfume'}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultPerfumeImage; setImageLoaded(true); }}
          />
        </Link>
      </div>

      {/* Details section */}
      <div className="flex-1 flex flex-col justify-between mb-2">
        <div className="space-y-1">
          {/* Category / Brand Row */}
          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.15em] font-sans font-semibold text-gold">
            <span className="truncate max-w-full sm:max-w-[60%]">
              {(() => {
                const resolvedBrand = resolveBrandName(product.brand, brands);
                if (resolvedBrand) return resolvedBrand;
                if (product.name && /\s+by\s+/i.test(product.name)) {
                  const parts = product.name.split(/\s+by\s+/i);
                  if (parts.length > 1 && parts[parts.length - 1].trim()) {
                    return parts[parts.length - 1].trim();
                  }
                }
                return resolveCategoryName(product.category, categories);
              })()}
            </span>
            <span className="text-zinc-400 font-normal truncate max-w-[38%] text-right hidden sm:block">{resolveCategoryName(product.category, categories)}</span>
          </div>

          {/* Product Name - 3 lines reserved */}
          <Link to={`/product/${product.slug || product.id}`} className="block hover:opacity-80 transition-opacity my-1">
            <h3 
              className={`text-xs sm:text-sm font-serif font-medium pt-2 leading-snug line-clamp-3 min-h-[3.6em] text-center ${isLight ? 'text-zinc-900' : 'text-zinc-100'} hover:text-gold`} 
              title={product.name}
            >
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* SELECTION CONTROLS (Only display if product actually has multiple real variations) */}
      {hasMultipleVariations && (
        <div className={`${hideMobileVariations ? 'hidden sm:block' : 'block'} border-t border-white/10 pt-1 flex-shrink-0`}>
          <div className="grid grid-cols-3 gap-1">
            {genuineVariations.map((v) => {
              const size = v.size;
              const isSelected = activeVariation
                ? (activeVariation.id === v.id || String(activeVariation.size).trim().toLowerCase() === String(size).trim().toLowerCase())
                : false;
              return (
                <button
                  key={v.id || v.slug || size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    if (isOutOfStock) return;
                    if (typeof onSizeChange === 'function') {
                      onSizeChange(size, v.slug);
                    }
                  }}
                  className={`w-full text-center py-1 rounded-sm text-[11px] font-sans font-medium transition-all duration-200 border ${
                    isOutOfStock
                      ? (isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed pointer-events-none' : 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 pointer-events-none')
                      : isSelected
                        ? (isLight ? 'bg-black text-white border-black cursor-pointer font-bold' : 'bg-gold text-black border-gold font-bold cursor-pointer')
                        : (isLight ? 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900 cursor-pointer' : 'bg-black/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer')
                  }`}
                >
                  {v.label || String(size).replace(/-/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to Cart & Price Row */}
      <div className="flex items-center justify-between gap-2 pt-1.5 mt-1 border-t border-white/10 flex-shrink-0">
        <div className="text-left">
          <span className="text-[8px] font-sans uppercase text-zinc-400 block tracking-wider font-light">Price</span>
          <span className="text-sm sm:text-base font-serif font-medium text-gold">
            {formatBDT(currentPrice)}
          </span>
        </div>

        <div>
          <button
            type="button"
            disabled={isBtnDisabled}
            onClick={() => {
              if (isBtnDisabled) return;
              if (typeof handleAddToCart === 'function') {
                handleAddToCart(product, activeSize, 1, currentPrice);
              } else {
                console.warn('handleAddToCart is not available for product:', product?.id);
              }
            }}
            className={`font-bold uppercase tracking-wider text-[9px] px-3 py-1.5 rounded-[3px] transition-all flex items-center justify-center gap-1 font-sans border ${
              isBtnDisabled
                ? (isLight ? 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed opacity-50' : 'bg-zinc-800 text-zinc-500 border-zinc-800 cursor-not-allowed opacity-50')
                : isLight 
                  ? 'bg-black text-white hover:bg-zinc-800 border-black cursor-pointer' 
                  : 'border-gold text-gold hover:bg-gold hover:text-black bg-transparent cursor-pointer'
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
            <span className="hidden xs:inline">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
