import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ChevronRight, MessageSquare, Instagram, Copy, CheckCircle2, User, UserCheck, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { auth, checkIfMarketer, saveReferralLead } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

type Role = 'guest' | 'client' | 'marketer' | 'admin';

export interface ClientWelcomePortalRef {
  triggerModal: () => void;
}

const ClientWelcomePortal = forwardRef<ClientWelcomePortalRef, {}>((props, ref) => {
  const [role, setRole] = useState<Role>('guest');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [step, setStep] = useState<'welcome' | 'referral'>('welcome');
  const [marketerUsername, setMarketerUsername] = useState('');
  const [showArrow, setShowArrow] = useState(false);
  const [isIdentityVisible, setIsIdentityVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerModal: () => {
      setStep('welcome');
      setIsWelcomeModalOpen(true);
    }
  }));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === 'fevisfootwears@gmail.com') {
          setRole('admin');
        } else {
          const isMkt = await checkIfMarketer(user.uid);
          setRole(isMkt ? 'marketer' : 'client');
        }
      } else {
        setRole('guest');
      }
      setIsIdentityVisible(true);
      
      // Auto-hide identity after 5 seconds
      const timer = setTimeout(() => setIsIdentityVisible(false), 5000);
      return () => clearTimeout(timer);
    });

    // Show persistent arrow for clients/guests after 2.5 seconds
    const arrowTimer = setTimeout(() => setShowArrow(true), 2500);

    return () => {
      unsubscribe();
      clearTimeout(arrowTimer);
    };
  }, []);

  const handleExplore = () => {
    setIsWelcomeModalOpen(false);
    const element = document.getElementById('collections');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const handleContactProducer = async (isSkipped = false) => {
    try {
      await saveReferralLead(isSkipped ? 'None (Direct)' : marketerUsername, isSkipped ? 'no_marketer' : 'with_marketer');
      window.open('https://wa.link/ojm98y', '_blank');
      setIsWelcomeModalOpen(false);
    } catch (err) {
      console.error("Error saving referral:", err);
    }
  };

  const roleMeta = {
    guest: { icon: User, label: 'GUEST VISITOR', color: 'text-brand-muted' },
    client: { icon: UserCheck, label: 'ESTEEMED CLIENT', color: 'text-brand-gold' },
    marketer: { icon: User, label: 'ARTISAN MARKETER', color: 'text-brand-gold' },
    admin: { icon: ShieldCheck, label: 'ATELIER MASTER', color: 'text-brand-gold' },
  };

  const activeMeta = roleMeta[role];

  return (
    <>
      <AnimatePresence>
        {isIdentityVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 30 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="bg-brand-obsidian text-white px-8 py-3 flex items-center gap-4 border border-brand-gold/30 shadow-2xl">
              <activeMeta.icon className={`w-4 h-4 ${activeMeta.color}`} />
              <div className="h-4 w-px bg-white/20" />
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase">{activeMeta.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showArrow && (role === 'guest' || role === 'client') && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed top-[115px] right-2 md:right-4 lg:right-10 z-[50] flex flex-col items-center gap-2 pointer-events-none"
          >
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="bg-brand-gold text-white p-2.5 rounded-full shadow-[0_10px_20px_rgba(197,165,114,0.3)] border border-white/20"
            >
              <ArrowUpRight className="w-5 h-5" />
            </motion.div>
            <div className="bg-brand-obsidian text-brand-cream px-3 py-1.5 border border-brand-gold/30 shadow-xl">
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase">
                SECURE YOUR PAIR
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isWelcomeModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWelcomeModalOpen(false)}
              className="absolute inset-0 bg-brand-obsidian/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-brand-cream border border-brand-gold/30 shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
              <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-brand-gold/10 to-transparent pointer-events-none" />

              <div className="p-12 text-center relative z-10">
                {step === 'welcome' ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="text-brand-gold text-[10px] font-bold tracking-[0.6em] uppercase block mb-6 italic">Welcome to the Atelier</span>
                    <h2 className="text-4xl md:text-5xl italic leading-tight mb-8">Prestigiously Welcomed</h2>
                    <p className="text-brand-muted text-sm leading-relaxed mb-12 opacity-80 max-w-md mx-auto font-serif italic text-center">
                      "We believe that the journey to excellence begins with the first step. How may we assist you in your pursuit of distinction?"
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button onClick={handleExplore} className="btn-primary group">
                        <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                          EXPLORE COLLECTIONS <ShoppingBag className="w-3 h-3" />
                        </span>
                      </button>
                      <button onClick={() => setStep('referral')} className="btn-outline group">
                        <span className="flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                          CONTACT PRODUCER <MessageSquare className="w-3 h-3" />
                        </span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="text-brand-gold text-[10px] font-bold tracking-[0.6em] uppercase block mb-6">Referral Verification</span>
                    <h2 className="text-3xl italic mb-6">Invitation Details</h2>
                    <p className="text-brand-muted text-[10px] uppercase tracking-widest mb-10 opacity-60">
                      Please enter the username of the marketer who introduced you to our atelier.
                    </p>

                    <div className="space-y-8 text-left">
                      <div className="relative">
                        <input 
                          type="text"
                          placeholder="MARKETER USERNAME"
                          className="w-full text-center py-4 border-b border-brand-obsidian/20 focus:border-brand-gold bg-transparent uppercase tracking-widest text-xs font-bold"
                          value={marketerUsername}
                          onChange={(e) => setMarketerUsername(e.target.value)}
                        />
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <input 
                          type="checkbox" 
                          id="no-marketer" 
                          className="w-4 h-4 accent-brand-gold cursor-pointer"
                          onChange={(e) => {
                             if (e.target.checked) setMarketerUsername('NONE');
                             else setMarketerUsername('');
                          }}
                        />
                        <label htmlFor="no-marketer" className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 cursor-pointer">No marketer invited me</label>
                      </div>

                      <button 
                        onClick={() => handleContactProducer(!marketerUsername || marketerUsername === 'NONE' || marketerUsername === 'None (Direct)')}
                        className="btn-primary w-full group"
                      >
                        CONTINUE TO PRODUCTION
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
});

export default ClientWelcomePortal;
