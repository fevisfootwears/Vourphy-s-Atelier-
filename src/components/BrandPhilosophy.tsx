import { motion } from 'motion/react';

export default function BrandPhilosophy() {
  return (
    <section className="bg-brand-obsidian text-brand-cream py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
        >
          <div className="relative aspect-square md:aspect-[4/5] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1473187983305-f6150658ddaf?q=80&w=2070" 
              alt="Craftsmanship detail" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Absolute element for graphic sophistication */}
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-gold/20 backdrop-blur-2xl hidden md:block" />
          </div>
        </motion.div>

        <div className="flex flex-col justify-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold tracking-[0.4em] uppercase mb-6 block"
          >
            OUR MANIFESTO
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl mb-8 leading-[1.1]"
          >
            THE ART OF <br />
            <span className="italic">UNCOMPROMISING</span> <br />
            QUALITY
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6 text-lg font-light leading-relaxed max-w-lg"
          >
            <p>
              At Vourphy's Atelier, we believe a shoe is more than an accessory—it is an extension of one's journey. 
              Our artisans meticulously select only the finest full-grain leathers, sourced from tanneries that 
              share our commitment to ethical excellence.
            </p>
            <p>
              By marrying traditional Cordwaining techniques with modern ergonomic engineering, we create 
              footwear that doesn't just look magnificent but offers a sanctuary for your feet.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-brand-cream/10 pt-12"
          >
            <div>
              <h4 className="text-2xl font-serif mb-1">200+</h4>
              <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold">STITCHES PER PAIR</p>
            </div>
            <div>
              <h4 className="text-2xl font-serif mb-1">12wk</h4>
              <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold">CURATION PROCESS</p>
            </div>
            <div className="hidden md:block">
              <h4 className="text-2xl font-serif mb-1">Lifetime</h4>
              <p className="text-[10px] tracking-widest uppercase opacity-50 font-bold">RESTYLING GUARANTEE</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
