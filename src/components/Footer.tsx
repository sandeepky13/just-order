import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 py-8 mt-auto flex-none">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div className="flex flex-col gap-3">
          <div className="text-xl font-bold tracking-tighter text-blue-500">JUST ORDER</div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Premium, production-ready, full-stack shopping portal with live analytical tracking. Handcrafted with an elegant dark interface for seamless modern commerce.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="p-1.5 bg-zinc-900 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-zinc-900 hover:bg-blue-400 hover:text-white rounded-full transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-zinc-900 hover:bg-pink-600 hover:text-white rounded-full transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-1.5 bg-zinc-900 hover:bg-blue-700 hover:text-white rounded-full transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Press & Media</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-4">Support</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Return & Refund Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-3 text-xs">
          <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider mb-1">Contact Us</h4>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            <span>+91 1111111111</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>support@justorder.com</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-4.5 h-4.5 text-blue-500 shrink-0" />
            <span>Noida, Sector 62, Plot No. A-151, India</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 pt-6 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-600 gap-4 uppercase tracking-wider">
        <span>© 2026 Just Order - Production Environment.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
          <span className="text-zinc-700">© 2024 Just Order - Noida, Sector 62</span>
        </div>
      </div>
    </footer>
  );
}
