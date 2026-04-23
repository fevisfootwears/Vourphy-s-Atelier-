import { motion } from 'motion/react';
import { ArrowRight, Crown } from 'lucide-react';
import { useBranding } from '../lib/useBranding';

export default function Hero() {
  const { branding } = useBranding();
  return (
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-brand-obsidian text-brand-cream">
      {/* Dynamic Background */}
      {branding?.heroUrl && (
        <div className="absolute inset-0 z-0">
          <img src={branding.heroUrl} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-obsidian/60 to-brand-obsidian" />
        </div>
      )}

      {/* Centered Logo Branding (Cover Page Style) */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-12 flex flex-col justify-center items-center text-center">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="mb-12 relative"
        >
          {/* Logo Container - This attempts to load the uploaded logo if it exists */}
          <div className="w-64 h-64 md:w-96 md:h-96 flex items-center justify-center p-8">
            {branding?.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt="Vourphy's Atelier Official Logo" 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img 
                src="/logo-dark.png" 
                alt="Vourphy's Atelier Official Logo" 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Fallback to stylized SVG if image not found
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const svg = document.getElementById('fallback-logo');
                    if (svg) svg.style.display = 'flex';
                  }
                }}
                referrerPolicy="no-referrer"
              />
            )}
            {/* Fallback stylized branding if logo-dark.png is missing */}
            <div id="fallback-logo" className="hidden flex-col items-center justify-center text-brand-gold">
               <Crown className="w-20 h-20 mb-4 stroke-[1]" />
               <div className="w-1 h-12 bg-brand-gold/20 mb-4" />
               <h2 className="text-5xl md:text-7xl font-bold tracking-[0.1em] leading-none mb-2">VOURPHY'S</h2>
               <p className="text-xl tracking-[0.4em] font-sans font-light">ATELIER</p>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 1 }}
           className="mb-8"
        >
          <p className="text-[12px] font-bold tracking-[0.6em] uppercase text-brand-gold mb-4">
            ELEGANCE • LUXURY • COMFORT
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight max-w-2xl leading-relaxed">
            Crafting the <span className="italic font-serif">Singular Path</span> for the Exceptional Individual.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="flex flex-col sm:flex-row gap-6 mt-8"
        >
          <button 
            onClick={() => {
              const element = document.getElementById('collections');
              if (element) {
                const offset = 100;
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                  top: elementPosition - offset,
                  behavior: 'smooth'
                });
              }
            }}
            className="btn-primary border border-brand-cream/20 bg-brand-obsidian hover:bg-brand-cream hover:text-brand-obsidian transition-all group flex items-center justify-center gap-3"
          >
            ENTER THE ATELIER
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />
      
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-brand-gold) 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
    </section>
  );
}
