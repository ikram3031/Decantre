import React from 'react';
import { Shop } from './Shop';

// Renders the dedicated On Sale page showcasing all discounted products
export const OnSale = () => {
  return (
    <Shop
      defaultOnSale={true}
      pageTitle="ON SALE & SPECIAL OFFERS"
      pageSubtitle="Exclusive limited-time promotional pricing on premium designer and niche decants."
    />
  );
};

export default OnSale;
