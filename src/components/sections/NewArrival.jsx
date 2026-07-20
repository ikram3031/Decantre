import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../ProductCard';
import { ProductGridSkeleton } from '../Skeleton';

export const NewArrival = () => {
    const { fetchProducts, filteredProducts, cardSelections, setCardSelections, wishlist, toggleWishlist, handleOpenProductDetail, handleAddToCart, calculateItemPrice } = useApp();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(4);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        // request API with sort=dec, empty category, and pagination limits
        if (typeof fetchProducts === 'function') {
            fetchProducts({ rawQuery: 'sort=dec&skip=0&limit=15' });
        }
    }, [fetchProducts]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
            } else if (window.innerWidth < 1024) {
                setVisibleCount(2);
            } else if (window.innerWidth < 1280) {
                setVisibleCount(3);
            } else {
                setVisibleCount(4);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show exactly 9 products maximum
    const items = filteredProducts.slice(0, 9);
    const maxIndex = Math.max(0, items.length - visibleCount);
    const safeCurrentIndex = Math.min(currentIndex, maxIndex);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (maxIndex + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + maxIndex + 1) % (maxIndex + 1));
    };

    // Auto-play the slider very slowly (6000ms)
    useEffect(() => {
        if (isPaused || maxIndex <= 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(timer);
    }, [isPaused, maxIndex]);

    useEffect(() => {
        if (currentIndex > maxIndex) {
            setCurrentIndex(maxIndex);
        }
    }, [maxIndex, currentIndex]);

    return (
        <section id="catalog-section" className="py-20 bg-luxury-dark/40 border-y border-gold/20 scroll-mt-24 select-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-2 text-left">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium">Spotlight Masterpieces</span>
                        <h2 className="text-3xl sm:text-4xl font-serif font-light text-luxury-white tracking-wide">New Arrivals</h2>
                        <p className="text-zinc-500 text-xs sm:text-sm font-sans font-light max-w-lg">Indulge in liquid art. Hand-poured signature essences formulated with rare, rich, natural ingredients.</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            to="/shop"
                            aria-label="See more on shop"
                            className="border border-gold hover:bg-gold hover:text-black bg-transparent text-gold font-bold uppercase tracking-widest text-[9px] px-4 py-2.5 rounded-sm transition-all flex items-center gap-2 font-sans"
                        >
                            See More
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="w-full">
                        <ProductGridSkeleton count={visibleCount} />
                    </div>
                ) : (
                    <div 
                        className="relative"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {/* Carousel Outer wrapper */}
                        <div className="overflow-hidden w-full px-1">
                            {/* Sliding Track */}
                            <div 
                                className="flex transition-transform duration-1000 ease-out"
                                style={{ 
                                    transform: `translateX(-${safeCurrentIndex * (100 / visibleCount)}%)`,
                                }}
                            >
                                {items.map((prod) => {
                                    const defaultSize = (prod.variations && prod.variations[0] && prod.variations[0].size) || '100ml';
                                    const currentSel = cardSelections[prod.id] || { size: defaultSize, concentration: 'Eau de Parfum' };
                                    return (
                                        <div 
                                            key={prod.id} 
                                            className="flex-shrink-0 px-3"
                                            style={{ width: `${100 / visibleCount}%` }}
                                        >
                                            <ProductCard
                                                product={prod}
                                                currentSel={currentSel}
                                                onSizeChange={(size) => setCardSelections(prev => ({ ...prev, [prod.id]: { ...currentSel, size } }))}
                                                onConcentrationChange={(concentration) => setCardSelections(prev => ({ ...prev, [prod.id]: { ...currentSel, concentration } }))}
                                                wishlist={wishlist}
                                                toggleWishlist={toggleWishlist}
                                                handleOpenProductDetail={handleOpenProductDetail}
                                                handleAddToCart={handleAddToCart}
                                                calculateItemPrice={calculateItemPrice}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Pagination Dots */}
                        {maxIndex > 0 && (
                            <div className="mt-10 flex justify-center items-center gap-2">
                                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                            idx === safeCurrentIndex 
                                                ? 'bg-gold w-6' 
                                                : 'bg-zinc-700 hover:bg-zinc-500'
                                        }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Navigation Arrows */}
                        {maxIndex > 0 && (
                            <>
                                <button 
                                    onClick={prevSlide}
                                    className="absolute -left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 bg-black/85 hover:bg-gold text-white hover:text-black rounded-full border border-white/10 hover:border-gold transition-all duration-300 cursor-pointer shadow-lg shadow-black/50"
                                    title="Previous"
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                                <button 
                                    onClick={nextSlide}
                                    className="absolute -right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 bg-black/85 hover:bg-gold text-white hover:text-black rounded-full border border-white/10 hover:border-gold transition-all duration-300 cursor-pointer shadow-lg shadow-black/50"
                                    title="Next"
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewArrival;
