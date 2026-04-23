import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, Copy, ExternalLink, Package, Image as ImageIcon, Briefcase, CheckCircle2, ChevronRight, LogOut, Loader2, ShieldCheck } from 'lucide-react';
import { auth, getProducts, getBranding, signOut as fbSignOut, checkIfMarketer, registerMarketer } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { formatPrice } from '../lib/currency';
import { Link } from 'react-router-dom';

export default function MarketerPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [branding, setBranding] = useState<any>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMarketer, setIsMarketer] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regType, setRegType] = useState<'existing' | 'new'>('existing');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const isMkt = await checkIfMarketer(u.uid);
        setIsMarketer(isMkt);
        if (isMkt) {
          fetchData();
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleRegistration = async () => {
    if (!user || !agreedToTerms) return;
    try {
      setLoading(true);
      await registerMarketer(user);
      setIsMarketer(true);
      fetchData();
    } catch (error) {
      console.error("Registration failed:", error);
      alert("System could not document your registration. Please verify your connection.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [pdts, brand] = await Promise.all([getProducts(), getBranding()]);
      setProducts(pdts);
      setBranding(brand);
    } catch (error) {
      console.error("Error fetching marketer resources:", error);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic uppercase tracking-widest bg-brand-cream">Initializing Resources...</div>;

  if (!user || !isMarketer) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 pt-24">
        <div className="luxury-card max-w-lg w-full p-12 text-center">
           <Briefcase className="w-12 h-12 text-brand-gold/40 mx-auto mb-8" />
           <h2 className="text-3xl mb-6 italic">NETWORK ONBOARDING</h2>
           {!user ? (
             <>
               <p className="text-brand-muted text-sm mb-12 leading-relaxed">
                 Please authenticate via the authorized entry portal to access the Atelier's high-resolution marketing assets and copy resources.
               </p>
               <Link to="/entry" className="btn-primary w-full inline-block">
                 GO TO ENTRY PORTAL
               </Link>
             </>
           ) : (
             <div className="space-y-8">
               <div className="p-6 bg-brand-cream border border-brand-obsidian/10">
                 <p className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2">Authenticated Identity</p>
                 <p className="text-sm font-bold truncate">{user.email}</p>
               </div>

               <div className="flex gap-4 p-2 bg-brand-obsidian/5 rounded-lg mb-8">
                 <button 
                   onClick={() => setRegType('existing')}
                   className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase transition-all ${regType === 'existing' ? 'bg-white shadow-sm' : 'opacity-40'}`}
                 >
                   Verify Access
                 </button>
                 <button 
                   onClick={() => setRegType('new')}
                   className={`flex-1 py-3 text-[10px] font-bold tracking-widest uppercase transition-all ${regType === 'new' ? 'bg-white shadow-sm' : 'opacity-40'}`}
                 >
                   New Registration
                 </button>
               </div>

               {regType === 'new' ? (
                 <>
                   <div className="text-left space-y-6">
                     <div className="flex items-start gap-4 cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                       <div className={`mt-1 w-5 h-5 flex-shrink-0 border-2 transition-colors flex items-center justify-center ${agreedToTerms ? 'bg-brand-gold border-brand-gold' : 'border-brand-obsidian/20'}`}>
                         {agreedToTerms && <CheckCircle2 className="w-3 h-3 text-white" />}
                       </div>
                       <p className="text-[10px] uppercase tracking-widest leading-relaxed opacity-60">I agree to the <Link to="/terms" className="text-brand-gold underline underline-offset-4">Artisan Terms & Conditions</Link> for professional marketing and representation.</p>
                     </div>
                   </div>

                   <button 
                     disabled={!agreedToTerms || loading}
                     onClick={handleRegistration}
                     className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                     COMPLETE REGISTRATION
                   </button>
                 </>
               ) : (
                 <>
                    <p className="text-red-900/60 text-[10px] font-bold tracking-widest uppercase mb-8">
                       This identity is not yet documented in the Creative Network.
                    </p>
                    <button 
                      onClick={() => setRegType('new')}
                      className="btn-outline w-full"
                    >
                      BEGIN REGISTRATION
                    </button>
                    <button 
                      onClick={() => auth.signOut()}
                      className="block mx-auto text-[10px] font-bold tracking-widest uppercase opacity-30 hover:opacity-100 mt-8"
                    >
                      SWITCH ACCOUNT
                    </button>
                 </>
               )}
             </div>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-24 gap-8 border-b border-brand-obsidian/10 pb-16">
          <div>
            <span className="text-brand-gold text-[10px] font-bold tracking-[0.6em] uppercase block mb-4">The Creative Network</span>
            <h1 className="text-5xl md:text-6xl mb-4 italic tracking-tight">MARKETER HUB</h1>
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-brand-gold" />
              <p className="text-brand-muted text-[10px] tracking-widest uppercase opacity-60">Authorized Atelier Identity • {user.email}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Link 
              to="/"
              className="flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-brand-gold transition-colors py-4 px-8 border border-brand-obsidian/5 hover:border-brand-gold/30"
            >
              <Package className="w-3 h-3" />
              BACK TO SITE
            </Link>
            <button 
              onClick={() => fbSignOut()}
              className="group flex items-center gap-3 text-[10px] font-bold tracking-[0.3em] uppercase hover:text-brand-gold transition-colors py-4 px-8 border border-brand-obsidian/5 hover:border-brand-gold/30"
            >
              <LogOut className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              EXIT WORKSPACE
            </button>
          </div>
        </div>

        {/* Brand Identity Section */}
        <section className="mb-32">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-brand-gold whitespace-nowrap">01 // VISUAL IDENTITY</h2>
            <div className="h-px flex-1 bg-brand-obsidian/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {branding?.logoUrl && (
              <div className="md:col-span-5 luxury-card p-12 flex flex-col items-center justify-center text-center relative group min-h-[400px]">
                <div className="absolute top-6 left-6 text-[8px] font-bold tracking-widest uppercase opacity-20 italic">Master Signature</div>
                <div className="w-48 h-48 bg-brand-obsidian/5 flex items-center justify-center p-8 mb-10 transition-transform duration-700 group-hover:scale-105">
                  <img src={branding.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-base italic mb-2">Official Atelier Emblem</h3>
                  <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-6 max-w-[200px] mx-auto opacity-60">High-resolution vector-equivalent file for all press manifestations.</p>
                  <button 
                    onClick={() => downloadImage(branding.logoUrl, 'Vourphy_Logo.png')}
                    className="btn-outline group inline-flex items-center gap-3 mx-auto"
                  >
                    <Download className="w-3 h-3 text-brand-gold" /> GET PNG ASSET
                  </button>
                </div>
              </div>
            )}
            {branding?.heroUrl && (
              <div className="md:col-span-7 luxury-card overflow-hidden group min-h-[400px] flex flex-col">
                <div className="flex-1 relative overflow-hidden">
                  <img src={branding.heroUrl} alt="Hero" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-brand-obsidian/20 group-hover:bg-brand-obsidian/40 transition-colors duration-700" />
                  <div className="absolute bottom-10 left-10 text-white">
                    <span className="text-[9px] font-bold tracking-[0.5em] uppercase opacity-60">Seasonal Atmosphere</span>
                    <h3 className="text-3xl italic mt-2">Primary Cover Shot</h3>
                  </div>
                </div>
                <div className="p-8 bg-white flex justify-between items-center">
                  <p className="text-[9px] text-brand-muted uppercase tracking-widest opacity-60">High-Fidelity Campaign Header</p>
                  <button 
                    onClick={() => downloadImage(branding.heroUrl, 'Vourphy_Hero.jpg')}
                    className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold hover:underline flex items-center gap-2 group/btn"
                  >
                    <Download className="w-3 h-3 group-hover/btn:translate-y-1 transition-transform" /> SAVE MASTER FILE
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Product Copy Section */}
        <section>
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-sm font-bold tracking-[0.5em] uppercase text-brand-gold whitespace-nowrap">02 // COLLECTION RESOURCES</h2>
            <div className="h-px flex-1 bg-brand-obsidian/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="luxury-card overflow-hidden mb-8">
                  <div className="aspect-[3/4] bg-brand-obsidian/5 relative overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-brand-obsidian/10">
                      <button 
                        onClick={() => downloadImage(product.image, `${product.name}.jpg`)}
                        className="btn-primary w-full max-w-[200px]"
                      >
                        SAVE HERITAGE SHOT
                      </button>
                    </div>
                  </div>
                  <div className="p-10 border-t border-brand-obsidian/5">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <span className="text-[9px] font-bold tracking-[0.4em] text-brand-gold uppercase block mb-3">{product.category}</span>
                        <h3 className="text-3xl italic mb-3">{product.name}</h3>
                        <p className="font-serif italic text-brand-muted opacity-60">Retail Price: {formatPrice(product.price).ngn}</p>
                      </div>
                      <div className="text-[9px] font-bold tracking-widest text-brand-muted uppercase border border-brand-obsidian/10 px-3 py-1">
                        SKU {product.id.slice(0, 8).toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="relative mb-10">
                      <div className="absolute -left-6 top-0 bottom-0 w-1 bg-brand-gold/10" />
                      <p className="text-brand-muted text-sm leading-relaxed italic opacity-80 line-clamp-4 group-hover:line-clamp-none transition-all duration-700">
                        {product.description || "No artisan description available."}
                      </p>
                    </div>

                    <button 
                      onClick={() => copyToClipboard(product.description || '', product.id)}
                      className={`w-full flex items-center justify-center gap-3 py-5 border text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-500 ${copiedId === product.id ? 'bg-brand-gold text-white border-brand-gold' : 'border-brand-obsidian/10 hover:border-brand-gold hover:text-brand-gold'}`}
                    >
                      {copiedId === product.id ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> NARRATIVE COPIED
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> COPY DESCRIPTION NARRATIVE
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Marketing Support Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-16 bg-white border border-brand-obsidian/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
          <div className="relative z-10">
            <h4 className="text-xs font-bold tracking-[0.6em] uppercase mb-6 text-brand-gold">Administrative Support</h4>
            <p className="text-brand-muted text-sm mb-12 opacity-60 leading-relaxed max-w-xl mx-auto italic">
              For billboard-grade master files, bespoke campaign inquiries, or technical atelier assistance, please coordinate with the Master Creative team.
            </p>
            <a 
              href="mailto:creative@vourphys-atelier.com" 
              className="text-base font-bold tracking-[0.2em] uppercase text-brand-obsidian hover:text-brand-gold transition-colors border-b-2 border-brand-gold pb-2"
            >
              creative@vourphys-atelier.com
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
