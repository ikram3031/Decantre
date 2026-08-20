export const getApiBaseUrl = () => {
  const envUrl =
    import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  return "https://server.decantrebd.com";
};

export const normalizeProductImage = (rawImage = "") => {
  let imageUrl = rawImage || "";
  if (!imageUrl || imageUrl === "undefined") return "";
  if (imageUrl.startsWith("//")) imageUrl = `https:${imageUrl}`;

  imageUrl = imageUrl.replace(
    /webiste\.decantrebd\.com|webste\.decantrebd\.com/gi,
    "decantrebd.com",
  );
  imageUrl = imageUrl.replace(/\/content\//gi, "/uploads/");

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const baseUrl = getApiBaseUrl();
  const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${baseUrl}${cleanPath}`;
};

const parseBadge = (badge = {}) => ({
  name: badge.badge_name || badge.key || badge.name || "",
  text: badge.badge_text || badge.value || badge.text || "",
  color: badge.badge_color || badge.color || "",
  priority: Number.isFinite(+badge.badge_priority)
    ? Number(badge.badge_priority)
    : 0,
});

export const normalizeProductBadges = (product = {}) => {
  const badges = [];

  if (Array.isArray(product.badges)) {
    badges.push(
      ...product.badges.map(parseBadge).filter((badge) => badge.text),
    );
  } else if (product.badge) {
    const badge = parseBadge(product.badge);
    if (badge.text) badges.push(badge);
  } else if (
    product.badge_name ||
    product.badge_text ||
    product.badge_color ||
    product.badge_priority !== undefined
  ) {
    const badge = parseBadge(product);
    if (badge.text) badges.push(badge);
  }

  if (!badges.length) {
    if (product.isBestSeller) {
      badges.push({
        name: "best-seller",
        text: "BESTSELLER",
        color: "gold",
        priority: 0,
      });
    }
    if (product.isFeatured) {
      badges.push({
        name: "decantre-choice",
        text: "DECANTRE CHOICE",
        color: "#bf9b30",
        priority: 1,
      });
    }
  }

  return badges.sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

const getCachedCategories = () => {
  try {
    const cached = localStorage.getItem("luxury_categories");
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

const getCachedBrands = () => {
  try {
    const cached = localStorage.getItem("luxury_brands");
    return cached ? JSON.parse(cached) : [];
  } catch (e) {
    return [];
  }
};

export const resolveCategoryName = (catValue, customList = null) => {
  if (!catValue) return "";
  if (typeof catValue === "object" && catValue !== null) {
    return catValue.name || catValue.title || catValue.slug || "";
  }
  const strVal = String(catValue).trim();
  if (!strVal) return "";
  const cachedList = Array.isArray(customList) && customList.length > 0 ? customList : getCachedCategories();
  const found = cachedList.find(
    (c) =>
      String(c._id || c.id || c.did || "").toLowerCase() === strVal.toLowerCase() ||
      String(c.slug || "").toLowerCase() === strVal.toLowerCase() ||
      String(c.name || "").toLowerCase() === strVal.toLowerCase(),
  );
  if (found) return found.name || found.title || found.slug || "";

  // Never return raw hex ID / DID strings to the UI
  if (/^[0-9a-fA-F]{16,24}$/.test(strVal)) {
    return "";
  }
  return strVal;
};

export const resolveBrandName = (brandValue, customList = null) => {
  if (!brandValue) return "";
  if (Array.isArray(brandValue)) {
    for (const item of brandValue) {
      const resolved = resolveBrandName(item, customList);
      if (resolved) return resolved;
    }
    return "";
  }
  if (typeof brandValue === "object" && brandValue !== null) {
    const directName =
      brandValue.name || brandValue.title || brandValue.slug || "";
    if (directName) return directName;

    const lookupValue = String(
      brandValue.id || brandValue._id || brandValue.did || "",
    ).trim();
    if (lookupValue) {
      const cachedList = Array.isArray(customList) && customList.length > 0 ? customList : getCachedBrands();
      const found = cachedList.find((b) => {
        const candidates = [b._id, b.id, b.did, b.slug, b.name, b.title];
        return candidates.some(
          (candidate) =>
            String(candidate || "")
              .trim()
              .toLowerCase() === lookupValue.toLowerCase(),
        );
      });
      if (found) return found.name || found.title || found.slug || "";
      if (/^[0-9a-fA-F]{16,24}$/.test(lookupValue)) {
        return "";
      }
      return lookupValue;
    }
    return "";
  }

  const strVal = String(brandValue).trim();
  if (!strVal) return "";
  const cachedList = Array.isArray(customList) && customList.length > 0 ? customList : getCachedBrands();
  const found = cachedList.find((b) => {
    const candidates = [b._id, b.id, b.did, b.slug, b.name, b.title];
    return candidates.some(
      (candidate) =>
        String(candidate || "")
          .trim()
          .toLowerCase() === strVal.toLowerCase(),
    );
  });
  if (found) return found.name || found.title || found.slug || "";

  // Never return raw hex ID / DID strings to the UI
  if (/^[0-9a-fA-F]{16,24}$/.test(strVal)) {
    return "";
  }
  return strVal;
};

export const resolveBrandSlug = (brandValue, customList = null) => {
  if (!brandValue) return "";
  if (Array.isArray(brandValue)) {
    for (const item of brandValue) {
      const resolved = resolveBrandSlug(item, customList);
      if (resolved) return resolved;
    }
    return "";
  }
  const cachedList = Array.isArray(customList) && customList.length > 0 ? customList : getCachedBrands();
  let searchKey = "";
  if (typeof brandValue === "object" && brandValue !== null) {
    searchKey = String(brandValue.slug || brandValue.name || brandValue.title || brandValue.id || brandValue._id || "").trim();
  } else {
    searchKey = String(brandValue).trim();
  }
  if (!searchKey) return "";
  const found = cachedList.find((b) => {
    const candidates = [b._id, b.id, b.did, b.slug, b.name, b.title];
    return candidates.some(
      (candidate) =>
        String(candidate || "")
          .trim()
          .toLowerCase() === searchKey.toLowerCase(),
    );
  });
  if (found && found.slug) return found.slug;
  if (/^[0-9a-fA-F]{16,24}$/.test(searchKey)) {
    return "all";
  }
  return searchKey.toLowerCase().replace(/\s+/g, "-");
};

export const resolveCategorySlug = (catValue, customList = null) => {
  if (!catValue) return "";
  const cachedList = Array.isArray(customList) && customList.length > 0 ? customList : getCachedCategories();
  let searchKey = "";
  if (typeof catValue === "object" && catValue !== null) {
    searchKey = String(catValue.slug || catValue.name || catValue.title || catValue.id || catValue._id || "").trim();
  } else {
    searchKey = String(catValue).trim();
  }
  if (!searchKey) return "";
  const found = cachedList.find((c) => {
    const candidates = [c._id, c.id, c.did, c.slug, c.name, c.title];
    return candidates.some(
      (candidate) =>
        String(candidate || "")
          .trim()
          .toLowerCase() === searchKey.toLowerCase(),
    );
  });
  if (found && found.slug) return found.slug;
  if (/^[0-9a-fA-F]{16,24}$/.test(searchKey)) {
    return "all";
  }
  return searchKey.toLowerCase().replace(/\s+/g, "-");
};

const normalizeCategory = (product = {}) => {
  const catInput =
    product.category ||
    product.categoryId ||
    product.category_id ||
    (Array.isArray(product.categories) && product.categories.length > 0
      ? product.categories[0]
      : null);
  return resolveCategoryName(catInput);
};

const normalizeBrand = (product = {}) => {
  const brandCandidates = [];

  if (Array.isArray(product.brands) && product.brands.length > 0) {
    brandCandidates.push(...product.brands);
  }

  brandCandidates.push(
    product.brand,
    product.brandName,
    product.brand_name,
    product.brandInfo,
    product.brandData,
    product.brandId,
    product.brand_id,
    product.brandDetails,
  );

  for (const brandInput of brandCandidates) {
    const resolved = resolveBrandName(brandInput);
    if (resolved) return resolved;
  }

  // Fallback: extract from product name if name is in "Product by Brand" or "Brand - Product" format
  if (product.name || product.title) {
    const fullName = String(product.name || product.title).trim();
    if (/\s+by\s+/i.test(fullName)) {
      const parts = fullName.split(/\s+by\s+/i);
      if (parts.length > 1 && parts[parts.length - 1].trim()) {
        return parts[parts.length - 1].trim();
      }
    }
    if (fullName.includes(" - ")) {
      return fullName.split(" - ")[0].trim();
    }
    const words = fullName.split(" ");
    if (words.length > 1) {
      return words[0];
    }
    return fullName;
  }
  return "";
};

export const mapRemoteProduct = (product = {}) => {
  // Determine Primary Image URL
  let rawImage = product.imageUrl || product.image || "";
  if (!rawImage && Array.isArray(product.images) && product.images.length > 0) {
    const firstImg = product.images[0];
    rawImage = typeof firstImg === "object" ? firstImg.url : firstImg;
  }

  // Handle Gallery Images
  const galleryImages = Array.isArray(product.images)
    ? product.images
        .map((img) =>
          typeof img === "object"
            ? normalizeProductImage(img.url)
            : normalizeProductImage(img),
        )
        .filter(Boolean)
    : [];

  // Determine Product Variations (Mongoose 'variants' or WP 'variations')
  let variations = [];

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    // Mongoose Variant Schema
    variations = product.variants.map((v, idx) => {
      const effectivePrice =
        Number.isFinite(+v.offerPrice) && +v.offerPrice > 0
          ? Number(v.offerPrice)
          : Number(v.price || 0);
      const originalPrice =
        Number.isFinite(+v.offerPrice) && +v.offerPrice > 0
          ? Number(v.price)
          : null;
      const rawSize = String(v.size || "Standard").trim();
      const variantSlug = v.slug || rawSize.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const displayLabel = rawSize.replace(/-/g, " ");

      return {
        id: v._id || v.id || `var-${variantSlug}-${idx}`,
        name: `${product.name || product.title} - ${rawSize}`,
        size: rawSize,
        slug: variantSlug,
        label: displayLabel,
        price: effectivePrice,
        originalPrice: originalPrice,
        stockQuantity: v.stockQuantity ?? 0,
        stockStatus: (v.stockQuantity ?? 1) > 0 ? "instock" : "outofstock",
        sku: v.sku || "",
        sortOrder: v.sortOrder ?? idx,
        raw: v,
      };
    });
  } else if (
    Array.isArray(product.variations) &&
    product.variations.length > 0
  ) {
    // WP / Legacy Variations Schema
    variations = product.variations.map((v, idx) => {
      const rawSize = String(v.size || "Standard").trim();
      const variantSlug = v.slug || rawSize.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const displayLabel = rawSize.replace(/-/g, " ");
      return {
        id: v.id || `var-${variantSlug}-${idx}`,
        name: v.name || product.title || product.name,
        size: rawSize,
        slug: variantSlug,
        label: displayLabel,
        price: Number(v.price || 0),
        originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
        stockStatus: v.stockStatus || "instock",
        sku: v.sku || "",
        sortOrder: v.sortOrder ?? idx,
        raw: v,
      };
    });
  }

  // If simple product or no variations specified, create a default top-level variation
  const topPrice =
    Number.isFinite(+product.offerPrice) && +product.offerPrice > 0
      ? Number(product.offerPrice)
      : Number(product.price || 0);
  const topOriginalPrice =
    Number.isFinite(+product.offerPrice) && +product.offerPrice > 0
      ? Number(product.price)
      : null;

  if (variations.length === 0) {
    variations.push({
      id: product.id || product._id || product.slug || "var-default",
      name: product.name || product.title || "",
      size: "Full Bottle",
      slug: "full-bottle",
      label: "Full Bottle",
      price: topPrice,
      originalPrice: topOriginalPrice,
      stockQuantity: product.stockQuantity ?? 0,
      stockStatus: product.stockStatus || "instock",
      sku: product.sku || "",
      raw: product,
    });
  }

  // Base price calculation (lowest variation price or top-level price)
  const basePrice =
    variations.length > 0
      ? Math.min(...variations.map((v) => v.price))
      : topPrice;

  return {
    id: product.id || product._id || product.slug || String(Math.random()),
    _id: product._id || product.id,
    name: product.name || product.title || "",
    slug: product.slug || "",
    type: product.type || "simple",
    tagline: (product.excerpt || "").replace(/<[^>]+>/g, "").trim() || "",
    category: normalizeCategory(product),
    categories: product.categories || [],
    brand: normalizeBrand(product),
    basePrice: basePrice,
    price: topPrice,
    originalPrice: topOriginalPrice,
    offerPrice: product.offerPrice || null,
    stockQuantity: product.stockQuantity ?? 0,
    sku: product.sku || "",
    description: product.description || product.content || "",
    season: product.season || "All-Season",
    tags: Array.isArray(product.tags) ? product.tags : [],
    notes: Array.isArray(product.notes)
      ? product.notes
      : typeof product.notes === "object"
        ? product.notes
        : [],
    scentFamily:
      product.scentFamily ||
      (Array.isArray(product.tags) ? product.tags.join(", ") : ""),
    longevity: product.longevity || 4,
    sillage: product.sillage || 4,
    image: normalizeProductImage(rawImage),
    images:
      galleryImages.length > 0
        ? galleryImages
        : [normalizeProductImage(rawImage)],
    stockStatus: product.stockStatus || "instock",
    isBestSeller: product.isBestSeller || false,
    isFeatured: product.isFeatured || false,
    badges: normalizeProductBadges(product),
    variations,
    raw: product,
  };
};

export const getDefaultSelection = (product = {}) => {
  const variations = Array.isArray(product.variations) ? product.variations : [];
  if (variations.length === 0) {
    return { size: "Full Bottle", slug: "full-bottle", label: "Full Bottle", concentration: "Eau de Parfum" };
  }
  // Find variation with the lowest price
  const lowest = variations.reduce((min, curr) => {
    return (curr.price < min.price) ? curr : min;
  }, variations[0]);
  return {
    size: lowest?.size || "Standard",
    slug: lowest?.slug || String(lowest?.size || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    label: lowest?.label || String(lowest?.size || "").replace(/-/g, " "),
    concentration: "Eau de Parfum"
  };
};

