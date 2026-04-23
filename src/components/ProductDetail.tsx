import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Ruler, Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { formatPrice } from '../lib/currency';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic text-xl">Entering Atelier Storage...</div>;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-serif px-6 text-center">
      <h2 className="text-4xl mb-8">PIECE NOT FOUND</h2>
      <Link to="/" className="btn-primary">RETURN TO COLLECTION</Link>
    </div>
  );

  const sizes = ['38', '39', '40', '41', '42', '43', '44', '45'];
  const prices = formatPrice(product.price);

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.3em] uppercase opacity-50 hover:opacity-100 transition-opacity mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO CURATION
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Image Gallery Simulation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="luxury-card overflow-hidden aspect-[4/5] relative group">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6">
                <span className="bg-brand-obsidian text-white text-[10px] font-bold px-4 py-1.5 tracking-[0.2em] uppercase">
                  {product.tag || 'EXCLUSIVE'}
                </span>
              </div>
            </div>
            {/* Mock Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-4">
               {[1, 2, 3, 4].map((i) => (
                 <div key={i} className="aspect-square luxury-card opacity-30 cursor-pointer overflow-hidden hover:opacity-100 transition-opacity">
                    <img src={product.image} className="w-full h-full object-cover grayscale" />
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <div className="flex flex-col">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
            >
              <span className="text-brand-gold text-[12px] font-bold tracking-[0.4em] uppercase mb-4 block">
                {product.category}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 leading-[1.1]">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-8">
                 <div className="flex gap-1 text-brand-gold">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                 </div>
                 <span className="text-xs font-bold tracking-widest opacity-40 uppercase">(12 REVIEWS)</span>
              </div>
              <div className="mb-10">
                <p className="text-3xl font-serif italic">{prices.ngn}</p>
                <p className="text-sm font-bold opacity-40 mt-1 uppercase tracking-widest">Equivalent to {prices.usd}</p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="space-y-10"
            >
              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-[11px] font-bold tracking-[0.3em] uppercase">SELECT SIZE (EU)</h4>
                  <button className="text-[10px] font-bold tracking-widest uppercase opacity-40 hover:opacity-100 flex items-center gap-2">
                    <Ruler className="w-3 h-3" /> SIZE GUIDE
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-xs font-bold tracking-widest border transition-all ${
                        selectedSize === size 
                          ? 'bg-brand-obsidian text-white border-brand-obsidian' 
                          : 'bg-transparent border-brand-obsidian/10 hover:border-brand-obsidian'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-brand-obsidian/10 pt-10">
                <h4 className="text-[11px] font-bold tracking-[0.3em] uppercase mb-6">ARTISAN DETAILS</h4>
                <p className="text-brand-muted leading-relaxed font-light text-lg">
                  {product.description || "Each pair is a masterpiece of Cordwaining heritage, meticulously handcrafted and stitched over a 12-week curation period. Using only the highest grade of full-grain leather, we ensure a piece that grows in character with every step."}
                </p>
              </div>

              {/* CTA */}
              <div className="space-y-4 pt-10">
                <a 
                  href={`https://wa.me/2348123456789?text=${encodeURIComponent(`Greetings Vourphy. I would like to reserve the ${product.name} from the collection. [ID: ${product.id}]`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary w-full py-5 text-sm flex items-center justify-center gap-4 group"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  RESERVE THIS PIECE
                </a>
                <div className="flex flex-col md:flex-row gap-6 pt-6">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 opacity-40" />
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">COMPLIMENTARY SHIPPING</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 opacity-40" />
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">LIFETIME CRAFT WARRANTY</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
