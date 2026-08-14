import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, Clock, Flame, Sparkles, ShoppingBag } from 'lucide-react';
import { useApp } from '../core/context/AppContext';
import {
  searchProductsAPI,
  fetchPopularSearches,
  fetchRecentSearches,
  clearRecentSearch,
} from '../core/lib/api';
import { normalizeProductImage } from '../core/store/productHelpers';

// localStorage fallback key for recent searches (guests)
const LOCAL_RECENT_KEY = 'decantre_recent_searches';
const MAX_LOCAL_RECENT = 10;

const getLocalRecentSearches = () => {
  try {
    const stored = localStorage.getItem(LOCAL_RECENT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const addLocalRecentSearch = (query) => {
  if (!query || !query.trim()) return;
  const q = query.trim();
  const existing = getLocalRecentSearches().filter(
    (s) => s.query.toLowerCase() !== q.toLowerCase()
  );
  const updated = [{ query: q, searchedAt: new Date().toISOString() }, ...existing].slice(0, MAX_LOCAL_RECENT);
  localStorage.setItem(LOCAL_RECENT_KEY, JSON.stringify(updated));
};

const clearLocalRecentSearch = (query) => {
  if (query) {
    const filtered = getLocalRecentSearches().filter(
      (s) => s.query.toLowerCase() !== query.toLowerCase()
    );
    localStorage.setItem(LOCAL_RECENT_KEY, JSON.stringify(filtered));
  } else {
    localStorage.removeItem(LOCAL_RECENT_KEY);
  }
};

export const SearchPanel = ({ isOpen, onClose, onSearch, onSelectProduct }) => {
  const navigate = useNavigate();
  const { user } = useApp();
  const inputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Search input state
  const [searchVal, setSearchVal] = useState('');
  const [debouncedVal, setDebouncedVal] = useState('');

  // Data states
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [discoveryProduct, setDiscoveryProduct] = useState(null);
  const [discoveryLoading, setDiscoveryLoading] = useState(false);

  // Loading states
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  // Hover debounce ref
  const hoverTimerRef = useRef(null);
  const discoveryAbortRef = useRef(null);

  // Typewriter placeholder
  const searchSuggestions = useMemo(() => [
    'Sauvage Elixir', 'Baccarat Rouge 540', 'Oud Wood', 'Bleu de Chanel',
    'Aventus', 'Lattafa Khamrah', 'Hawas', 'Gucci Flora'
  ], []);
  const [suggestionIdx, setSuggestionIdx] = useState(0);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) return;
    const fullText = searchSuggestions[suggestionIdx];
    let timer;
    if (!isDeleting && placeholderText !== fullText) {
      timer = setTimeout(() => setPlaceholderText(fullText.slice(0, placeholderText.length + 1)), 70);
    } else if (!isDeleting && placeholderText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && placeholderText !== '') {
      timer = setTimeout(() => setPlaceholderText(placeholderText.slice(0, -1)), 40);
    } else if (isDeleting && placeholderText === '') {
      setIsDeleting(false);
      setSuggestionIdx((prev) => (prev + 1) % searchSuggestions.length);
    }
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, suggestionIdx, searchSuggestions, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      // Reset state on close
      setSearchVal('');
      setDebouncedVal('');
      setSearchResults([]);
      setDiscoveryProduct(null);
    }
  }, [isOpen]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedVal(searchVal), 250);
    return () => clearTimeout(timer);
  }, [searchVal]);

  // Fetch recent & popular on open
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    // Recent searches
    const loadRecent = async () => {
      setLoadingRecent(true);
      try {
        if (user) {
          const data = await fetchRecentSearches();
          if (!cancelled) setRecentSearches(Array.isArray(data) ? data : []);
        } else {
          const local = getLocalRecentSearches();
          if (!cancelled) setRecentSearches(local);
        }
      } catch {
        if (!cancelled) setRecentSearches(getLocalRecentSearches());
      }
      if (!cancelled) setLoadingRecent(false);
    };

    // Popular searches
    const loadPopular = async () => {
      setLoadingPopular(true);
      try {
        const data = await fetchPopularSearches(8);
        if (!cancelled) setPopularSearches(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setPopularSearches([]);
      }
      if (!cancelled) setLoadingPopular(false);
    };

    loadRecent();
    loadPopular();

    return () => { cancelled = true; };
  }, [isOpen, user]);

  // Live search results
  useEffect(() => {
    if (!debouncedVal || debouncedVal.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    let cancelled = false;
    setLoadingResults(true);

    const doSearch = async () => {
      try {
        const results = await searchProductsAPI(debouncedVal, 8);
        if (!cancelled) setSearchResults(Array.isArray(results) ? results : []);
      } catch {
        if (!cancelled) setSearchResults([]);
      }
      if (!cancelled) setLoadingResults(false);
    };
    doSearch();

    return () => { cancelled = true; };
  }, [debouncedVal]);

  // Handle form submit
  const handleSubmit = useCallback((e) => {
    if (e?.preventDefault) e.preventDefault();
    const query = searchVal.trim();
    if (!query) return;

    // Save to recent
    addLocalRecentSearch(query);

    onClose();
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/search?search=${encodeURIComponent(query)}`);
    }
  }, [searchVal, onClose, onSearch, navigate]);

  // Handle clicking a search term
  const handleTermClick = useCallback((term) => {
    addLocalRecentSearch(term);
    onClose();
    navigate(`/search?search=${encodeURIComponent(term)}`);
  }, [onClose, navigate]);

  // Handle clicking a search result product
  const handleProductClick = useCallback((product) => {
    onClose();
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      navigate(`/product/${product.slug || product.id}`);
    }
  }, [onClose, onSelectProduct, navigate]);

  // Handle removing a recent search
  const handleRemoveRecent = useCallback(async (query, e) => {
    if (e?.stopPropagation) e.stopPropagation();
    if (user) {
      await clearRecentSearch(query);
      const data = await fetchRecentSearches();
      setRecentSearches(Array.isArray(data) ? data : []);
    } else {
      clearLocalRecentSearch(query);
      setRecentSearches(getLocalRecentSearches());
    }
  }, [user]);

  // Handle hovering over a search term for discovery
  const handleTermHover = useCallback((term) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (discoveryAbortRef.current) discoveryAbortRef.current = true;

    hoverTimerRef.current = setTimeout(async () => {
      let aborted = false;
      discoveryAbortRef.current = { set abort(v) { aborted = v; } };
      setDiscoveryLoading(true);
      try {
        const results = await searchProductsAPI(term, 1);
        if (!aborted && Array.isArray(results) && results.length > 0) {
          setDiscoveryProduct({ ...results[0], searchTerm: term });
        } else if (!aborted) {
          setDiscoveryProduct(null);
        }
      } catch {
        if (!aborted) setDiscoveryProduct(null);
      }
      if (!aborted) setDiscoveryLoading(false);
    }, 250);
  }, []);

  const handleTermLeave = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Determine if we're in search mode (user is typing)
  const isSearchMode = debouncedVal.trim().length >= 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed top-0 inset-x-0 z-[61] bg-[#0A0A0A] text-zinc-100 border-b border-gold/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            style={{ maxHeight: '85vh' }}
          >
            {/* Top Gold Ambient Glow Bar */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-80" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Search Input Bar */}
              <div className="py-5 sm:py-6">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gold shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder={placeholderText ? `Search "${placeholderText}"...` : 'Search fragrances, brands, notes...'}
                    className="flex-1 bg-transparent text-zinc-100 text-base sm:text-lg font-light placeholder-zinc-500 focus:outline-none border-none caret-gold font-sans"
                    autoComplete="off"
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => { setSearchVal(''); setDebouncedVal(''); inputRef.current?.focus(); }}
                      className="p-1.5 text-zinc-400 hover:text-gold transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-gold hover:text-white hover:bg-gold/10 border border-gold/40 rounded-full transition-all cursor-pointer ml-2"
                    aria-label="Close search"
                  >
                    <X className="w-4 h-4 stroke-[1.8]" />
                  </button>
                </form>
                <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              </div>

              {/* Content Area */}
              <div className="pb-6 sm:pb-8" style={{ maxHeight: 'calc(85vh - 95px)', overflow: 'hidden' }}>
                <AnimatePresence mode="wait">
                  {isSearchMode ? (
                    /* Live Search Results Mode */
                    <motion.div
                      key="search-results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-y-auto search-panel-scroll"
                      style={{ maxHeight: 'calc(85vh - 120px)' }}
                    >
                      {loadingResults && (
                        <div className="flex items-center gap-3 py-6 px-3">
                          <div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                          <span className="text-xs text-zinc-400 font-mono tracking-wider">Searching fragrances...</span>
                        </div>
                      )}
                      {!loadingResults && searchResults.length === 0 && (
                        <div className="py-12 text-center">
                          <Search className="w-9 h-9 text-zinc-600 mx-auto mb-3 opacity-60" />
                          <p className="text-sm font-serif text-zinc-400">No fragrances found matching "{debouncedVal}"</p>
                          <p className="text-xs text-zinc-600 mt-1">Try searching by brand, notes, or perfume family</p>
                        </div>
                      )}
                      <ul className="divide-y divide-white/5">
                        {searchResults.map((item) => {
                          const resolvedImg = normalizeProductImage(item.image || item.imageUrl || item.thumbnailUrl);
                          return (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => handleProductClick(item)}
                                className="w-full text-left px-3.5 py-3.5 flex items-center gap-4 hover:bg-gold/[0.04] transition-all group cursor-pointer rounded-sm"
                              >
                                <div className="w-13 h-13 rounded bg-zinc-900 border border-white/10 group-hover:border-gold/40 overflow-hidden shrink-0 flex items-center justify-center transition-colors">
                                  {resolvedImg ? (
                                    <img
                                      src={resolvedImg}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-full h-full flex items-center justify-center bg-zinc-900"
                                    style={{ display: resolvedImg ? 'none' : 'flex' }}
                                  >
                                    <ShoppingBag className="w-5 h-5 text-gold/40" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-serif font-medium text-zinc-100 truncate group-hover:text-gold transition-colors tracking-wide">
                                    {item.name}
                                  </div>
                                  <div className="text-xs font-sans text-zinc-400 truncate mt-0.5 font-light">
                                    {item.brand}{item.category ? ` · ${item.category}` : ''}
                                  </div>
                                </div>
                                {item.price ? (
                                  <div className="text-right shrink-0">
                                    <span className="text-xs font-serif text-gold font-semibold">
                                      ৳{Number(item.price).toLocaleString()}
                                    </span>
                                  </div>
                                ) : null}
                                <Search className="w-4 h-4 text-gold/40 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  ) : (
                    /* Browse Mode: Recent + Popular + Discovery */
                    <motion.div
                      key="browse-mode"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex gap-0"
                      style={{ maxHeight: 'calc(85vh - 120px)' }}
                    >
                      {/* Left Column: Recent + Popular */}
                      <div
                        ref={scrollContainerRef}
                        className="w-full lg:w-[58%] overflow-y-auto search-panel-scroll pr-0 lg:pr-6 lg:border-r lg:border-gold/15"
                        style={{ maxHeight: 'calc(85vh - 120px)' }}
                      >
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3 px-1">
                              <h3 className="text-xs uppercase tracking-[0.22em] text-gold font-serif font-semibold flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-gold/70" />
                                Recent Searches
                              </h3>
                              <button
                                onClick={() => handleRemoveRecent(null, { stopPropagation: () => {} })}
                                className="text-[10px] uppercase tracking-wider text-zinc-500 hover:text-gold transition-colors cursor-pointer font-mono"
                              >
                                Clear all
                              </button>
                            </div>
                            <ul className="space-y-1">
                              {recentSearches.map((item, idx) => (
                                <li key={item.id || item.query + idx}>
                                  <button
                                    type="button"
                                    onClick={() => handleTermClick(item.query)}
                                    onMouseEnter={() => handleTermHover(item.query)}
                                    onMouseLeave={handleTermLeave}
                                    className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded hover:bg-gold/[0.06] border border-transparent hover:border-gold/20 transition-all group cursor-pointer"
                                  >
                                    <TrendingUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-gold transition-colors shrink-0" />
                                    <span className="text-xs sm:text-sm text-zinc-200 group-hover:text-white transition-colors font-sans truncate flex-1">
                                      {item.query}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleRemoveRecent(item.query, e)}
                                      className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-zinc-200 transition-all cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Popular Searches */}
                        {popularSearches.length > 0 && (
                          <div className="mb-4">
                            <h3 className="text-xs uppercase tracking-[0.22em] text-gold font-serif font-semibold flex items-center gap-2 mb-3 px-1">
                              <Flame className="w-3.5 h-3.5 text-gold/70" />
                              Trending Fragrances
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                              {popularSearches.map((item, idx) => (
                                <button
                                  key={item.keyword + idx}
                                  type="button"
                                  onClick={() => handleTermClick(item.keyword)}
                                  onMouseEnter={() => handleTermHover(item.keyword)}
                                  onMouseLeave={handleTermLeave}
                                  className="text-left px-3 py-2.5 flex items-center gap-2 rounded bg-white/[0.02] hover:bg-gold/[0.06] border border-white/5 hover:border-gold/25 transition-all group cursor-pointer"
                                >
                                  <TrendingUp className="w-3.5 h-3.5 text-zinc-500 group-hover:text-gold transition-colors shrink-0" />
                                  <span className="text-xs sm:text-sm text-zinc-300 group-hover:text-gold transition-colors font-sans truncate">
                                    {item.keyword}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty state */}
                        {!loadingRecent && !loadingPopular && recentSearches.length === 0 && popularSearches.length === 0 && (
                          <div className="py-10 text-center">
                            <Search className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                            <p className="text-sm font-serif text-zinc-400">Discover Exclusive Fragrances</p>
                            <p className="text-xs text-zinc-600 mt-1">Start typing to search notes, brands or collections</p>
                          </div>
                        )}

                        {/* Loading skeleton */}
                        {(loadingRecent || loadingPopular) && recentSearches.length === 0 && popularSearches.length === 0 && (
                          <div className="space-y-3 px-3 py-2">
                            {[...Array(4)].map((_, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded bg-zinc-800 animate-pulse" />
                                <div className="h-4 rounded bg-zinc-800 animate-pulse" style={{ width: `${50 + Math.random() * 30}%` }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Column: Scent Discovery (hidden on mobile) */}
                      <div className="hidden lg:flex lg:w-[42%] flex-col items-center justify-center pl-6">
                        <AnimatePresence mode="wait">
                          {discoveryLoading ? (
                            <motion.div
                              key="discovery-loading"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center py-12"
                            >
                              <div className="w-7 h-7 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                            </motion.div>
                          ) : discoveryProduct ? (
                            <motion.div
                              key={`discovery-${discoveryProduct.id}`}
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.25 }}
                              className="w-full max-w-[280px] cursor-pointer group bg-[#050505] p-4 rounded border border-gold/20 hover:border-gold/50 transition-all shadow-xl text-center"
                              onClick={() => handleProductClick(discoveryProduct)}
                            >
                              {/* Product Image */}
                              <div className="aspect-square rounded overflow-hidden bg-zinc-900 mb-3 border border-white/5 group-hover:border-gold/30 transition-colors flex items-center justify-center">
                                {discoveryProduct.image || discoveryProduct.imageUrl ? (
                                  <img
                                    src={normalizeProductImage(discoveryProduct.image || discoveryProduct.imageUrl)}
                                    alt={discoveryProduct.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <ShoppingBag className="w-10 h-10 text-gold/30" />
                                )}
                              </div>
                              {/* Product Info */}
                              <div>
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold/80 block mb-1">
                                  {discoveryProduct.brand || 'Decantre Exclusive'}
                                </span>
                                <h4 className="text-sm font-serif font-medium text-zinc-100 group-hover:text-gold transition-colors mb-1 line-clamp-2">
                                  {discoveryProduct.name}
                                </h4>
                                {discoveryProduct.price ? (
                                  <p className="text-xs font-serif text-gold font-semibold mt-1">
                                    ৳{Number(discoveryProduct.price).toLocaleString()}
                                  </p>
                                ) : null}
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="discovery-placeholder"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center py-12 select-none text-center"
                            >
                              {/* Decorative luxury circle */}
                              <div className="relative w-20 h-20 mb-5">
                                <div className="absolute inset-0 rounded-full border border-dashed border-gold/30 animate-[spin_20s_linear_infinite]" />
                                <div className="absolute inset-2 rounded-full bg-gold/5 flex items-center justify-center border border-gold/10">
                                  <Sparkles className="w-7 h-7 text-gold/60" />
                                </div>
                              </div>
                              <h4 className="text-sm font-serif text-zinc-200 mb-1.5 tracking-[0.15em] uppercase text-gold">
                                Scent Discovery
                              </h4>
                              <p className="text-xs text-zinc-500 max-w-[210px] leading-relaxed font-sans font-light">
                                Hover over any perfume to preview notes and profile.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchPanel;
