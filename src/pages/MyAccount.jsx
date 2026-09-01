import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  LogOut,
  Edit3,
  Clipboard,
  Package,
  Eye,
  FileText,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  RotateCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ExternalLink,
  Award
} from 'lucide-react';
import { useApp } from '../core/context/AppContext';
import { updateMember, fetchMemberById, getOrderInvoiceUrl } from '../core/lib/api';

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'orders', label: 'Orders' },
  { key: 'wishlist', label: 'Wishlist' },
];

// Resolves a nested address property safely from user state
const getAddressValue = (userObj, section, field) => {
  const sec = userObj?.[section] || userObj?.raw?.[section] || {};
  return sec[field] || '';
};

// Formats an ISO date string into a user-friendly readable date
const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return 'N/A';
  }
};

// Formats month and year for member join date display
const formatMemberSince = (isoString) => {
  if (!isoString) return 'Valued Member';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Valued Member';
    return `Member Since ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  } catch (_) {
    return 'Valued Member';
  }
};

// Returns responsive color badge styling for an order status
const getStatusBadge = (status) => {
  const normalized = (status || '').toLowerCase().trim();
  if (normalized === 'completed' || normalized === 'delivered') {
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  }
  if (normalized === 'shipped') {
    return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
  }
  if (normalized === 'processing' || normalized === 'received') {
    return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }
  if (normalized === 'cancelled') {
    return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  }
  return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30';
};

// Maps raw technical errors to friendly user-facing messages
const getFriendlyErrorMessage = (error, defaultMsg = 'An unexpected error occurred. Please try again.') => {
  const rawMessage = error?.message || String(error);
  if (!rawMessage) return defaultMsg;
  const lowerMsg = rawMessage.toLowerCase();
  if (lowerMsg.includes('billinginfo') || lowerMsg.includes('shippinginfo') || lowerMsg.includes('required')) {
    return 'Something went wrong. Please check your address book inputs and try again.';
  }
  if (lowerMsg.includes('failed to fetch') || lowerMsg.includes('networkerror')) {
    return 'Network connection issue. Please check your internet connection.';
  }
  return rawMessage;
};

// Main member dashboard page component handling profile, order history, and details modal
export const MyAccount = () => {
  const { user, setUser, setAuthModal, currentTheme, addToast } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const isLight = currentTheme === 'light';

  const [orders, setOrders] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isRefreshingOrders, setIsRefreshingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [memberStats, setMemberStats] = useState({
    totalOrders: 0,
    lifetimeSpent: 0,
    memberSince: '',
  });

  const [name, setName] = useState(user?.name || user?.raw?.name || '');
  const [phone, setPhone] = useState(user?.phone || user?.raw?.phone || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [billingAddress, setBillingAddress] = useState(getAddressValue(user, 'billingInfo', 'address1') || getAddressValue(user, 'billingInfo', 'address') || '');
  const [billingCity, setBillingCity] = useState(getAddressValue(user, 'billingInfo', 'city') || '');
  const [billingState, setBillingState] = useState(getAddressValue(user, 'billingInfo', 'state') || '');
  const [billingZip, setBillingZip] = useState(getAddressValue(user, 'billingInfo', 'postcode') || getAddressValue(user, 'billingInfo', 'zip') || '');
  const [billingCountry, setBillingCountry] = useState(getAddressValue(user, 'billingInfo', 'country') || 'Bangladesh');
  const [billingPhone, setBillingPhone] = useState(getAddressValue(user, 'billingInfo', 'phone') || '');

  const [shippingAddress, setShippingAddress] = useState(getAddressValue(user, 'shippingInfo', 'address1') || getAddressValue(user, 'shippingInfo', 'address') || '');
  const [shippingCity, setShippingCity] = useState(getAddressValue(user, 'shippingInfo', 'city') || '');
  const [shippingState, setShippingState] = useState(getAddressValue(user, 'shippingInfo', 'state') || '');
  const [shippingZip, setShippingZip] = useState(getAddressValue(user, 'shippingInfo', 'postcode') || getAddressValue(user, 'shippingInfo', 'zip') || '');
  const [shippingCountry, setShippingCountry] = useState(getAddressValue(user, 'shippingInfo', 'country') || 'Bangladesh');
  const [shippingPhone, setShippingPhone] = useState(getAddressValue(user, 'shippingInfo', 'phone') || '');

  // Fetches latest member profile details, order list, and spending aggregates from backend API
  const loadMemberDetails = useCallback(async (showRefreshingState = false) => {
    const memberId = user?.id || user?._id || user?.raw?.id || user?.raw?._id;
    if (!memberId) return;

    if (showRefreshingState) {
      setIsRefreshingOrders(true);
    } else {
      setIsLoadingData(true);
    }

    try {
      const memberData = await fetchMemberById(memberId);
      if (memberData) {
        const orderList = Array.isArray(memberData.orderList) ? memberData.orderList : [];
        setOrders(orderList);

        const totalOrders = memberData.totalOrders ?? orderList.length;
        const lifetimeSpent = memberData.lifetimeSpent ?? memberData.totalOrderAmount ?? 0;
        const memberSince = memberData.createdAt || user?.raw?.createdAt || '';

        setMemberStats({
          totalOrders,
          lifetimeSpent,
          memberSince,
        });

        if (memberData.name && !isEditing) {
          setName(memberData.name);
        }
        if (memberData.phone && !isEditing) {
          setPhone(memberData.phone);
        }

        const bInfo = memberData.billingAddress || memberData.billingInfo;
        if (bInfo && !isEditing) {
          setBillingAddress(bInfo.address1 || bInfo.address || '');
          setBillingCity(bInfo.city || bInfo.district || '');
          setBillingState(bInfo.state || bInfo.thana || '');
          setBillingZip(bInfo.postcode || bInfo.zip || '');
          setBillingCountry(bInfo.country || 'Bangladesh');
          setBillingPhone(bInfo.phone || memberData.phone || '');
        }

        const sInfo = memberData.shippingAddress || memberData.shippingInfo;
        if (sInfo && !isEditing) {
          setShippingAddress(sInfo.address1 || sInfo.address || '');
          setShippingCity(sInfo.city || sInfo.district || '');
          setShippingState(sInfo.state || sInfo.thana || '');
          setShippingZip(sInfo.postcode || sInfo.zip || '');
          setShippingCountry(sInfo.country || 'Bangladesh');
          setShippingPhone(sInfo.phone || memberData.phone || '');
        }
      }
    } catch (err) {
      console.error('Failed to load member profile data:', err);
    } finally {
      setIsLoadingData(false);
      setIsRefreshingOrders(false);
    }
  }, [user?.id, user?._id, user?.raw?.id, user?.raw?._id, isEditing]);

  useEffect(() => {
    if (user) {
      loadMemberDetails(false);
    }
  }, [user?.id, user?._id, user?.raw?.id, user?.raw?._id]);

  useEffect(() => {
    if (!isEditing) {
      setName(user?.name || user?.raw?.name || '');
      setPhone(user?.phone || user?.raw?.phone || '');
      setBillingAddress(getAddressValue(user, 'billingInfo', 'address1') || getAddressValue(user, 'billingInfo', 'address') || '');
      setBillingCity(getAddressValue(user, 'billingInfo', 'city') || '');
      setBillingState(getAddressValue(user, 'billingInfo', 'state') || '');
      setBillingZip(getAddressValue(user, 'billingInfo', 'postcode') || getAddressValue(user, 'billingInfo', 'zip') || '');
      setBillingCountry(getAddressValue(user, 'billingInfo', 'country') || 'Bangladesh');
      setBillingPhone(getAddressValue(user, 'billingInfo', 'phone') || '');
      setShippingAddress(getAddressValue(user, 'shippingInfo', 'address1') || getAddressValue(user, 'shippingInfo', 'address') || '');
      setShippingCity(getAddressValue(user, 'shippingInfo', 'city') || '');
      setShippingState(getAddressValue(user, 'shippingInfo', 'state') || '');
      setShippingZip(getAddressValue(user, 'shippingInfo', 'postcode') || getAddressValue(user, 'shippingInfo', 'zip') || '');
      setShippingCountry(getAddressValue(user, 'shippingInfo', 'country') || 'Bangladesh');
      setShippingPhone(getAddressValue(user, 'shippingInfo', 'phone') || '');
    }
  }, [user, isEditing]);

  // Cancels profile edits and restores original input fields from current user state
  const handleCancelEdit = () => {
    setName(user?.name || user?.raw?.name || '');
    setPhone(user?.phone || user?.raw?.phone || '');
    setBillingAddress(getAddressValue(user, 'billingInfo', 'address1') || getAddressValue(user, 'billingInfo', 'address') || '');
    setBillingCity(getAddressValue(user, 'billingInfo', 'city') || '');
    setBillingState(getAddressValue(user, 'billingInfo', 'state') || '');
    setBillingZip(getAddressValue(user, 'billingInfo', 'postcode') || getAddressValue(user, 'billingInfo', 'zip') || '');
    setBillingCountry(getAddressValue(user, 'billingInfo', 'country') || 'Bangladesh');
    setBillingPhone(getAddressValue(user, 'billingInfo', 'phone') || '');
    setShippingAddress(getAddressValue(user, 'shippingInfo', 'address1') || getAddressValue(user, 'shippingInfo', 'address') || '');
    setShippingCity(getAddressValue(user, 'shippingInfo', 'city') || '');
    setShippingState(getAddressValue(user, 'shippingInfo', 'state') || '');
    setShippingZip(getAddressValue(user, 'shippingInfo', 'postcode') || getAddressValue(user, 'shippingInfo', 'zip') || '');
    setShippingCountry(getAddressValue(user, 'shippingInfo', 'country') || 'Bangladesh');
    setShippingPhone(getAddressValue(user, 'shippingInfo', 'phone') || '');
    setIsEditing(false);
  };

  // Submits updated member profile credentials and addresses to backend API
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }
    setIsUpdating(true);
    try {
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '.';

      const memberPhone = phone.trim() || user?.phone || user?.raw?.phone || '.';
      const memberEmail = user?.email || user?.raw?.email || '';

      const billingInfo = {
        firstName,
        lastName,
        address1: billingAddress.trim(),
        district: billingCity.trim() || 'Dhaka',
        city: billingCity.trim(),
        state: billingState.trim() || 'Dhaka',
        postcode: billingZip.trim(),
        country: billingCountry.trim(),
        email: memberEmail,
        phone: billingPhone.trim() || memberPhone,
      };

      const shippingInfo = {
        firstName,
        lastName,
        address1: shippingAddress.trim(),
        district: shippingCity.trim() || 'Dhaka',
        city: shippingCity.trim(),
        state: shippingState.trim() || 'Dhaka',
        postcode: shippingZip.trim(),
        country: shippingCountry.trim(),
        email: memberEmail,
        phone: shippingPhone.trim() || memberPhone,
      };

      const memberId = user.id || user._id || user.raw?.id || user.raw?._id;
      const updatedUser = await updateMember(memberId, {
        name: name.trim(),
        phone: phone.trim(),
        billingInfo,
        shippingInfo,
      });

      setUser({
        ...user,
        name: updatedUser.name || user.name,
        phone: updatedUser.phone || user.phone,
        raw: { ...user.raw, ...updatedUser },
      });
      addToast('Your personal profile and address books have been updated.', 'success');
      setIsEditing(false);
    } catch (err) {
      addToast(getFriendlyErrorMessage(err), 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // Duplicates billing address entries into the shipping address inputs
  const copyBillingToShipping = () => {
    setShippingAddress(billingAddress);
    setShippingCity(billingCity);
    setShippingState(billingState);
    setShippingZip(billingZip);
    setShippingCountry(billingCountry);
    setShippingPhone(billingPhone);
    addToast('Billing address copied to shipping address.', 'info');
  };

  // Opens the full printable HTML invoice view in a new browser tab
  const handleOpenInvoice = (orderId, e) => {
    if (e) e.stopPropagation();
    if (!orderId) return;
    const url = getOrderInvoiceUrl(orderId);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!user) {
    return (
      <div className={`min-h-screen py-20 ${isLight ? 'bg-white text-black' : 'bg-[#050505] text-white'} transition-colors duration-500`}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-white/10 bg-zinc-900/80'} p-10 text-center space-y-6`}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-serif uppercase tracking-[0.2em]">My Account</h1>
            <p className="max-w-xl mx-auto text-sm text-zinc-400 leading-relaxed">
              Please sign in or create an account to access your membership dashboard, order history and personalized fragrance recommendations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setAuthModal(true, 'login')}
                className="inline-flex items-center justify-center rounded-sm bg-gold px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-black transition-all hover:bg-gold/90 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setAuthModal(true, 'register')}
                className="inline-flex items-center justify-center rounded-sm border border-white/10 bg-black/70 px-6 py-3 text-xs font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-white/10 cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 ${isLight ? 'bg-white text-black' : 'bg-[#050505] text-white'} transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-white/10 bg-zinc-950/80'} p-6 sm:p-8 space-y-8`}>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-semibold mb-1">
                    {formatMemberSince(memberStats.memberSince)}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] text-white leading-tight">
                    {user.name || 'Valued Member'}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-4 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-white">
                    {memberStats.totalOrders}
                  </p>
                </div>

                <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-4 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Lifetime Spent</span>
                    <CreditCard className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-xl sm:text-2xl font-serif font-bold text-gold">
                    ৳{Number(memberStats.lifetimeSpent || 0).toLocaleString()}
                  </p>
                </div>

                <div className={`col-span-2 sm:col-span-1 rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-4 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-bold">Member Tier</span>
                    <Award className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                    {user.tier || 'Privé Connoisseur'}
                  </p>
                </div>
              </div>

              <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-5 sm:p-6`}>
                <p className="text-[10px] uppercase tracking-[0.35em] text-gold font-bold mb-4">Member Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">Full Name</span>
                    <span className="font-semibold text-white">{user.name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">Email Address</span>
                    <span className="font-semibold text-white">{user.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">Phone Number</span>
                    <span className="font-semibold text-white">{user.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-0.5">Status</span>
                    <span className="font-semibold text-gold">Active Session</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
              {tabs.map((tab) => {
                const badgeCount = tab.key === 'orders' ? orders.length : null;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-sm border px-4 py-2 text-[10px] uppercase tracking-[0.25em] font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                      activeTab === tab.key
                        ? 'border-gold bg-gold text-black'
                        : isLight
                          ? 'border-zinc-300 bg-white text-zinc-700'
                          : 'border-white/10 bg-zinc-900 text-zinc-300'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {badgeCount !== null && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${
                        activeTab === tab.key ? 'bg-black/20 text-black' : 'bg-white/10 text-gold'
                      }`}>
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {orders.length > 0 && (
                  <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/30'} p-5 space-y-4`}>
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gold" />
                        <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200">
                          Latest Order Summary
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('orders')}
                        className="text-[10px] text-gold font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                      >
                        View All ({orders.length})
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {orders.slice(0, 2).map((order) => {
                      const orderNum = order.orderNumber || order.did || order._id?.slice(-8) || 'N/A';
                      const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                      const orderTotal = order.totals?.total ?? order.total ?? 0;
                      return (
                        <div
                          key={order._id || order.id || orderNum}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-sm bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-white">#{orderNum}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border ${getStatusBadge(order.status)}`}>
                                {order.status || 'Received'}
                              </span>
                            </div>
                            <p className="text-[11px] text-zinc-400">
                              {formatDate(order.createdAt)} • {itemCount} {itemCount === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                            <span className="text-sm font-bold text-gold">৳{Number(orderTotal).toLocaleString()}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-gold hover:text-black text-zinc-300 text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer border border-white/10"
                              >
                                View Details
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleOpenInvoice(order._id || order.id, e)}
                                title="Print Invoice"
                                className="p-1.5 rounded-sm bg-white/5 hover:bg-gold hover:text-black text-zinc-400 transition-colors cursor-pointer border border-white/10"
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="rounded-sm border border-gold/20 bg-gold/5 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 mb-1">Private Access Control</p>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Update your account profiles, delivery addresses, and billing credentials below. Email address and primary phone configurations cannot be modified due to authentication locks.
                  </p>
                </div>

                {!isEditing ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-4 bg-zinc-950/40 p-6 border border-white/5 rounded-sm">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200">
                          Profile Details
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-1.5 text-xs text-gold font-bold hover:underline cursor-pointer bg-transparent border-none uppercase tracking-wider"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit Profile
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">Display Name</span>
                          <span className="text-xs font-sans text-white">{name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">Email Address</span>
                          <span className="text-xs font-sans text-white">{user?.email || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">Phone Number</span>
                          <span className="text-xs font-sans text-white">{phone || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4 bg-zinc-950/40 p-6 border border-white/5 rounded-sm">
                        <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200 border-b border-white/5 pb-2">
                          Billing Address
                        </h3>
                        <div className="space-y-3.5 text-xs font-sans text-zinc-300">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Street Address</span>
                            <span>{billingAddress || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">City</span>
                              <span>{billingCity || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">State / Division</span>
                              <span>{billingState || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">ZIP / Postal Code</span>
                              <span>{billingZip || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Country</span>
                              <span>{billingCountry || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Phone Number</span>
                            <span>{billingPhone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 bg-zinc-950/40 p-6 border border-white/5 rounded-sm">
                        <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200 border-b border-white/5 pb-2">
                          Shipping Address
                        </h3>
                        <div className="space-y-3.5 text-xs font-sans text-zinc-300">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Street Address</span>
                            <span>{shippingAddress || 'N/A'}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">City</span>
                              <span>{shippingCity || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">State / Division</span>
                              <span>{shippingState || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">ZIP / Postal Code</span>
                              <span>{shippingZip || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Country</span>
                              <span>{shippingCountry || 'N/A'}</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Phone Number</span>
                            <span>{shippingPhone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-6 animate-fade-in">
                    <div className="space-y-4">
                      <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200 border-b border-white/5 pb-2">
                        Profile Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Display Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                      <div className="space-y-4">
                        <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200 border-b border-white/5 pb-2">
                          Billing Address
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Street Address</label>
                            <input
                              type="text"
                              value={billingAddress}
                              onChange={(e) => setBillingAddress(e.target.value)}
                              className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                              placeholder="Street address / house / apartment"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">City</label>
                              <input
                                type="text"
                                value={billingCity}
                                onChange={(e) => setBillingCity(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">State / Division</label>
                              <input
                                type="text"
                                value={billingState}
                                onChange={(e) => setBillingState(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="State"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">ZIP / Postal Code</label>
                              <input
                                type="text"
                                value={billingZip}
                                onChange={(e) => setBillingZip(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="ZIP"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Country</label>
                              <input
                                type="text"
                                value={billingCountry}
                                onChange={(e) => setBillingCountry(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="Country"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={billingPhone}
                              onChange={(e) => setBillingPhone(e.target.value)}
                              className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                              placeholder="Billing Phone"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <h3 className="text-xs font-sans font-bold uppercase tracking-widest text-zinc-200">
                            Shipping Address
                          </h3>
                          <button
                            type="button"
                            onClick={copyBillingToShipping}
                            className="text-[9px] uppercase tracking-wider font-bold text-gold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                          >
                            <Clipboard className="w-3 h-3" />
                            Same as Billing
                          </button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Street Address</label>
                            <input
                              type="text"
                              value={shippingAddress}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                              placeholder="Street address / house / apartment"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">City</label>
                              <input
                                type="text"
                                value={shippingCity}
                                onChange={(e) => setShippingCity(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">State / Division</label>
                              <input
                                type="text"
                                value={shippingState}
                                onChange={(e) => setShippingState(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="State"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">ZIP / Postal Code</label>
                              <input
                                type="text"
                                value={shippingZip}
                                onChange={(e) => setShippingZip(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="ZIP"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Country</label>
                              <input
                                type="text"
                                value={shippingCountry}
                                onChange={(e) => setShippingCountry(e.target.value)}
                                className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                                placeholder="Country"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value)}
                              className="w-full rounded-sm border border-white/10 bg-zinc-900/60 p-3 text-xs text-white focus:border-gold focus:outline-none"
                              placeholder="Shipping Phone"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 rounded-sm bg-gold px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-black hover:bg-gold/90 transition-all cursor-pointer disabled:opacity-55"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isUpdating ? 'Saving Changes…' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-2 rounded-sm border border-white/10 bg-zinc-900/40 px-8 py-3 text-xs font-bold uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">Transaction History</p>
                    <h3 className="text-2xl font-serif tracking-tight">Recent Purchases ({orders.length})</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => loadMemberDetails(true)}
                      disabled={isRefreshingOrders || isLoadingData}
                      className="inline-flex items-center gap-1.5 rounded-sm border border-white/10 bg-zinc-900/80 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:border-gold hover:text-gold transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isRefreshingOrders ? 'animate-spin text-gold' : ''}`} />
                      <span>{isRefreshingOrders ? 'Syncing…' : 'Refresh'}</span>
                    </button>
                    <button
                      onClick={() => navigate('/shop')}
                      className="inline-flex items-center gap-2 rounded-sm bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-black hover:bg-gold/90 cursor-pointer"
                    >
                      Shop Fragrances
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {isLoadingData && orders.length === 0 ? (
                  <div className="space-y-3 py-8">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-16 rounded-sm bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : orders.length > 0 ? (
                  <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/20'} overflow-hidden shadow-2xl`}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className={`border-b ${isLight ? 'border-zinc-200 bg-zinc-50 text-zinc-600' : 'border-white/10 bg-zinc-950/50 text-zinc-400'} uppercase tracking-wider font-semibold text-[10px]`}>
                            <th className="py-3.5 px-4 font-sans font-bold">Order ID</th>
                            <th className="py-3.5 px-4 font-sans font-bold">Date</th>
                            <th className="py-3.5 px-4 font-sans font-bold">Items</th>
                            <th className="py-3.5 px-4 font-sans font-bold">Status</th>
                            <th className="py-3.5 px-4 font-sans font-bold">Payment</th>
                            <th className="py-3.5 px-4 font-sans font-bold text-right">Total</th>
                            <th className="py-3.5 px-4 font-sans font-bold text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {orders.map((order) => {
                            const orderNum = order.orderNumber || order.did || order._id?.slice(-8) || 'N/A';
                            const itemCount = Array.isArray(order.items) ? order.items.length : 0;
                            const firstItemName = order.items?.[0]?.name || order.items?.[0]?.productName || '';
                            const totalAmount = order.totals?.total ?? order.total ?? 0;
                            const pMethod = order.paymentMethod || 'COD';
                            const pStatus = order.paymentStatus || (['completed', 'shipped'].includes((order.status || '').toLowerCase()) ? 'Paid' : 'Pending');

                            return (
                              <tr key={order._id || order.id || orderNum} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4 font-mono font-semibold text-white">
                                  #{orderNum}
                                </td>
                                <td className="py-4 px-4 text-zinc-300 whitespace-nowrap">
                                  {formatDate(order.createdAt)}
                                </td>
                                <td className="py-4 px-4 text-zinc-300">
                                  <span className="font-semibold text-white">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                                  {firstItemName && (
                                    <span className="block text-[10px] text-zinc-400 truncate max-w-[140px]" title={firstItemName}>
                                      {firstItemName}
                                    </span>
                                  )}
                                </td>
                                <td className="py-4 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border ${getStatusBadge(order.status)}`}>
                                    {order.status || 'Received'}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-zinc-300">
                                  <span className="block uppercase text-[10px] font-bold text-zinc-200">{pMethod}</span>
                                  <span className="text-[10px] text-zinc-400 capitalize">{pStatus}</span>
                                </td>
                                <td className="py-4 px-4 text-right text-gold font-semibold text-sm whitespace-nowrap">
                                  ৳{Number(totalAmount).toLocaleString()}
                                </td>
                                <td className="py-4 px-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrder(order)}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm bg-white/5 hover:bg-gold hover:text-black text-zinc-300 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                                      title="View full order details"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Details</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleOpenInvoice(order._id || order.id, e)}
                                      className="p-1.5 rounded-sm bg-white/5 hover:bg-gold hover:text-black text-zinc-400 transition-all cursor-pointer border border-white/10"
                                      title="View printable invoice"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-10 text-center space-y-4`}>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-serif uppercase tracking-wider text-white">No Orders Found</h4>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                        You have not placed any orders yet. Explore our luxury decant and full bottle collections to begin your olfactory journey.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/shop')}
                      className="inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.25em] text-black hover:bg-gold/90 transition-all cursor-pointer"
                    >
                      Explore Collection
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">Sovereign Curations</p>
                    <h3 className="text-2xl font-serif tracking-tight">Saved Favorites</h3>
                  </div>
                </div>
                <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-8 text-center space-y-3`}>
                  <Heart className="w-8 h-8 text-gold/50 mx-auto" />
                  <p className="text-sm text-zinc-400">Your saved fragrance shortlist will appear here once you select items.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="inline-flex items-center gap-2 rounded-sm border border-gold/30 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition-all cursor-pointer"
                  >
                    Browse Perfumes
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-zinc-50' : 'border-white/10 bg-zinc-950/80'} p-6`}>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 mb-5">Quick Actions</p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full rounded-sm border border-gold/30 bg-black/20 px-4 py-3 text-left text-xs uppercase tracking-wider font-bold text-white hover:border-gold hover:bg-gold/10 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-gold" />
                    View Wishlist
                  </span>
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full rounded-sm border border-gold/30 bg-black/20 px-4 py-3 text-left text-xs uppercase tracking-wider font-bold text-white hover:border-gold hover:bg-gold/10 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-gold" />
                    Review Cart
                  </span>
                </button>
                <button
                  onClick={() => {
                    setUser(null);
                    navigate('/');
                  }}
                  className="w-full rounded-sm border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-left text-xs uppercase tracking-wider font-bold text-rose-400 hover:border-rose-500 hover:bg-rose-500/20 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Log Out Session
                  </span>
                </button>
              </div>
            </div>

            <div className={`rounded-sm border ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-zinc-900/40'} p-6`}>
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 mb-4">Member Notes</p>
              <p className="text-xs leading-relaxed text-zinc-400">
                Your credentials and active order states persist encrypted inside this secure session. You can inspect live order progress, track dispatches, and print invoices directly from this portal.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6 shadow-2xl relative text-white">
            
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400">Order Inspection</p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                  #{selectedOrder.orderNumber || selectedOrder.did || selectedOrder._id}
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold border ${getStatusBadge(selectedOrder.status)}`}>
                    Status: {selectedOrder.status || 'Received'}
                  </span>
                  <span className="text-xs text-zinc-400">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-sm bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[10px]">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </div>
                <div className="space-y-0.5 text-zinc-300">
                  <p className="font-semibold text-white">
                    {selectedOrder.shippingInfo?.fullName || selectedOrder.shippingInfo?.name || selectedOrder.billingInfo?.fullName || 'N/A'}
                  </p>
                  <p>{selectedOrder.shippingInfo?.phone || selectedOrder.billingInfo?.phone || 'N/A'}</p>
                  <p>{selectedOrder.shippingInfo?.address || selectedOrder.shippingInfo?.address1 || 'N/A'}</p>
                  <p>
                    {[
                      selectedOrder.shippingInfo?.thana,
                      selectedOrder.shippingInfo?.district || selectedOrder.shippingInfo?.city,
                      selectedOrder.shippingInfo?.zip || selectedOrder.shippingInfo?.postcode
                    ].filter(Boolean).join(', ') || 'Bangladesh'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-sm bg-zinc-900/60 border border-white/5 space-y-2">
                <div className="flex items-center gap-1.5 text-gold font-bold uppercase tracking-wider text-[10px]">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Payment & Invoice</span>
                </div>
                <div className="space-y-1 text-zinc-300">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Payment Method</span>
                    <span className="font-semibold text-white uppercase">{selectedOrder.paymentMethod || 'Cash on Delivery'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 block">Payment Status</span>
                    <span className="font-semibold text-gold capitalize">
                      {selectedOrder.paymentStatus || (['completed', 'shipped'].includes((selectedOrder.status || '').toLowerCase()) ? 'Paid' : 'Pending')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-bold">Purchased Items</p>
              <div className="divide-y divide-white/5 border border-white/5 rounded-sm bg-zinc-900/30 overflow-hidden">
                {Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => {
                    const itemTotal = Number(item.unitPrice || item.price || 0) * Number(item.quantity || 1);
                    return (
                      <div key={idx} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-sm bg-black/60 border border-white/10 flex items-center justify-center shrink-0 text-gold">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{item.name || item.productName || 'Product Item'}</p>
                            <p className="text-[10px] text-zinc-400">
                              {[item.size, item.concentration].filter(Boolean).join(' • ') || 'Standard'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <p className="font-semibold text-gold">৳{itemTotal.toLocaleString()}</p>
                          <p className="text-[10px] text-zinc-400">
                            ৳{Number(item.unitPrice || item.price || 0).toLocaleString()} × {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="p-4 text-center text-xs text-zinc-500">No item details recorded.</p>
                )}
              </div>
            </div>

            <div className="p-4 rounded-sm bg-zinc-900/60 border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span>৳{Number(selectedOrder.totals?.subtotal ?? selectedOrder.subtotal ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping / Delivery Fee</span>
                <span>৳{Number(selectedOrder.totals?.shippingFee ?? selectedOrder.shippingFee ?? 0).toLocaleString()}</span>
              </div>
              {Number(selectedOrder.totals?.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount</span>
                  <span>-৳{Number(selectedOrder.totals?.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white border-t border-white/10 pt-2">
                <span>Grand Total</span>
                <span className="text-gold">৳{Number(selectedOrder.totals?.total ?? selectedOrder.total ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={(e) => handleOpenInvoice(selectedOrder._id || selectedOrder.id, e)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-sm bg-gold px-6 py-2.5 text-xs font-bold uppercase tracking-[0.25em] text-black hover:bg-gold/90 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Print / View Invoice</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto rounded-sm border border-white/10 bg-zinc-900/60 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-zinc-300 hover:text-white transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
