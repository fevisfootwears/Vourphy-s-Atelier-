import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, User, Search, Briefcase, MapPin, Sparkles, LogOut, Loader2, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBranding } from '../lib/useBranding';
import { auth, signInWithGoogle, registerMarketer, checkIfMarketer } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export default function Navbar({ onBuyClick }: { onBuyClick?: () => void }) {
  const { branding } = useBranding();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleMarketerLogin = async () => {
    setLoading(true);
    try {
      const u = await signInWithGoogle();
      if (u) {
        // Exclude the admin from marketer registration
        const isAdmin = u.email === 'fevisfootwears@gmail.com';
        if (isAdmin) {
          alert("The Artisan Master does not register as a Marketer. Please use the Atelier Control panel below.");
          await auth.signOut();
          return;
        }

        setIsLoginModalOpen(false);
        navigate('/marketer-hub');
      }
    } catch (err) {
      console.error("Marketer login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNavClick = (e: any, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.replace('#', '');
      
      if (window.location.pathname !== '/') {
        navigate('/' + href);
        return;
      }
      
      const element = document.getElementById(id);
      if (element) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        setIsMobileMenuOpen(false);
      }
    }
  };

  const navLinks = [
    { name: 'COLLECTIONS', href: '#collections' },
    { name: 'THE ARTISAN', href: '#artisan' },
    { name: 'BESPOKE', href: '#bespoke' },
    { name: 'JOURNAL', href: '#journal' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? 'glass-nav py-4 shadow-xl' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Desktop Navigation Left */}
        <div className="hidden md:flex items-center space-x-10">
          <button 
            onClick={() => {
              if (onBuyClick) {
                onBuyClick();
              }
            }}
            className="text-[11px] font-bold tracking-[0.2em] text-brand-gold hover:text-brand-obsidian transition-colors animate-pulse"
          >
            VISIT THE ATELIER
          </button>
          {navLinks.slice(0, 1).map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[11px] font-semibold tracking-[0.2em] hover:text-brand-gold transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center h-full flex items-center">
          <Link to="/" className="group h-full flex items-center">
            {branding?.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt="Vourphy's Atelier" 
                className="h-10 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col items-center leading-none text-brand-gold">
                <span className="text-xl md:text-2xl font-bold tracking-[0.1em]">VOURPHY'S</span>
                <span className="text-[8px] tracking-[0.3em] font-sans font-normal text-brand-obsidian opacity-60">ATELIER</span>
              </div>
            )}
          </Link>
        </div>

        {/* Desktop Navigation Right */}
        <div className="hidden md:flex items-center space-x-10">
           {navLinks.slice(1).map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-[11px] font-semibold tracking-[0.2em] hover:text-brand-gold transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-6">
          <button className="hidden sm:block hover:text-brand-gold transition-colors">
            <Search className="w-5 h-5 stroke-[1.5]" />
          </button>
          <button 
            onClick={() => setIsLoginModalOpen(true)}
            className="hover:text-brand-gold transition-colors flex items-center gap-2"
          >
            <User className="w-5 h-5 stroke-[1.5]" />
          </button>
          <div 
            onClick={onBuyClick}
            className="relative group cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.5] group-hover:text-brand-gold transition-colors" />
            <span className="absolute -top-2 -right-2 text-[10px] bg-brand-obsidian text-brand-cream w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
              0
            </span>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute inset-0 bg-brand-obsidian/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm bg-brand-cream p-12 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold animate-pulse" />
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="absolute top-4 right-4 p-2 opacity-20 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="w-20 h-20 bg-brand-obsidian/5 rounded-full flex items-center justify-center mx-auto mb-10 relative">
                  <div className="absolute inset-0 rounded-full border border-brand-gold/20 animate-[spin_10s_linear_infinite]" />
                  <Briefcase className="w-8 h-8 text-brand-gold opacity-40" />
                </div>
                
                <h2 className="text-3xl mb-4 italic tracking-tight">MARKETER ENTRY</h2>
                <div className="h-px w-8 bg-brand-gold mx-auto mb-10" />
                
                <p className="text-[10px] tracking-[0.4em] font-bold text-brand-muted uppercase mb-12 leading-loose px-4 opacity-60">
                  Register or sign in to join <br /> the Vourphy's artisan network
                </p>

                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="p-6 bg-brand-obsidian/5 border border-brand-obsidian/5 overflow-hidden">
                      <p className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-30 mb-2">Artisan Status: Active</p>
                      <p className="text-xs font-bold truncate opacity-80">{user.email}</p>
                    </div>
                    <Link 
                      to="/marketer-hub" 
                      onClick={() => setIsLoginModalOpen(false)}
                      className="btn-primary w-full inline-block group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        ENTER RESOURCE HUB <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                    <button 
                      onClick={() => auth.signOut()}
                      className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-40 hover:opacity-100 flex items-center gap-2 mx-auto pt-4"
                    >
                      <LogOut className="w-3 h-3" /> Terminate Session
                    </button>
                  </motion.div>
                ) : (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleMarketerLogin}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-3 active:scale-95"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin text-brand-gold" /> : <Sparkles className="w-4 h-4 text-brand-gold" />}
                    JOIN THE NETWORK
                  </motion.button>
                )}

                <div className="mt-16 relative">
                  <p className="text-[9px] tracking-[0.5em] uppercase opacity-20 leading-relaxed italic">
                    "Excellence is not a singular act, <br /> but the synergy of many."
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            className={`md:hidden fixed inset-0 z-[150] bg-brand-cream p-12 flex flex-col justify-center items-center`}
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 left-6">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col space-y-10 text-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-2xl font-serif italic tracking-widest text-brand-obsidian"
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onBuyClick) onBuyClick();
                }}
                className="btn-primary"
              >
                SECURE YOUR PAIR
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
