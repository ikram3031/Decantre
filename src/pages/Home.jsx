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

import { HeroSlider } from '../components/HeroSlider';
import { FeaturedProductSlider } from '../components/FeaturedProductSlider';
import { TrustBadges } from '../components/TrustBadges';
import { CategoryNav } from '../components/CategoryNav';
import { ProductCard } from '../components/ProductCard';
import NewArrival from '../components/sections/NewArrival';
import ScentFinder from '../components/sections/ScentFinder';
import Testimonials from '../components/sections/Testimonials';

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
    startQuiz,
    products,
    fetchProducts,
    fetchCategories,
    fetchBrands
  } = useApp();

  // fetch remote products, categories and brands on mount
  useEffect(() => {
    if (typeof fetchProducts === 'function') fetchProducts();
    if (typeof fetchCategories === 'function') fetchCategories();
    if (typeof fetchBrands === 'function') fetchBrands();
  }, [fetchProducts, fetchCategories, fetchBrands]);

  // Show top 3 spotlight products on home page to keep layout premium, with link to view more
  const spotlightProducts = filteredProducts.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Display Showcase */}
      <HeroSlider />

      {/* Credibility badges */}
      <TrustBadges />

      {/* Olfactory category cards */}
      <CategoryNav setSelectedCategory={setSelectedCategory} />

      {/* Featured Products Slider (Moved from main banner slot) */}
      {/* <FeaturedProductSlider /> */}

      {/* New Arrivals (moved to its own section component) */}
      <NewArrival />

      {/* Scent finder guidance CTA section */}
      <ScentFinder />

      {/* Reviews Section */}
      <Testimonials />

      {/* Editorials bar */}
      <div id="editorial-mentions" className="bg-luxury-black py-12 border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-500 block mb-6">As Featured In Global Editorial Columns</span>
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-20 opacity-30 mix-blend-screen grayscale">
            <span className="text-base font-serif font-bold tracking-[0.2em]">VOGUE ELITE</span>
            <span className="text-base font-serif font-bold tracking-[0.25em]">GQ LUXE</span>
            <span className="text-base font-serif font-bold tracking-[0.15em]">ELLE COUTURE</span>
            <span className="text-base font-serif font-bold tracking-[0.3em]">HARPER'S DECANTRE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
