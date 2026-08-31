import { mapRemoteProduct } from "../store/productHelpers";

// Centralized helper to get the sanitized API base URL from env
export const getApiBaseUrl = () => {
	const envUrl =
		import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL || "";
	return envUrl ? envUrl.replace(/\/$/, "") : "https://server.decantrebd.com";
};

// Centralized helper to get the image base URL from env
export const getImageBaseUrl = () => {
	const envImgUrl =
		import.meta.env.VITE_IMAGE_BASE_URL ||
		import.meta.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
		"";
	return envImgUrl ? envImgUrl.replace(/\/$/, "") : getApiBaseUrl();
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
	try {
		const response = await fetch(url, {
			...options,
			signal: controller.signal,
		});
		clearTimeout(id);
		return response;
	} catch (err) {
		clearTimeout(id);
		throw err;
	}
};

const fetchWithRetry = async (
	url,
	options = {},
	timeout = 10000,
	maxAttempts = 3,
	attempt = 1,
) => {
	try {
		return await fetchWithTimeout(url, options, timeout);
	} catch (err) {
		if (attempt >= maxAttempts) {
			throw err;
		}
		await delay(250 * attempt);
		return fetchWithRetry(url, options, timeout, maxAttempts, attempt + 1);
	}
};

const getStoredMemberTokens = () => {
	if (typeof window === "undefined") {
		return { accessToken: null, refreshToken: null };
	}

	return {
		accessToken: localStorage.getItem("luxury_access_token") || null,
		refreshToken: localStorage.getItem("luxury_refresh_token") || null,
	};
};

const setStoredMemberTokens = (accessToken, refreshToken) => {
	if (typeof window === "undefined") return;
	if (accessToken) {
		localStorage.setItem("luxury_access_token", accessToken);
	} else {
		localStorage.removeItem("luxury_access_token");
	}
	if (refreshToken) {
		localStorage.setItem("luxury_refresh_token", refreshToken);
	} else {
		localStorage.removeItem("luxury_refresh_token");
	}
};

const clearStoredMemberTokens = () => {
	if (typeof window === "undefined") return;
	localStorage.removeItem("luxury_access_token");
	localStorage.removeItem("luxury_refresh_token");
};

const refreshMemberSession = async () => {
	const { refreshToken } = getStoredMemberTokens();
	if (!refreshToken) {
		throw new Error("No refresh token available.");
	}

	const apiBaseUrl = getApiBaseUrl();
	const res = await fetchWithRetry(
		`${apiBaseUrl}/api/v1/members/refresh-token`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken }),
		},
		8000,
		1,
	);

	if (!res.ok) {
		clearStoredMemberTokens();
		throw new Error("Session expired. Please log in again.");
	}

	const json = await res.json().catch(() => null);
	const nextTokenBundle = json?.data || {};
	const nextAccessToken = nextTokenBundle.accessToken || null;
	const nextRefreshToken = nextTokenBundle.refreshToken || refreshToken;
	setStoredMemberTokens(nextAccessToken, nextRefreshToken);

	return {
		accessToken: nextAccessToken,
		refreshToken: nextRefreshToken,
	};
};

export const authFetch = async (url, options = {}, timeout = 10000) => {
	const { accessToken } = getStoredMemberTokens();
	const headers = new Headers(options.headers || {});

	if (accessToken) {
		headers.set("Authorization", `Bearer ${accessToken}`);
	}

	if (
		options.body &&
		!(options.body instanceof FormData) &&
		!headers.has("Content-Type")
	) {
		headers.set("Content-Type", "application/json");
	}

	let res = await fetchWithRetry(
		url,
		{ ...options, headers },
		timeout,
		3,
	);

	if (res.status === 401) {
		try {
			const refreshed = await refreshMemberSession();
			const retryHeaders = new Headers(options.headers || {});
			retryHeaders.set("Authorization", `Bearer ${refreshed.accessToken}`);
			if (
				options.body &&
				!(options.body instanceof FormData) &&
				!retryHeaders.has("Content-Type")
			) {
				retryHeaders.set("Content-Type", "application/json");
			}

			res = await fetchWithRetry(
				url,
				{ ...options, headers: retryHeaders },
				timeout,
				3,
			);
		} catch (_) {
			clearStoredMemberTokens();
			throw new Error("Your session has expired. Please log in again.");
		}
	}

	return res;
};

/**
 * Fetch Products
 */
