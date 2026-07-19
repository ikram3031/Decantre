import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../ProductCard';

export const NewArrival = () => {
    const { fetchProducts, filteredProducts, cardSelections, setCardSelections, wishlist, toggleWishlist, handleOpenProductDetail, handleAddToCart, calculateItemPrice } = useApp();

    useEffect(() => {
        // request API with sort=dec, empty category, and pagination limits
        if (typeof fetchProducts === 'function') fetchProducts({ rawQuery: 'sort=dec&&skip=0&limit=10' });
    }, [fetchProducts]);

    const spotlightProducts = filteredProducts.slice(0, 3);

    return (
        <section id="catalog-section" className="py-20 bg-luxury-dark/40 border-y border-gold/20 scroll-mt-24">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {spotlightProducts.map((prod) => {
                        const defaultSize = (prod.variations && prod.variations[0] && prod.variations[0].size) || '100ml';
                        const currentSel = cardSelections[prod.id] || { size: defaultSize, concentration: 'Eau de Parfum' };
                        return (
                            <ProductCard
                                key={prod.id}
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
                        );
                    })}
                </div>

            </div>
        </section>
    );
};

export default NewArrival;
