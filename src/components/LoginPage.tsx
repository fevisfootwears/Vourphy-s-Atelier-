import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, LogIn } from 'lucide-react';
import { auth, signInWithGoogle, checkIfMarketer } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        verifyAccess(u);
      }
    });
    return () => unsubscribe();
  }, []);

  const verifyAccess = async (u: User) => {
    setIsVerifying(true);
    setError(null);
    try {
      const isAdmin = u.email === 'fevisfootwears@gmail.com' && u.emailVerified;
      const isMarketer = await checkIfMarketer(u.uid);

      if (isAdmin) {
        navigate('/admin');
      } else if (isMarketer) {
        navigate('/marketer-hub');
      } else {
        setError('Access restricted to permitted Atelier identities only.');
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError('System verification failed. Please contact high-level support.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in failed:", err);
      setError('Authentication failed. Please check your network connection.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="luxury-card max-w-md w-full p-12 text-center"
      >
        <div className="w-20 h-20 bg-brand-gold/5 rounded-full flex items-center justify-center mx-auto mb-10">
          <ShieldCheck className="w-10 h-10 text-brand-gold opacity-40" />
        </div>
        
        <h1 className="text-3xl md:text-4xl mb-4 italic">ATELIER ENTRY</h1>
        <p className="text-brand-muted text-xs tracking-[0.3em] uppercase mb-12">Authorized Personnel Only</p>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-900/5 text-red-900 border border-red-900/10 text-[10px] font-bold tracking-widest uppercase mb-8"
          >
            {error}
          </motion.div>
        )}

        {isVerifying ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-40">Verifying Identity...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {!user ? (
              <button 
                onClick={handleSignIn}
                className="btn-primary w-full flex items-center justify-center gap-3 group"
              >
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                AUTHENTICATE IDENTITY
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-bold tracking-widest uppercase opacity-40 mb-2">Signed in as {user.email}</p>
                <button 
                  onClick={() => verifyAccess(user)}
                  className="btn-primary w-full flex items-center justify-center gap-3"
                >
                  ENTER MANAGEMENT SUITE
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => auth.signOut()}
                  className="text-[10px] font-bold tracking-widest uppercase opacity-30 hover:opacity-100 transition-opacity"
                >
                  USE DIFFERENT IDENTITY
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-brand-obsidian/5">
          <p className="text-[9px] text-brand-muted tracking-widest uppercase leading-relaxed">
            All entry attempts are recorded in the <br /> Atelier Security Journal.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
