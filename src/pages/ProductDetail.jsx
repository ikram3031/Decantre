import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link, useParams } from 'react-router-dom';
import { useAppStore } from '../core/store/useAppStore';
import { formatBDT } from '../core/utils/formatCurrency';
import { mapRemoteProduct, resolveBrandName, resolveCategoryName, resolveBrandSlug, resolveCategorySlug } from '../core/store/productHelpers';
import { fetchProductDetails, fetchProducts, fetchProductReviews, createProductReview } from '../core/lib/api';
import { MoreProducts } from '../components/sections/MoreProducts';
import { RecentlyViewedProducts } from '../components/sections/RecentlyViewedProducts';
import { AvailableSizesCard } from '../components/AvailableSizesCard';
import { pixelViewContent, pixelAddToCart } from '../utils/fbPixel';

// Adds recently viewed product identifier to browser local storage
const addToRecentlyViewed = (id) => {
  if (!id) return;
  try {
    const stored = localStorage.getItem('recently_viewed');
    let list = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(list)) list = [];
    list = list.filter(item => String(item) !== String(id));
    list.unshift(id);
    list = list.slice(0, 10);
    localStorage.setItem('recently_viewed', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
};

import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Loader2, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Info,
  Search,
  Share2,
  Check,
  Plus,
  Minus,
  Star,
  Tag,
  ShoppingBag,
  X,
  Maximize2,
  MessageSquare,
  UserCheck,
  Send,
  CheckCircle2
} from 'lucide-react';

