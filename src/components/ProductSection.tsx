import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProducts } from '../lib/firebase';
import { formatPrice } from '../lib/currency';

export default function ProductSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Fetch products error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // No fallback items, if empty show helpful message
  const displayProducts = products;

  return (
    <section id="collections" className="py-24 md:py-32 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Warm Showroom Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-brand-gold/5 blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="h-px w-8 bg-brand-gold" />
              <span className="text-[11px] font-bold tracking-[0.4em] text-brand-gold uppercase block">Digital Showroom</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tighter"
            >
              Bespoke <br /><span className="italic font-serif">Narratives</span>
            </motion.h2>
          </div>
          <div className="md:max-w-md">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-brand-muted text-lg leading-relaxed font-serif italic mb-6"
            >
              "Every pair is a dialogue between the artisan's hand and the wearer's soul. Step into a world where comfort is whispered and elegance is absolute."
            </motion.p>
            <div className="flex gap-4">
              <div className="h-px w-12 bg-brand-obsidian/10 self-center" />
              <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">Direct from the Atelier</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {displayProducts.length > 0 ? displayProducts.map((product, index) => {
            const prices = formatPrice(product.price);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="luxury-card overflow-hidden mb-6 aspect-[3/4] relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Overlay Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-obsidian text-white text-[9px] font-bold px-3 py-1 tracking-widest uppercase">
                        {product.tag}
                      </span>
                    </div>

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-brand-obsidian/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white text-brand-obsidian px-6 py-2 text-xs font-bold tracking-widest hover:bg-brand-gold hover:text-white transition-colors">
                          VIEW PIECE
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-brand-muted text-[10px] font-bold tracking-widest uppercase mb-1 block">
                        {product.category}
                      </span>
                      <h3 className="text-lg md:text-xl mb-2 group-hover:text-brand-gold transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 opacity-50 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                        <span className="text-[10px] ml-1">(24)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-serif italic block">{prices.ngn}</span>
                      <span className="text-[10px] font-bold opacity-40 block">{prices.usd}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          }) : (
            <div className="col-span-full py-24 text-center">
              <p className="text-brand-muted italic font-serif text-lg">"The artisan's hands are currently at work on a new narrative. Please visit the atelier shortly for the next unveiled series."</p>
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 bg-brand-cream relative overflow-hidden group border border-brand-obsidian/5"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <span className="text-brand-gold text-[10px] font-bold tracking-[0.5em] uppercase block mb-4">Network // The Creative Partnership</span>
              <h3 className="text-3xl italic mb-4">Elevate the Narrative</h3>
              <p className="text-brand-muted text-sm max-w-xl leading-relaxed italic font-serif">
                Are you a professional storyteller or marketer? Join our exclusive network to help distribute the atelier's vision and secure high-value commissions.
              </p>
            </div>
            <Link 
              to="/marketer-hub"
              className="btn-primary flex items-center gap-4 px-10"
            >
              JOIN THE NETWORK <span className="text-brand-gold">|</span> ENTER HUB
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <Link to="/" className="inline-block border-b-2 border-brand-obsidian pb-1 font-bold text-sm tracking-widest hover:text-brand-gold hover:border-brand-gold transition-all">
            VIEW ALL COLLECTIONS
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
