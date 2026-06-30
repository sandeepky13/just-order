import { Star, ShoppingCart, CreditCard, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  isWishlisted: boolean;
  onProductClick: (productId: string, buttonName: string) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  isWishlisted,
  onProductClick
}: ProductCardProps) {
  
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleAction = (buttonName: string, callback: () => void) => {
    onProductClick(product.id, buttonName);
    callback();
  };

  return (
    <div 
      onClick={() => handleAction('Card Click', () => {})}
      className="stat-card bg-zinc-900/40 rounded-xl p-4 flex flex-col hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300 relative group"
    >
      {/* Wishlist Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleAction('Add to Wishlist', () => onToggleWishlist(product.id));
        }}
        className={`absolute top-6 right-6 p-2 rounded-full border border-zinc-800 transition-colors z-10 cursor-pointer ${
          isWishlisted 
            ? 'bg-red-950/40 border-red-900/60 text-red-500' 
            : 'bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
        }`}
        title="Add to Wishlist"
      >
        <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </button>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <span className="absolute top-6 left-6 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10">
          {product.discount}% OFF
        </span>
      )}

      {/* Product Image */}
      <div className="h-44 bg-zinc-950 rounded-lg mb-4 flex items-center justify-center overflow-hidden border border-zinc-900">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Category & Brand */}
      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
        <span>{product.brand}</span>
        <span>{product.category}</span>
      </div>

      {/* Product Name */}
      <h3 className="font-semibold text-zinc-100 text-base mb-1 line-clamp-1 group-hover:text-white">{product.name}</h3>

      {/* Description */}
      <p className="text-zinc-500 text-xs mb-3 line-clamp-2 h-8 leading-normal">{product.description}</p>

      {/* Rating & Stock Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span className="text-xs font-semibold text-zinc-300">{product.rating}</span>
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded ${
          product.stockStatus === 'In Stock' 
            ? 'text-green-500 bg-green-950/20' 
            : product.stockStatus === 'Low Stock' 
            ? 'text-yellow-500 bg-yellow-950/20 animate-pulse' 
            : 'text-zinc-600 bg-zinc-950/40'
        }`}>
          {product.stockStatus}
        </span>
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-lg font-bold text-white">${discountedPrice.toFixed(2)}</span>
        {product.discount > 0 && (
          <span className="text-xs text-zinc-500 line-through">${product.price.toFixed(2)}</span>
        )}
      </div>

      {/* Bottom Product Info */}
      <div className="text-[10px] text-zinc-600 font-mono mb-4">
        ID: {product.id}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleAction('Add to Cart', () => onAddToCart(product.id));
          }}
          disabled={product.stockStatus === 'Out of Stock'}
          className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:hover:bg-zinc-800 text-zinc-200 py-2 px-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleAction('Buy Now', () => onBuyNow(product.id));
          }}
          disabled={product.stockStatus === 'Out of Stock'}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white py-2 px-1 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
}
