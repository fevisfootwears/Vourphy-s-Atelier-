/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductSection from './components/ProductSection';
import BrandPhilosophy from './components/BrandPhilosophy';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import { ArrowRight } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import LoginPage from './components/LoginPage';
import MarketerPortal from './components/MarketerPortal';
import ClientWelcomePortal, { ClientWelcomePortalRef } from './components/ClientWelcomePortal';
import { ArtisanSection, BespokeSection, JournalSection } from './components/ArtisanSections';
import { motion, useScroll, useSpring } from 'motion/react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function HomePage({ onBuyClick }: { onBuyClick?: () => void }) {
  return (
    <>
      <Hero />
      <section className="py-24 bg-brand-cream border-y border-brand-obsidian/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 opacity-60">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase whitespace-nowrap opacity-40">Featured In //</span>
            <div className="flex-1 flex flex-wrap justify-between gap-12 md:gap-24 grayscale hover:grayscale-0 transition-all duration-700">
               <span className="text-sm font-bold tracking-[0.5em] uppercase">Vogue</span>
               <span className="text-sm font-bold tracking-[0.5em] uppercase">GQ</span>
               <span className="text-sm font-bold tracking-[0.5em] uppercase">Hypebeast</span>
               <span className="text-sm font-bold tracking-[0.5em] uppercase">Esquire</span>
            </div>
          </div>
        </div>
      </section>

      <ProductSection />
      
      {/* Marketer Outreach - The 'Email Space' just below collections */}
      <section className="py-24 bg-brand-cream border-t border-brand-obsidian/5 relative overflow-hidden group">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <span className="text-brand-gold text-[10px] font-bold tracking-[0.6em] uppercase block mb-8">Curatorial Network</span>
          <h2 className="text-4xl md:text-5xl italic mb-12 font-light">Join the Vourphy <span className="text-brand-gold">Collective</span></h2>
          <p className="text-brand-muted text-sm mb-12 max-w-xl mx-auto leading-relaxed italic">
            Are you a marketer with an eye for artisanal brilliance? Access our high-resolution assets and narrative guides.
          </p>
          <Link 
            to="/marketer-hub" 
            className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.4em] uppercase border-b-2 border-brand-gold pb-2 hover:text-brand-gold transition-all"
          >
            ENTER THE MARKETER HUB <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <BrandPhilosophy />
      <ArtisanSection />
      <BespokeSection onInitiateClick={onBuyClick} />
      <JournalSection />
      
      <section className="py-32 md:py-48 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-brand-obsidian/5" />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-4 lg:sticky lg:top-48">
              <span className="text-[10px] font-bold tracking-[0.6em] uppercase text-brand-gold block mb-6">Voices of Distinction</span>
              <h2 className="text-5xl md:text-6xl italic leading-[0.9] mb-8">PEERS IN <br /><span className="not-italic uppercase tracking-tighter">Excellence</span></h2>
              <div className="h-px w-12 bg-brand-gold mb-8" />
              <p className="text-brand-muted text-sm leading-relaxed max-w-sm italic opacity-70">
                A testament to the enduring relationship between artisan craftsmanship and those who shape our modern world.
              </p>
            </div>
            
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-obsidian/5 border border-brand-obsidian/5">
              {[
                { 
                  text: "The ergonomics of the Vourphy Oxford is unlike anything I've experienced. Truly a masterpiece of comfort.",
                  author: "Ibanga Joseph",
                  title: "Architect",
                  category: "BESPOKE SERVICE"
                },
                { 
                  text: "Sartorial elegance paired with rugged durability. My Chelsea boots have become my everyday essential.",
                  author: "Elena Rossi",
                  title: "Interior Designer",
                  category: "READY-TO-WEAR"
                },
                { 
                  text: "Attention to detail is singular. The patina development over six months has been breathtaking.",
                  author: "Edifon Jack",
                  title: "Art Curator",
                  category: "LIMITED SERIES"
                },
                { 
                  text: "The atelier's respect for ancient techniques while embracing contemporary silhouette is refreshing.",
                  author: "Wisdom Ekong",
                  title: "Creative Director",
                  category: "EDITORIAL PICK"
                }
              ].map((testimonial, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                  className="p-12 md:p-16 bg-white flex flex-col justify-between group transition-colors hover:bg-brand-cream"
                >
                  <div>
                    <span className="text-[8px] font-bold tracking-[0.4em] uppercase text-brand-gold block mb-8 opacity-0 group-hover:opacity-100 transition-opacity">{testimonial.category}</span>
                    <p className="text-2xl font-serif italic mb-12 opacity-80 leading-relaxed">"{testimonial.text}"</p>
                  </div>
                  <div>
                    <div className="h-px w-8 bg-brand-obsidian/10 mb-6" />
                    <p className="text-xs font-bold tracking-widest uppercase mb-1">{testimonial.author}</p>
                    <p className="text-[9px] tracking-widest uppercase opacity-40 italic">{testimonial.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-brand-obsidian">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0.2 }}
          whileInView={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1449247709967-d4461a6a6103?q=80&w=2071" 
          alt="Interior" 
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-brand-gold text-[10px] font-bold tracking-[0.6em] uppercase block mb-8 underline underline-offset-[12px]">Final Call</span>
            <h2 className="text-5xl md:text-7xl mb-12 leading-tight text-white italic tracking-tighter">YOUR PERFECT <br /> <span className="not-italic uppercase text-4xl md:text-6xl opacity-80">FIT AWAITS</span></h2>
            <button 
              onClick={onBuyClick}
              className="btn-primary transform hover:scale-105 active:scale-95 transition-transform"
            >
              VISIT THE ATELIER
            </button>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const portalRef = useRef<ClientWelcomePortalRef>(null);

  const handleBuyClick = () => {
    portalRef.current?.triggerModal();
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative min-h-screen">
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-brand-gold z-[120] origin-left"
          style={{ scaleX }}
        />

        <Navbar onBuyClick={handleBuyClick} />
        <ClientWelcomePortal ref={portalRef} />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage onBuyClick={handleBuyClick} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/entry" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/management" element={<AdminPanel />} />
            <Route path="/marketers" element={<MarketerPortal />} />
            <Route path="/marketer-hub" element={<MarketerPortal />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
