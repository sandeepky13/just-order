import React, { useEffect, useState } from "react";
import { 
  ShoppingBag, Heart, Star, ShoppingCart, Tag, Check, AlertCircle, 
  MapPin, Phone, Mail, Calendar, Trash2, Plus, Minus, ArrowRight,
  User, CheckCircle2, Award, Settings, ShieldCheck, RefreshCw, X, ChevronRight
} from "lucide-react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./components/AdminDashboard";
import { Product, CartItem, WishlistItem, Order } from "./types";

// Toasts interface
interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// Categories definitions with beautiful unsplash tags for presentation cards
const CATEGORIES_CATALOG = [
  { name: "Electronics", count: 42, icon: "💻", slug: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400" },
  { name: "Mobiles", count: 35, icon: "📱", slug: "mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400" },
  { name: "Laptops", count: 28, icon: "💻", slug: "laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400" },
  { name: "Accessories", count: 19, icon: "⌨️", slug: "accessories", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=400" },
  { name: "T-Shirts", count: 54, icon: "👕", slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400" },
  { name: "Shirts", count: 48, icon: "👔", slug: "shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400" },
  { name: "Footwear", count: 32, icon: "👟", slug: "footwear", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=400" },
  { name: "Shoes", count: 21, icon: "👟", slug: "shoes", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=400" },
  { name: "Watches", count: 14, icon: "⌚", slug: "watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400" },
  { name: "Fashion", count: 62, icon: "🕶️", slug: "fashion", image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=400" },
  { name: "Home Appliances", count: 18, icon: "🏠", slug: "home-appliances", image: "https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80&w=400" },
  { name: "Kitchen", count: 25, icon: "🍳", slug: "kitchen", image: "https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=400" },
  { name: "Beauty", count: 80, icon: "💄", slug: "beauty", image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=400" },
  { name: "Books", count: 110, icon: "📚", slug: "books", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400" },
  { name: "Sports", count: 45, icon: "⚽", slug: "sports", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=400" },
  { name: "Furniture", count: 15, icon: "🪑", slug: "furniture", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400" }
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("just_order_token"));
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Search & Filters state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [activePage, setActivePage] = useState<string>("home"); // home | categories | wishlist | cart | checkout | profile | admin | detail
  
  // Modals & Forms
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Address variables for checkout overrides
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutState, setCheckoutState] = useState("Delhi");

  // Show customized toast notice
  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Fetch Products in Real Time with search query
  const loadProducts = async (search = searchKeyword, category = activeCategory) => {
    setLoadingProducts(true);
    try {
      const url = `/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to search products");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      showToast(err.message || "Error retrieving products catalog", "error");
    } finally {
      setLoadingProducts(false);
    }
  };

  // Synchronize authenticated state
  const syncProfile = async (authToken = token) => {
    if (!authToken) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setCart(data.cart || []);
        setWishlist(data.wishlist || []);
        setOrders(data.orders || []);
        setCheckoutAddress(data.user.address || "");
        setCheckoutState(data.user.state || "Delhi");
      } else {
        // Token expired or invalid
        handleLogout();
      }
    } catch (e) {
      console.error("Authentication sync failed", e);
    }
  };

  useEffect(() => {
    loadProducts();
    if (token) {
      syncProfile(token);
    }
    // Track initial page visit
    trackPageVisit("/");
  }, []);

  // Track search changes in real time
  const handleSearchChange = (keyword: string) => {
    setSearchKeyword(keyword);
    // Debounce/fire immediately for smooth typing feel
    loadProducts(keyword, activeCategory);
    if (activePage !== "home") {
      setActivePage("home");
    }
  };

  const handleCategorySelect = (categoryName: string | null) => {
    const cat = (!categoryName || categoryName === "All") ? "" : categoryName;
    setActiveCategory(cat);
    setActivePage("home");
    loadProducts(searchKeyword, cat);
    showToast(`Filtering category: ${categoryName || "All Products"}`, "info");
  };

  const handleAuthSuccess = (newToken: string, loggedUser: any) => {
    localStorage.setItem("just_order_token", newToken);
    setToken(newToken);
    setUser(loggedUser);
    syncProfile(newToken);
    showToast(`Successfully logged in as ${loggedUser.fullName}!`);
  };

  const handleLogout = async () => {
    if (token) {
      // Log logout behaviour
      try {
        await fetch("/api/analytics/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventType: "Logout" })
        });
      } catch (e) {}
    }
    localStorage.removeItem("just_order_token");
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    showToast("Successfully logged out. Visit again!", "info");
    setActivePage("home");
  };

  // Click & Navigation Tracking Helpers
  const trackClick = async (productId: string, productName: string, category: string, buttonClicked: string) => {
    try {
      await fetch("/api/analytics/click", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ productId, productName, category, buttonClicked, pageUrl: `/${activePage}` })
      });
    } catch (e) {}
  };

  const trackPageVisit = async (pageUrl: string) => {
    try {
      await fetch("/api/analytics/page-visit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ pageUrl })
      });
    } catch (e) {}
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    trackPageVisit(`/${page}`);
    // Clear product details on return
    if (page !== "detail") setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewProductDetails = async (product: Product) => {
    setSelectedProduct(product);
    handleNavigate("detail");
    // Explicit detail trigger fetches single product with detailed log tracking
    try {
      const res = await fetch(`/api/products/${product.id}`);
      if (!res.ok) throw new Error("Failed to load details");
      const detailed = await res.json();
      setSelectedProduct(detailed);
    } catch (e) {}
  };

  // --- Cart System Actions ---

  const handleAddToCart = async (product: Product, quantity = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Explicit behavioral tracking before auth check
    trackClick(product.id, product.name, product.category, "Add to Cart");

    if (!user) {
      setAuthMode("signin");
      setIsAuthOpen(true);
      showToast("Please sign in or register to manage your shopping cart.", "info");
      return;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id, quantity })
      });

      if (!res.ok) throw new Error("Could not add item to cart");
      const newItem = await res.json();
      
      // Refresh local cart
      syncProfile();
      showToast(`Added ${quantity}x ${product.name} to your cart.`);
    } catch (err: any) {
      showToast(err.message || "Failed to modify cart", "error");
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      const res = await fetch(`/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to remove item");
      syncProfile();
      showToast("Item removed from your cart.", "info");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateCartQuantity = async (cartItem: CartItem, delta: number) => {
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      handleRemoveFromCart(cartItem.id);
      return;
    }

    try {
      const res = await fetch(`/api/cart/${cartItem.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQty })
      });
      if (!res.ok) throw new Error("Failed to update item quantity");
      syncProfile();
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleClearCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      syncProfile();
      showToast("Your shopping cart has been cleared.", "info");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // --- Wishlist System Actions ---

  const handleToggleWishlist = async (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    trackClick(product.id, product.name, product.category, "Toggle Wishlist");

    if (!user) {
      setAuthMode("signin");
      setIsAuthOpen(true);
      showToast("Please login to save custom item wishlists.", "info");
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });
      if (!res.ok) throw new Error("Failed to toggle wishlist item");
      const data = await res.json();
      syncProfile();
      showToast(data.message);
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  // --- Checkout Processing ---

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Your cart is currently empty", "error");
      return;
    }

    if (!checkoutAddress.trim()) {
      showToast("Shipping Address is required to complete purchase", "error");
      return;
    }

    const cartTotal = cart.reduce((sum, item) => {
      const itemPrice = item.product ? item.product.price * (1 - (item.product.discount / 100)) : 0;
      return sum + (itemPrice * item.quantity);
    }, 0);

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.product?.name || "Product Name",
      price: item.product ? item.product.price * (1 - (item.product.discount / 100)) : 0,
      quantity: item.quantity
    }));

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          amount: cartTotal
        })
      });

      if (!res.ok) throw new Error("Database transaction rejected checkout");
      const data = await res.json();
      
      syncProfile();
      showToast("Order Placed Successfully! Instant digital invoice generated.");
      handleNavigate("profile");
    } catch (err: any) {
      showToast(err.message || "Failed to process checkout", "error");
    }
  };

  // --- Order Returns / Cancel Actions ---

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Cancellation request failed");
      syncProfile();
      showToast("Your order has been cancelled successfully.", "info");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Return registration failed");
      syncProfile();
      showToast("Return request submitted for processing.", "info");
    } catch (err: any) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* Dynamic Floating Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm">
        {toasts.map((t) => (
          <div 
            key={t.id} 
            className={`p-4 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs border font-sans animate-slide-up ${
              t.type === "error" 
                ? "bg-red-950/90 border-red-900/50 text-red-200" 
                : t.type === "info"
                  ? "bg-zinc-950/90 border-zinc-800 text-blue-400"
                  : "bg-zinc-950/90 border-zinc-800 text-green-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              )}
              <span>{t.message}</span>
            </div>
            <button 
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-zinc-600 hover:text-white transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Header component */}
      <Header 
        searchQuery={searchKeyword}
        setSearchQuery={handleSearchChange}
        currentUser={user}
        onOpenAuth={(mode) => {
          setAuthMode(mode === "login" ? "signin" : "signup");
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        cartCount={cart.reduce((total, item) => total + item.quantity, 0)}
        wishlistCount={wishlist.length}
        activeTab={activePage}
        setActiveTab={handleNavigate}
        setSelectedCategory={handleCategorySelect}
      />

      {/* Hero Banner (Only shown on Home tab and when no active category/search is filtering) */}
      {activePage === "home" && !activeCategory && !searchKeyword && (
        <section className="relative bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-900 overflow-hidden py-14 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 md:space-y-5">
              <span className="inline-block text-[10px] uppercase tracking-widest font-bold bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/15">
                Modern E-Commerce Engine
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                SELECT. TAP.<br/>
                <span className="text-blue-500 uppercase">JUST ORDER.</span>
              </h1>
              <p className="text-xs md:text-sm text-zinc-400 max-w-md leading-relaxed">
                Unlock instant full-stack checkout, real-time telemetry metrics, and high-performance product sorting under an Elegant Dark framework.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleCategorySelect("All")}
                  className="bg-blue-600 hover:bg-blue-500 transition text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleNavigate("admin")}
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Live Metrics</span>
                </button>
              </div>
            </div>

            <div className="relative hidden md:flex items-center justify-center">
              {/* Floating aesthetic stat widget */}
              <div className="absolute -top-3 -left-3 bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-3.5 shadow-2xl animate-bounce-slow flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                <div className="text-[10px] font-mono">
                  <div className="text-zinc-500 uppercase">TELEMETRY</div>
                  <div className="font-bold text-white mt-0.5">3.82% Conv. Rate</div>
                </div>
              </div>
              
              <img 
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600" 
                alt="Product Banner" 
                className="w-full max-w-sm rounded-2xl border border-zinc-800 shadow-2xl"
              />
            </div>
          </div>
        </section>
      )}

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">

        {/* Sidebar categories select list (only shown on home & categories screen) */}
        {(activePage === "home" || activePage === "categories") && (
          <aside className="w-full md:w-56 flex-none space-y-4">
            <div className="bg-zinc-900/10 border border-zinc-800/60 rounded-xl p-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">Categories</div>
              <ul className="space-y-1">
                <li 
                  onClick={() => handleCategorySelect("All")}
                  className={`px-3 py-2 text-xs rounded-lg cursor-pointer transition flex items-center justify-between ${
                    !activeCategory ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>All Catalog</span>
                  <span className="font-mono text-[9px] opacity-60">16</span>
                </li>
                {CATEGORIES_CATALOG.map((cat) => (
                  <li 
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.name)}
                    className={`px-3 py-2 text-xs rounded-lg cursor-pointer transition flex items-center justify-between ${
                      activeCategory === cat.name ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 font-semibold" : "hover:bg-zinc-900 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                    <span className="font-mono text-[9px] text-zinc-600">{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Live stats sidebar widget */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3.5 hidden md:block">
              <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>Active Terminal</span>
              </div>
              <div className="space-y-2.5">
                <div className="text-xs">
                  <div className="text-zinc-600 text-[9px] font-mono">POSTGRES CONNECTION</div>
                  <div className="text-zinc-300 font-semibold mt-0.5 font-mono">Dual-Mode Online</div>
                </div>
                <div className="text-xs">
                  <div className="text-zinc-600 text-[9px] font-mono">SUPPORT DESK</div>
                  <div className="text-zinc-300 mt-0.5">+91 1111111111</div>
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Dynamic Center Stage Content */}
        <section className="flex-1">

          {/* HOME PAGE: Products Catalog Grid */}
          {activePage === "home" && (
            <div className="space-y-6">
              
              {/* Header block with count */}
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    {activeCategory || "Featured Products"}
                    {searchKeyword && <span className="text-xs font-normal text-zinc-500">for search "{searchKeyword}"</span>}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Click any product card to see live analytics and instant details</p>
                </div>
                <span className="text-xs text-zinc-400 font-semibold bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                  {products.length} Products Found
                </span>
              </div>

              {loadingProducts ? (
                <div className="text-center py-20 text-zinc-500 space-y-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs font-mono">Scanning PostgreSQL indexes...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/20">
                  <ShoppingBag className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                  <p className="text-white font-semibold">No matching products found</p>
                  <p className="text-xs text-zinc-500 mt-1">Try resetting search string or selecting another category.</p>
                  <button 
                    onClick={() => { setSearchKeyword(""); setActiveCategory(""); loadProducts("", ""); }}
                    className="mt-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                  >
                    Reset Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((prod) => {
                    const discountedPrice = prod.price * (1 - (prod.discount / 100));
                    return (
                      <div 
                        key={prod.id}
                        onClick={() => handleViewProductDetails(prod)}
                        className="bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-4 flex flex-col group cursor-pointer transition-all shadow-md relative"
                      >
                        {/* Image section */}
                        <div className="h-44 bg-zinc-900 rounded-xl mb-4 overflow-hidden relative flex items-center justify-center">
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {prod.discount > 0 && (
                            <span className="absolute top-2.5 left-2.5 bg-blue-600 text-[10px] text-white font-bold px-2 py-0.5 rounded-full shadow-lg">
                              {prod.discount}% OFF
                            </span>
                          )}
                          <button
                            onClick={(e) => handleToggleWishlist(prod, e)}
                            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full border border-zinc-800 backdrop-blur-md transition cursor-pointer ${
                              wishlist.some(w => w.productId === prod.id)
                                ? "bg-red-500 border-red-400 text-white"
                                : "bg-zinc-950/80 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <Heart className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>

                        {/* Text and Stock info */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition truncate">{prod.name}</h3>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                            prod.stockStatus === "In Stock" 
                              ? "bg-green-500/10 text-green-400" 
                              : "bg-amber-500/10 text-amber-400"
                          }`}>
                            {prod.stockStatus}
                          </span>
                        </div>
                        
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">{prod.description}</p>

                        {/* Price segment */}
                        <div className="flex items-baseline gap-2 mb-4 mt-auto">
                          <span className="text-base font-black text-white">${discountedPrice.toFixed(2)}</span>
                          {prod.discount > 0 && (
                            <span className="text-xs text-zinc-600 line-through">${prod.price}</span>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(prod, 1);
                            }}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(prod, 1);
                              handleNavigate("cart");
                            }}
                            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES GRID OVERVIEW VIEW */}
          {activePage === "categories" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-xl font-bold text-white tracking-tight">E-Commerce Categories Catalog</h2>
                <p className="text-xs text-zinc-500 mt-1">Browse and filter beautiful product subsets in real-time</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES_CATALOG.map((cat) => (
                  <div 
                    key={cat.slug}
                    onClick={() => handleCategorySelect(cat.name)}
                    className="bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl p-3 cursor-pointer group transition-all"
                  >
                    <div className="h-28 rounded-xl bg-zinc-900 overflow-hidden mb-3 relative">
                      <img 
                        src={cat.image} 
                        alt={cat.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-zinc-950/80 text-sm p-1.5 rounded-lg">
                        {cat.icon}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs tracking-wide">{cat.name}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{cat.count} Items</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCT DETAIL VIEW SCREEN */}
          {activePage === "detail" && selectedProduct && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <button 
                onClick={() => handleNavigate("home")}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2 font-mono cursor-pointer"
              >
                ← Back to catalog products
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl">
                
                {/* Visual */}
                <div className="bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full max-h-96 object-cover" />
                  {selectedProduct.discount > 0 && (
                    <span className="absolute top-4 left-4 bg-blue-600 text-xs text-white font-bold px-3 py-1 rounded-full shadow-lg">
                      {selectedProduct.discount}% discount
                    </span>
                  )}
                </div>

                {/* Details text */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{selectedProduct.brand}</span>
                      <span className="text-xs bg-zinc-900 text-zinc-400 px-3 py-1 rounded-full font-mono">{selectedProduct.category}</span>
                    </div>
                    <h1 className="text-2xl font-black text-white">{selectedProduct.name}</h1>
                    
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold">{selectedProduct.rating}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500 font-mono">Product ID: {selectedProduct.id}</span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-2">{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-zinc-900">
                    <div className="flex items-baseline gap-3">
                      <span className="text-2xl font-black text-white">
                        ${(selectedProduct.price * (1 - (selectedProduct.discount / 100))).toFixed(2)}
                      </span>
                      {selectedProduct.discount > 0 && (
                        <span className="text-sm text-zinc-600 line-through">${selectedProduct.price}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs text-zinc-500 block">Stock Availability:</span>
                      <span className={`text-xs font-bold ${selectedProduct.stockStatus === "In Stock" ? "text-green-400" : "text-amber-400"}`}>
                        {selectedProduct.stockStatus} ({selectedProduct.stockCount} items remaining)
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleAddToCart(selectedProduct, 1)}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add To Cart</span>
                      </button>
                      <button 
                        onClick={() => handleToggleWishlist(selectedProduct)}
                        className="px-4 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition cursor-pointer"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* WISHLIST VIEW SCREEN */}
          {activePage === "wishlist" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-lg font-bold text-white tracking-tight">My Wishlist Catalog</h2>
                <p className="text-xs text-zinc-500 mt-1">Keep track of items you want to buy later</p>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
                  <Heart className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                  <p className="text-zinc-400 font-semibold text-sm">Your Wishlist is currently empty</p>
                  <p className="text-xs text-zinc-600 mt-1">Tap the heart icons on product panels to save products here.</p>
                  <button onClick={() => handleNavigate("home")} className="mt-4 bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer">Discover Products</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {wishlist.map((item) => {
                    const prod = item.product;
                    if (!prod) return null;
                    return (
                      <div key={item.id} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 flex flex-col relative">
                        <img src={prod.imageUrl} alt={prod.name} className="h-36 w-full object-cover rounded-lg mb-3" />
                        <h3 className="font-bold text-white text-xs truncate mb-1">{prod.name}</h3>
                        <div className="text-xs font-black text-white mb-3">${prod.price}</div>
                        <div className="flex gap-2 mt-auto">
                          <button 
                            onClick={() => handleAddToCart(prod, 1)}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add to Cart</span>
                          </button>
                          <button 
                            onClick={() => handleToggleWishlist(prod)}
                            className="p-2 border border-zinc-800 text-red-400 hover:bg-red-950/20 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* SHOPPING CART VIEW SCREEN */}
          {activePage === "cart" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-900 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Your Shopping Cart</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">Manage items before proceeding to transactional checkout</p>
                </div>
                {cart.length > 0 && (
                  <button 
                    onClick={handleClearCart}
                    className="text-zinc-500 hover:text-red-400 text-xs flex items-center gap-1 font-semibold border border-zinc-900 hover:border-red-900/40 px-3 py-1 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
                  <ShoppingCart className="w-12 h-12 text-zinc-800 mx-auto mb-3" />
                  <p className="text-zinc-400 font-semibold text-sm font-sans">Your Shopping Cart is empty</p>
                  <p className="text-xs text-zinc-600 mt-1">Explore our product catalogs to add e-commerce items.</p>
                  <button onClick={() => handleNavigate("home")} className="mt-4 bg-blue-600 text-white text-xs px-4 py-2 rounded-xl font-bold cursor-pointer">Start Shopping</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Cart Items List */}
                  <div className="lg:col-span-2 space-y-3">
                    {cart.map((item) => {
                      const prod = item.product;
                      if (!prod) return null;
                      const discounted = prod.price * (1 - (prod.discount / 100));
                      return (
                        <div key={item.id} className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-xl flex items-center justify-between gap-4 font-sans">
                          <img src={prod.imageUrl} alt={prod.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-xs truncate">{prod.name}</h3>
                            <p className="text-[10px] text-zinc-500 mt-0.5">{prod.brand} • {prod.category}</p>
                            <div className="text-xs font-bold text-white mt-1">
                              ${discounted.toFixed(2)} 
                              {prod.discount > 0 && <span className="text-[10px] text-zinc-600 line-through ml-1.5">${prod.price}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateCartQuantity(item, -1)}
                              className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateCartQuantity(item, 1)}
                              className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button 
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="p-2 text-zinc-600 hover:text-red-400 transition cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary checkout drawer card */}
                  <div className="bg-zinc-950 border border-zinc-900 p-5 rounded-2xl flex flex-col h-fit space-y-4">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider border-b border-zinc-900 pb-2.5">
                      Order Summary
                    </h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between text-zinc-400">
                        <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                        <span className="font-mono">
                          ${cart.reduce((sum, item) => {
                            const p = item.product ? item.product.price * (1 - (item.product.discount / 100)) : 0;
                            return sum + (p * item.quantity);
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Shipping Delivery</span>
                        <span className="text-green-500 font-semibold uppercase text-[10px]">FREE</span>
                      </div>
                      <div className="flex justify-between text-zinc-400">
                        <span>Estimated Taxes</span>
                        <span className="font-mono">$0.00</span>
                      </div>
                      <div className="border-t border-zinc-900 pt-3 flex justify-between font-bold text-white text-sm">
                        <span>Estimated Total</span>
                        <span className="text-blue-500 font-mono">
                          ${cart.reduce((sum, item) => {
                            const p = item.product ? item.product.price * (1 - (item.product.discount / 100)) : 0;
                            return sum + (p * item.quantity);
                          }, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleNavigate("checkout")}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CHECKOUT BILLING PROCESS SCREEN */}
          {activePage === "checkout" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-lg font-bold text-white tracking-tight">Transactional Checkout</h2>
                <p className="text-xs text-zinc-500 mt-1">Submit shipping coordinates to authorize and log PostgreSQL orders</p>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl space-y-5">
                
                {/* Items preview scroll */}
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-zinc-400 block">Reviewing Items ({cart.length})</span>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-xs py-1 border-b border-zinc-900/40">
                        <span className="text-zinc-300 truncate max-w-xs">{item.product?.name} x {item.quantity}</span>
                        <span className="text-white font-mono">${((item.product ? item.product.price * (1 - (item.product.discount / 100)) : 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Recipient Contact Name</label>
                    <input 
                      type="text" 
                      required
                      readOnly
                      value={user?.fullName || ""}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 px-4 text-xs text-zinc-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Contact Number</label>
                    <input 
                      type="tel" 
                      required
                      readOnly
                      value={user?.mobile || ""}
                      className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 px-4 text-xs text-zinc-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Shipping complete address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-400">Complete Shipping Address</label>
                  <textarea 
                    rows={3}
                    required
                    placeholder="Enter complete shipping coordinates..."
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">State Location</label>
                    <select
                      value={checkoutState}
                      onChange={(e) => setCheckoutState(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-4 text-xs text-white focus:outline-none focus:ring-1"
                    >
                      <option value="Delhi">Delhi</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400">Payment Configuration</label>
                    <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2.5 rounded-xl text-xs text-blue-400 font-mono font-semibold text-center">
                      🔐 Cash on Delivery / Card Auth
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Invoice Payable</div>
                    <div className="text-xl font-bold text-white font-mono">
                      ${cart.reduce((sum, item) => {
                        const p = item.product ? item.product.price * (1 - (item.product.discount / 100)) : 0;
                        return sum + (p * item.quantity);
                      }, 0).toFixed(2)}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition text-xs shadow-lg cursor-pointer"
                  >
                    Authorize Order & Purchase
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* USER PROFILE & ORDER HISTORY SCREEN */}
          {activePage === "profile" && (
            <div className="space-y-8">
              
              {/* Profile Card Header */}
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-5 justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 text-white text-xl font-black rounded-full flex items-center justify-center">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">{user?.fullName}</h2>
                    <p className="text-xs text-zinc-500">{user?.email} • {user?.mobile}</p>
                    <span className="inline-block bg-blue-500/10 text-blue-400 border border-blue-500/15 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full mt-1.5 uppercase">
                      Active Customer
                    </span>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 font-mono space-y-1 md:text-right">
                  <div>Joined on: {user ? new Date(user.createdAt).toLocaleDateString() : ""}</div>
                  <div>Default address: {user?.address}</div>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <div className="border-b border-zinc-900 pb-2">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Previous Transaction History ({orders.length})</h3>
                  <p className="text-[11px] text-zinc-500">History of checkouts processed under this user identifier</p>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-14 bg-zinc-950/20 border border-zinc-900 rounded-xl text-zinc-500">
                    No orders registered yet. Start purchasing items from our catalog!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="bg-zinc-950/50 border border-zinc-900 p-4 rounded-xl space-y-3.5">
                        <div className="flex flex-col md:flex-row justify-between border-b border-zinc-900/60 pb-2.5 gap-2 text-xs">
                          <div className="font-mono">
                            <span className="text-zinc-500">ORDER ID:</span> <span className="text-zinc-300 font-semibold">{ord.id}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px]">
                            <span className="text-zinc-500">{new Date(ord.orderDate).toLocaleDateString()}</span>
                            <span className="text-white font-mono font-bold">${ord.amount.toFixed(2)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                              ord.orderStatus === "Successful" 
                                ? "bg-green-500/10 text-green-400" 
                                : ord.orderStatus === "Cancelled"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-amber-500/10 text-amber-400"
                            }`}>
                              {ord.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* Order items bullet list */}
                        <div className="space-y-1.5">
                          {ord.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-xs text-zinc-400">
                              <span>{item.name} <span className="text-zinc-600 font-mono">x{item.quantity}</span></span>
                              <span className="font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Return/Cancel control triggers */}
                        {ord.orderStatus === "Successful" && (
                          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-900/40">
                            <button 
                              onClick={() => handleCancelOrder(ord.id)}
                              className="bg-zinc-900 hover:bg-red-950/20 text-zinc-400 hover:text-red-400 text-[10px] font-bold px-3 py-1 rounded transition cursor-pointer"
                            >
                              Request Cancellation
                            </button>
                            <button 
                              onClick={() => handleReturnOrder(ord.id)}
                              className="bg-zinc-900 hover:bg-blue-950/20 text-zinc-400 hover:text-blue-400 text-[10px] font-bold px-3 py-1 rounded transition cursor-pointer"
                            >
                              Register Product Return
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ADMIN DASHBOARD COMPONENT TAB */}
          {activePage === "admin" && (
            <AdminDashboard />
          )}

        </section>

      </main>

      {/* Footer component */}
      <Footer />

      {/* Auth Modal Trigger */}
      <AuthModal 
        isOpen={isAuthOpen}
        initialTab={authMode === "signin" ? "login" : "register"}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

    </div>
  );
}
