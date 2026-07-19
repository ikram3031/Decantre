import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  ArrowRight,
  Star,
  ThumbsUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import { products, slides } from '../data';

import { HeroSlider } from '../components/HeroSlider';
import { TrustBadges } from '../components/TrustBadges';
import { CategoryNav } from '../components/CategoryNav';
import { ProductCard } from '../components/ProductCard';

export const Home = () => {
  const {
    currentSlide,
    setCurrentSlide,
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
    filteredProducts,
    startQuiz
  } = useApp();

  // Hero slider auto interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [setCurrentSlide]);

  // Show top 3 spotlight products on home page to keep layout premium, with link to view more
  const spotlightProducts = filteredProducts.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Display Showcase */}
      <HeroSlider 
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        products={products}
        handleOpenProductDetail={handleOpenProductDetail}
      />

      {/* Credibility badges */}
      <TrustBadges />

      {/* Olfactory category cards */}
      <CategoryNav setSelectedCategory={setSelectedCategory} />

      {/* Live Perfume Atelier Spotlight / Catalog */}
      <section id="catalog-section" className="py-20 bg-luxury-dark/40 border-y border-gold/20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2 text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium">Spotlight Masterpieces</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-light text-luxury-white tracking-wide">
                L'ÉLIXIR HIGHLIGHTS
              </h2>
              <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-lg">
                Indulge in liquid art. Hand-poured signature essences formulated with rare, rich, natural ingredients.
              </p>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'For Him', 'For Her', 'Unisex'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-sm text-[9px] font-sans font-semibold tracking-widest uppercase transition-all duration-300 ${
                    selectedCategory === cat 
                      ? 'bg-gold text-black shadow-lg' 
                      : 'bg-luxury-dark border border-white/5 hover:border-gold/40 text-zinc-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Empty search fallback */}
          {spotlightProducts.length === 0 && (
            <div className="text-center py-16 border border-dashed border-gold/15 rounded-sm">
              <SlidersHorizontal className="w-10 h-10 text-gold/50 mx-auto mb-4" />
              <p className="text-zinc-400 text-sm font-sans font-light">No majestic fragrances found in this category.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 text-[10px] font-bold uppercase tracking-widest text-gold underline hover:text-gold/80"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Perfume catalog cards list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spotlightProducts.map((prod) => {
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

          {/* View All CTA */}
          {filteredProducts.length > 3 && (
            <div className="mt-12 text-center">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 border border-white/10 px-8 py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-300 hover:text-gold hover:border-gold/40 rounded-sm transition-all duration-300 bg-black/30 backdrop-blur-md"
              >
                <span>Discover All {filteredProducts.length} Fragrances</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* Scent finder guidance CTA */}
      <section id="scent-finder-banner" className="py-20 bg-luxury-black relative overflow-hidden border-b border-gold/20">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-black via-gold/5 to-luxury-black pointer-events-none"></div>
        <div className="absolute -right-32 top-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-5 h-5 text-gold" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">Scent Guidance Atelier</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-light tracking-wide text-luxury-white">
            FIND YOUR PERFECT SIGNATURE AURA
          </h2>
          <p className="text-zinc-500 font-sans font-light text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Answer a few luxury sensory questions about your lifestyle, environment, and scent inclinations to receive a curated perfume masterpiece matching your natural chemistry.
          </p>
          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-2 border border-gold text-gold font-sans font-bold uppercase tracking-[0.25em] text-[10px] px-8 py-4 rounded-sm hover:bg-gold hover:text-black transition-all duration-300"
          >
            <span>Begin Sensory Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="testimonials-section" className="py-24 bg-luxury-dark/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium">Sovereign Echoes</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-luxury-white tracking-wide">
              MEMBER REVIEWS & VERDICTS
            </h2>
            <div className="w-20 h-[1px] bg-gold/30 mx-auto"></div>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-sm mx-auto font-sans font-light leading-relaxed">
              Read the unfiltered olfactory journeys from our distinguished global connoisseurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div id="testimonial-1" className="bg-[#080808] border border-gold/15 hover:border-gold/30 p-8 rounded-sm shadow-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm italic font-light font-serif leading-relaxed">
                  "Oud Impérial is an architectural marvel in liquid form. The dry-down of royal leather coupled with golden saffron is absolutely divine. I wear it to international meetings and the silage commands supreme respect."
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-left">
                <div>
                  <h4 className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-200">Viscount Sterling</h4>
                  <span className="text-[9px] text-gold font-sans font-medium uppercase tracking-widest">London, UK</span>
                </div>
                <ThumbsUp className="w-3.5 h-3.5 text-gold/50" />
              </div>
            </div>

            {/* Review 2 */}
            <div id="testimonial-2" className="bg-[#080808] border border-gold/15 hover:border-gold/30 p-8 rounded-sm shadow-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm italic font-light font-serif leading-relaxed">
                  "I was skeptic about ordering L'Élixir online but Nectar de Saphir has changed everything. The champagne rose and warm Madagascar vanilla is soft yet incredibly hypnotic. It persists past 24 hours on my coat."
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-left">
                <div>
                  <h4 className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-200">Elena Rostova</h4>
                  <span className="text-[9px] text-gold font-sans font-medium uppercase tracking-widest">Paris, France</span>
                </div>
                <ThumbsUp className="w-3.5 h-3.5 text-gold/50" />
              </div>
            </div>

            {/* Review 3 */}
            <div id="testimonial-3" className="bg-[#080808] border border-gold/15 hover:border-gold/30 p-8 rounded-sm shadow-2xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm italic font-light font-serif leading-relaxed">
                  "Saffron Mystique is a sensory goldmine. It smells like hot spice balanced perfectly with black amber and tonka. The packaging is just stunning - a beautiful black box that feels like premium jewelry."
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-left">
                <div>
                  <h4 className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-200">Marcus Vance</h4>
                  <span className="text-[9px] text-gold font-sans font-medium uppercase tracking-widest">New York, USA</span>
                </div>
                <ThumbsUp className="w-3.5 h-3.5 text-gold/50" />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/reviews"
              className="inline-flex items-center gap-2 border border-gold/20 hover:border-gold text-gold hover:bg-gold/5 px-8 py-3.5 text-[10px] uppercase font-bold tracking-[0.2em] rounded-sm transition-all duration-300"
            >
              <span>Explore All Verified Verdicts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorials bar */}
      <div id="editorial-mentions" className="bg-luxury-black py-12 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 block mb-6">As Featured In Global Editorial Columns</span>
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 opacity-30 mix-blend-screen grayscale">
            <span className="text-base font-serif font-bold tracking-[0.2em]">VOGUE ELITE</span>
            <span className="text-base font-serif font-bold tracking-[0.25em]">GQ LUXE</span>
            <span className="text-base font-serif font-bold tracking-[0.15em]">ELLE COUTURE</span>
            <span className="text-base font-serif font-bold tracking-[0.3em]">HARPER'S ATELIER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
