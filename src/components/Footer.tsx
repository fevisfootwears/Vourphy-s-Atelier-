import { Instagram, Twitter, Facebook, ArrowRight, MessageSquare, Phone, X, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import TermsAndConditions from './TermsAndConditions';

export default function Footer() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <footer className="bg-brand-cream border-t border-brand-obsidian/5 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl md:text-3xl mb-6 italic">BECOME AN INSIDER</h3>
            <p className="text-brand-muted text-sm mb-8 max-w-sm">
              Receive private invitations to seasonal previews or join our artisan network as a professional marketer.
            </p>
            <div className="flex gap-4">
              <Link 
                to="/marketer-hub"
                className="btn-primary inline-flex items-center gap-3 text-[10px]"
              >
                JOIN THE CREATIVE NETWORK <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 opacity-40">COLLECTIONS</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li><a href="#collections" className="hover:text-brand-gold transition-colors">Digital Showroom</a></li>
              <li><a href="#artisan" className="hover:text-brand-gold transition-colors">The Master Artisan</a></li>
              <li><a href="#bespoke" className="hover:text-brand-gold transition-colors">Bespoke Inquiry</a></li>
              <li><a href="#journal" className="hover:text-brand-gold transition-colors">Atelier Journal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-8 opacity-40">ASSISTANCE</h4>
            <ul className="space-y-4 text-xs font-bold tracking-widest uppercase">
              <li><a href="#" className="hover:text-brand-gold transition-colors opacity-30">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors opacity-30">Size Guide</a></li>
              <li><a href="#" className="hover:text-brand-gold transition-colors opacity-30">Care Guide</a></li>
              <li><button onClick={() => setIsContactOpen(true)} className="hover:text-brand-gold transition-colors uppercase cursor-pointer">Contact Us</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-brand-obsidian/5 gap-8">
          <div className="flex items-center space-x-6">
            <a href="https://www.facebook.com/profile.php?id=61587756782612" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="https://wa.link/ojm98y" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1974" target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-brand-gold transition-colors">
              <svg 
                viewBox="0 0 24 24" 
                aria-hidden="true" 
                className="w-4 h-4 fill-current"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-xl font-bold tracking-[0.1em] leading-none mb-1 text-brand-gold italic">VOURPHY'S</h1>
            <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase">© 2026 VOURPHY'S ATELIER. ALL RIGHTS RESERVED.</p>
          </div>

          <div className="flex space-x-8 text-[10px] font-bold tracking-widest opacity-40 uppercase">
             <Link to="/entry" className="hover:text-brand-gold hover:opacity-100 transition-colors">Atelier Control</Link>
             <button onClick={() => setIsTermsOpen(true)} className="hover:opacity-100 transition-colors">Privacy & Terms</button>
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      {isContactOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-brand-obsidian/60 backdrop-blur-sm" onClick={() => setIsContactOpen(false)} />
          <div className="relative w-full max-w-sm bg-brand-cream p-12 border border-brand-gold/30 shadow-2xl">
            <button onClick={() => setIsContactOpen(false)} className="absolute top-4 right-4 p-2 opacity-20 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-brand-gold mx-auto mb-8 opacity-30" />
              <h2 className="text-3xl italic mb-6">Contact the Atelier</h2>
              <p className="text-[10px] tracking-widest uppercase opacity-40 mb-12">Choose your preferred channel for artisan consultation.</p>
              
              <div className="space-y-4">
                <a 
                  href="https://wa.link/ojm98y" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-3 bg-[#25D366] border-none hover:bg-[#128C7E]"
                >
                  <Phone className="w-4 h-4" /> WHATSAPP DIRECT
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61587756782612" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-outline w-full flex items-center justify-center gap-3"
                >
                  <Facebook className="w-4 h-4" /> FACEBOOK MESSENGER
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms Dialog */}
      <TermsAndConditions isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </footer>
  );
}
