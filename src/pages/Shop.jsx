import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Sparkles, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/formatCurrency';
import { ProductCard } from '../components/ProductCard';

export const Shop = () => {
  const {
    searchQuery,
    setSearchQuery,
    cardSelections,
    setCardSelections,
    wishlist,
    toggleWishlist,
    handleOpenProductDetail,
    handleAddToCart,
    calculateItemPrice,
    products,
    categories,
    brands,
    fetchProducts,
    fetchCategories,
    fetchBrands,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const brandParam = searchParams.get('brand');
  const searchParam = searchParams.get('search');

  const [maxPrice, setMaxPrice] = useState(200);
  const [sortOrder, setSortOrder] = useState('newest');
  const [brandFilters, setBrandFilters] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const categoryOptions = useMemo(
    () => [{ id: 'all', name: 'All', slug: 'All', product_count: products.length }, ...categories],
    [categories, products]
  );

  const brandOptions = useMemo(
    () => [{ id: 'all', name: 'All', slug: 'All', product_count: products.length }, ...brands],
    [brands, products]
  );

  // Sync URL query params to state
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('All');
    }
  }, [categoryParam, setSelectedCategory]);

  useEffect(() => {
    if (brandParam) {
      setBrandFilters([brandParam]);
    } else {
      setBrandFilters([]);
    }
  }, [brandParam]);

  useEffect(() => {
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery('');
    }
  }, [searchParam, setSearchQuery]);

  useEffect(() => {
    if (typeof fetchCategories === 'function') {
      fetchCategories({ rawQuery: 'skip=0&limit=50' });
    }
    if (typeof fetchBrands === 'function') {
      fetchBrands({ rawQuery: 'skip=0&limit=50' });
    }
  }, [fetchCategories, fetchBrands]);

  useEffect(() => {
    if (typeof fetchProducts !== 'function') return;

    const categoryFilter = selectedCategory && selectedCategory !== 'All' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    const brandFilter = brandFilters.length === 1 ? `&brand=${encodeURIComponent(brandFilters[0])}` : '';
    const searchFilter = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
    const rawQuery = `skip=0&limit=20&sort=${sortOrder}${categoryFilter}${brandFilter}${searchFilter}`;

    const loadProducts = async () => {
      setIsLoadingProducts(true);
      try {
        await fetchProducts({ rawQuery });
      } finally {
        setIsLoadingProducts(false);
      }
    };

    loadProducts();
  }, [fetchProducts, selectedCategory, brandFilters, searchQuery, sortOrder]);

  const handleBrandToggle = (brandSlug) => {
    const params = new URLSearchParams(searchParams);
    if (brandSlug === 'All') {
      params.delete('brand');
    } else {
      if (brandParam === brandSlug) {
        params.delete('brand');
      } else {
        params.set('brand', brandSlug);
      }
    }
    setSearchParams(params);
  };

  const handleCategorySelect = (categorySlug) => {
    const params = new URLSearchParams(searchParams);
    if (categorySlug === 'All') {
      params.delete('category');
    } else {
      params.set('category', categorySlug);
    }
    setSearchParams(params);
  };

  const handleClearBrands = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('brand');
    setSearchParams(params);
  };

  return (
    <div className="py-12 sm:py-20 bg-luxury-black animate-fade-in text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center space-y-4 mb-16 relative py-12 border border-gold/15 bg-luxury-dark/20 rounded-sm">
          <div className="absolute -inset-px bg-gradient-to-r from-transparent via-gold/5 to-transparent pointer-events-none"></div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-sans font-medium block">The Decantre Boutique</span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light text-luxury-white tracking-wide">
            THE DECANTRE SHOP
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

            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block">Category</span>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category.id || category.slug}
                      onClick={() => handleCategorySelect(category.slug)}
                      className={`w-full text-left px-4 py-3 rounded-sm text-xs transition-all border ${
                        selectedCategory === category.slug
                          ? 'border-gold bg-gold/10 text-gold font-semibold'
                          : 'border-white/10 text-zinc-400 hover:border-gold/30 hover:text-white'
                      }`}
                    >
                      {category.name}
                      {category.product_count !== undefined && category.slug !== 'All' ? (
                        <span className="text-[10px] text-zinc-500 ml-2">({category.product_count})</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold block">Brands</span>
                  <button
                    type="button"
                    onClick={handleClearBrands}
                    className="text-[10px] uppercase tracking-wide text-gold hover:underline animate-fade-in"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {brandOptions.map((brand) => (
                    <label key={brand.id || brand.slug} className="flex items-center gap-3 text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={brand.slug === 'All' ? brandFilters.length === 0 : brandFilters.includes(brand.slug)}
                        onChange={() => {
                          if (brand.slug === 'All') {
                            setBrandFilters([]);
                            return;
                          }
                          handleBrandToggle(brand.slug);
                        }}
                        className="h-4 w-4 accent-gold rounded-sm border border-white/10 bg-luxury-dark"
                      />
                      <span>{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Maximum Price</span>
                  <span className="text-xs font-mono text-gold font-semibold">{formatBDT(maxPrice)}</span>
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
                  <span>{formatBDT(140)}</span>
                  <span>{formatBDT(200)}</span>
                </div>
              </div>
            </div>

            <div className="p-5 border border-gold/15 bg-luxury-dark/30 rounded-sm space-y-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-200">Personal Scent finder</h4>
              <p className="text-zinc-500 text-[11px] font-sans font-light leading-relaxed">
                Undecided on the perfect balance of top and heart notes? Take our 4-step sensory assessment to discover your sovereign match.
              </p>
              <button
                onClick={() => {
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
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-white/5 pb-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                Displaying {products.length} Premium Formulations
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                  <span>Sort</span>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-luxury-dark border border-white/10 text-zinc-200 text-xs rounded-sm py-2 px-3 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                  >
                    <option value="newest">Newest first</option>
                    <option value="price-asc">Price low to high</option>
                    <option value="price-desc">Price high to low</option>
                  </select>
                </div>
                {searchQuery && (
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete('search');
                      setSearchParams(params);
                    }}
                    className="text-[10px] uppercase tracking-widest text-gold hover:underline font-mono"
                  >
                    Clear search: "{searchQuery}"
                  </button>
                )}
              </div>
            </div>

            {/* Loading skeleton */}
            {isLoadingProducts && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 text-zinc-300">
                  <div className="w-10 h-10 rounded-full border-4 border-gold border-r-transparent animate-spin" />
                  <span className="text-xs uppercase tracking-[0.4em] text-zinc-400">Loading products...</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-sm border border-white/10 bg-luxury-dark/70 p-6 animate-pulse"
                    >
                      <div className="h-56 bg-zinc-900 rounded-sm mb-4" />
                      <div className="h-4 bg-zinc-800 rounded-full mb-3" />
                      <div className="h-4 bg-zinc-800 rounded-full w-5/6 mb-3" />
                      <div className="flex items-center justify-between mt-4">
                        <div className="h-3 bg-zinc-800 rounded-full w-1/3" />
                        <div className="h-3 bg-zinc-800 rounded-full w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty search fallback */}
            {!isLoadingProducts && products.length === 0 && (
              <div className="text-center py-24 border border-dashed border-gold/15 rounded-sm bg-luxury-dark/10">
                <Search className="w-12 h-12 text-gold/40 mx-auto mb-4" />
                <h3 className="text-lg font-serif font-light text-zinc-300 mb-2">No Products Found</h3>
                <p className="text-zinc-500 text-xs font-sans font-light max-w-xs mx-auto">
                  The shop is waiting for products from the API. Please check back shortly.
                </p>
              </div>
            )}

            {/* Perfume list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {!isLoadingProducts && products.map((prod) => {
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
