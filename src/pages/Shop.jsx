import React, { useState } from 'react';
import { SlidersHorizontal, Sparkles, Heart, Search, HelpCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { products } from '../data';
import { ProductCard } from '../components/ProductCard';

export const Shop = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cardSelections,
    setCardSelections,
    wishlist,
    toggleWishlist,
    handleOpenProductDetail,
    handleAddToCart,
    calculateItemPrice,
    filteredProducts
  } = useApp();

  const [scentFamilyFilter, setScentFamilyFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200);

  // Get unique scent families for extra filtering
  const scentFamilies = ['All', ...new Set(products.map(p => p.scentFamily.split(' ')[0]))];

  // Apply extra interactive filters on top of search and category
  const finalFilteredProducts = filteredProducts.filter(p => {
    const matchesFamily = scentFamilyFilter === 'All' || p.scentFamily.toLowerCase().includes(scentFamilyFilter.toLowerCase());
    const matchesPrice = p.basePrice <= maxPrice;
    return matchesFamily && matchesPrice;
  });

  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center space-y-4 mb-16 relative py-12 border border-gold/15 bg-luxury-dark/20 rounded-sm">
          <div className="absolute -inset-px bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Royal Decanter Boutique</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            THE ATELIER SHOP
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-xl mx-auto leading-relaxed px-4">
            Browse our curated reserves. Customize bottle volume and concentration. Each order is meticulously hand-packed in a velvet presentation chest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-8 border-r border-gold/10 pr-0 lg:pr-8">
            <div>
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-300 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-gold" /> Filter Collection
              </h3>
              <div className="h-[1px] w-full bg-gold/15 mb-6"></div>
            </div>

            {/* Scent Categories */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block">Client Intention</span>
              <div className="flex flex-col gap-1">
                {['All', 'For Him', 'For Her', 'Unisex'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left py-2 px-3 text-xs transition-all duration-300 rounded-sm ${
                      selectedCategory === cat 
                        ? 'bg-gold/10 text-gold border-l-2 border-gold font-medium' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scent Families */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block">Olfactory Families</span>
              <div className="flex flex-wrap gap-1.5">
                {scentFamilies.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setScentFamilyFilter(fam)}
                    className={`px-3 py-1.5 rounded-sm text-[10px] uppercase tracking-wider transition-all border ${
                      scentFamilyFilter === fam 
                        ? 'border-gold bg-gold/5 text-gold' 
                        : 'border-white/5 bg-luxury-dark text-zinc-400 hover:border-gold/30 hover:text-white'
                    }`}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Price Range */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Maximum Base Price</span>
                <span className="text-xs font-mono text-gold font-semibold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="140"
                max="200"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-gold bg-zinc-800 h-1 rounded-sm cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-zinc-600 font-mono">
                <span>$140</span>
                <span>$200</span>
              </div>
            </div>

            {/* Quick Scent Consultation */}
            <div className="p-5 border border-gold/15 bg-luxury-dark/30 rounded-sm space-y-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-200">Personal Scent finder</h4>
              <p className="text-zinc-500 text-[11px] font-sans font-light leading-relaxed">
                Undecided on the perfect balance of top and heart notes? Take our 4-step sensory assessment to discover your sovereign match.
              </p>
              <button
                onClick={() => {
                  // Scent finder quiz is bound globally
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  const startQuizBtn = document.querySelector('#main-header button');
                  if (startQuizBtn) startQuizBtn.click();
                }}
                className="w-full text-center border border-gold/40 hover:bg-gold hover:text-black text-gold font-bold uppercase tracking-widest text-[9px] py-2.5 transition-all duration-300 rounded-sm"
              >
                Launch Assessment
              </button>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                Displaying {finalFilteredProducts.length} Premium Formulations
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] uppercase tracking-widest text-gold hover:underline font-mono"
                >
                  Clear search: "{searchQuery}"
                </button>
              )}
            </div>

            {/* Empty search fallback */}
            {finalFilteredProducts.length === 0 && (
              <div className="text-center py-24 border border-dashed border-gold/15 rounded-sm bg-luxury-dark/10">
                <Search className="w-12 h-12 text-gold/40 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-light text-zinc-300 mb-2">No Fragrances Match Filters</h3>
                <p className="text-zinc-500 text-xs font-sans font-light max-w-xs mx-auto">
                  Try relaxing your price scale or clearing your search queries to see the full royal selection.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setScentFamilyFilter('All'); setMaxPrice(200); }}
                  className="mt-6 border border-gold/40 px-6 py-2.5 text-[9px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Perfume list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {finalFilteredProducts.map((prod) => {
                const currentSel = cardSelections[prod.id] || { size: '100ml', concentration: 'Eau de Parfum' };
                return (
                  <ProductCard 
                    key={prod.id}
                    product={prod}
                    currentSel={currentSel}
                    onSizeChange={(size) => {
                      setCardSelections(prev => ({
                        ...prev,
                        [prod.id]: { ...currentSel, size }
                      }));
                    }}
                    onConcentrationChange={(concentration) => {
                      setCardSelections(prev => ({
                        ...prev,
                        [prod.id]: { ...currentSel, concentration }
                      }));
                    }}
                    wishlist={wishlist}
                    toggleWishlist={toggleWishlist}
                    handleOpenProductDetail={handleOpenProductDetail}
                    handleAddToCart={handleAddToCart}
                    calculateItemPrice={calculateItemPrice}
                  />
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Shop;
