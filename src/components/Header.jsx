import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Compass, Heart, ShoppingBag, Search, Menu, X } from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (location.pathname !== '/catalog') {
      navigate('/catalog');
    }
  };

  // Close mobile menu on click or route change
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Mobile menu toggle (left side on small screens) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-gold transition-colors focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo and branding */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-2xl font-serif tracking-[0.3em] text-gold font-light">
            DECANTRE
          </span>
          {/* <span className="hidden sm:inline-block h-4 w-[1px] bg-gold/30 mx-2"></span> */}
        </Link>

        {/* Quick links */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-sans text-zinc-300">
          <Link to="/" className="hover:text-gold transition-colors">Home</Link>
          <Link to="/season" className="hover:text-gold transition-colors">Season</Link>
          <Link to="/shop" className="hover:text-gold transition-colors">Shop</Link>
          <Link to="/atelier" className="hover:text-gold transition-colors">Brand</Link>
          <Link to="/catalog" className="hover:text-gold transition-colors">Full Bottles</Link>
          <button 
            onClick={startQuiz} 
            className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 px-3.5 py-1 rounded-full text-[9px] tracking-widest uppercase transition-all duration-300 font-sans cursor-pointer"
          >
            <Compass className="w-3 h-3 text-gold" />
            Scent Finder
          </button>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          {/* Search Input on header */}
          <div className="relative max-w-[140px] sm:max-w-[200px] hidden sm:block">
            <input 
              type="text"
              placeholder="Search scents..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-[#080808] border border-gold/20 rounded-sm py-1.5 pl-8 pr-4 text-[11px] font-sans font-light text-luxury-white placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-gold/40 absolute left-3 top-2.5" />
          </div>

          {/* Scent finder mini icon for mobile */}
          <button 
            onClick={startQuiz}
            className="md:hidden p-2 text-zinc-400 hover:text-gold transition-colors"
            title="Scent Finder"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* Wishlist Indicator */}
          <div className="relative group">
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

          {/* Cart Trigger Button */}
          <button 
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="p-2 bg-gradient-to-b from-[#080808] to-black border border-gold/30 hover:border-gold rounded-sm text-zinc-200 hover:text-gold transition-all duration-300 flex items-center gap-2 px-3.5 cursor-pointer"
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
            <Link to="/" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Home</Link>
            <Link to="/season" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Season</Link>
            <Link to="/shop" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Shop</Link>
            <Link to="/atelier" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Brand</Link>
            <Link to="/catalog" onClick={handleNavLinkClick} className="hover:text-gold py-2 transition-colors border-b border-white/5">Full Bottles</Link>
            <button 
              onClick={() => { startQuiz(); handleNavLinkClick(); }} 
              className="flex items-center justify-center gap-1.5 bg-gold/15 hover:bg-gold/25 text-gold border border-gold/30 py-3 rounded-sm text-[10px] tracking-widest uppercase transition-all duration-300 font-sans cursor-pointer"
            >
              <Compass className="w-4 h-4 text-gold" />
              Scent Finder Assessment
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

