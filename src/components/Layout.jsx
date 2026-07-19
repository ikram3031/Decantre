import React from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScentFinderQuiz } from './ScentFinderQuiz';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { Toast } from './Toast';

export const Layout = () => {
  const {
    toasts,
    setToasts,
    isQuizOpen,
    setIsQuizOpen,
    quizStep,
    setQuizStep,
    quizRecommendation,
    handleQuizAnswer,
    handleAddToCart,
    handleOpenProductDetail,
    selectedProduct,
    setSelectedProduct,
    modalSize,
    setModalSize,
    modalConcentration,
    setModalConcentration,
    calculateItemPrice,
    isCartOpen,
    setIsCartOpen,
    isCheckoutMode,
    setIsCheckoutMode,
    cart,
    handleRemoveFromCart,
    handleUpdateQty,
    orderCompleted,
    handleResetCheckout,
    shippingInfo,
    setShippingInfo,
    isProcessingOrder,
    handleCheckoutSubmit,
    promoCode,
    setPromoCode,
    applyPromoCode,
    promoError,
    appliedDiscount,
    cartSubtotal,
    discountAmount,
    shippingFee,
    luxuryTax,
    cartTotal,
    searchQuery,
    setSearchQuery,
    addToast,
    wishlist,
    startQuiz
  } = useApp();

  return (
    <div id="landing-container" className="min-h-screen bg-luxury-black text-luxury-white font-sans antialiased selection:bg-gold selection:text-luxury-black overflow-x-hidden">
      {/* Dynamic Toast Feedback */}
      <Toast toasts={toasts} onClose={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Top Banner */}
      <AnnouncementBar />

      {/* Luxury Navigation Header */}
      <Header 
        startQuiz={startQuiz}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        addToast={addToast}
        wishlist={wishlist}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main Content Area */}
      <main className="min-h-[70vh]">
        <Outlet />
      </main>

      {/* Scent finder modal */}
      <ScentFinderQuiz 
        isQuizOpen={isQuizOpen}
        setIsQuizOpen={setIsQuizOpen}
        quizStep={quizStep}
        setQuizStep={setQuizStep}
        quizRecommendation={quizRecommendation}
        handleQuizAnswer={handleQuizAnswer}
        handleAddToCart={handleAddToCart}
        handleOpenProductDetail={handleOpenProductDetail}
      />

      {/* Product Detail Quickview dialog */}
      <ProductDetailModal 
        selectedProduct={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        modalSize={modalSize}
        setModalSize={setModalSize}
        modalConcentration={modalConcentration}
        setModalConcentration={setModalConcentration}
        calculateItemPrice={calculateItemPrice}
        handleAddToCart={handleAddToCart}
      />

      {/* Shopping bag drawer sheet */}
      <CartDrawer 
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        isCheckoutMode={isCheckoutMode}
        setIsCheckoutMode={setIsCheckoutMode}
        cart={cart}
        handleRemoveFromCart={handleRemoveFromCart}
        handleUpdateQty={handleUpdateQty}
        orderCompleted={orderCompleted}
        handleResetCheckout={handleResetCheckout}
        shippingInfo={shippingInfo}
        setShippingInfo={setShippingInfo}
        isProcessingOrder={isProcessingOrder}
        handleCheckoutSubmit={handleCheckoutSubmit}
        promoCode={promoCode}
        setPromoCode={setPromoCode}
        applyPromoCode={applyPromoCode}
        promoError={promoError}
        appliedDiscount={appliedDiscount}
        cartSubtotal={cartSubtotal}
        discountAmount={discountAmount}
        shippingFee={shippingFee}
        luxuryTax={luxuryTax}
        cartTotal={cartTotal}
      />

      {/* Footnote */}
      <Footer />
    </div>
  );
};
