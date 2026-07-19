import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Heart, ShoppingBag, Search, Menu, X, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';

const brandHierarchy = {
  niche: {
    name: 'Niche',
    ranges: {
      'A-K': [
        "Amouage", "Atelier des Ors", "BDK Parfums", "Byredo", "Creed", "Diptyque",
        "Essential Parfums", "Frederic Malle", "Giardini Di Toscana", "Gisada",
        "INITIO PARFUMS PRIVÉS", "Kajal", "Kayali"
      ],
      'L-O': [
        "Loewe", "Maison Crivelli", "Maison Francis Kurkdjian", "Maison Martin Margiela",
        "Mancera", "Matiere Premier", "Montale", "Nishane", "Orto Parisi"
      ],
      'P-Z': [
        "Parfums de Marly", "Penhaligon’s", "Roja", "Roja Parfums", "Serge Lutens",
        "Sospiro", "Unique’e Luxury", "Van Cleef & Arpels", "Xerjoff"
      ]
    }
  },
  designer: {
    name: 'Designer Brands',
    ranges: {
      'A-C': [
        "Ariana Grande", "Azzaro", "Bentley", "Billie Eilish", "Bottega Veneta",
        "Burberry", "Bvlgari", "Cartier", "Calvin Klein", "Carolina Herrera",
        "Chanel", "Chloe", "Coach"
      ],
      'D-G': [
        "Davidoff", "Dior", "Dolce & Gabbana", "Dunhill", "Elie Saab",
        "Elizabeth Arden", "Giorgio Armani", "Givenchy", "Gucci", "Guerlain"
      ],
      'H-L': [
        "Hermes", "Hugo Boss", "Issey Miyake", "Jean Paul Gaultier", "Jimmy Choo",
        "Kenzo", "Kilian", "Lancôme", "Lacoste", "Louis Vuitton"
      ],
      'M-P': [
        "Mercedes Benz", "Marc Jacobs", "Montblanc", "Moschino", "Mugler",
        "Narciso Rodriguez", "Nautica", "Office for men", "Paco Rabanne", "Prada"
      ],
      'Q-Z': [
        "Ralph Lauren", "Sabrina Carpenter", "Tom Ford", "Valentino", "Versace",
        "Victoria’s Secret", "Viktor & Rolf", "Yves Saint Laurent", "Zara"
      ]
    }
  },
  arabian: {
    name: 'UAE & Arabian Brands',
    ranges: {
      'A-K': [
        "Armaf", "Afnan", "Ahmad Al Maghribi", "Al Haramain", "Brandy",
        "French Avenue", "Khadlaj"
      ],
      'L-Z': [
        "Maison Alhambra", "Maison Asrar", "Naseem", "Lattafa", "Paris Corner",
        "Rasasi", "Rayhaan", "Reyane Tradition", "Swiss Arabian"
      ]
    }
  }
};

