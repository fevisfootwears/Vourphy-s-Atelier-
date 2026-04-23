import { motion } from 'motion/react';
import { Sparkles, Hammer, BookOpen, User, PenTool, Wind } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSiteAssets } from '../lib/firebase';

export function ArtisanSection() {
  const [profileAsset, setProfileAsset] = useState<any>(null);

  useEffect(() => {
    const fetchAsset = async () => {
      const assets = await getSiteAssets('profile');
      if (assets && assets.length > 0) {
        setProfileAsset(assets[0]);
      }
    };
    fetchAsset();
  }, []);

  return (
    <section id="artisan" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className={`aspect-[4/5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 ${!profileAsset?.url ? 'bg-brand-obsidian/5 flex items-center justify-center' : ''}`}>
              {profileAsset?.url ? (
                <img 
                  src={profileAsset.url} 
                  alt={profileAsset.title || "Vourphy Favour"} 
                  className="w-full h-full object-cover scale-110"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center px-12">
                  <User className="w-12 h-12 text-brand-gold/20 mx-auto mb-4" />
                  <p className="text-[9px] font-bold tracking-[0.3em] uppercase opacity-20 italic">Curator Image Pending Publication</p>
                </div>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 bg-brand-obsidian p-12 text-white hidden md:block">
              <span className="text-[10px] font-bold tracking-[0.5em] block mb-4 text-brand-gold uppercase">Vision Holder & Architect</span>
              <h3 className="text-3xl italic">{profileAsset?.title || "Vourphy Favour"}</h3>
            </div>
          </motion.div>

          <div className="space-y-12">
            <div>
              <span className="text-brand-gold text-[10px] font-bold tracking-[0.5em] uppercase block mb-6">Discovery // The Visionary</span>
              <h2 className="text-5xl md:text-6xl mb-12 italic leading-tight">The Soul of <br /> the Stitch</h2>
              <p className="text-brand-muted leading-relaxed font-serif italic text-lg mb-8">
                "Every pair of shoes is a silent dialogue between the artisan and the Earth. At Vourphy's, we don't just assemble footwear; we compose narratives of motion."
              </p>
              <p className="text-brand-muted text-sm leading-relaxed mb-12 opacity-80">
                Vourphy Favour, the visionary architect behind the atelier, blends ancestral Nigerian craftsmanship with contemporary European silhouettes. Each piece is born from a rigorous process of material selection and hand-welted precision, ensuring that elegance is never compromised by the passage of time.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Hammer className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2">Hand-Welted</h4>
                    <p className="text-[9px] text-brand-muted opacity-60 leading-relaxed uppercase">Traditional techniques preserved for modern masters.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-brand-gold" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2">Artisan Detail</h4>
                    <p className="text-[9px] text-brand-muted opacity-60 leading-relaxed uppercase">No two pieces are identical. Every stitch is a signature.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BespokeSection({ onInitiateClick }: { onInitiateClick?: () => void }) {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const data = await getSiteAssets('bespoke');
      setAssets(data);
    };
    fetchAssets();
  }, []);

  const defaultAssets = [
    { title: "I. The Consultation", url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012" },
    { title: "II. The Lasting", url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974" },
    { title: "III. The Unveiling", url: "https://images.unsplash.com/photo-1638247025967-b4e38f687b76?q=80&w=1964" }
  ];

  const displayAssets = assets.length > 0 ? assets.slice(0, 3) : defaultAssets;

  return (
    <section id="bespoke" className="py-32 bg-brand-obsidian text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <Wind className="w-full h-full text-brand-gold stroke-[0.1]" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <span className="text-brand-gold text-[11px] font-bold tracking-[0.6em] uppercase block mb-10">Commission // The Unique Path</span>
        <h2 className="text-6xl md:text-8xl mb-16 italic font-light tracking-tighter">Your Identity, <br /> Custom Contoured.</h2>
        
        <div className="max-w-2xl mx-auto mb-20">
          <p className="text-brand-cream/60 leading-relaxed text-lg italic font-serif mb-12">
            The Bespoke service at Vourphy's Atelier is an intimate collaboration. We design around your unique gait, character, and aspirations.
          </p>
          <div className="h-px w-24 bg-brand-gold mx-auto mb-16" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {displayAssets.map((asset, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="mb-8 overflow-hidden aspect-square border border-white/5">
                <img 
                   src={asset.url} 
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                   alt={asset.title}
                   referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-xl italic mb-4">{asset.title}</h3>
              <p className="text-[10px] tracking-widest opacity-40 uppercase leading-relaxed px-8">
                {index === 0 && "A private session to define your aesthetic legacy and functional needs."}
                {index === 1 && "Personalized lasts carved for comfort that defies standard sizing."}
                {index === 2 && "A masterpiece delivered, built to be resoled and rediscovered for decades."}
                {!([0,1,2].includes(index)) && "Bespoke artisan detailing and master construction."}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onInitiateClick}
          className="mt-24 px-12 py-5 bg-brand-gold text-brand-obsidian text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-white transition-colors"
        >
          INITIATE COMMISSION
        </motion.button>
      </div>
    </section>
  );
}

export function JournalSection() {
  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    const fetchAssets = async () => {
      const data = await getSiteAssets('journal');
      setAssets(data);
    };
    fetchAssets();
  }, []);

  const defaultPosts = [
    {
      title: "The Anatomy of a Welt",
      category: "TECHNICAL",
      date: "APR 2026",
      image: "https://images.unsplash.com/photo-1449247704656-13621df5ee70?q=80&w=2071"
    },
    {
      title: "The Poetry of Patina",
      category: "AESTHETICS",
      date: "MAR 2026",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000"
    }
  ];

  const displayPosts = assets.length > 0 ? assets.map(a => ({
    title: a.title,
    category: "ATELIER STORY",
    date: new Date(a.updatedAt?.toDate ? a.updatedAt.toDate() : Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase(),
    image: a.url
  })) : defaultPosts;

  return (
    <section id="journal" className="py-32 bg-brand-cream relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex justify-between items-end mb-24">
          <div>
            <span className="text-brand-gold text-[10px] font-bold tracking-[0.5em] uppercase block mb-6">Archive // The Artisan Journal</span>
            <h2 className="text-5xl italic font-light">Thought & Texture</h2>
          </div>
          <button 
            onClick={() => {
              const element = document.getElementById('journal');
              if (element) {
                const offset = 100;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
              }
            }}
            className="hidden md:flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase hover:text-brand-gold transition-all group"
          >
            All Entries <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {displayPosts.map((post, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="luxury-card overflow-hidden group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                  alt={post.title} 
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[9px] font-bold tracking-widest text-brand-gold uppercase">{post.category}</span>
                  <div className="w-4 h-px bg-brand-obsidian/20" />
                  <span className="text-[9px] font-bold tracking-widest text-brand-muted uppercase">{post.date}</span>
                </div>
                <h3 className="text-3xl italic mb-6 group-hover:text-brand-gold transition-colors">{post.title}</h3>
                <button 
                  onClick={() => {
                    const element = document.getElementById('journal');
                    if (element) {
                      const offset = 100;
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = element.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;
                      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="text-[10px] font-bold tracking-[0.3em] uppercase border-b-2 border-brand-gold pb-2 hover:border-brand-obsidian transition-colors"
                >
                  Read Narrative
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