export async function fetchProducts(opts = {}) {
	const apiBaseUrl = getApiBaseUrl();

	const skip = opts.skip ?? opts.offset ?? 0;
	const limit = Math.min(opts.limit || 20, 100);
	const sortBy = opts.sortBy || "createdAt";
	const order = opts.order || "desc";
	const q = opts.q || opts.search || opts.keyword || "";

	const params = new URLSearchParams();
	
	if (q) params.set("q", q);
	if (opts.category) params.set("category", opts.category);
	if (opts.brand) params.set("brand", opts.brand);
	if (opts.season) params.set("season", opts.season);
	if (opts.tags) params.set("tags", opts.tags);
	if (opts.filter) params.set("filter", opts.filter);
	if (opts.name) params.set("name", opts.name);
	if (opts.slug) params.set("slug", opts.slug);
	if (opts.did) params.set("did", opts.did);
	if (opts.minPrice !== undefined) params.set("min_price", opts.minPrice);
	if (opts.maxPrice !== undefined) params.set("max_price", opts.maxPrice);

	params.set("skip", String(skip));
	params.set("limit", String(limit));
	params.set("sortBy", sortBy);
	params.set("order", order);

	try {
		const res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/products?${params.toString()}`,
			{ method: "GET" },
			10000,
			3,
		);

		if (!res.ok) {
			throw new Error(`Server error: ${res.status}`);
		}

		const json = await res.json();
		const list = Array.isArray(json.data)
			? json.data
			: Array.isArray(json)
				? json
				: [];
		const mapped = list.map(mapRemoteProduct);
		mapped._pagination = json.pagination || null;
		mapped._meta = json.meta || null;
		mapped._totalRows = json.pagination?.total ?? json.meta?.total_products ?? json.totalRows ?? list.length;
		return mapped;
	} catch (err) {
		console.error("fetchProducts Error:", err);
		throw err;
	}
}

/**
 * Search Products (lightweight autocomplete with analytics tracking)
 * Uses the dedicated /api/v1/search endpoint which also tracks popular/recent searches.
 * @param {string} q - Search query
 * @param {number} [limit=12] - Max results
 * @returns {Promise<Array<{id, name, category, brand, image}>>}
 */
export async function searchProductsAPI(q, limit = 12) {
	const apiBaseUrl = getApiBaseUrl();
	if (!q || !q.trim()) return [];
	const params = new URLSearchParams({ q: q.trim(), limit: String(limit) });
	try {
		const res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/search?${params.toString()}`,
			{ method: "GET" },
			8000,
			2,
		);
		if (!res.ok) throw new Error(`Search error: ${res.status}`);
		const json = await res.json();
		return Array.isArray(json.data) ? json.data : [];
	} catch (err) {
		console.error("searchProductsAPI Error:", err);
		return [];
	}
}

/**
 * Fetch Popular Search Terms
 * @param {number} [limit=10] - Max terms to return
 * @returns {Promise<Array<{keyword: string, count: number}>>}
 */
export async function fetchPopularSearches(limit = 10) {
	const apiBaseUrl = getApiBaseUrl();
	try {
		const res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/search/popular?limit=${limit}`,
			{ method: "GET" },
			8000,
			2,
		);
		if (!res.ok) throw new Error(`Popular searches error: ${res.status}`);
		const json = await res.json();
		return Array.isArray(json.data) ? json.data : [];
	} catch (err) {
		console.error("fetchPopularSearches Error:", err);
		return [];
	}
}

/**
 * Fetch Recent Searches (requires auth)
 * @returns {Promise<Array<{id: string, query: string, searchedAt: string}>>}
 */
export async function fetchRecentSearches() {
	const apiBaseUrl = getApiBaseUrl();
	try {
		const res = await authFetch(
			`${apiBaseUrl}/api/v1/search/recent`,
			{ method: "GET" },
			8000,
		);
		if (!res.ok) return [];
		const json = await res.json();
		return Array.isArray(json.data) ? json.data : [];
	} catch (err) {
		console.error("fetchRecentSearches Error:", err);
		return [];
	}
}

/**
 * Clear Recent Search History (requires auth)
 * @param {string} [query] - Specific query to remove, or omit to clear all
 * @returns {Promise<boolean>}
 */
export async function clearRecentSearch(query) {
	const apiBaseUrl = getApiBaseUrl();
	try {
		const params = query ? `?q=${encodeURIComponent(query)}` : "";
		const res = await authFetch(
			`${apiBaseUrl}/api/v1/search/recent${params}`,
			{ method: "DELETE" },
			8000,
		);
		return res.ok;
	} catch (err) {
		console.error("clearRecentSearch Error:", err);
		return false;
	}
}

/**
 * Fetch Product Details
 */
export async function fetchProductDetails(slugOrId) {
	const apiBaseUrl = getApiBaseUrl();
	try {
		let res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/products/${slugOrId}`,
			{},
			8000,
			3,
		);
		if (!res.ok) {
			res = await fetchWithRetry(
				`${apiBaseUrl}/api/wp/products/${slugOrId}`,
				{},
				8000,
				3,
			);
		}

		if (!res.ok) {
			throw new Error("Failed to fetch product details.");
		}

		const json = await res.json();
		const targetData = json.data || json;
		if (targetData && typeof targetData === "object") {
			return mapRemoteProduct(targetData);
		}
		return null;
	} catch (err) {
		console.error("fetchProductDetails Error:", err);
		throw err;
	}
}