export const Header = ({
  startQuiz,
  searchQuery,
  setSearchQuery,
  addToast,
  wishlist,
  cart,
  setIsCartOpen
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setSelectedCategory } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileShopExpanded, setIsMobileShopExpanded] = React.useState(false);
  const [isMobileBrandExpanded, setIsMobileBrandExpanded] = React.useState(false);
  const [isMobileCatalogExpanded, setIsMobileCatalogExpanded] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [logoFailed, setLogoFailed] = React.useState(false);

  // States for desktop cascading brand dropdown
  const [hoveredCategory, setHoveredCategory] = React.useState('niche');
  const [hoveredRange, setHoveredRange] = React.useState('A-K');

  // Helper to change category and auto-select its first range
  const handleCategoryHover = (catId) => {
    setHoveredCategory(catId);
    const ranges = Object.keys(brandHierarchy[catId]?.ranges || {});
    if (ranges.length > 0) {
      setHoveredRange(ranges[0]);
    }
  };

  // States for mobile alphabetical brand lists
  const [mobileExpandedCat, setMobileExpandedCat] = React.useState(null); // 'niche' | 'designer' | 'arabian' | null
  const [mobileExpandedRange, setMobileExpandedRange] = React.useState(null); // string (e.g., 'A-K') | null

  const handleBrandClick = (brandName) => {
    setActiveDropdown(null);
    navigate(`/shop?brand=${encodeURIComponent(brandName)}`);
  };

  // Top search panel states
  const [isSearchPanelOpen, setIsSearchPanelOpen] = React.useState(false);
  const [localSearchVal, setLocalSearchVal] = React.useState('');
  const [selectedSearchCategory, setSelectedSearchCategoryState] = React.useState('All');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    navigate(`/shop?search=${encodeURIComponent(val)}`);
  };

  const handlePerformSearch = () => {
    setIsSearchPanelOpen(false);
    let url = `/shop?search=${encodeURIComponent(localSearchVal)}`;
    if (selectedSearchCategory !== 'All') {
      url += `&category=${encodeURIComponent(selectedSearchCategory)}`;
    }
    navigate(url);
  };

  const handleTrendingClick = (tag) => {
    setLocalSearchVal(tag);
    setIsSearchPanelOpen(false);
    navigate(`/shop?search=${encodeURIComponent(tag)}`);
  };

  // Close mobile menu on click or route change
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        
        {/* Mobile menu toggle (left side on small screens) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-gold transition-colors focus:outline-none z-10"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo and branding - Centered on mobile, Left-aligned on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-0">
          <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            {!logoFailed ? (
              <img 
                src="https://decantrebd.com/wp-content/uploads/2026/03/decantre-color-logo-transparent.webp" 
                alt="DECANTRE" 
                className="h-14 sm:h-18 w-auto object-contain max-w-[200px] sm:max-w-[260px]"
                onError={() => setLogoFailed(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xl sm:text-2xl font-serif tracking-[0.3em] text-gold font-light">
                DECANTRE
              </span>
            )}
          </Link>
        </div>

        {/* Quick links */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-sans text-zinc-300">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <Link to="/season" className="hover:text-gold transition-colors">Season</Link>
          
          {/* Shop with Dropdown Submenu */}
          <div 
            className="relative py-4 group"
            onMouseEnter={() => setActiveDropdown('shop')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              onClick={() => {
                setSelectedCategory('All');
                navigate('/shop');
                setActiveDropdown(null);
              }}
              className="hover:text-gold transition-all duration-300 flex items-center gap-1 uppercase tracking-[0.2em] cursor-pointer focus:outline-none font-bold"
            >
              Shop {activeDropdown === 'shop' ? <ChevronUp className="w-3 h-3 text-gold" /> : <ChevronDown className="w-3 h-3 text-zinc-400" />}
            </button>
            
            {activeDropdown === 'shop' && (
              <div className="absolute left-0 top-full mt-0 w-64 bg-white shadow-2xl border-t-2 border-gold py-2 z-50 text-left transition-all duration-300 rounded-none animate-fade-in">
                {[
                  { name: 'For Him', val: 'For Him' },
                  { name: 'For Her', val: 'For Her' },
                  { name: 'Unisex', val: 'Unisex' },
                  { name: 'Miniatures', val: 'Miniatures' },
                  { name: 'Decant Accessories', val: 'Decant Accessories' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(`/shop?category=${encodeURIComponent(item.val)}`);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-6 py-3.5 text-black hover:text-gold hover:bg-zinc-50 font-sans text-xs tracking-widest uppercase transition-colors font-semibold border-b border-zinc-100 last:border-b-0 cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brand with Dropdown Submenu */}
          <div 
            className="relative py-4 group"
            onMouseEnter={() => setActiveDropdown('brand')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              onClick={() => {
                navigate('/atelier');
                setActiveDropdown(null);
              }}
              className="hover:text-gold transition-all duration-300 flex items-center gap-1 uppercase tracking-[0.2em] cursor-pointer focus:outline-none font-bold"
            >
              Brand {activeDropdown === 'brand' ? <ChevronUp className="w-3 h-3 text-gold" /> : <ChevronDown className="w-3 h-3 text-zinc-400" />}
            </button>
            
            {activeDropdown === 'brand' && (
              <div className="absolute left-1/2 -translate-x-[45%] top-full mt-0 bg-white border border-zinc-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 text-left transition-all duration-300 rounded-none animate-fade-in flex h-[360px] overflow-hidden">
                {/* Column 1: Main Brand Categories */}
                <div className="w-56 bg-zinc-50 border-r border-zinc-100 flex flex-col justify-start">
                  {Object.keys(brandHierarchy).map((catId) => {
                    const isActive = hoveredCategory === catId;
                    return (
                      <button
                        key={catId}
                        onMouseEnter={() => handleCategoryHover(catId)}
                        className={`w-full text-left px-5 py-4 font-sans text-xs tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer border-b border-zinc-100 last:border-b-0 ${
                          isActive 
                            ? 'text-gold bg-white border-l-2 border-l-gold font-bold' 
                            : 'text-zinc-700 hover:bg-zinc-100/70 hover:text-black font-medium'
                        }`}
                      >
                        <span>{brandHierarchy[catId].name}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-gold translate-x-0.5' : 'text-zinc-400'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Column 2: Alphabetical Letter Ranges */}
                <div className="w-44 border-r border-zinc-100 flex flex-col justify-start bg-zinc-50/50">
                  {Object.keys(brandHierarchy[hoveredCategory]?.ranges || {}).map((range) => {
                    const isActive = hoveredRange === range;
                    return (
                      <button
                        key={range}
                        onMouseEnter={() => setHoveredRange(range)}
                        className={`w-full text-left px-6 py-4 font-sans text-xs tracking-widest uppercase transition-all flex items-center justify-between cursor-pointer border-b border-zinc-100/50 last:border-b-0 ${
                          isActive 
                            ? 'text-gold bg-white font-bold' 
                            : 'text-zinc-500 hover:bg-zinc-100/70 hover:text-black font-medium'
                        }`}
                      >
                        <span>{range}</span>
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-gold translate-x-0.5' : 'text-zinc-400'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Column 3: Brand List */}
                <div className="w-64 py-4 px-5 flex flex-col bg-white overflow-y-auto custom-scrollbar h-full">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2 mb-2 block shrink-0">
                    {brandHierarchy[hoveredCategory].name} ({hoveredRange})
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {(brandHierarchy[hoveredCategory]?.ranges[hoveredRange] || []).map((brand) => (
                      <button
                        key={brand}
                        onClick={() => handleBrandClick(brand)}
                        className="text-left text-zinc-600 hover:text-gold hover:translate-x-1 text-[11px] font-sans font-light tracking-wider py-1.5 border-b border-zinc-50 last:border-b-0 transition-all uppercase duration-200 cursor-pointer truncate"
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Bottles with Dropdown Submenu */}
          <div 
            className="relative py-4 group"
            onMouseEnter={() => setActiveDropdown('catalog')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              onClick={() => {
                navigate('/shop');
                setActiveDropdown(null);
              }}
              className="hover:text-gold transition-all duration-300 flex items-center gap-1 uppercase tracking-[0.2em] cursor-pointer focus:outline-none font-bold"
            >
              Full Bottles {activeDropdown === 'catalog' ? <ChevronUp className="w-3 h-3 text-gold" /> : <ChevronDown className="w-3 h-3 text-zinc-400" />}
            </button>
            
            {activeDropdown === 'catalog' && (
              <div className="absolute left-0 top-full mt-0 w-64 bg-white shadow-2xl border-t-2 border-gold py-2 z-50 text-left transition-all duration-300 rounded-none animate-fade-in">
                {[
                  { name: 'Niche Intacts', val: 'Niche Intacts' },
                  { name: 'Designer Intacts', val: 'Designer Intacts' },
                  { name: 'Arabian Intacts', val: 'Arabian Intacts' }
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(`/shop?category=${encodeURIComponent(item.val)}`);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-6 py-3.5 text-black hover:text-gold hover:bg-zinc-50 font-sans text-xs tracking-widest uppercase transition-colors font-semibold border-b border-zinc-100 last:border-b-0 cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-4 z-10">
          {/* Search Trigger Icon on header - Desktop & Tablet */}
          <button 
            onClick={() => setIsSearchPanelOpen(true)}
            className="p-2 text-zinc-400 hover:text-gold transition-colors relative hidden md:block cursor-pointer"
            title="Search catalog"
          >
            <Search className="w-5 h-5 text-gold" />
          </button>

          {/* Wishlist Indicator - Desktop only */}
          <div className="relative group hidden md:block">
            <button 
              onClick={() => addToast(`You have ${wishlist.length} item(s) in your private vanity wishlist. Check the catalog to review or customize.`, 'info')}
              className="p-2 text-zinc-400 hover:text-gold transition-colors relative"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-black rounded-full text-[9px] w-4 h-4 font-semibold flex items-center justify-center border border-zinc-950 animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Cart Trigger Button - Always visible on Right */}
          <button 
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="p-2 bg-gradient-to-b from-[#080808] to-black border border-gold/30 hover:border-gold rounded-sm text-zinc-200 hover:text-gold transition-all duration-300 flex items-center gap-2 px-3 sm:px-3.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-sans font-medium tracking-widest hidden sm:inline text-gold">BAG</span>
            <span className="bg-gold text-black rounded-sm text-[10px] w-5 h-5 font-bold flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gold/10 bg-black/95 backdrop-blur-lg absolute top-20 left-0 right-0 py-6 px-4 space-y-4 animate-fade-in z-50">
          <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.25em] font-sans text-zinc-300">
            {/* Search Input inside Mobile Menu */}
            <div className="relative mb-2">
              <input 
                type="text"
                placeholder="Search scents..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#080808]/90 border border-gold/30 rounded-sm py-3 pl-10 pr-4 text-xs font-sans font-light text-white placeholder-zinc-500 focus:outline-none focus:border-gold/60 transition-all"
              />
              <Search className="w-4 h-4 text-gold/60 absolute left-3.5 top-3.5" />
            </div>

            <Link to="/" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Home</Link>
            <Link to="/season" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Season</Link>
            <div>
              <button 
                onClick={() => setIsMobileShopExpanded(!isMobileShopExpanded)}
                className="w-full flex items-center justify-between hover:text-gold py-2 transition-colors border-b border-white/5 text-left uppercase text-xs tracking-[0.25em] cursor-pointer"
              >
                <span>Shop</span>
                {isMobileShopExpanded ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isMobileShopExpanded && (
                <div className="pl-4 mt-2 space-y-2 flex flex-col border-l border-gold/20">
                  {[
                    { name: 'For Him', val: 'For Him' },
                    { name: 'For Her', val: 'For Her' },
                    { name: 'Unisex', val: 'Unisex' },
                    { name: 'Miniatures', val: 'Miniatures' },
                    { name: 'Decant Accessories', val: 'Decant Accessories' }
                  ].map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => {
                        navigate(`/shop?category=${encodeURIComponent(sub.val)}`);
                        handleNavLinkClick();
                      }}
                      className="text-left text-[11px] text-zinc-400 hover:text-gold tracking-[0.2em] py-1.5 uppercase font-medium cursor-pointer"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <button 
                onClick={() => setIsMobileBrandExpanded(!isMobileBrandExpanded)}
                className="w-full flex items-center justify-between hover:text-gold py-2 transition-colors border-b border-white/5 text-left uppercase text-xs tracking-[0.25em] cursor-pointer"
              >
                <span>Brand</span>
                {isMobileBrandExpanded ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isMobileBrandExpanded && (
                <div className="pl-4 mt-2 pr-2 space-y-3 flex flex-col border-l border-gold/20 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {Object.keys(brandHierarchy).map((catId) => {
                    const cat = brandHierarchy[catId];
                    const isCatExpanded = mobileExpandedCat === catId;
                    return (
                      <div key={catId} className="text-left space-y-1">
                        <button
                          onClick={() => setMobileExpandedCat(isCatExpanded ? null : catId)}
                          className="w-full flex items-center justify-between hover:text-gold py-1.5 text-left text-[11px] uppercase tracking-wider font-semibold text-zinc-300"
                        >
                          <span>{cat.name}</span>
                          {isCatExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gold" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                        </button>
                        
                        {isCatExpanded && (
                          <div className="pl-3 space-y-2 border-l border-white/5 py-1">
                            {Object.keys(cat.ranges).map((range) => {
                              const rangeKey = `${catId}-${range}`;
                              const isRangeExpanded = mobileExpandedRange === rangeKey;
                              return (
                                <div key={range} className="space-y-1">
                                  <button
                                    onClick={() => setMobileExpandedRange(isRangeExpanded ? null : rangeKey)}
                                    className="w-full flex items-center justify-between hover:text-gold py-1 text-left text-[10px] uppercase tracking-wider text-zinc-400 font-medium"
                                  >
                                    <span>{range}</span>
                                    {isRangeExpanded ? <ChevronUp className="w-3 h-3 text-gold" /> : <ChevronDown className="w-3 h-3 text-zinc-600" />}
                                  </button>
                                  
                                  {isRangeExpanded && (
                                    <div className="pl-3 py-1 flex flex-col gap-1.5 border-l border-gold/10">
                                      {cat.ranges[range].map((brand) => (
                                        <button
                                          key={brand}
                                          onClick={() => {
                                            handleBrandClick(brand);
                                            handleNavLinkClick();
                                          }}
                                          className="text-left text-[11px] text-zinc-500 hover:text-gold py-0.5 uppercase tracking-wider font-light cursor-pointer"
                                        >
                                          {brand}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div>
              <button 
                onClick={() => setIsMobileCatalogExpanded(!isMobileCatalogExpanded)}
                className="w-full flex items-center justify-between hover:text-gold py-2 transition-colors border-b border-white/5 text-left uppercase text-xs tracking-[0.25em] cursor-pointer"
              >
                <span>Full Bottles</span>
                {isMobileCatalogExpanded ? <ChevronUp className="w-4 h-4 text-gold" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>
              {isMobileCatalogExpanded && (
                <div className="pl-4 mt-2 space-y-2 flex flex-col border-l border-gold/20">
                  {[
                    { name: 'Niche Intacts', val: 'Niche Intacts' },
                    { name: 'Designer Intacts', val: 'Designer Intacts' },
                    { name: 'Arabian Intacts', val: 'Arabian Intacts' }
                  ].map((sub) => (
                    <button
                      key={sub.name}
                      onClick={() => {
                        navigate(`/shop?category=${encodeURIComponent(sub.val)}`);
                        handleNavLinkClick();
                      }}
                      className="text-left text-[11px] text-zinc-400 hover:text-gold tracking-[0.2em] py-1.5 uppercase font-medium cursor-pointer"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Wishlist in Mobile Menu */}
            <button 
              onClick={() => {
                addToast(`You have ${wishlist.length} item(s) in your private vanity wishlist. Check the catalog to review or customize.`, 'info');
                handleNavLinkClick();
              }} 
              className="flex items-center justify-between hover:text-gold py-2 transition-colors border-b border-white/5 text-left uppercase text-xs tracking-[0.25em] cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4.5 h-4.5 text-gold" />
                Wishlist
              </span>
              {wishlist.length > 0 ? (
                <span className="bg-gold text-black rounded-full text-[10px] px-2.5 py-0.5 font-bold">
                  {wishlist.length} ITEMS
                </span>
              ) : (
                <span className="text-zinc-500 text-[10px]">EMPTY</span>
              )}
            </button>
          </nav>
        </div>
      )}

      {/* Sliding Search Panel Overlay */}
      <AnimatePresence>
        {isSearchPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ type: 'tween', duration: 0.35, ease: 'easeInOut' }}
            className="fixed top-0 inset-x-0 bg-white text-zinc-900 z-50 shadow-[0_15px_40px_rgba(0,0,0,0.18)] py-14 px-4 sm:px-6 border-b border-zinc-200"
          >
            <div className="max-w-4xl mx-auto relative">
              {/* Close Button */}
              <button 
                onClick={() => setIsSearchPanelOpen(false)}
                className="absolute top-[-20px] right-2 sm:right-0 p-2 text-zinc-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-8 h-8 stroke-[1.25]" />
              </button>

              <div className="space-y-6">
                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-center font-light tracking-wide text-zinc-900">
                  What Are You Looking For?
                </h3>

                {/* Form Row */}
                <div className="flex flex-col sm:flex-row items-stretch border border-zinc-300 rounded-none overflow-hidden max-w-3xl mx-auto shadow-sm">
                  {/* Category Dropdown */}
                  <div className="relative min-w-[170px] border-b sm:border-b-0 sm:border-r border-zinc-200 bg-zinc-50 flex items-center shrink-0">
                    <select
                      value={selectedSearchCategory}
                      onChange={(e) => setSelectedSearchCategoryState(e.target.value)}
                      className="w-full bg-transparent pl-4 pr-10 py-4 text-xs font-sans uppercase tracking-[0.15em] text-zinc-700 focus:outline-none appearance-none cursor-pointer font-medium"
                    >
                      <option value="All">All categories</option>
                      <option value="For Him">For Him</option>
                      <option value="For Her">For Her</option>
                      <option value="Unisex">Unisex</option>
                      <option value="Miniatures">Miniatures</option>
                      <option value="Decant Accessories">Decant Accessories</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 pointer-events-none" />
                  </div>

                  {/* Search Input */}
                  <div className="relative flex-grow flex items-center">
                    <input 
                      type="text"
                      placeholder="Search for products"
                      value={localSearchVal}
                      onChange={(e) => setLocalSearchVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePerformSearch();
                        }
                      }}
                      className="w-full px-5 py-4 text-xs sm:text-sm font-sans font-light placeholder-zinc-400 focus:outline-none bg-white text-zinc-900 border-none"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handlePerformSearch}
                    className="bg-black hover:bg-gold text-white hover:text-black transition-all px-8 py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] font-sans font-bold cursor-pointer shrink-0 border-none"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span>Search</span>
                  </button>
                </div>

                {/* Trending Searches */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs pt-1.5">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-sans font-bold mr-1">
                    TRENDING SEARCHES:
                  </span>
                  {['rouge', 'muse', 'santal', 'Soir'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTrendingClick(tag)}
                      className="bg-zinc-100 hover:bg-gold hover:text-black text-zinc-800 transition-colors px-3 py-1 text-xs font-sans tracking-wide cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

