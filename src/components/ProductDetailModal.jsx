import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

export const ProductDetailModal = ({
  selectedProduct,
  onClose,
  modalSize,
  setModalSize,
  modalConcentration,
  setModalConcentration,
  calculateItemPrice,
  handleAddToCart
}) => {
  if (!selectedProduct) return null;

  return (
    <Dialog open={!!selectedProduct} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-luxury-black border border-gold/25 text-luxury-white p-6 sm:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(197,160,89,0.05)] rounded-none flex flex-col md:flex-row gap-8 font-sans">
        <div className="sr-only">
          <DialogTitle>{selectedProduct.name} - Quick View</DialogTitle>
          <DialogDescription>{selectedProduct.tagline}</DialogDescription>
        </div>

        {/* Left: Perfume Bottle Thumbnail */}
        <div className="w-full md:w-[45%] shrink-0">
          <div className="aspect-[4/5] rounded-none bg-black border border-white/5 overflow-hidden relative group">
            <img 
              src={selectedProduct.image} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-3 left-3 bg-black/95 border border-white/5 text-gold text-[9px] uppercase tracking-widest py-1 px-2.5 rounded-none font-sans font-medium">
              {selectedProduct.scentFamily}
            </span>
          </div>

          {/* Scent Statistics Section */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1 font-sans text-zinc-500">
                <span>Longevity / persistence</span>
                <span className="text-gold font-semibold">{selectedProduct.longevity}/5</span>
              </div>
              <div className="w-full bg-[#0d0d0d] border border-white/5 h-1.5 rounded-none overflow-hidden">
                <div 
                  className="bg-gold h-full" 
                  style={{ width: `${(selectedProduct.longevity / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1 font-sans text-zinc-500">
                <span>Sillage / Projection Trail</span>
                <span className="text-gold font-semibold">{selectedProduct.sillage}/5</span>
              </div>
              <div className="w-full bg-[#0d0d0d] border border-white/5 h-1.5 rounded-none overflow-hidden">
                <div 
                  className="bg-gold h-full" 
                  style={{ width: `${(selectedProduct.sillage / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Olfactory Details & Selectors */}
        <div className="flex-1 flex flex-col justify-between space-y-6">
          
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-semibold bg-gold/10 border border-gold/25 px-2.5 py-0.5 rounded-none font-sans">
                {selectedProduct.category}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-sans font-light">Atelier Formula</span>
            </div>

            <h2 className="text-2xl font-serif font-light tracking-wide text-luxury-white uppercase">
              {selectedProduct.name}
            </h2>

            <p className="text-gold text-xs font-serif italic">
              "{selectedProduct.tagline}"
            </p>

            <p className="text-zinc-400 text-xs font-sans font-light leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Scent Pyramid Graphic */}
            <div className="bg-black border border-white/5 rounded-none p-4 space-y-3">
              <span className="text-[9px] uppercase text-gold font-sans font-bold tracking-widest block border-b border-white/5 pb-1">
                Olfactory Fragrance Pyramid
              </span>
              
              <div className="grid grid-cols-1 gap-2.5 text-[11px] text-left font-sans">
                <div>
                  <span className="text-zinc-500 font-medium uppercase tracking-widest text-[8px] block">Top Notes (First 15m)</span>
                  <p className="text-zinc-300 font-light">{selectedProduct.notes.top.join(', ')}</p>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium uppercase tracking-widest text-[8px] block">Heart Notes (Next 4 Hours)</span>
                  <p className="text-zinc-300 font-light">{selectedProduct.notes.heart.join(', ')}</p>
                </div>
                <div>
                  <span className="text-zinc-500 font-medium uppercase tracking-widest text-[8px] block">Base Notes (Persistence Anchor)</span>
                  <p className="text-zinc-300 font-light">{selectedProduct.notes.base.join(', ')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Panels inside Detail Modal */}
          <div className="space-y-4 border-t border-white/5 pt-6 text-left">
            
            {/* Size options */}
            <div className="space-y-2">
              <span className="text-[9px] text-zinc-400 block font-sans font-medium uppercase tracking-widest">Select Vial Size</span>
              <div className="grid grid-cols-3 gap-2">
                {['50ml', '100ml', '200ml'].map((size) => {
                  const calculatedPrice = calculateItemPrice(selectedProduct.basePrice, size, modalConcentration);
                  return (
                    <button
                      key={size}
                      onClick={() => setModalSize(size)}
                      className={`p-2.5 rounded-none border text-left transition-all ${
                        modalSize === size
                          ? 'bg-[#0d0d0d] border-gold text-gold shadow-[0_0_15px_rgba(197,160,89,0.05)]'
                          : 'bg-black border-white/5 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="block text-[10px] font-sans font-bold uppercase tracking-widest">{size}</span>
                      <span className="text-[10px] text-zinc-500 font-sans">${calculatedPrice} est.</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Formulation options */}
            <div className="space-y-2">
              <span className="text-[9px] text-zinc-400 block font-sans font-medium uppercase tracking-widest">Select Concentration Formulation</span>
              <div className="grid grid-cols-2 gap-2">
                {['Eau de Parfum', 'Extrait de Parfum'].map((conc) => {
                  const calculatedPrice = calculateItemPrice(selectedProduct.basePrice, modalSize, conc);
                  return (
                    <button
                      key={conc}
                      onClick={() => setModalConcentration(conc)}
                      className={`p-2.5 rounded-none border text-left transition-all ${
                        modalConcentration === conc
                          ? 'bg-[#0d0d0d] border-gold text-gold shadow-[0_0_15px_rgba(197,160,89,0.05)]'
                          : 'bg-black border-white/5 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      <span className="block text-[10px] font-sans font-bold uppercase tracking-widest">{conc}</span>
                      <span className="text-[9px] text-zinc-500 font-sans">
                        {conc === 'Eau de Parfum' ? '8-12 hours trail' : '16-24 hours absolute'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price and primary CTA */}
            <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/5">
              <div>
                <span className="text-[9px] text-zinc-500 uppercase block tracking-widest font-sans">Configured Value</span>
                <span className="text-2xl font-serif font-light text-gold">
                  ${calculateItemPrice(selectedProduct.basePrice, modalSize, modalConcentration)}
                </span>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(selectedProduct, modalSize, modalConcentration, 1);
                  onClose();
                }}
                className="bg-transparent border border-gold hover:bg-gold hover:text-black text-gold font-sans font-bold uppercase tracking-[0.2em] text-[10px] px-6 py-3.5 rounded-none shadow-2xl flex items-center gap-2 transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Configure & Add to Chest
              </button>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};
