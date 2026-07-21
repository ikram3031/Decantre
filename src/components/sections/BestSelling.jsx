import React, { useState, useMemo } from 'react';
import { ProductCard } from '../ProductCard';
import { useApp } from '../../context/AppContext';

export const BestSelling = () => {
  const { 
    products, 
    wishlist, 
    toggleWishlist, 
    cardSelections, 
    setCardSelections, 
    handleOpenProductDetail, 
    handleAddToCart, 
    calculateItemPrice,
    currentTheme
  } = useApp();

  const [filter, setFilter] = useState('All');
  const isLight = currentTheme === 'light';

  // Filter bestsellers based on tab selection
  const filtered = useMemo(() => {
    // We prioritize items marked isBestSeller, but fall back to normal products if pool is small
    const bSellers = products.filter(p => p.isBestSeller);
    const pool = bSellers.length >= 3 ? bSellers : products;

    if (filter === 'For Him') {
      return pool.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('him') || cat.includes('men') || cat.includes('male') || cat.includes('ছেলেদের');
      }).slice(0, 6);
    }

    if (filter === 'For Her') {
      return pool.filter(p => {
        const cat = (p.category || '').toLowerCase();
        return cat.includes('her') || cat.includes('women') || cat.includes('female') || cat.includes('মেয়েদের');
      }).slice(0, 6);
    }

    return pool.slice(0, 6);
  }, [products, filter]);

  return (
    <section id="our-bestsellers" className={`py-16 border-t ${isLight ? 'bg-zinc-50/50 border-zinc-200' : 'bg-[#030303] border-gold/15'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
        
        {/* Heading */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">
            Most Coveted Formulations
          </span>
          <h2 className={`text-3xl sm:text-4xl font-serif font-light tracking-wide ${isLight ? 'text-black' : 'text-luxury-white'}`}>
            OUR BESTSELLERS
          </h2>
          <div className="h-[1px] w-12 bg-gold/40 mx-auto"></div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3">
          {['All', 'For Him', 'For Her'].map((type) => {
            const isActive = filter === type;
            return (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-[4px] text-xs font-sans font-bold uppercase tracking-widest transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? (isLight ? 'bg-black text-white border-black' : 'bg-gold text-black border-gold')
                    : (isLight ? 'border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-400' : 'border-gold/20 text-zinc-400 hover:text-gold hover:border-gold/60')
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 pt-4">
          {filtered.map(p => {
            const currentSel = cardSelections[p.id] || { size: (p.variations && p.variations[0] && p.variations[0].size) || '100ml', concentration: 'Eau de Parfum' };
            return (
              <ProductCard
                key={p.id}
                product={p}
                currentSel={currentSel}
                onSizeChange={(size) => setCardSelections(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), size } }))}
                onConcentrationChange={(c) => setCardSelections(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), concentration: c } }))}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
                handleOpenProductDetail={handleOpenProductDetail}
                handleAddToCart={handleAddToCart}
                calculateItemPrice={calculateItemPrice}
              />
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-zinc-500 text-xs font-sans font-light py-10">
            No matching formulations found in our bestsellers list.
          </p>
        )}

      </div>
    </section>
  );
};

export default BestSelling;
