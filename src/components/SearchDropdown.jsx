import React, { useState, useEffect, useRef } from 'react';
import { searchProductsAPI } from '../core/lib/api';
import { normalizeProductImage } from '../core/store/productHelpers';
import { Sparkles, ShoppingBag } from 'lucide-react';

export const SearchDropdown = ({ query, onSelect, maxResults = 6 }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);
  const controllerRef = useRef(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, []);

  useEffect(() => {
    if (!query || String(query).trim().length === 0) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    const q = String(query).trim();
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const items = await searchProductsAPI(q, maxResults);
        if (!mounted.current || isCancelled) return;
        setResults(Array.isArray(items) ? items.slice(0, maxResults) : []);
      } catch (err) {
        if (!mounted.current || isCancelled) return;
        setError('Failed to load results');
        setResults([]);
      } finally {
        if (!mounted.current || isCancelled) return;
        setLoading(false);
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query, maxResults]);

  if ((!query || !query.trim()) && results.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-30 border border-gold/30 bg-[#0A0A0A] rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.85)] overflow-hidden">
      <div className="px-3 py-1.5 border-b border-white/5 bg-white/[0.02]">
        {loading && (
          <div className="text-xs text-gold/80 font-mono py-1.5 flex items-center gap-2">
            <div className="w-3.5 h-3.5 border border-gold/40 border-t-gold rounded-full animate-spin" />
            Searching fragrances...
          </div>
        )}
        {error && (
          <div className="text-xs text-rose-400 py-1.5">{error}</div>
        )}
        {!loading && results.length === 0 && !error && (
          <div className="text-xs text-zinc-400 py-1.5 font-light">No fragrances found for "{query}"</div>
        )}
      </div>

      {results.length > 0 && (
        <ul className="divide-y divide-white/5 max-h-80 overflow-y-auto">
          {results.map((item) => {
            const rawImg = item.thumbnailUrl || item.imageUrl || item.image;
            const resolvedImg = rawImg ? normalizeProductImage(rawImg) : null;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onSelect && onSelect({ id: item.id, name: item.name, slug: item.slug })}
                  className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-gold/[0.08] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 w-[70%] min-w-0">
                    <div className="w-11 h-11 rounded-sm bg-[#111111] border border-white/10 group-hover:border-gold/50 overflow-hidden shrink-0 flex items-center justify-center transition-colors relative">
                      {resolvedImg ? (
                        <img
                          src={resolvedImg}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <ShoppingBag className="w-4 h-4 text-gold/50" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium font-serif text-zinc-100 truncate group-hover:text-gold transition-colors tracking-wide">
                        {item.name}
                      </div>
                      <div className="text-[11px] font-sans text-zinc-400 truncate mt-0.5 font-light">
                        {item.brand ? item.brand : ''}{item.category ? ` · ${item.category}` : ''}
                      </div>
                    </div>
                  </div>
                  {item.price ? (
                    <div className="w-[30%] text-right text-xs sm:text-sm font-semibold font-serif text-gold truncate pl-2">
                      ৳{Number(item.price).toLocaleString()}
                    </div>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchDropdown;