// Renders standalone fragrance product detail page with variations, reviews, and recommendations
export const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const products = useAppStore((state) => state.products);
  const brands = useAppStore((state) => state.brands);
  const categories = useAppStore((state) => state.categories);
  const wishlist = useAppStore((state) => state.wishlist);
  const toggleWishlist = useAppStore((state) => state.toggleWishlist);
  const handleAddToCart = useAppStore((state) => state.handleAddToCart);
  const setIsCartOpen = useAppStore((state) => state.setIsCartOpen);
  const addToast = useAppStore((state) => state.addToast);
  const user = useAppStore((state) => state.user);
  const setAuthModal = useAppStore((state) => state.setAuthModal);
  const currentTheme = useAppStore((state) => state.currentTheme);

  const isLight = currentTheme === 'light';
  const { slug } = useParams();
  const did = slug || searchParams.get('slug') || searchParams.get('did') || searchParams.get('id');

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState('15ML');
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [reviewsStats, setReviewsStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsPagination, setReviewsPagination] = useState({ skip: 0, limit: 10, total: 0 });
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (!did) {
      setError('No product identifier provided.');
      setIsLoading(false);
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const loadProductDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetched = await fetchProductDetails(did);
        if (fetched) {
          setProduct(fetched);
          setIsLoading(false);
          addToRecentlyViewed(fetched.id);
          return;
        }

        if (products && products.length > 0) {
          const found = products.find(p => p.slug === did || p.id === did || String(p.raw?.id) === String(did));
          if (found) {
            setProduct(found);
            setIsLoading(false);
            addToRecentlyViewed(found.id);
            return;
          }
        }

        const allProds = await fetchProducts({ limit: 100 });
        const found = allProds.find(p => p.slug === did || p.id === did || String(p.raw?.id) === String(did));
        if (found) {
          setProduct(found);
          addToRecentlyViewed(found.id);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    loadProductDetail();
  }, [did]);

  useEffect(() => {
    if (product) {
      pixelViewContent({
        id: product.id || product._id,
        name: product.name,
        price: product.price || product.basePrice,
      });
    }
  }, [product]);

  const decantSwatches = React.useMemo(() => {
    if (product && Array.isArray(product.variations) && product.variations.length > 0) {
      return product.variations.map((v) => {
        const rawSize = String(v.size || 'Standard');
        const sizeNumber = parseInt(rawSize.replace(/[^0-9]/g, ''), 10);
        return {
          size: rawSize,
          label: rawSize.replace(/-/g, ' '),
          price: v.price,
          originalPrice: v.originalPrice,
          sprays: sizeNumber ? `~${sizeNumber * 15} Sprays` : '',
          raw: v
        };
      });
    }
    return [];
  }, [product]);

  useEffect(() => {
    if (decantSwatches.length > 0 && (!selectedSize || !decantSwatches.some(s => s.size === selectedSize))) {
      setSelectedSize(decantSwatches[0].size);
    }
  }, [decantSwatches, selectedSize]);

  // Fetches paginated approved reviews and statistical summary from API
  const loadReviews = async (targetProductDid, skip = 0, append = false) => {
    if (!targetProductDid) return;
    setIsLoadingReviews(true);
    try {
      const data = await fetchProductReviews(targetProductDid, { skip, limit: 10 });
      if (data) {
        if (data.stats) {
          setReviewsStats(data.stats);
        }
        if (data.pagination) {
          setReviewsPagination(data.pagination);
        }
        if (append) {
          setReviewsList((prev) => [...prev, ...(data.reviews || [])]);
        } else {
          setReviewsList(data.reviews || []);
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    const productDid = product?.did || product?.id;
    if (productDid) {
      loadReviews(productDid, 0, false);
    }
  }, [product?.did, product?.id]);

  const activeSwatch = decantSwatches.find(s => s.size === selectedSize) || decantSwatches[0] || { size: 'Full Bottle', price: product?.price || product?.basePrice };

  const isOutOfStock = React.useMemo(() => {
    if (!product) return false;
    const status = String(product.stockStatus || '').toLowerCase().trim();
    return status === 'outofstock' || status === 'out of stock';
  }, [product]);

  const unitPrice = activeSwatch?.price ?? product?.basePrice ?? 980;

  // Shares product URL or copies link to system clipboard
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Decantre',
        text: `Check out ${product?.name} on Decantre`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  // Adds active product variation to cart and navigates directly to checkout
  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart(product, activeSwatch.size, quantity, unitPrice);
    navigate('/checkout');
  };

  // Submits customer product review to backend API with validation
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModal(true, 'login');
      return;
    }
    if (!reviewText.trim()) {
      addToast('Please write a review before submitting.', 'error');
      return;
    }
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      addToast('Please select a rating between 1 and 5 stars.', 'error');
      return;
    }

    const productDid = product?.did || product?.raw?.did || product?.id || product?.slug;
    if (!productDid) {
      addToast('Product identifier is missing.', 'error');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await createProductReview({
        productDid,
        rating: reviewRating,
        description: reviewText.trim()
      });

      addToast(res?.message || 'Review submitted successfully and is pending approval.', 'success');
      setReviewText('');
      setReviewRating(5);
      setIsReviewFormOpen(false);
      loadReviews(productDid, 0, false);
    } catch (err) {
      addToast(err?.message || 'Failed to submit review.', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-[70vh] flex flex-col items-center justify-center space-y-4 ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-luxury-black text-luxury-white'}`}>
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
        <p className="text-zinc-400 font-sans text-xs uppercase tracking-widest">Loading Product Details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`min-h-[75vh] flex flex-col items-center justify-center p-4 text-center ${isLight ? 'bg-zinc-50 text-zinc-900' : 'bg-luxury-black text-luxury-white'}`}>
        <div className="bg-gold/10 border border-gold/30 p-4 rounded-full mb-6">
          <Info className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-2xl font-serif uppercase tracking-wider mb-2">Product Not Found</h2>
        <p className="text-zinc-500 max-w-md text-sm mb-8 font-sans leading-relaxed">
          {error || 'We could not locate the selected fragrance in our catalog.'}
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-black transition-all px-8 py-3.5 uppercase tracking-widest text-xs font-sans font-bold rounded-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-white text-zinc-900' : 'bg-luxury-black text-luxury-white'} text-left`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">

        {/* Requirements 9 & 10: PCBWay-style Single Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT CONTAINER: Sticky Media & Size Thumbnails */}
          <div className="lg:col-span-5 space-y-4">
            <div className="lg:sticky lg:top-28 space-y-4">
              
              {/* Main Image View */}
              <div className={`relative w-full aspect-square border ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-950 border-gold/20'} rounded-xl overflow-hidden p-6 flex items-center justify-center group shadow-md`}>
                <button 
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-black/60 border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all cursor-pointer"
                  aria-label="Zoom image"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <img 
                  src={product.image} 
                  alt={product.name} 
                  className={`max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  referrerPolicy="no-referrer"
                />
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 z-10 bg-red-600/90 backdrop-blur-sm text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-sm shadow-md">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER: Scrollable Info, Swatches, Quantities, Actions, Reviews */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Category Link, Title & Brand */}
            <div className="space-y-2.5 border-b border-gold/15 pb-6">
              <Link
                to={`/shop?${new URLSearchParams({ category: resolveCategorySlug(product.category) || 'All' }).toString()}`}
                className="text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.25em] text-gold hover:underline"
              >
                {resolveCategoryName(product.category)}
              </Link>
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium leading-tight tracking-tight">
                  {product.name}
                </h1>
                {isOutOfStock && (
                  <span className="bg-red-600 text-white text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-sm shrink-0">
                    Out of Stock
                  </span>
                )}
              </div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-sans font-medium block">
                Brand: <Link
                  to={`/shop?${new URLSearchParams({ brand: resolveBrandSlug(product.brand, brands) || 'All' }).toString()}`}
                  className="text-gold font-semibold hover:underline"
                >
                  {resolveBrandName(product.brand, brands) || (product.name && /\s+by\s+/i.test(product.name) ? product.name.split(/\s+by\s+/i).pop().trim() : '') || 'Perfume'}
                </Link>
              </span>

              {/* Dynamic Star Rating */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('product-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
                >
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          reviewsStats.totalReviews > 0
                            ? star <= Math.round(reviewsStats.averageRating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-600'
                            : 'text-zinc-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-400 font-mono font-semibold group-hover:text-gold transition-colors">
                    {reviewsStats.totalReviews > 0
                      ? `${reviewsStats.averageRating.toFixed(1)} (${reviewsStats.totalReviews} ${reviewsStats.totalReviews === 1 ? 'Review' : 'Reviews'})`
                      : 'No reviews yet (Write a review)'}
                  </span>
                </button>
              </div>

              {/* Price Display */}
              <div className="pt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-serif text-gold font-bold">
                  {formatBDT(unitPrice * quantity)}
                </span>
                <span className="text-xs text-zinc-500 font-sans">
                  ({formatBDT(unitPrice)} per bottle)
                </span>
              </div>
            </div>

            {/* 3-Column Variation Swatches */}
            {product.type === 'variant' && decantSwatches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans uppercase tracking-widest text-zinc-400 font-bold">
                    Select Decant Size:
                  </span>
                  <button 
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[10px] uppercase tracking-wider text-gold hover:underline cursor-pointer"
                  >
                    Size & Spray Guide
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {decantSwatches.map((swatch) => {
                    const isSelected = selectedSize === swatch.size;
                    return (
                      <button
                        key={swatch.size}
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (isOutOfStock) return;
                          setSelectedSize(swatch.size);
                        }}
                        className={`p-3.5 rounded-sm border text-left transition-all flex flex-col justify-between relative overflow-hidden ${
                          isOutOfStock
                            ? 'border-zinc-800 bg-zinc-900/50 text-zinc-600 cursor-not-allowed opacity-50 pointer-events-none'
                            : isSelected
                              ? 'border-gold bg-gold/15 text-gold font-bold shadow-md ring-1 ring-gold/50 cursor-pointer'
                              : isLight
                                ? 'border-zinc-200 bg-white text-zinc-800 hover:border-black cursor-pointer'
                                : 'border-white/10 bg-black/40 text-zinc-300 hover:border-gold/40 cursor-pointer'
                        }`}
                      >
                        <span className="text-xs font-mono font-bold block">{swatch.label}</span>
                        <span className="text-[11px] text-gold font-mono font-semibold block mt-1">{formatBDT(swatch.price)}</span>
                        {swatch.sprays && (
                          <span className="text-[10px] text-zinc-400 font-mono block mt-2">{swatch.sprays}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Picker */}
            <div className="space-y-2">
              <span className="text-xs font-sans uppercase tracking-widest text-zinc-400 font-bold block">
                Quantity
              </span>
              <div className={`inline-flex items-center border ${isLight ? 'border-[#050505]' : 'border-gold/40'} rounded-sm overflow-hidden`}>
                <button 
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && setQuantity(prev => Math.max(1, prev - 1))}
                  className={`w-10 h-10 flex items-center justify-center font-bold transition-colors ${
                    isOutOfStock ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gold text-black hover:bg-gold/90 cursor-pointer'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className={`w-12 h-10 flex items-center justify-center text-sm font-mono font-bold ${isLight ? 'bg-white text-black border-x border-[#050505]' : 'bg-transparent text-white'}`}>
                  {quantity}
                </span>
                <button 
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => !isOutOfStock && setQuantity(prev => prev + 1)}
                  className={`w-10 h-10 flex items-center justify-center font-bold transition-colors ${
                    isOutOfStock ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gold text-black hover:bg-gold/90 cursor-pointer'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  handleAddToCart(product, activeSwatch.size, quantity, unitPrice);
                  pixelAddToCart(product, quantity, unitPrice);
                }}
                className={`w-full py-4 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50 shadow-none'
                    : 'bg-gold hover:bg-gold/90 text-black shadow-lg shadow-gold/10 cursor-pointer'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
              </button>

              <button
                disabled={isOutOfStock}
                onClick={() => {
                  if (isOutOfStock) return;
                  handleBuyNow();
                }}
                className={`w-full py-4 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${
                  isOutOfStock
                    ? 'bg-transparent text-zinc-500 border-zinc-800 cursor-not-allowed opacity-50'
                    : 'bg-black text-gold border-gold hover:bg-gold hover:text-black cursor-pointer'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {isOutOfStock ? 'OUT OF STOCK' : 'BUY NOW'}
              </button>
            </div>

            {/* Share and Wishlist Row */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleShare}
                className={`w-full py-3 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  isLight 
                    ? 'bg-transparent text-[#050505] border-[#050505] hover:bg-[#050505]/10' 
                    : 'bg-black/40 text-zinc-300 border-white/10 hover:border-gold hover:text-gold'
                }`}
              >
                <Share2 className={`w-4 h-4 ${isLight ? 'text-black' : 'text-gold'}`} />
                SHARE
              </button>
              <button 
                onClick={() => toggleWishlist(product.id)}
                className={`w-full py-3 rounded-sm text-xs font-sans font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  wishlist.includes(product.id)
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                    : isLight
                      ? 'bg-transparent text-[#050505] border-[#050505] hover:bg-[#050505]/10'
                      : 'bg-black/40 text-zinc-300 border-white/10 hover:border-gold hover:text-gold'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : isLight ? 'text-black' : 'text-gold'}`} />
                WISHLIST
              </button>
            </div>

            {/* Available Decant Sizes Showcase with Popup Preview */}
            <AvailableSizesCard 
              product={product} 
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)} 
            />

            {/* Linked Shipping Notice */}
            <div className={`p-4 border rounded-sm flex items-start gap-3 shadow-md ${
              isLight ? 'bg-amber-50/60 border-amber-200 text-amber-900' : 'bg-zinc-900/90 border-zinc-700/60 text-zinc-200'
            }`}>
              <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="text-xs font-sans leading-relaxed">
                <strong className="text-gold font-bold uppercase tracking-wider block mb-0.5">Delivery Notice</strong>
                Courier delivery: <span className="font-semibold text-white">৳80 Inside Dhaka (24–48h)</span>, <span className="font-semibold text-white">৳120 Outside Dhaka (24–72h)</span>. Cash on Delivery & Office Pickup available.
              </div>
            </div>

            {/* Description & Olfactory Notes breakdown */}
            <div className="p-6 border bg-zinc-950/80 border-gold/15 rounded-sm space-y-4">
              <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-gold border-b border-gold/15 pb-2">
                Description
              </h3>
              <div 
                className="text-xs text-zinc-300 font-sans font-light leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_b]:font-semibold [&_p]:my-1"
                dangerouslySetInnerHTML={{ 
                  __html: product.description || product.tagline || 'Exquisitely blended royal fragrance with top notes of bergamot and pink pepper, transitioning into a heart of white cedar, and anchored by a rich amber-musk sillage.' 
                }}
              />
            </div>

            <div id="product-reviews-section" className={`p-6 sm:p-8 border rounded-sm space-y-8 scroll-mt-24 transition-all ${
              isLight ? 'bg-zinc-50/90 border-zinc-200 shadow-sm' : 'bg-zinc-950/90 border-gold/20'
            }`}>
              
              <div className={`border-b pb-6 space-y-6 ${isLight ? 'border-zinc-200' : 'border-gold/15'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className={`text-xl sm:text-2xl font-serif font-medium flex items-center gap-2.5 ${isLight ? 'text-zinc-900' : 'text-luxury-white'}`}>
                      <MessageSquare className="w-5 h-5 text-gold shrink-0" />
                      Customer Reviews
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        setAuthModal(true, 'login');
                      } else {
                        setIsReviewFormOpen((prev) => !prev);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-black text-xs font-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-all shadow-md shadow-gold/5 shrink-0 cursor-pointer"
                  >
                    {isReviewFormOpen ? (
                      <>
                        <X className="w-4 h-4" />
                        Close Form
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Write a Review
                      </>
                    )}
                  </button>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 rounded-sm border ${
                  isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-black/50 border-white/5'
                }`}>
                  
                  <div className={`md:col-span-4 flex flex-col items-center justify-center text-center p-2 border-b md:border-b-0 md:border-r ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
                    <div className="text-4xl sm:text-5xl font-serif font-bold text-gold mb-1">
                      {reviewsStats.totalReviews > 0 ? reviewsStats.averageRating.toFixed(1) : '0.0'}
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            reviewsStats.totalReviews > 0 && star <= Math.round(reviewsStats.averageRating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : isLight ? 'text-zinc-300' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-[11px] font-sans uppercase tracking-wider ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      Based on {reviewsStats.totalReviews} {reviewsStats.totalReviews === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>

                  <div className="md:col-span-8 flex flex-col justify-center space-y-2 text-xs font-sans">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviewsStats.ratingBreakdown?.[String(stars)] ?? reviewsStats.ratingBreakdown?.[stars] ?? 0;
                      const percentage = reviewsStats.totalReviews > 0
                        ? Math.round((count / reviewsStats.totalReviews) * 100)
                        : 0;

                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <div className={`flex items-center gap-1 w-12 shrink-0 font-mono text-[11px] ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                            <span>{stars}</span>
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                          </div>

                          <div className={`flex-1 h-2 rounded-full overflow-hidden ${isLight ? 'bg-zinc-200' : 'bg-zinc-800'}`}>
                            <div
                              className="h-full bg-gold transition-all duration-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className={`w-12 text-right text-[11px] font-mono shrink-0 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {count} ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {isReviewFormOpen && (
                <div className={`p-4 sm:p-6 rounded-sm border overflow-hidden animate-fade-in ${
                  isLight ? 'bg-white border-gold/40 shadow-md' : 'bg-black/70 border-gold/30 shadow-2xl'
                }`}>
                  {user ? (
                    <form onSubmit={handleReviewSubmit} className="space-y-5">
                      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 ${isLight ? 'border-zinc-200' : 'border-white/10'}`}>
                        <span className="text-xs font-sans font-bold uppercase tracking-widest text-gold">
                          Write a Review
                        </span>
                        <span className={`text-xs font-sans truncate ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          Reviewing as <strong className={`font-medium ${isLight ? 'text-zinc-900' : 'text-white'}`}>{user.name || user.email}</strong>
                        </span>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-sans font-bold uppercase tracking-wider block ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          Rating *
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <div className="flex items-center gap-1 shrink-0">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                onMouseEnter={() => setReviewHoverRating(star)}
                                onMouseLeave={() => setReviewHoverRating(0)}
                                className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                              >
                                <Star
                                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                                    star <= (reviewHoverRating || reviewRating)
                                      ? 'fill-amber-400 text-amber-400'
                                      : isLight ? 'text-zinc-300 hover:text-zinc-400' : 'text-zinc-700 hover:text-zinc-500'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-xs text-gold font-sans font-semibold">
                            {(reviewHoverRating || reviewRating) === 5 && '5/5 — Excellent'}
                            {(reviewHoverRating || reviewRating) === 4 && '4/5 — Very Good'}
                            {(reviewHoverRating || reviewRating) === 3 && '3/5 — Good'}
                            {(reviewHoverRating || reviewRating) === 2 && '2/5 — Fair'}
                            {(reviewHoverRating || reviewRating) === 1 && '1/5 — Poor'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] font-sans font-bold uppercase tracking-wider block ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          Your Review *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Write your review here..."
                          className={`w-full border text-xs p-3.5 sm:p-4 rounded-sm outline-none font-sans leading-relaxed resize-y transition-colors box-border ${
                            isLight
                              ? 'bg-zinc-50 border-zinc-300 focus:border-gold text-zinc-900 placeholder:text-zinc-400'
                              : 'bg-zinc-900/90 border-white/10 focus:border-gold/70 text-zinc-100 placeholder:text-zinc-500'
                          }`}
                        />
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsReviewFormOpen(false)}
                          className={`w-full sm:w-auto px-5 py-2.5 border text-xs font-sans uppercase tracking-wider rounded-sm transition-all cursor-pointer text-center ${
                            isLight
                              ? 'border-zinc-300 hover:border-zinc-400 text-zinc-600 hover:text-black'
                              : 'border-white/10 hover:border-white/20 text-zinc-400 hover:text-white'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmittingReview || !reviewText.trim()}
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-sans font-bold uppercase tracking-wider rounded-sm whitespace-nowrap transition-all shadow-md ${
                            isSubmittingReview || !reviewText.trim()
                              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                              : 'bg-gold hover:bg-gold/90 text-black shadow-gold/10 cursor-pointer'
                          }`}
                        >
                          {isSubmittingReview ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 shrink-0" />
                              <span>Submit Review</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h4 className={`text-sm font-sans font-bold uppercase tracking-wider ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
                          Please Log In
                        </h4>
                        <p className={`text-xs font-sans font-light max-w-sm mx-auto ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                          Please log in to your account to write a review.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAuthModal(true, 'login')}
                        className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-black text-xs font-sans font-bold uppercase tracking-widest px-6 py-3 rounded-sm transition-all shadow-lg shadow-gold/5 cursor-pointer"
                      >
                        Log In to Write a Review
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {isLoadingReviews && reviewsList.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3 text-zinc-500">
                    <Loader2 className="w-6 h-6 text-gold animate-spin" />
                    <span className="text-xs font-sans tracking-widest uppercase">Loading Reviews...</span>
                  </div>
                ) : reviewsList.length === 0 ? (
                  <div className={`text-center py-12 px-4 border rounded-sm space-y-3 ${
                    isLight ? 'border-zinc-200 bg-white' : 'border-white/5 bg-black/20'
                  }`}>
                    <MessageSquare className="w-8 h-8 text-gold/30 mx-auto" />
                    <h4 className={`text-sm font-serif ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>No Reviews Yet</h4>
                    <p className={`text-xs font-sans font-light max-w-md mx-auto leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
                      There are no reviews for this product yet. Be the first to leave a review!
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!user) {
                          setAuthModal(true, 'login');
                        } else {
                          setIsReviewFormOpen(true);
                        }
                      }}
                      className="inline-flex items-center gap-2 border border-gold/50 text-gold hover:bg-gold hover:text-black text-xs font-sans font-bold uppercase tracking-wider px-5 py-2 rounded-sm transition-all cursor-pointer mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Write a Review
                    </button>
                  </div>
                ) : (
                  <div className={`space-y-4 divide-y ${isLight ? 'divide-zinc-200' : 'divide-white/5'}`}>
                    {reviewsList.map((review) => {
                      const reviewerName = review.memberId?.name || review.author || 'Verified Customer';
                      const initials = reviewerName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((n) => n[0]?.toUpperCase())
                        .join('') || 'VC';
                      const formattedDate = review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : review.date || 'Verified Buyer';

                      return (
                        <div
                          key={review._id || review.id || review.did}
                          className="pt-5 first:pt-0 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center font-serif text-xs text-gold font-bold shrink-0">
                                {initials}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-sans font-bold uppercase tracking-wide ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
                                    {reviewerName}
                                  </span>
                                  <span className="inline-flex items-center gap-1 text-[9px] font-sans font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded-xs">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    Verified
                                  </span>
                                </div>
                                <span className={`text-[10px] font-mono block ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                                  {formattedDate}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3.5 h-3.5 ${
                                    star <= review.rating ? 'fill-amber-400 text-amber-400' : isLight ? 'text-zinc-300' : 'text-zinc-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          <p className={`text-xs sm:text-sm font-sans font-light leading-relaxed whitespace-pre-line pl-11 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                            {review.description || review.comment || review.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {reviewsPagination.total > reviewsList.length && (
                  <div className="pt-4 text-center">
                    <button
                      type="button"
                      disabled={isLoadingReviews}
                      onClick={() => {
                        const productDid = product?.did || product?.id;
                        loadReviews(productDid, reviewsList.length, true);
                      }}
                      className={`inline-flex items-center gap-2 px-6 py-2.5 border text-xs font-sans uppercase tracking-widest rounded-sm transition-all cursor-pointer ${
                        isLight
                          ? 'border-zinc-300 hover:border-gold text-zinc-700 hover:text-black'
                          : 'border-white/10 hover:border-gold/50 text-zinc-300 hover:text-gold'
                      }`}
                    >
                      {isLoadingReviews ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
                          Loading...
                        </>
                      ) : (
                        `Load More Reviews (${reviewsPagination.total - reviewsList.length} remaining)`
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Recently Viewed Products Section */}
        <div className="pt-8">
          <RecentlyViewedProducts 
            currentProductId={product.id}
            limit={8}
          />
        </div>

        {/* Requirement 11: Reusable "More Products" Section Component */}
        <div className="pt-8">
          <MoreProducts 
            title="More Fragrances You May Like" 
            category={product.category} 
            currentProductId={product.id}
            limit={8}
          />
        </div>

      </div>

      {/* ZOOM IMAGE MODAL */}
      {isZoomOpen && (
        <div 
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full cursor-pointer transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}

      {/* DECANT SIZE GUIDE MODAL */}
      {isSizeGuideOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-950 border border-gold/30 rounded-sm p-6 max-w-md w-full space-y-4 shadow-2xl text-left relative text-white"
          >
            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-gold rounded-full cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-serif font-light text-gold tracking-widest uppercase border-b border-gold/20 pb-2">
              Decant Volume & Spray Guide
            </h3>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans font-light">
              All decants are hand-filled into sterile, glass atomizers with high-fidelity fine sprayers.
            </p>

            <div className="space-y-2.5 pt-1 font-mono text-xs">
              {decantSwatches.length > 0 ? (
                decantSwatches.map((swatch) => (
                  <div
                    key={swatch.size}
                    className={`flex justify-between items-center p-3 rounded-sm border ${swatch.size === selectedSize ? 'bg-gold/15 border-gold/40' : 'bg-black border-white/10'}`}
                  >
                    <span className="font-bold text-gold">{swatch.label}</span>
                    <span className="text-zinc-300">{swatch.sprays}</span>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-center p-3 rounded-sm bg-black border border-white/10">
                    <span className="font-bold text-gold">3ML Decant</span>
                    <span className="text-zinc-300">~45+ Sprays</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-sm bg-black border border-white/10">
                    <span className="font-bold text-gold">5ML Decant</span>
                    <span className="text-zinc-300">~75+ Sprays</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-sm bg-black border border-white/10">
                    <span className="font-bold text-gold">10ML Decant</span>
                    <span className="text-zinc-300">~150+ Sprays</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-sm bg-gold/15 border border-gold/40">
                    <span className="font-bold text-gold">15ML Decant (Best Value)</span>
                    <span className="text-gold font-bold">~225+ Sprays</span>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={() => setIsSizeGuideOpen(false)}
              className="w-full bg-gold text-black font-bold py-3 rounded-sm text-xs uppercase tracking-widest cursor-pointer hover:bg-gold/90 transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
