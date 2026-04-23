import { motion } from 'motion/react';
import { X, Shield, Scale, FileText } from 'lucide-react';

export default function TermsAndConditions({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-obsidian/60 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-brand-cream border border-brand-gold/30 shadow-2xl h-[80vh] flex flex-col"
      >
        <div className="flex justify-between items-center p-8 border-b border-brand-obsidian/10">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-brand-gold" />
            <h2 className="text-xl italic font-serif">Terms & Conditions</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-obsidian/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12 text-sm leading-relaxed text-brand-muted">
          <section>
            <h3 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-brand-gold">01 // The Artisan Mandate</h3>
            <p>
              By accessing Vourphy's Atelier, you enter into a covenant of excellence. Our bespoke footwear is more than a commodity; it is a collaborative masterpiece between the artisan, Vourphy Favour, and the distinguished client. Each piece is hand-crafted to order, subject to the inherent variations of natural materials.
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-brand-gold">02 // Intellectual Heritage</h3>
            <p>
              All proprietary designs, narratives, and visual manifestations within this digital atelier are the intellectual heritage of Vourphy Favour. Unauthorized replication, redistribution, or derivation is strictly prohibited under artisanal and legal statutes.
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-brand-gold">03 // The Commission Process</h3>
            <p>
              Commissions are initiated upon receipt of the requisite deposit. Given the highly individualistic nature of bespoke production, timelines provided are estimates reflecting the pursuit of perfection, not rigid deadlines. Returns are not accepted on bespoke creations, though we offer adjustments to ensure a flawless contour.
            </p>
          </section>

          <section>
            <h3 className="text-[10px] font-bold tracking-widest uppercase mb-6 text-brand-gold">04 // Marketer Conduct</h3>
            <p>
              Individuals within our creative network must uphold the prestige of the Vourphy identity. Misrepresentation of product value or artisan heritage through unauthorized marketing channels will result in immediate termination of hub access.
            </p>
          </section>

          <div className="pt-8 border-t border-brand-obsidian/5 flex items-center justify-between opacity-40 italic">
             <span>Last Updated: April 2026</span>
             <span>Vourphy's Atelier Legal Hub</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
