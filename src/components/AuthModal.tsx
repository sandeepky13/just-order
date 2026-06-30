import { useState } from 'react';
import { User } from '../types';
import { DbMock } from '../dbMock';
import { X, Lock, Mail, Smartphone, User as UserIcon, MapPin } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab: 'login' | 'register';
  onAuthSuccess: (token: string, user: User) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialTab,
  onAuthSuccess
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regState, setRegState] = useState('Delhi');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Validation States
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('Please fill in all credential fields.');
      return;
    }

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: loginIdentifier, password: loginPassword })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        setSuccess('Login successful.');
        setTimeout(() => {
          onAuthSuccess(data.token, data.user);
          onClose();
          resetForms();
        }, 1000);
      } else {
        setError(data.error || 'Invalid Email/Mobile or Password.');
      }
    })
    .catch(() => setError('Server authentication offline.'));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Extensive Validation
    if (!regName.trim() || !regMobile.trim() || !regEmail.trim() || !regAddress.trim() || !regPassword || !regConfirmPassword) {
      setError('All registration fields are required.');
      return;
    }

    if (regMobile.length < 10 || !/^\d+$/.test(regMobile)) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Confirm Password does not match Password.');
      return;
    }

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: regName,
        mobile: regMobile,
        email: regEmail,
        address: regAddress,
        state: regState,
        password: regPassword
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        setSuccess('Account created! Please sign in with your password.');
        setTimeout(() => {
          setActiveTab('login');
          setLoginIdentifier(regEmail);
          setLoginPassword('');
          setError('');
        }, 1500);
      } else {
        setError(data.error || 'Failed to create account.');
      }
    })
    .catch(() => setError('Server authentication offline.'));
  };

  const resetForms = () => {
    setLoginIdentifier('');
    setLoginPassword('');
    setRegName('');
    setRegMobile('');
    setRegEmail('');
    setRegAddress('');
    setRegState('Delhi NCR');
    setRegPassword('');
    setRegConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-150">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-full hover:bg-zinc-850 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-zinc-800">
          <button 
            onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
            className={`flex-1 py-4 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'login' 
                ? 'text-white border-b-2 border-blue-500 bg-zinc-850/20' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
            className={`flex-1 py-4 text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'register' 
                ? 'text-white border-b-2 border-blue-500 bg-zinc-850/20' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Register Account
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Logo / Header Branding */}
          <div className="text-center">
            <h3 className="text-xl font-bold tracking-tight text-white">JUST ORDER</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Production-Grade Secure Gateway</p>
          </div>

          {/* Validation Feedback Messages */}
          {error && (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 text-xs py-2 px-3 rounded-lg font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-950/30 border border-green-900/50 text-green-400 text-xs py-2 px-3 rounded-lg font-medium">
              {success}
            </div>
          )}

          {activeTab === 'login' ? (
            /* Sign In Form */
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Email or Mobile Number</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="Enter email or mobile..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Password</label>
                <div className="relative">
                  <input 
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Lock className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer mt-2"
              >
                Sign In
              </button>
              
              <p className="text-[10px] text-zinc-500 text-center leading-relaxed mt-2">
                Simulated admin login: <span className="text-blue-400 font-mono">admin@justorder.com</span> / <span className="text-blue-400 font-mono">admin123</span>
              </p>
            </form>
          ) : (
            /* Register Account Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Full Name</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="E.g. Sandeep Singh"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Mobile Number</label>
                <div className="relative">
                  <input 
                    type="text"
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Smartphone className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Email Address</label>
                <div className="relative">
                  <input 
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="sandeep@gmail.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <Mail className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Shipping State</label>
                <select 
                  value={regState}
                  onChange={(e) => setRegState(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] text-zinc-400 font-medium">Complete Address</label>
                <div className="relative">
                  <textarea 
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    placeholder="Plot No. 15, Sector 15, Ghaziabad"
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                  <MapPin className="w-4 h-4 text-zinc-600 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-400 font-medium">Password</label>
                  <input 
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] text-zinc-400 font-medium">Confirm Password</label>
                  <input 
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-xs transition-colors cursor-pointer mt-2"
              >
                Register & Verify
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
