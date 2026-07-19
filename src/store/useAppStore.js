import { create } from 'zustand';
import { mapRemoteProduct } from './productHelpers';

export const useAppStore = create((set, get) => {
  // Load initial cached values safely
  const initialCart = (() => {
    try {
      const cached = localStorage.getItem('luxury_cart');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      console.error('Error parsing cart cache', e);
      return [];
    }
  })();

  const initialWishlist = (() => {
    try {
      const cached = localStorage.getItem('luxury_wishlist');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      console.error('Error parsing wishlist cache', e);
      return [];
    }
  })();

  return {
    // products can be loaded from remote API; initialize empty until fetched
    products: [],
    categories: [],
    brands: [],

    setProducts: (newProducts) => set({ products: newProducts }),
    setCategories: (newCategories) => set({ categories: newCategories }),
    setBrands: (newBrands) => set({ brands: newBrands }),

    fetchProducts: async (opts = {}) => {
      try {
        const base = 'http://localhost:4000/api/wp/products';
        const url = opts && opts.rawQuery ? `${base}?${opts.rawQuery}` : base;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];

        // map remote shape to app product shape, include variations
        const mapped = list.map(mapRemoteProduct);

        set({ products: mapped });
        return mapped;
      } catch (err) {
        console.error('Error fetching products', err);
        return get().products;
      }
    },

    fetchCategories: async (opts = {}) => {
      try {
        const base = 'http://localhost:4000/api/wp/taxonomies/categories';
        const rawQuery = opts && opts.rawQuery ? opts.rawQuery : 'skip=0&limit=50';
        const res = await fetch(`${base}?${rawQuery}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        set({ categories: list });
        return list;
      } catch (err) {
        console.error('Error fetching categories', err);
        return get().categories;
      }
    },

    fetchBrands: async (opts = {}) => {
      try {
        const base = 'http://localhost:4000/api/wp/taxonomies/brands';
        const rawQuery = opts && opts.rawQuery ? opts.rawQuery : 'skip=0&limit=50';
        const res = await fetch(`${base}?${rawQuery}`);
        if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        set({ brands: list });
        return list;
      } catch (err) {
        console.error('Error fetching brands', err);
        return get().brands;
      }
    },
    // 1. Core States
    currentSlide: 0,
    selectedCategory: 'All',
    searchQuery: '',
    cart: initialCart,
    isCartOpen: false,
    wishlist: initialWishlist,

    cardSelections: {
      'oud-imperial': { size: '100ml', concentration: 'Eau de Parfum' },
      'nectar-de-saphir': { size: '100ml', concentration: 'Eau de Parfum' },
      'saffron-mystique': { size: '100ml', concentration: 'Eau de Parfum' },
      'bergamote-sauvage': { size: '100ml', concentration: 'Eau de Parfum' },
      'ambre-nuit': { size: '100ml', concentration: 'Eau de Parfum' },
      'rose-absolue': { size: '100ml', concentration: 'Eau de Parfum' },
    },

    selectedProduct: null,
    modalSize: '100ml',
    modalConcentration: 'Eau de Parfum',

    isQuizOpen: false,
    quizStep: 1,
    quizAnswers: {},
    quizRecommendation: null,

    isCheckoutMode: false,
    promoCode: '',
    appliedDiscount: 0,
    promoError: '',
    paymentMethod: 'cod',
    sameAsBilling: true,
    shippingZone: 'inside-dhaka',
    shippingAddress: {
      address: '',
      city: '',
      thana: '',
      district: '',
      zip: ''
    },
    shippingInfo: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      thana: '',
      district: '',
      zip: '',
      giftWrap: false
    },
    orderCompleted: false,
    isProcessingOrder: false,
    orderNumber: null,
    toasts: [],

    // 2. Direct State Setters
    setCurrentSlide: (slide) => set((state) => ({
      currentSlide: typeof slide === 'function' ? slide(state.currentSlide) : slide
    })),
    setSelectedCategory: (category) => set({ selectedCategory: category }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setCart: (cart) => {
      set({ cart });
      localStorage.setItem('luxury_cart', JSON.stringify(cart));
    },
    setIsCartOpen: (isOpen) => set((state) => ({
      isCartOpen: typeof isOpen === 'function' ? isOpen(state.isCartOpen) : isOpen
    })),
    setWishlist: (wishlist) => {
      set({ wishlist });
      localStorage.setItem('luxury_wishlist', JSON.stringify(wishlist));
    },
    setCardSelections: (updater) => set((state) => {
      const nextSelections = typeof updater === 'function' ? updater(state.cardSelections) : updater;
      return { cardSelections: nextSelections };
    }),
    setSelectedProduct: (product) => set({ selectedProduct: product }),
    setModalSize: (size) => set({ modalSize: size }),
    setModalConcentration: (concentration) => set({ modalConcentration: concentration }),
    setIsQuizOpen: (isOpen) => set((state) => ({
      isQuizOpen: typeof isOpen === 'function' ? isOpen(state.isQuizOpen) : isOpen
    })),
    setQuizStep: (step) => set({ quizStep: step }),
    setQuizAnswers: (answers) => set({ quizAnswers: answers }),
    setQuizRecommendation: (recommendation) => set({ quizRecommendation: recommendation }),
    setIsCheckoutMode: (isCheckout) => set((state) => ({
      isCheckoutMode: typeof isCheckout === 'function' ? isCheckout(state.isCheckoutMode) : isCheckout
    })),
    setPromoCode: (code) => set({ promoCode: code }),
    setAppliedDiscount: (discount) => set({ appliedDiscount: discount }),
    setPromoError: (error) => set({ promoError: error }),
    setPaymentMethod: (method) => set({ paymentMethod: method }),
    setSameAsBilling: (same) => set({ sameAsBilling: same }),
    setShippingZone: (zone) => set({ shippingZone: zone }),
    setShippingAddress: (updater) => set((state) => {
      const nextAddress = typeof updater === 'function' ? updater(state.shippingAddress) : updater;
      return { shippingAddress: nextAddress };
    }),
    setShippingInfo: (updater) => set((state) => {
      const nextInfo = typeof updater === 'function' ? updater(state.shippingInfo) : updater;
      return { shippingInfo: nextInfo };
    }),
    setOrderCompleted: (completed) => set({ orderCompleted: completed }),
    setIsProcessingOrder: (isProcessing) => set({ isProcessingOrder: isProcessing }),
    setToasts: (updater) => set((state) => {
      const nextToasts = typeof updater === 'function' ? updater(state.toasts) : updater;
      return { toasts: nextToasts };
    }),

    // 3. Helper Actions
    saveCart: (newCart) => {
      set({ cart: newCart });
      localStorage.setItem('luxury_cart', JSON.stringify(newCart));
    },

    saveWishlist: (newWishlist) => {
      set({ wishlist: newWishlist });
      localStorage.setItem('luxury_wishlist', JSON.stringify(newWishlist));
    },

    addToast: (text, type = 'success') => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      set((state) => ({
        toasts: [...state.toasts, { id, text, type }]
      }));
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, 4000);
    },

    calculateItemPrice: (basePrice, size, concentration) => {
      let finalPrice = basePrice;
      if (size === '50ml') {
        finalPrice = basePrice * 0.75;
      } else if (size === '200ml') {
        finalPrice = basePrice * 1.6;
      }
      if (concentration === 'Extrait de Parfum') {
        finalPrice += 60;
      }
      return Math.round(finalPrice);
    },

    handleAddToCart: (product, size, concentration, qty = 1) => {
      const unitPrice = get().calculateItemPrice(product.basePrice, size, concentration);
      const cart = get().cart;
      const existingIndex = cart.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.concentration === concentration
      );

      let newCart = [...cart];
      if (existingIndex > -1) {
        newCart[existingIndex].quantity += qty;
      } else {
        newCart.push({
          id: `${product.id}-${size}-${concentration.replace(/\s+/g, '')}`,
          product,
          size,
          concentration,
          quantity: qty,
          unitPrice
        });
      }

      get().saveCart(newCart);
      get().addToast(`Added ${qty}x ${product.name} (${size} - ${concentration}) to your chest.`, 'success');
    },

    handleUpdateQty: (itemId, change) => {
      const cart = get().cart;
      const newCart = cart.map((item) => {
        if (item.id === itemId) {
          const nextQty = item.quantity + change;
          return { ...item, quantity: Math.max(1, nextQty) };
        }
        return item;
      });
      get().saveCart(newCart);
    },

    handleRemoveFromCart: (itemId) => {
      const cart = get().cart;
      const item = cart.find((i) => i.id === itemId);
      const newCart = cart.filter((i) => i.id !== itemId);
      get().saveCart(newCart);
      if (item) {
        get().addToast(`Removed ${item.product.name} from your cart.`, 'info');
      }
    },

    toggleWishlist: (productId) => {
      const wishlist = get().wishlist;
      let newWishlist = [...wishlist];
      if (newWishlist.includes(productId)) {
        newWishlist = newWishlist.filter((id) => id !== productId);
        get().addToast('Removed fragrance from your collection favorites.', 'info');
      } else {
        newWishlist.push(productId);
        get().addToast('Added fragrance to your collection favorites.', 'success');
      }
      get().saveWishlist(newWishlist);
    },

    startQuiz: () => {
      set({
        quizStep: 1,
        quizAnswers: {},
        quizRecommendation: null,
        isQuizOpen: true
      });
    },

    handleQuizAnswer: (question, answer) => {
      const currentAnswers = get().quizAnswers;
      const updated = { ...currentAnswers, [question]: answer };
      set({ quizAnswers: updated });
      
      const step = get().quizStep;
      if (step < 3) {
        set({ quizStep: step + 1 });
      } else {
        // Find recommendation
        const allProducts = get().products || [];
        let bestMatch = allProducts[0];
        const gender = updated['gender'];
        const family = updated['family'];

        if (gender === 'Him') {
          if (family === 'Fresh') bestMatch = allProducts.find(p => p.id === 'bergamote-sauvage') || allProducts[3];
          else bestMatch = allProducts.find(p => p.id === 'oud-imperial') || allProducts[0];
        } else if (gender === 'Her') {
          if (family === 'Floral' || family === 'Fresh') bestMatch = allProducts.find(p => p.id === 'rose-absolue') || allProducts[5];
          else bestMatch = allProducts.find(p => p.id === 'nectar-de-saphir') || allProducts[1];
        } else {
          if (family === 'Warm' || family === 'Woody') bestMatch = allProducts.find(p => p.id === 'saffron-mystique') || allProducts[2];
          else bestMatch = allProducts.find(p => p.id === 'ambre-nuit') || allProducts[4];
        }

        set({
          quizRecommendation: bestMatch,
          quizStep: 4
        });
      }
    },

    handleCheckoutSubmit: async (e) => {
      if (e) e.preventDefault();
      const cart = get().cart;
      const shippingInfo = get().shippingInfo;
      const paymentMethod = get().paymentMethod;
      const sameAsBilling = get().sameAsBilling;
      const shippingAddress = get().shippingAddress;
      if (cart.length === 0) return;

      const requiredBilling = [
        shippingInfo.fullName,
        shippingInfo.phone,
        shippingInfo.email,
        shippingInfo.address,
        shippingInfo.thana,
        shippingInfo.district,
        shippingInfo.zip
      ];

      if (requiredBilling.some((field) => !field)) {
        get().addToast('Please complete all billing details before continuing.', 'error');
        return;
      }

      if (paymentMethod === 'cod' && !sameAsBilling) {
        const requiredShipping = [
          shippingAddress.address,
          shippingAddress.thana,
          shippingAddress.district,
          shippingAddress.zip
        ];
        if (requiredShipping.some((field) => !field)) {
          get().addToast('Please complete the shipping address or enable billing as shipping.', 'error');
          return;
        }
      }

      set({ isProcessingOrder: true });

      try {
        const pricing = get().getCartPricing();

        const payload = {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: shippingInfo.address,
          city: shippingInfo.city,
          thana: shippingInfo.thana,
          district: shippingInfo.district,
          zip: shippingInfo.zip,
          giftWrap: shippingInfo.giftWrap,
          paymentMethod,
          subtotal: pricing.cartSubtotal,
          shippingFee: pricing.shippingFee,
          tax: pricing.luxuryTax,
          total: pricing.cartTotal,
          items: cart.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            size: item.size,
            concentration: item.concentration
          }))
        };

        const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/$/, '');
        const res = await fetch(`${apiBaseUrl}/api/v1/orders/new-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        let json = {};
        try {
          json = await res.json();
        } catch {
          json = {};
        }

        if (!res.ok || json.status !== 'success') {
          const errMsg = json?.errors?.[0] || json?.message || 'Order submission failed. Please try again.';
          get().addToast(errMsg, 'error');
          set({ isProcessingOrder: false });
          return;
        }

        set({
          isProcessingOrder: false,
          orderCompleted: true,
          orderNumber: json.data?.orderNumber ?? null
        });
        get().addToast(json?.message || 'Your order has been officially verified and compiled.', 'success');
      } catch (err) {
        console.error('Order submission error:', err);
        get().addToast('Network error — could not reach the order server. Please try again.', 'error');
        set({ isProcessingOrder: false });
      }
    },

    handleResetCheckout: () => {
      get().saveCart([]);
      set({
        isCheckoutMode: false,
        orderCompleted: false,
        orderNumber: null,
        isCartOpen: false,
        paymentMethod: 'cod',
        sameAsBilling: true,
        shippingZone: 'inside-dhaka',
        shippingAddress: {
          address: '',
          thana: '',
          district: '',
          zip: ''
        },
        shippingInfo: {
          fullName: '',
          phone: '',
          email: '',
          address: '',
          city: '',
          thana: '',
          district: '',
          zip: '',
          giftWrap: false
        },
        promoCode: '',
        appliedDiscount: 0
      });
    },

    handleOpenProductDetail: (product) => {
      set({
        selectedProduct: product,
        modalSize: '100ml',
        modalConcentration: 'Eau de Parfum'
      });
    },

    applyPromoCode: (e) => {
      if (e) e.preventDefault();
      set({ promoError: '' });
      const code = get().promoCode.trim().toUpperCase();
      if (code === 'GOLDEN20' || code === 'LÉLIXIR') {
        set({ appliedDiscount: 0.20 });
        get().addToast('Exclusive 20% elite discount applied successfully.', 'success');
      } else if (code === 'MAJESTY') {
        set({ appliedDiscount: 0.15 });
        get().addToast('15% premium coupon code accepted.', 'success');
      } else {
        set({ promoError: 'This luxury credential code has expired or is invalid.' });
      }
    },

    // Getters for computed states
    getFilteredProducts: () => {
      const selectedCategory = get().selectedCategory;
      const searchQuery = get().searchQuery;
      const allProducts = get().products || [];
      return allProducts.filter((prod) => {
        const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
        const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              prod.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              prod.scentFamily.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    },

    getCartPricing: () => {
      const cart = get().cart;
      const appliedDiscount = get().appliedDiscount;
      const paymentMethod = get().paymentMethod;
      const shippingInfo = get().shippingInfo;
      const cartSubtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
      const discountAmount = Math.round(cartSubtotal * appliedDiscount);
      const shippingFee = paymentMethod === 'instore' ? 0 : (cartSubtotal > 200 || cartSubtotal === 0 ? 0 : 25);
      const luxuryTax = Math.round((cartSubtotal - discountAmount) * 0.08);
      const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + luxuryTax + (shippingInfo.giftWrap ? 15 : 0));

      return {
        cartSubtotal,
        discountAmount,
        shippingFee,
        luxuryTax,
        cartTotal
      };
    }
  };
});