/**
 * Fetch Categories
 */
export async function fetchCategories(opts = {}) {
	const apiBaseUrl = getApiBaseUrl();
	const skip = opts.skip ?? 0;
	const limit = opts.limit || 50;

	try {
		const res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/categories?skip=${skip}&limit=${limit}`,
			{},
			8000,
			3,
		);
		if (!res.ok) throw new Error("Failed to fetch categories.");
		const json = await res.json();
		return Array.isArray(json.data)
			? json.data
			: Array.isArray(json)
				? json
				: [];
	} catch (err) {
		console.error("fetchCategories Error:", err);
		throw err;
	}
}

/**
 * Fetch Brands
 */
export async function fetchBrands(opts = {}) {
	const apiBaseUrl = getApiBaseUrl();
	const skip = opts.skip ?? 0;
	const limit = opts.limit || 50;

	try {
		const res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/brands?skip=${skip}&limit=${limit}`,
			{},
			8000,
			3,
		);
		if (!res.ok) throw new Error("Failed to fetch brands.");
		const json = await res.json();
		return Array.isArray(json.data)
			? json.data
			: Array.isArray(json)
				? json
				: [];
	} catch (err) {
		console.error("fetchBrands Error:", err);
		throw err;
	}
}

/**
 * Fetch Combo / Bundle Products
 */
export async function fetchCombos(opts = {}) {
	const limit = opts.limit || 100;
	const categoryNames = ["Combo", "Bundle", "Combo Set"];

	for (const cat of categoryNames) {
		try {
			const results = await fetchProducts({ category: cat, skip: 0, limit });
			if (results && results.length > 0) return results;
		} catch (_) {
			// try next category fallback
		}
	}
	return [];
}

/**
 * Create Order
 */
