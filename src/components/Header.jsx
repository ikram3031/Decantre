import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Heart, ShoppingBag, Search, Menu, X, ChevronDown, ChevronUp, ChevronRight, User, Sun, Moon } from 'lucide-react';
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
  const { setSelectedCategory, user, setAuthModal, currentTheme, toggleTheme } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobileShopExpanded, setIsMobileShopExpanded] = React.useState(false);
  const [isMobileBrandExpanded, setIsMobileBrandExpanded] = React.useState(false);
  const [isMobileCatalogExpanded, setIsMobileCatalogExpanded] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState(null);
  const [logoFailed, setLogoFailed] = React.useState(false);

  const [isScrolled, setIsScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Typewriter/Moving suggestion text inside search placeholder
  const searchSuggestions = React.useMemo(() => [
    "Gucci Flora",
    "Bleu de Chanel",
    "Creed Aventus",
    "Baccarat Rouge 540",
    "Tom Ford Lost Cherry"
  ], []);

  const [suggestionIdx, setSuggestionIdx] = React.useState(0);
  const [placeholderText, setPlaceholderText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    let timer;
    const fullText = searchSuggestions[suggestionIdx];

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholderText((prev) => prev.slice(0, -1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setPlaceholderText(fullText.slice(0, placeholderText.length + 1));
      }, 100);
    }

    if (!isDeleting && placeholderText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 1500);
    } else if (isDeleting && placeholderText === '') {
      setIsDeleting(false);
      setSuggestionIdx((prev) => (prev + 1) % searchSuggestions.length);
    }

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, suggestionIdx, searchSuggestions]);

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
    <header id="main-header" className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-black/95 shadow-lg border-b border-gold/35' : 'bg-black/80 backdrop-blur-md border-b border-gold/20'}`}>
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'} flex items-center justify-between relative`}>
        
        {/* Mobile menu toggle (left side on small screens) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-gold transition-colors focus:outline-none z-10"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo and branding - Centered on mobile, Left-aligned on desktop */}
        <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-0 max-w-[50%] xs:max-w-[60%] sm:max-w-[70%] md:max-w-none w-full flex justify-center">
          <Link to="/" className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity w-full">
            {!logoFailed ? (
              <img 
                src="https://decantrebd.com/wp-content/uploads/2026/03/decantre-color-logo-transparent.webp" 
                alt="DECANTRE" 
                className={`w-auto max-w-full object-contain transition-all duration-300 ${isScrolled ? 'h-14 md:h-18' : 'h-20 md:h-24 lg:h-26'}`}
                onError={() => setLogoFailed(true)}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-xl xs:text-2xl sm:text-3xl font-serif tracking-[0.3em] text-gold font-light truncate">
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
                    className="w-full text-left px-6 py-3.5 text-zinc-700 hover:text-gold hover:bg-zinc-50/50 font-sans text-xs tracking-widest uppercase transition-colors font-semibold border-b border-zinc-100 last:border-b-0 cursor-pointer"
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
                            : 'text-zinc-700 hover:bg-zinc-100/70 hover:text-gold font-semibold'
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
                            : 'text-zinc-500 hover:bg-zinc-100/70 hover:text-gold font-semibold'
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
                        className="text-left text-zinc-700 hover:text-gold hover:translate-x-1 text-xs font-sans font-semibold tracking-widest py-2 border-b border-zinc-50 last:border-b-0 transition-all uppercase duration-200 cursor-pointer truncate"
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
                    className="w-full text-left px-6 py-3.5 text-zinc-700 hover:text-gold hover:bg-zinc-50/50 font-sans text-xs tracking-widest uppercase transition-colors font-semibold border-b border-zinc-100 last:border-b-0 cursor-pointer"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-4 z-10">
          {/* Theme Switcher Button */}
          <button 
            onClick={toggleTheme}
            className="hidden md:block p-2 text-zinc-400 hover:text-gold transition-colors relative cursor-pointer"
          >
            {currentTheme === 'dark' ? <Sun className="w-5 h-5 text-gold" /> : <Moon className="w-5 h-5 text-gold" />}
          </button>

          {/* Search Trigger Icon on header - Desktop & Mobile (Left of the cart icon) */}
          <button 
            onClick={() => setIsSearchPanelOpen(true)}
            className="p-2 text-zinc-400 hover:text-gold transition-colors relative cursor-pointer"
          >
            <Search className="w-5 h-5 text-gold" />
          </button>

          {/* Wishlist Indicator - Desktop only */}
          <div className="relative group hidden md:block">
            <button 
              onClick={() => navigate('/wishlist')}
              className="p-2 text-[#C5A059] hover:text-[#e0b86c] transition-colors relative cursor-pointer"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#C5A059]' : ''} text-[#C5A059]`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-black rounded-full text-[9px] w-4 h-4 font-semibold flex items-center justify-center border border-zinc-950 animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>
          </div>

          {/* Cart Trigger Button - Desktop (md and up) */}
          <button 
            id="header-cart-btn-desktop"
            onClick={() => setIsCartOpen(true)}
            className="hidden md:flex p-2 bg-gradient-to-b from-[#080808] to-black border border-gold/30 hover:border-gold rounded-sm text-zinc-200 hover:text-gold transition-all duration-300 items-center gap-2 px-3.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-gold" />
            <span className="text-[10px] font-sans font-medium tracking-widest text-gold">BAG</span>
            <span className="bg-gold text-black rounded-sm text-[10px] w-5 h-5 font-bold flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>

          {/* Cart Trigger Icon - Mobile (below md) - Just an icon without borders, badge above it */}
          <button 
            id="header-cart-btn-mobile"
            onClick={() => setIsCartOpen(true)}
            className="md:hidden p-2 text-zinc-400 hover:text-gold transition-colors relative cursor-pointer flex items-center justify-center"
          >
            <ShoppingBag className="w-6 h-6 text-gold" />
            {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-black rounded-full text-[9px] w-4.5 h-4.5 font-bold flex items-center justify-center border border-black shadow-lg animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gold/10 bg-black/95 backdrop-blur-lg absolute top-24 left-0 right-0 py-6 px-4 space-y-4 animate-fade-in z-50">
          <nav className="flex flex-col gap-4 text-xs uppercase tracking-[0.25em] font-sans text-zinc-300">
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

            {/* Profile or Login/Register side-by-side buttons in Mobile Menu */}
            {user ? (
              <button 
                onClick={() => {
                  setAuthModal(true, 'profile');
                  handleNavLinkClick();
                }} 
                className="flex items-center justify-between hover:text-gold py-2 transition-colors border-b border-white/5 text-left uppercase text-xs tracking-[0.25em] cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-gold" />
                  Profile ({user.name})
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2.5 py-0.5 bg-gold/10 border border-gold/30 text-gold font-bold">
                  {user.tier}
                </span>
              </button>
            ) : (
              <div className="pt-2 border-b border-white/5 pb-4 space-y-2">
                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
                  Atelier Credentials
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setAuthModal(true, 'login');
                      handleNavLinkClick();
                    }}
                    className="py-3 text-center border border-gold/30 hover:border-gold/60 bg-[#050505] text-gold text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthModal(true, 'register');
                      handleNavLinkClick();
                    }}
                    className="py-3 text-center bg-gold hover:bg-gold/90 text-black text-[10px] font-sans font-bold uppercase tracking-widest transition-all cursor-pointer border-none"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
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
            className="fixed top-0 inset-x-0 bg-white text-zinc-900 z-50 shadow-[0_15px_40px_rgba(0,0,0,0.18)] py-6 sm:py-14 px-4 sm:px-6 border-b border-zinc-200"
          >
            <div className="max-w-4xl mx-auto relative">
              {/* Close Button */}
              <button 
                onClick={() => setIsSearchPanelOpen(false)}
                className="absolute top-[-10px] sm:top-[-20px] right-1 sm:right-0 p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-50 border border-zinc-300 rounded-full transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.25]" />
              </button>

              <div className="space-y-4 sm:space-y-6">
                {/* Title */}
                <h3 className="hidden sm:block text-2xl sm:text-3xl lg:text-4xl font-serif text-center font-light tracking-wide text-zinc-900">
                  What you are searching for
                </h3>

                {/* Form Row */}
                <div className="flex flex-row items-stretch border border-zinc-300 rounded-none overflow-hidden max-w-3xl mx-auto shadow-sm">
                  {/* Search Input */}
                  <div className="relative flex-grow flex items-center bg-white">
                    <input 
                      type="text"
                      placeholder={`Search "${placeholderText || 'Search'}"...`}
                      value={localSearchVal}
                      onChange={(e) => setLocalSearchVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handlePerformSearch();
                        }
                      }}
                      className="w-full px-5 py-3.5 sm:py-4 text-xs sm:text-sm font-sans font-light placeholder-zinc-400 focus:outline-none bg-white text-zinc-900 border-none"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handlePerformSearch}
                    className="bg-black hover:bg-gold text-white hover:text-black transition-all px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] font-sans font-bold cursor-pointer shrink-0 border-none"
                  >
                    <Search className="w-4 h-4 shrink-0" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>

                {/* Trending Searches */}
                <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs pt-1.5">
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

