import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQty: (cartItemId: string, change: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export default function CartPage({
  cartItems,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onContinueShopping
}: CartPageProps) {
  
  // Calculate pricing metrics
  const totalOriginal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalDiscount = cartItems.reduce((sum, item) => {
    const discountedPrice = item.product.price * (1 - item.product.discount / 100);
    return sum + (item.product.price - discountedPrice) * item.quantity;
  }, 0);
  const finalTotal = totalOriginal - totalDiscount;

  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950/20 text-center">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-600 mb-4">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-200 mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore our premier categories and find something special.
        </p>
        <button 
          onClick={onContinueShopping}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-lg text-sm transition-all cursor-pointer"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-zinc-950/20">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <span>Shopping Cart ({cartItems.length} items)</span>
          </h2>
          <button 
            onClick={onClearCart}
            className="text-xs text-red-400 hover:text-red-300 hover:underline cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => {
              const discountedPrice = item.product.price * (1 - item.product.discount / 100);
              return (
                <div 
                  key={item.id}
                  className="stat-card bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl flex gap-4 hover:border-zinc-800 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-zinc-950 rounded-lg flex-none overflow-hidden border border-zinc-900 flex items-center justify-center">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="object-cover h-full w-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-sm text-zinc-200 truncate pr-4">{item.product.name}</h4>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{item.product.brand} • {item.product.category}</p>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-md">
                        <button 
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="p-1 hover:text-white text-zinc-500 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs text-zinc-100 font-mono font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="p-1 hover:text-white text-zinc-500 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Prices */}
                      <div className="text-right">
                        <p className="text-sm font-semibold text-zinc-100">${(discountedPrice * item.quantity).toFixed(2)}</p>
                        {item.product.discount > 0 && (
                          <p className="text-[10px] text-zinc-500 line-through">${(item.product.price * item.quantity).toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="stat-card bg-zinc-900/60 rounded-xl p-5 border border-zinc-850 h-fit space-y-4">
            <h3 className="font-semibold text-sm text-zinc-200 uppercase tracking-wider">Order Summary</h3>
            
            <div className="space-y-2 text-xs font-medium text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">${totalOriginal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-400">
                <span>Discount Saved</span>
                <span className="font-mono">-${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Delivery</span>
                <span className="font-mono">FREE</span>
              </div>
              <div className="h-[1px] bg-zinc-800 my-2"></div>
              <div className="flex justify-between text-sm font-bold text-zinc-100">
                <span>Estimated Total</span>
                <span className="font-mono text-blue-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md mt-4"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button 
              onClick={onContinueShopping}
              className="w-full text-xs text-zinc-400 hover:text-white text-center mt-2 hover:underline block cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
