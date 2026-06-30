import { useState } from 'react';
import { User, Order } from '../types';
import { User as UserIcon, Mail, Phone, MapPin, Package, Calendar, Settings, ShieldCheck, LogOut } from 'lucide-react';

interface ProfilePageProps {
  currentUser: User;
  orders: Order[];
  onLogout: () => void;
  onUpdateAddress: (newAddress: string) => void;
}

export default function ProfilePage({
  currentUser,
  orders,
  onLogout,
  onUpdateAddress
}: ProfilePageProps) {
  const [addressInput, setAddressInput] = useState(currentUser.address);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'settings'>('orders');
  const [feedback, setFeedback] = useState('');

  // Filter orders specifically for this user
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAddress(addressInput);
    setIsEditing(false);
    setFeedback('Address updated successfully!');
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-zinc-950/20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header Banner */}
        <div className="stat-card bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-20 h-20 rounded-full border-2 border-blue-500 overflow-hidden bg-zinc-950 flex items-center justify-center relative flex-none">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt="Profile avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <UserIcon className="w-10 h-10 text-zinc-500" />
            )}
          </div>

          <div className="text-center md:text-left flex-1 space-y-1">
            <h2 className="text-xl font-bold text-zinc-100 flex items-center justify-center md:justify-start gap-2">
              <span>{currentUser.fullName}</span>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-900 px-2 py-0.5 rounded-full uppercase font-mono">
                Verified Customer
              </span>
            </h2>
            <p className="text-xs text-zinc-500 font-mono">Joined on {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            <p className="text-xs text-zinc-400 flex items-center justify-center md:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-600" />
              <span>{currentUser.address}</span>
            </p>
          </div>

          <div className="flex gap-2 flex-none w-full md:w-auto">
            <button 
              onClick={() => setActiveSubTab('orders')}
              className={`flex-1 md:flex-none text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                activeSubTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              Order History
            </button>
            <button 
              onClick={() => setActiveSubTab('settings')}
              className={`flex-1 md:flex-none text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                activeSubTab === 'settings' ? 'bg-blue-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              Account Settings
            </button>
          </div>
        </div>

        {/* Feedback banner */}
        {feedback && (
          <div className="bg-emerald-950/20 border border-emerald-900/50 text-emerald-400 text-xs py-2 px-4 rounded-lg text-center font-medium animate-pulse">
            {feedback}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Details Details Card (Left Column) */}
          <div className="stat-card bg-zinc-900/60 rounded-2xl p-5 border border-zinc-855 h-fit space-y-4">
            <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">Profile Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-zinc-500 font-medium">Email Address</p>
                  <p className="text-xs text-zinc-200 font-mono truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Mobile Number</p>
                  <p className="text-xs text-zinc-200 font-mono">{currentUser.mobile}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Account Status</p>
                  <p className="text-xs text-green-400 font-semibold font-mono">Active</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium">Default Delivery Address</p>
                  <p className="text-xs text-zinc-200 leading-relaxed">{currentUser.address}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/40 hover:text-red-300 text-xs font-semibold rounded-lg transition-all cursor-pointer mt-4"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout from App</span>
            </button>
          </div>

          {/* Sub-tab view contents (Right Columns) */}
          <div className="md:col-span-2">
            {activeSubTab === 'orders' ? (
              /* Order History View */
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-zinc-200 flex items-center gap-2">
                  <Package className="w-4.5 h-4.5 text-blue-500" />
                  <span>My Purchase History ({userOrders.length} orders)</span>
                </h3>

                {userOrders.length === 0 ? (
                  <div className="stat-card bg-zinc-900/20 rounded-2xl p-8 border border-zinc-900 text-center text-zinc-500 text-xs">
                    No orders found. Once you place an order, it will appear here in your purchase logs in real time.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userOrders.map(order => (
                      <div 
                        key={order.id}
                        className="stat-card bg-zinc-900/40 rounded-xl p-4 border border-zinc-850 hover:border-zinc-800 transition-colors space-y-3"
                      >
                        {/* Order Meta Header */}
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-800 pb-2 text-xs font-mono gap-1 text-zinc-400">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500">ID:</span>
                            <span className="text-white font-semibold">{order.id}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                            <span>{new Date(order.orderDate).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1 text-xs">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-zinc-300">
                              <span>{item.name} <span className="text-zinc-500 font-mono">x{item.quantity}</span></span>
                              <span className="font-mono text-zinc-400">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order Meta Footer */}
                        <div className="flex justify-between items-center pt-2 border-t border-zinc-850 text-xs font-mono">
                          <div className="flex gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.paymentStatus === 'Paid' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50' : 'bg-amber-950/40 text-amber-400 border border-amber-900/50'
                            }`}>
                              {order.paymentStatus}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              order.orderStatus === 'Successful' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/50' : 'bg-red-950/40 text-red-400 border border-red-900/50'
                            }`}>
                              {order.orderStatus}
                            </span>
                          </div>
                          <div className="text-zinc-100 font-bold">
                            Total: <span className="text-blue-400">${order.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Settings / Address Editing View */
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-zinc-200 flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5 text-blue-500" />
                  <span>Account Settings</span>
                </h3>

                <div className="stat-card bg-zinc-900/40 rounded-2xl p-5 border border-zinc-850 space-y-4">
                  <form onSubmit={handleAddressSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs text-zinc-500 font-medium mb-1">Update Delivery Address</label>
                      <textarea 
                        value={addressInput}
                        onChange={(e) => setAddressInput(e.target.value)}
                        placeholder="Provide your complete shipping address..." 
                        rows={3}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-md transition-all cursor-pointer"
                    >
                      Save New Address
                    </button>
                  </form>

                  <div className="h-[1px] bg-zinc-800 my-2"></div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-zinc-300">Security Credentials</h4>
                    <p className="text-zinc-500 text-[11px] leading-relaxed">
                      Passwords inside our production storage are securely salted and hashed using bcrypt. To update your secret password or enable dual-factor authentication, please contact security support.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