export async function createOrder(orderPayload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/orders/new-order`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(orderPayload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") || json?.message || "Failed to place order";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Check Member Email (via /members/check-email)
 * Checks if email exists and is verified.
 */
export async function checkMemberEmail(emailPayload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/check-email`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(emailPayload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Email check failed. Please check the address.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Member Login (via /members/login)
 */
export async function loginMember(credentials) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(credentials),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Login failed. Please check your credentials.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Resend Member OTP (via /members/resend-otp)
 */
export async function resendMemberOtp(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/resend-otp`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Failed to resend OTP.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Register Member (via /members/register with OTP flow)
 */
export async function registerMember(memberPayload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(memberPayload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Registration failed. Please try again.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Verify Member OTP (via /members/verify-otp)
 */
export async function verifyMemberOtp(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/verify-otp`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"OTP verification failed.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Forgot Member Password (via /members/forgot-password)
 */
export async function forgotMemberPassword(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/forgot-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Password reset request failed.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Reset Member Password (via /members/reset-password)
 */
export async function resetMemberPassword(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/reset-password`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Password reset failed.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Refresh Member Access Token (via /members/refresh-token)
 */
export async function refreshMemberToken(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/refresh-token`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Token refresh failed.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Logout Member Session (via /members/logout)
 */
export async function logoutMember(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/members/logout`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Logout failed.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * MEMBERS API COLLECTION (/api/v1/members)
 */

export async function fetchMembers() {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/members`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(
			json?.message || json?.error || "Failed to fetch members list.",
		);
	}
	return json?.data || (Array.isArray(json) ? json : []);
}

export async function fetchMemberById(memberId) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(json?.message || json?.error || "Member not found.");
	}
	return json?.data || json;
}

export async function createMember(memberPayload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/members`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(memberPayload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Failed to create member.";
		throw new Error(errorMsg);
	}
	return json?.data || json;
}

export async function updateMember(memberId, updatePayload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updatePayload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg =
			json?.errors?.join(", ") ||
			json?.message ||
			json?.error ||
			"Failed to update member.";
		throw new Error(errorMsg);
	}
	return json?.data || json;
}

export async function deleteMember(memberId) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/members/${memberId}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(json?.message || json?.error || "Failed to delete member.");
	}
	return json;
}

export async function fetchCouponByCode(code) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetchWithRetry(`${apiBaseUrl}/api/v1/coupons/${encodeURIComponent(code)}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(json?.message || json?.error || "Invalid coupon code.");
	}
	return json?.data || json;
}

/**
 * REVIEWS API COLLECTION (/api/v1/reviews)
 */

/**
 * Fetch approved reviews and aggregated statistics for a specific product
 * @param {string} productDid - The product's DID or ID
 * @param {object} [opts] - { skip, limit }
 * @returns {Promise<{stats: {totalReviews: number, averageRating: number, ratingBreakdown: object}, reviews: Array, pagination: object}>}
 */
export async function fetchProductReviews(productDid, opts = {}) {
	if (!productDid) return { stats: { totalReviews: 0, averageRating: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }, reviews: [], pagination: { skip: 0, limit: 10, total: 0 } };
	const apiBaseUrl = getApiBaseUrl();
	const skip = opts.skip ?? 0;
	const limit = opts.limit ?? 10;
	try {
		const res = await fetchWithRetry(
			`${apiBaseUrl}/api/v1/reviews/product/${encodeURIComponent(productDid)}?skip=${skip}&limit=${limit}`,
			{ method: "GET" },
			8000,
			3,
		);
		if (!res.ok) {
			throw new Error(`Failed to fetch reviews: ${res.status}`);
		}
		const json = await res.json();
		return json.data || { stats: { totalReviews: 0, averageRating: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }, reviews: [], pagination: { skip, limit, total: 0 } };
	} catch (err) {
		console.error("fetchProductReviews Error:", err);
		return { stats: { totalReviews: 0, averageRating: 0, ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } }, reviews: [], pagination: { skip: 0, limit: 10, total: 0 } };
	}
}

/**
 * Create a new review for a product (Member authenticated)
 * @param {{ productDid: string, rating: number, description: string }} payload
 * @returns {Promise<object>}
 */
export async function createProductReview(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/reviews`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg = json?.message || json?.error || "Failed to submit review.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Update an existing review (Owner or Admin)
 * @param {string} reviewId - The review ID or DID
 * @param {{ rating?: number, description?: string }} payload
 * @returns {Promise<object>}
 */
export async function updateProductReview(reviewId, payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/reviews/${encodeURIComponent(reviewId)}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg = json?.message || json?.error || "Failed to update review.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Delete a review (Owner or Admin)
 * @param {string} reviewId - The review ID or DID
 * @returns {Promise<object>}
 */
export async function deleteProductReview(reviewId) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await authFetch(`${apiBaseUrl}/api/v1/reviews/${encodeURIComponent(reviewId)}`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg = json?.message || json?.error || "Failed to delete review.";
		throw new Error(errorMsg);
	}
	return json;
}

/**
 * Fetch a single review by ID
 * @param {string} reviewId - The review ID or DID
 * @returns {Promise<object>}
 */
export async function fetchReviewById(reviewId) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetchWithRetry(`${apiBaseUrl}/api/v1/reviews/${encodeURIComponent(reviewId)}`, {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		throw new Error(json?.message || json?.error || "Review not found.");
	}
	return json?.data || json;
}

/**
 * Submit Contact Inquiry Message
 * @param {object} payload - Contact form payload with reCAPTCHA token
 * @returns {Promise<object>}
 */
export async function submitContactMessage(payload) {
	const apiBaseUrl = getApiBaseUrl();
	const res = await fetch(`${apiBaseUrl}/api/v1/contact`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
	const json = await res.json().catch(() => null);
	if (!res.ok) {
		const errorMsg = json?.message || json?.error || "Failed to send message. Please try again.";
		throw new Error(errorMsg);
	}
	return json;
}

