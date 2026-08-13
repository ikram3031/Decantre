import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, TrendingUp, Clock, Flame, Sparkles } from 'lucide-react';
import { useApp } from '../core/context/AppContext';
import {
  searchProductsAPI,
  fetchPopularSearches,
  fetchRecentSearches,
  clearRecentSearch,
} from '../core/lib/api';

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
    'Aventus', 'Lattafa', 'Hawas', 'Gucci Flora'
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
      setTimeout(() => inputRef.current?.focus(), 350);
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
    const timer = setTimeout(() => setDebouncedVal(searchVal), 300);
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
          if (!cancelled) setRecentSearches(data);
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
        const data = await fetchPopularSearches(10);
        if (!cancelled) setPopularSearches(data);
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
        if (!cancelled) setSearchResults(results);
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
    e.stopPropagation();
    if (user) {
      await clearRecentSearch(query);
      const data = await fetchRecentSearches();
      setRecentSearches(data);
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
        if (!aborted && results.length > 0) {
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeOut' }}
            className="fixed top-0 inset-x-0 z-[61] bg-[#0c1615] border-b border-gold/25 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
            style={{ maxHeight: '85vh' }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

              {/* Search Input Bar */}
              <div className="py-5 sm:py-6">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gold/60 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder={`Search name, brand, family...`}
                    className="flex-1 bg-transparent text-zinc-100 text-base sm:text-lg font-light placeholder-zinc-500 focus:outline-none border-none caret-gold"
                    autoComplete="off"
                  />
                  {searchVal && (
                    <button
                      type="button"
                      onClick={() => { setSearchVal(''); setDebouncedVal(''); inputRef.current?.focus(); }}
                      className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer ml-1"
                    aria-label="Close search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
                <div className="mt-3 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              </div>

              {/* Content Area */}
              <div className="pb-6 sm:pb-8" style={{ maxHeight: 'calc(85vh - 90px)', overflow: 'hidden' }}>
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
                      style={{ maxHeight: 'calc(85vh - 110px)' }}
                    >
                      {loadingResults && (
                        <div className="flex items-center gap-2 py-4 px-2">
                          <div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                          <span className="text-xs text-zinc-500 font-mono tracking-wide">Searching...</span>
                        </div>
                      )}
                      {!loadingResults && searchResults.length === 0 && (
                        <div className="py-8 text-center">
                          <Search className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                          <p className="text-sm text-zinc-500">No results found for "{debouncedVal}"</p>
                        </div>
                      )}
                      <ul className="divide-y divide-white/5">
                        {searchResults.map((item) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => handleProductClick(item)}
                              className="w-full text-left px-3 py-3 flex items-center gap-4 hover:bg-white/[0.04] transition-colors group cursor-pointer"
                            >
                              <img
                                src={item.image || ''}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded bg-zinc-900 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-zinc-100 truncate group-hover:text-gold transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-xs text-zinc-500 truncate mt-0.5">
                                  {item.brand}{item.category ? ` · ${item.category}` : ''}
                                </div>
                              </div>
                              <Search className="w-4 h-4 text-zinc-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          </li>
                        ))}
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
                      style={{ maxHeight: 'calc(85vh - 110px)' }}
                    >
                      {/* Left Column: Recent + Popular */}
                      <div
                        ref={scrollContainerRef}
                        className="w-full lg:w-[58%] overflow-y-auto search-panel-scroll pr-0 lg:pr-4 lg:border-r lg:border-gold/10"
                        style={{ maxHeight: 'calc(85vh - 110px)' }}
                      >
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-3 px-1">
                              <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-gold/50" />
                                Recent Searches
                              </h3>
                              <button
                                onClick={() => handleRemoveRecent(null, { stopPropagation: () => {} })}
                                className="text-[10px] uppercase tracking-wider text-zinc-600 hover:text-gold/60 transition-colors cursor-pointer"
                              >
                                Clear all
                              </button>
                            </div>
                            <ul className="space-y-0.5">
                              {recentSearches.map((item, idx) => (
                                <li key={item.id || item.query + idx}>
                                  <button
                                    type="button"
                                    onClick={() => handleTermClick(item.query)}
                                    onMouseEnter={() => handleTermHover(item.query)}
                                    onMouseLeave={handleTermLeave}
                                    className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-md hover:bg-white/[0.05] transition-all group cursor-pointer"
                                  >
                                    <TrendingUp className="w-4 h-4 text-zinc-600 group-hover:text-gold/70 transition-colors shrink-0" />
                                    <span className="text-sm text-zinc-200 group-hover:text-white transition-colors font-medium truncate flex-1">
                                      {item.query}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={(e) => handleRemoveRecent(item.query, e)}
                                      className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-zinc-300 transition-all cursor-pointer"
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
                            <h3 className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-semibold flex items-center gap-2 mb-3 px-1">
                              <Flame className="w-3.5 h-3.5 text-gold/50" />
                              Popular Searches
                            </h3>
                            <div className="grid grid-cols-2 gap-1.5">
                              {popularSearches.map((item, idx) => (
                                <button
                                  key={item.keyword + idx}
                                  type="button"
                                  onClick={() => handleTermClick(item.keyword)}
                                  onMouseEnter={() => handleTermHover(item.keyword)}
                                  onMouseLeave={handleTermLeave}
                                  className="text-left px-3 py-2.5 flex items-center gap-2.5 rounded-md hover:bg-white/[0.05] transition-all group cursor-pointer"
                                >
                                  <TrendingUp className="w-3.5 h-3.5 text-zinc-600 group-hover:text-gold/70 transition-colors shrink-0" />
                                  <span className="text-sm text-zinc-200 group-hover:text-white transition-colors font-medium truncate">
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
                            <p className="text-sm text-zinc-500">Start typing to search fragrances</p>
                          </div>
                        )}

                        {/* Loading skeleton */}
                        {(loadingRecent || loadingPopular) && recentSearches.length === 0 && popularSearches.length === 0 && (
                          <div className="space-y-3 px-3 py-2">
                            {[...Array(5)].map((_, i) => (
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
                              <div className="w-8 h-8 border-2 border-gold/20 border-t-gold/60 rounded-full animate-spin" />
                            </motion.div>
                          ) : discoveryProduct ? (
                            <motion.div
                              key={`discovery-${discoveryProduct.id}`}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.25 }}
                              className="w-full max-w-[280px] cursor-pointer group"
                              onClick={() => handleProductClick(discoveryProduct)}
                            >
                              {/* Product Image */}
                              <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 mb-4 border border-white/5 group-hover:border-gold/20 transition-colors">
                                <img
                                  src={discoveryProduct.image || ''}
                                  alt={discoveryProduct.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                              {/* Product Info */}
                              <div className="text-center">
                                <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-gold transition-colors mb-1 line-clamp-2">
                                  {discoveryProduct.name}
                                </h4>
                                <p className="text-xs text-zinc-500 mb-2">
                                  {discoveryProduct.brand}{discoveryProduct.category ? ` · ${discoveryProduct.category}` : ''}
                                </p>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="discovery-placeholder"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="flex flex-col items-center justify-center py-12 select-none"
                            >
                              {/* Decorative circle */}
                              <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/20" />
                                <div className="absolute inset-2 rounded-full bg-gold/5 flex items-center justify-center">
                                  <Sparkles className="w-8 h-8 text-gold/40" />
                                </div>
                              </div>
                              <h4 className="text-base font-serif text-zinc-200 mb-2 tracking-wide">
                                Scent Discovery
                              </h4>
                              <p className="text-xs text-zinc-500 text-center max-w-[200px] leading-relaxed">
                                Hover over any fragrance to reveal its profile.
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
