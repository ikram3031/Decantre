import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatBDT } from '../utils/formatCurrency';
import { mapRemoteProduct } from '../store/productHelpers';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Loader2, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Info
} from 'lucide-react';

export const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { 
    products, 
    wishlist, 
    toggleWishlist, 
    handleAddToCart, 
    calculateItemPrice 
  } = useApp();

  const did = searchParams.get('did') || searchParams.get('id');

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration states
  const [selectedSize, setSelectedSize] = useState('100ml');
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!did) {
      setError('No product identifier provided.');
      setIsLoading(false);
      return;
    }

    const loadProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiBaseUrl = (import.meta.env.VITE_API_URL || 'https://perfume-store-backend-wi7o.onrender.com').replace(/\/$/, '');
        
        // Try fetching specifically by id
        try {
          const res = await fetch(`${apiBaseUrl}/api/wp/products/${did}`);
          if (res.ok) {
            const json = await res.json();
            if (json && json.data) {
              const mapped = mapRemoteProduct(json.data);
              setProduct(mapped);
              setIsLoading(false);
              return;
            }
          }
        } catch (e) {
          console.warn('Direct fetch failed, falling back to lists...', e);
        }

        // Try matching from existing products list
        if (products && products.length > 0) {
          const found = products.find(p => p.id === did || String(p.raw?.id) === String(did));
          if (found) {
            setProduct(found);
            setIsLoading(false);
            return;
          }
        }

        // Fallback: fetch all and search
        const res = await fetch(`${apiBaseUrl}/api/wp/products?limit=100`);
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json.data) ? json.data : [];
          const mappedList = list.map(mapRemoteProduct);
          const found = mappedList.find(p => p.id === did || String(p.raw?.id) === String(did));
          if (found) {
            setProduct(found);
          } else {
            setError('The requested luxury fragrance could not be located.');
          }
        } else {
          setError('Failed to load fragrance information from our archives.');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('A network security anomaly occurred while loading the details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetail();
  }, [did, products]);

  // Set default size if variations are present
  useEffect(() => {
    if (product?.variations && product.variations.length > 0) {
      const firstVar = product.variations[0];
      if (firstVar && firstVar.size) {
        setSelectedSize(firstVar.size);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] bg-luxury-black flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
        <p className="text-zinc-500 font-sans text-xs uppercase tracking-[0.25em]">Retrieving Olfactory Signature...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[75vh] bg-luxury-black flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-gold/10 border border-gold/30 p-4 rounded-full mb-6">
          <Info className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-2xl font-serif text-white uppercase tracking-wider mb-2">Fragrance Disappeared</h2>
        <p className="text-zinc-400 max-w-md text-sm mb-8 font-sans leading-relaxed">
          {error || 'We could not find the selected scent. It may have been retired or sold out.'}
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all px-8 py-3.5 uppercase tracking-widest text-xs font-sans font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Atelier
        </Link>
      </div>
    );
  }

  // Determine main category gender display
  const getGenderCategory = (category = '') => {
    const catLower = category.toLowerCase();
    if (catLower.includes('her') || catLower.includes('women') || catLower.includes('female') || catLower.includes('মেয়েদের')) {
      return 'FOR HER';
    }
    if (catLower.includes('him') || catLower.includes('men') || catLower.includes('male') || catLower.includes('ছেলেদের')) {
      return 'FOR HIM';
    }
    return 'UNISEX';
  };

  const genderCategory = getGenderCategory(product.category || '');

  // Sanitize description text and filter out "NPS"
  const sanitizeDescription = (text = '') => {
    if (!text) return '';
    return text
      .replace(/NPS\s*(text)?/gi, '')
      .replace(/<[^>]+>/g, '') // remove HTML tags if any
      .trim();
  };

  const shortDescription = sanitizeDescription(product.tagline || product.description);

  // Dynamic variations list
  const variationsToDisplay = product.variations && product.variations.length > 0
    ? product.variations
    : [
        { id: 'v1', size: '50ml', price: product.basePrice * 0.75 },
        { id: 'v2', size: '100ml', price: product.basePrice },
        { id: 'v3', size: '200ml', price: product.basePrice * 1.6 }
      ];

  const selectedVariation = variationsToDisplay.find(v => v.size === selectedSize) || variationsToDisplay[0];
  const activePrice = selectedVariation ? selectedVariation.price : product.basePrice;
  const configuredPrice = activePrice * quantity;

  return (
    <div className="bg-luxury-black text-luxury-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="group inline-flex items-center gap-2 text-zinc-400 hover:text-gold transition-colors text-xs font-sans uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to previous formulation
          </button>
        </div>

        {/* Name Displayed prominently at the Top */}
        <div className="border-b border-white/5 pb-6 mb-10 text-left">
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold bg-gold/10 border border-gold/25 px-3 py-1 rounded-none font-sans inline-block mb-3">
            {genderCategory}
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-light tracking-wide text-luxury-white uppercase">
            {product.name}
          </h1>
          <p className="text-zinc-400 text-xs mt-2 uppercase tracking-[0.2em] font-sans font-light">
            Main Category: {product.category || 'Luxury'}
          </p>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Visual Media (5 columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[4/5] bg-black border border-white/5 overflow-hidden group">
              {!imageLoaded && (
                <div className="absolute inset-0 bg-zinc-900/80 animate-pulse z-10" />
              )}
              <img 
                src={product.image} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-4 left-4 bg-black/95 border border-white/5 text-gold text-[10px] uppercase tracking-widest py-1 px-3 rounded-none font-sans font-medium">
                {product.scentFamily || 'Luxury Scent'}
              </span>
            </div>

            {/* Scent Sillage / Longevity Specs */}
            <div className="bg-luxury-dark border border-gold/15 p-6 space-y-5 rounded-none">
              <h4 className="text-xs uppercase tracking-widest text-gold font-sans font-bold border-b border-white/5 pb-2 text-left">
                Performance Diagnostics
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-sans text-zinc-400">
                    <span>Longevity / Persistence</span>
                    <span className="text-gold font-bold">{(product.longevity || 4)}/5</span>
                  </div>
                  <div className="w-full bg-[#0d0d0d] border border-white/5 h-1.5 rounded-none overflow-hidden">
                    <div 
                      className="bg-gold h-full" 
                      style={{ width: `${((product.longevity || 4) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1.5 font-sans text-zinc-400">
                    <span>Sillage / Projection Trail</span>
                    <span className="text-gold font-bold">{(product.sillage || 4)}/5</span>
                  </div>
                  <div className="w-full bg-[#0d0d0d] border border-white/5 h-1.5 rounded-none overflow-hidden">
                    <div 
                      className="bg-gold h-full" 
                      style={{ width: `${((product.sillage || 4) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Configuration & Info (7 columns) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            
            <div className="space-y-6 text-left">
              
              {/* Product Tags */}
              <div className="flex flex-wrap items-center gap-3">
                {product.isBestSeller && (
                  <span className="text-[10px] uppercase tracking-[0.25em] text-black font-semibold bg-gold px-3 py-1 rounded-none font-sans">
                    Bestseller
                  </span>
                )}
                {product.isFeatured && (
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold bg-gold/10 border border-gold/25 px-3 py-1 rounded-none font-sans">
                    Featured
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <span className="text-[10px] text-zinc-500 block uppercase tracking-widest font-sans font-semibold">Fragrance Signature</span>
                <p className="text-zinc-300 text-sm font-sans font-light leading-relaxed max-w-2xl">
                  {shortDescription || 'A masterfully curated sensory formulation representing refined luxury and absolute sophistication.'}
                </p>
              </div>

              {/* Scent Pyramid Structure */}
              <div className="bg-black border border-white/5 rounded-none p-5 space-y-4">
                <span className="text-[10px] uppercase text-gold font-sans font-bold tracking-widest block border-b border-white/5 pb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  Olfactory Fragrance Pyramid Structure
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left font-sans">
                  <div>
                    <span className="text-zinc-500 font-medium uppercase tracking-widest text-[9px] block mb-1">Top Notes</span>
                    <p className="text-zinc-200 font-light leading-relaxed">
                      {(product?.notes?.top || ['Bergamot', 'Pink Pepper', 'Citrus']).join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium uppercase tracking-widest text-[9px] block mb-1">Heart Notes</span>
                    <p className="text-zinc-200 font-light leading-relaxed">
                      {(product?.notes?.heart || ['Turkish Rose', 'Jasmine', 'Amberwood']).join(', ')}
                    </p>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-medium uppercase tracking-widest text-[9px] block mb-1">Base Notes</span>
                    <p className="text-zinc-200 font-light leading-relaxed">
                      {(product?.notes?.base || ['Madagascar Vanilla', 'White Musk', 'Patchouli']).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Panels and Purchase CTA */}
            <div className="space-y-6 border-t border-white/5 pt-6 text-left">
              
              {/* Size Option Grid (Variations) */}
              <div className="space-y-3">
                <span className="text-[10px] text-gold block font-sans font-bold uppercase tracking-widest">
                  Available Variations
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {variationsToDisplay.map((v) => {
                    const size = v.size || '100ml';
                    const isSelected = selectedSize === size;
                    const priceEst = v.price || calculateItemPrice(product.basePrice, size, 'Eau de Parfum');
                    return (
                      <button
                        key={v.id || size}
                        onClick={() => setSelectedSize(size)}
                        className={`p-3.5 rounded-none border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0d0d0d] border-gold text-gold shadow-[0_0_20px_rgba(197,160,89,0.08)]'
                            : 'bg-black border-white/5 text-zinc-400 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <span className="block text-xs font-sans font-bold uppercase tracking-widest">{size}</span>
                        <span className="text-[11px] text-zinc-500 font-sans mt-1 block">
                          {formatBDT(priceEst)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity and Add to Chest Row */}
              <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block tracking-widest font-sans mb-1">
                    Total Value
                  </span>
                  <span className="text-3xl font-serif font-light text-gold">
                    {formatBDT(configuredPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-white/10 bg-black h-12">
                    <button 
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="px-4 text-zinc-400 hover:text-gold transition-colors text-lg focus:outline-none cursor-pointer font-bold h-full"
                    >
                      -
                    </button>
                    <span className="px-4 font-sans font-medium text-sm text-white w-10 text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="px-4 text-zinc-400 hover:text-gold transition-colors text-lg focus:outline-none cursor-pointer font-bold h-full"
                    >
                      +
                    </button>
                  </div>

                  {/* Add To Cart */}
                  <button
                    onClick={() => handleAddToCart(product, selectedSize, 'Eau de Parfum', quantity)}
                    className="flex-1 sm:flex-none h-12 bg-transparent border border-gold hover:bg-gold hover:text-black text-gold font-sans font-bold uppercase tracking-[0.2em] text-xs px-8 rounded-none shadow-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to chest
                  </button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 border rounded-none h-12 flex items-center justify-center transition-all cursor-pointer ${
                      wishlist.includes(product.id)
                        ? 'border-gold text-gold bg-gold/10'
                        : 'border-white/10 text-zinc-400 hover:border-gold hover:text-gold'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-gold' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Fine Print Trust Marks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/5 pt-6 text-[11px] text-zinc-500 font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold shrink-0" />
                  <span>100% Authentic Guaranteed Decant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold shrink-0" />
                  <span>Rapid Nationwide Secure Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-gold shrink-0" />
                  <span>Easy Exchange Premium Assurances</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Extra Bottom Margin for Elegant Breathing Space */}
        <div className="pb-16 md:pb-24"></div>

      </div>
    </div>
  );
};
