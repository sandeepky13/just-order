import { useState } from 'react';
import { ShoppingCart, Heart, Search, User as UserIcon, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: User | null;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onLogout: () => void;
  cartCount: number;
  wishlistCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setSelectedCategory: (cat: string | null) => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout,
  cartCount,
  wishlistCount,
  activeTab,
  setActiveTab,
  setSelectedCategory
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogoClick = () => {
    setActiveTab('home');
    setSelectedCategory(null);
    setSearchQuery('');
  };

  const handleCategoriesClick = () => {
    setActiveTab('home');
    setSelectedCategory(null);
  };

  return (
    <header className="h-16 flex-none border-b border-zinc-800 glass sticky top-0 z-50 px-6 flex items-center justify-between bg-zinc-950/80">
      {/* Brand Logo and Links */}
      <div className="flex items-center gap-8">
        <div 
          onClick={handleLogoClick}
          className="text-2xl font-bold tracking-tighter text-blue-500 cursor-pointer hover:opacity-90 select-none"
          id="logo"
        >
          JUST ORDER
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button 
            onClick={handleLogoClick}
            className={`cursor-pointer transition-colors ${activeTab === 'home' && searchQuery === '' ? 'text-white' : 'hover:text-white'}`}
          >
            Home
          </button>
          <button 
            onClick={handleCategoriesClick}
            className={`cursor-pointer transition-colors hover:text-white`}
          >
            Categories
          </button>
        </nav>
      </div>

      {/* Real-time Search Bar */}
      <div className="flex-1 max-w-md mx-4 md:mx-8">
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products in real time..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            id="search-input"
          />
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-zinc-500" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2 text-xs text-zinc-400 hover:text-white bg-zinc-800 rounded-full px-1.5 py-0.5"
            >
              clear
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons, Cart, Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Wishlist Button */}
        <button 
          onClick={() => setActiveTab('wishlist')}
          className="p-2 hover:bg-zinc-800 rounded-full relative text-zinc-400 hover:text-white transition-colors cursor-pointer"
          id="wishlist-btn"
          title="Wishlist"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-bold animate-pulse">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart Button */}
        <button 
          onClick={() => setActiveTab('cart')}
          className="p-2 hover:bg-zinc-800 rounded-full relative text-zinc-400 hover:text-white transition-colors cursor-pointer"
          id="cart-btn"
          title="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 bg-blue-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-bold">
              {cartCount}
            </span>
          )}
        </button>

        <div className="h-8 w-[1px] bg-zinc-800 mx-1"></div>

        {currentUser ? (
          /* Logged In User Dropdown */
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer text-sm font-medium"
              id="profile-dropdown-btn"
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-6 h-6 rounded-full bg-zinc-800" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-4 h-4" />
              )}
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.fullName.split(' ')[0]}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-zinc-800">
                  <p className="text-xs text-zinc-500">Signed in as</p>
                  <p className="text-sm font-semibold text-white truncate">{currentUser.fullName}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{currentUser.email}</p>
                </div>
                
                <button 
                  onClick={() => { setActiveTab('profile'); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left transition-colors cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  My Profile
                </button>

                {currentUser.email === 'admin@justorder.com' && (
                  <button 
                    onClick={() => { setActiveTab('admin'); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white text-left transition-colors cursor-pointer font-medium"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    Admin Dashboard
                  </button>
                )}

                <button 
                  onClick={() => { onLogout(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 text-left transition-colors cursor-pointer border-t border-zinc-800 mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Sign In / Sign Up Buttons */
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onOpenAuth('login')}
              className="text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition-colors cursor-pointer"
              id="signin-btn"
            >
              Sign In
            </button>
            <button 
              onClick={() => onOpenAuth('register')}
              className="text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
              id="signup-btn"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
