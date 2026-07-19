import React from 'react';
import { ProductCard } from '../ProductCard';
import { useApp } from '../../context/AppContext';

export const BestSelling = () => {
  const { products, wishlist, toggleWishlist, cardSelections, setCardSelections, handleOpenProductDetail, handleAddToCart, calculateItemPrice } = useApp();
  // heuristics: best sellers flagged or top by basePrice (simple)
  const best = products.filter(p => p.isBestSeller).slice(0, 6);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl font-serif text-luxury-white mb-6">Best Selling</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {best.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              currentSel={cardSelections[p.id] || { size: (p.variations && p.variations[0] && p.variations[0].size) || '100ml', concentration: 'Eau de Parfum' }}
              onSizeChange={(size) => setCardSelections(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), size } }))}
              onConcentrationChange={(c) => setCardSelections(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), concentration: c } }))}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              handleOpenProductDetail={handleOpenProductDetail}
              handleAddToCart={handleAddToCart}
              calculateItemPrice={calculateItemPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSelling;
