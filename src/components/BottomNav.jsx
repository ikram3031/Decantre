import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Heart, 
  Home, 
  ShoppingBag, 
  Sun,
  Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    wishlist, 
    cart, 
    user, 
    setAuthModal, 
    setIsCartOpen,
    isCartOpen,
    addToast,
    currentTheme,
    toggleTheme
  } = useApp();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Shows after scrolling down 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to handle initial load state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    navigate('/wishlist');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (user) {
      setAuthModal(true, 'profile');
    } else {
      setAuthModal(true, 'login');
    }
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  // Determine active states for icons
  const isHomeActive = location.pathname === '/';
  const isShopActive = location.pathname === '/shop';

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            id="bottom-mobile-menu-pill"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed bottom-1.5 left-0 right-0 mx-auto w-[90%] sm:w-[80%] max-w-xs sm:max-w-sm z-50 bg-[#C5A059] border border-[#a8823d] h-12 rounded-full flex items-center justify-around px-2 shadow-[0_10px_30px_rgba(197,160,89,0.4)] text-black md:hidden"
          >
            {/* Option 1: Shop */}
            <Link 
              to="/shop" 
              className={`p-2 relative rounded-full transition-all duration-300 ${
                isShopActive 
                  ? 'text-[#C5A059] bg-black shadow-md' 
                  : 'text-black/75 hover:text-black'
              }`}
            >
              <Compass className="w-4.5 h-4.5" />
            </Link>

            {/* Option 2: Wishlist */}
            <button 
              onClick={handleWishlistClick}
              className={`p-2 relative rounded-full transition-all duration-300 ${
                location.pathname === '/wishlist'
                  ? 'text-[#C5A059] bg-black shadow-md'
                  : 'text-black/75 hover:text-black'
              } cursor-pointer`}
            >
              <Heart className={`w-4.5 h-4.5 ${location.pathname === '/wishlist' ? 'text-[#C5A059] fill-[#C5A059]' : 'text-black/75 hover:text-black'} ${wishlist.length > 0 && location.pathname !== '/wishlist' ? 'fill-black' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-black text-[#C5A059] rounded-full text-[8px] w-3.5 h-3.5 font-bold flex items-center justify-center border border-[#C5A059]/30 shadow-sm animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Option 3: Center Home Icon - Elevated Overflow Design */}
            <div className="relative -mt-5">
              <Link 
                to="/" 
                className={`w-12 h-12 rounded-full transition-all duration-500 flex items-center justify-center border-4 ${
                  isHomeActive 
                    ? 'bg-black text-[#C5A059] border-[#C5A059] shadow-[0_5px_20px_rgba(0,0,0,0.5)] scale-110' 
                    : 'bg-[#C5A059] text-black border-black/80 hover:bg-black hover:text-[#C5A059] hover:border-[#C5A059] shadow-[0_4px_10px_rgba(0,0,0,0.2)]'
                }`}
              >
                <Home className="w-5 h-5 stroke-[1.75]" />
              </Link>
            </div>

            {/* Option 4: Cart */}
            <button 
              onClick={handleCartClick}
              className={`p-2 relative rounded-full transition-all duration-300 ${
                isCartOpen
                  ? 'text-[#C5A059] bg-black shadow-md'
                  : 'text-black/75 hover:text-black'
              } cursor-pointer`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-black text-[#C5A059] rounded-full text-[8px] w-3.5 h-3.5 font-bold flex items-center justify-center border border-[#C5A059]/30 shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Option 5: Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 relative rounded-full transition-all duration-300 text-black/75 hover:text-black cursor-pointer"
            >
              {currentTheme === 'dark' ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>    </>
  );
};
