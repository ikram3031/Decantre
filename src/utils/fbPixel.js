/**
 * Facebook Pixel Utility
 * ---------------------
 * Centralised helper for firing Facebook Pixel standard events.
 *
 * Pixel ID         : VITE_FB_PIXEL_ID (env variable)
 * Test event code  : VITE_FB_TEST_EVENT_CODE (env variable, e.g. TEST5328)
 *
 * All functions are safe no-ops when the pixel script has not loaded yet.
 */

const FB_PIXEL_ID  = import.meta.env.VITE_FB_PIXEL_ID;
const FB_TEST_CODE = import.meta.env.VITE_FB_TEST_EVENT_CODE; // e.g. TEST5328

/** Safe wrapper around window.fbq */
const fbq = (...args) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args);
  }
};

/**
 * Helper that appends the test_event_code custom data when configured.
 * fbq('track', event, data, extraData) — 4th param passes test code.
 */
const track = (event, data = {}) => {
  if (FB_TEST_CODE) {
    fbq('track', event, data, { test_event_code: FB_TEST_CODE });
  } else {
    fbq('track', event, data);
  }
};

/**
 * Initialise the pixel (called once on app mount via main.jsx).
 * The base code loader is already in index.html; this just calls fbq('init').
 */
export const pixelInit = () => {
  if (!FB_PIXEL_ID) return;
  fbq('init', FB_PIXEL_ID);
  track('PageView');
};

/**
 * Track a PageView — called on every route change via RouteChangeTracker.
 */
export const pixelPageView = () => {
  track('PageView');
};

/**
 * ViewContent — fired when a user views a product detail page.
 * @param {object} product - Product object { id, name, price }.
 */
export const pixelViewContent = (product) => {
  if (!product) return;
  track('ViewContent', {
    content_ids:  [String(product.id || product._id || '')],
    content_name: product.name || '',
    content_type: 'product',
    currency:     'BDT',
    value:        Number(product.price) || 0,
  });
};

/**
 * AddToCart — fired when an item is added to the cart.
 * @param {object} product  - Product being added.
 * @param {number} quantity - Quantity added.
 * @param {number} price    - Unit price (BDT).
 */
export const pixelAddToCart = (product, quantity = 1, price = 0) => {
  track('AddToCart', {
    content_ids:  [String(product?.id || product?._id || '')],
    content_name: product?.name || '',
    content_type: 'product',
    currency:     'BDT',
    value:        Number(price) * Number(quantity),
    num_items:    Number(quantity),
  });
};

/**
 * InitiateCheckout — fired when the checkout page is loaded with items.
 * @param {Array}  cartItems - Current cart items array.
 * @param {number} cartTotal - Total cart value (BDT).
 */
export const pixelInitiateCheckout = (cartItems = [], cartTotal = 0) => {
  track('InitiateCheckout', {
    content_ids:  cartItems.map((item) => String(item.id || item._id || '')),
    content_type: 'product',
    currency:     'BDT',
    value:        Number(cartTotal),
    num_items:    cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
  });
};

/**
 * Purchase — fired on the Thank You page after a successful order.
 * @param {string|number} orderId   - The order ID / number.
 * @param {Array}         cartItems - Items that were purchased.
 * @param {number}        cartTotal - Grand total paid (BDT).
 */
export const pixelPurchase = (orderId, cartItems = [], cartTotal = 0) => {
  track('Purchase', {
    content_ids:  cartItems.map((item) => String(item.id || item._id || '')),
    content_type: 'product',
    currency:     'BDT',
    value:        Number(cartTotal),
    num_items:    cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0),
    order_id:     String(orderId || ''),
  });
};

/**
 * Search — fired when user performs a product search.
 * @param {string} query - Search query string.
 */
export const pixelSearch = (query) => {
  track('Search', { search_string: query || '' });
};

/**
 * AddToWishlist — fired when a product is added to the wishlist.
 * @param {object} product - Product object.
 */
export const pixelAddToWishlist = (product) => {
  if (!product) return;
  track('AddToWishlist', {
    content_ids:  [String(product.id || product._id || '')],
    content_name: product.name || '',
    content_type: 'product',
    currency:     'BDT',
    value:        Number(product.price) || 0,
  });
};
