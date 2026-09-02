import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { fetchSizeAttributes, getImageBaseUrl } from '../core/lib/api';
import { useAppStore } from '../core/store/useAppStore';

// Resolves full absolute image url from relative uploads path or returns fallback
const resolveFullImageUrl = (imgUrl) => {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')) return imgUrl;
  const baseUrl = getImageBaseUrl();
  return `${baseUrl}${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
};

// Formats raw size label into clean uppercase decant notation
const formatSizeLabel = (rawName = '') => {
  if (!rawName) return '';
  const cleaned = String(rawName).trim();
  const match = cleaned.match(/^0*(\d+)\s*(ml|oz|g|kg)?$/i);
  if (match) {
    const num = match[1];
    const unit = (match[2] || 'ML').toUpperCase();
    return `${num}${unit}`;
  }
  return cleaned.toUpperCase();
};

// Renders interactive available decant sizes showcase card with bottle thumbnails and popup preview
export const AvailableSizesCard = ({ onOpenSizeGuide, product }) => {
  const currentTheme = useAppStore((state) => state.currentTheme);
  const isLight = currentTheme === 'light';

  const [sizesList, setSizesList] = useState([]);
  const [activePopupItem, setActivePopupItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSizes = async () => {
      setIsLoading(true);
      try {
        const attributeValues = await fetchSizeAttributes();
        if (!isMounted) return;

        if (Array.isArray(attributeValues) && attributeValues.length > 0) {
          const itemsWithImages = attributeValues.filter((val) => Boolean(val.imageUrl));
          const list = itemsWithImages.length > 0 ? itemsWithImages : attributeValues;
          setSizesList(list);
        }
      } catch (err) {
        if (isMounted) setSizesList([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadSizes();

    return () => {
      isMounted = false;
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePopupItem(null);
      }
    };

    if (activePopupItem) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePopupItem]);

  if (!isLoading && sizesList.length === 0) {
    return null;
  }

  return (
    <>
      <div className={`p-5 sm:p-6 rounded-xl border transition-all ${
        isLight
          ? 'bg-white border-zinc-200/80 shadow-sm text-zinc-900'
          : 'bg-zinc-950/80 border-gold/15 shadow-md text-zinc-100'
      }`}>
        <h3 className={`text-sm sm:text-base font-medium mb-4 ${
          isLight ? 'text-zinc-800' : 'text-luxury-white'
        }`}>
          Available Sizes
        </h3>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 pb-4">
          {sizesList.map((item, idx) => {
            const label = formatSizeLabel(item.name || item.slug || `Size ${idx + 1}`);
            const fullImg = resolveFullImageUrl(item.imageUrl);

            return (
              <button
                key={item.slug || item.name || idx}
                type="button"
                onClick={() => setActivePopupItem({ ...item, label, fullImg })}
                className="group flex flex-col items-center focus:outline-none cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border transition-all flex items-center justify-center relative ${
                  isLight
                    ? 'bg-zinc-900 border-zinc-200 group-hover:border-zinc-900 group-hover:shadow-md'
                    : 'bg-black border-white/10 group-hover:border-gold/60 group-hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]'
                }`}>
                  {fullImg ? (
                    <img
                      src={fullImg}
                      alt={`${label} bottle preview`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-xs font-mono font-bold text-gold">
                      {label}
                    </div>
                  )}
                </div>
                <span className={`text-xs sm:text-sm font-semibold tracking-wider mt-2 transition-colors ${
                  isLight ? 'text-zinc-700 group-hover:text-black' : 'text-zinc-300 group-hover:text-gold'
                }`}>
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {onOpenSizeGuide && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={onOpenSizeGuide}
              className={`px-6 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-xs ${
                isLight
                  ? 'bg-white hover:bg-zinc-50 text-zinc-700 hover:text-black border-zinc-300 hover:border-zinc-400'
                  : 'bg-transparent hover:bg-gold/10 text-zinc-300 hover:text-gold border-white/20 hover:border-gold/40'
              }`}
            >
              Decant Size Guide
            </button>
          </div>
        )}
      </div>

      {activePopupItem && (
        <div
          onClick={() => setActivePopupItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`p-4 sm:p-5 rounded-2xl shadow-2xl relative max-w-xs sm:max-w-sm w-full border text-center transition-all ${
              isLight
                ? 'bg-white border-zinc-200 text-zinc-900'
                : 'bg-zinc-950 border-gold/30 text-white'
            }`}
          >
            <button
              type="button"
              onClick={() => setActivePopupItem(null)}
              className="absolute -top-3 -right-3 sm:-top-3.5 sm:-right-3.5 p-2 bg-zinc-900 hover:bg-black text-white border border-white/20 rounded-full cursor-pointer shadow-xl transition-transform hover:scale-110 focus:outline-none"
              aria-label="Close image popup"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full aspect-square rounded-xl overflow-hidden bg-black flex items-center justify-center border border-black/10 shadow-inner">
              {activePopupItem.fullImg ? (
                <img
                  src={activePopupItem.fullImg}
                  alt={`${activePopupItem.label} large preview`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-mono text-zinc-400">No Image Available</span>
              )}
            </div>

            <div className={`text-sm sm:text-base font-bold uppercase tracking-widest pt-3 pb-1 ${
              isLight ? 'text-zinc-800' : 'text-zinc-100'
            }`}>
              {activePopupItem.label}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AvailableSizesCard;
