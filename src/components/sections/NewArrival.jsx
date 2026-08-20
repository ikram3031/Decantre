import React, { useState, useEffect } from 'react';
import { useApp } from '../../core/context/AppContext';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../ProductCard';
import { ProductGridSkeleton } from '../Skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../ui/carousel';

export const NewArrival = () => {
    const { fetchProducts, filteredProducts, isProductsLoading, productsError, cardSelections, setCardSelections, wishlist, toggleWishlist, handleOpenProductDetail, handleAddToCart, calculateItemPrice, currentTheme } = useApp();

    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (typeof fetchProducts === 'function') {
            fetchProducts({ skip: 0, limit: 15, sortBy: 'createdAt', order: 'desc' });
        }
    }, [fetchProducts]);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        const onSelect = () => {
            setCurrent(api.selectedScrollSnap());
        };

        api.on('select', onSelect);
        api.on('reInit', onSelect);

        return () => {
            api.off('select', onSelect);
            api.off('reInit', onSelect);
        };
    }, [api]);

    const items = filteredProducts.slice(0, 15);
    const isLight = currentTheme === 'light';

    return (
        <section id="catalog-section" className={`py-10 sm:py-14 ${isLight ? 'bg-white border-y border-zinc-200 text-black' : 'bg-luxury-dark/40 border-y border-gold/20'} scroll-mt-24 select-none`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-baseline justify-between gap-4 w-full border-b border-gold/10 pb-3">
                        <div className="space-y-0.5 text-left">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-sans font-semibold">Spotlight Masterpieces</span>
                            <h2 className="text-xl sm:text-2xl font-serif font-light tracking-wide">New Arrivals</h2>
                        </div>
                        <div className="shrink-0">
                            <Link
                                to="/shop"
                                aria-label="See more on shop"
                                className={`font-sans transition-all flex items-center gap-1 uppercase font-bold text-xs rounded-[3px] ${
                                    isLight 
                                        ? 'bg-black text-white hover:bg-zinc-800 text-[10px] sm:text-xs px-3.5 py-2' 
                                        : 'text-gold hover:text-gold/80 tracking-[0.15em] sm:tracking-widest underline underline-offset-4 decoration-gold/40 hover:decoration-gold/90 sm:border sm:border-gold/30 sm:hover:border-gold sm:no-underline sm:px-3.5 sm:py-2 sm:hover:bg-gold/10'
                                }`}
                            >
                                <span>See More</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                    <p className="text-zinc-500 text-xs font-sans font-light max-w-lg text-left">
                        Indulge in liquid art. Hand-poured signature essences formulated with rare, rich, natural ingredients.
                    </p>
                </div>

                {isProductsLoading ? (
                    <div className="w-full">
                        <ProductGridSkeleton count={4} />
                    </div>
                ) : productsError ? (
                    <div className="p-8 border border-amber-500/20 bg-amber-500/5 rounded-sm text-center my-4 space-y-3">
                        <p className="text-amber-400 font-sans text-xs tracking-wide">
                            {productsError}
                        </p>
                        <button 
                            onClick={() => fetchProducts({ skip: 0, limit: 15, sortBy: 'createdAt', order: 'desc' })}
                            className="px-4 py-2 border border-gold/40 text-[10px] uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all cursor-pointer font-bold rounded-sm"
                        >
                            Retry Connection
                        </button>
                    </div>
                ) : items.length === 0 ? (
                    <div className="p-8 border border-zinc-700/40 bg-zinc-900/40 rounded-sm text-center my-4">
                        <p className="text-zinc-400 font-sans text-xs tracking-wide">
                            No new arrival products available at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="relative px-0 sm:px-4">
                        <Carousel
                            setApi={setApi}
                            opts={{
                                align: 'start',
                                loop: true,
                            }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-2 md:-ml-4">
                                {items.map((prod) => {
                                    const defaultSize = (prod.variations && prod.variations[0] && prod.variations[0].size) || '100ml';
                                    const currentSel = cardSelections[prod.id] || { size: defaultSize, concentration: 'Eau de Parfum' };
                                    return (
                                        <CarouselItem
                                            key={prod.id}
                                            className="carousel-item-2col pl-2 md:pl-4"
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
                                                isLargeCard={false}
                                            />
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>

                            <CarouselPrevious className="flex" />
                            <CarouselNext className="flex" />
                        </Carousel>

                        {/* Pagination Dots */}
                        {count > 1 && (
                            <div className="mt-6 flex justify-center items-center gap-2">
                                {Array.from({ length: count }).map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => api?.scrollTo(idx)}
                                        className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${
                                            idx === current 
                                                ? 'bg-gold w-6' 
                                                : 'bg-zinc-700 hover:bg-zinc-500'
                                        }`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewArrival;
