import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { config } from './utils/config';
import { pixelInit } from './utils/fbPixel';

// Cleans outdated localStorage caches and unregisters stale service workers across deployments
const checkAndBustStaleCache = () => {
  try {
    const buildTime = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : 'dev';
    const cachedBuildTime = localStorage.getItem('app_build_time');
    if (cachedBuildTime && cachedBuildTime !== buildTime) {
      const preserveKeys = ['luxury_cart', 'luxury_wishlist', 'luxury_user', 'luxury_auth_token'];
      Object.keys(localStorage).forEach((key) => {
        if (!preserveKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();
      localStorage.setItem('app_build_time', buildTime);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.unregister());
        });
      }
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } else if (!cachedBuildTime) {
      localStorage.setItem('app_build_time', buildTime);
    }
  } catch (_) {}
};

checkAndBustStaleCache();

// Apply client-specific branding theme properties to root DOM
if (config.primaryColor) {
  document.documentElement.style.setProperty('--color-gold', config.primaryColor);
}
if (config.luxuryBlack) {
  document.documentElement.style.setProperty('--color-luxury-black', config.luxuryBlack);
}
if (config.luxuryGray) {
  document.documentElement.style.setProperty('--color-luxury-gray', config.luxuryGray);
}

// Initialise Facebook Pixel (reads VITE_FB_PIXEL_ID from env)
pixelInit();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
