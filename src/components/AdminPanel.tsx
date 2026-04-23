import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Trash2, Edit2, LogOut, Save, X, Image as ImageIcon, 
  ShieldCheck, Sparkles, Loader2, ShoppingBag, User as UserIcon,
  Briefcase, Mail, Calendar, MessageSquare, Clock, UserPlus, Layers 
} from 'lucide-react';
import { 
  auth, signOut as fbSignOut, getProducts, addProduct, 
  updateProduct, deleteProduct, getBranding, updateBranding, 
  getMarketers, getReferralLeads, addSiteAsset, updateSiteAsset, 
  deleteSiteAsset, getSiteAssets as getSiteAssetsLib 
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { formatPrice } from '../lib/currency';
import { identifyFootwear } from '../services/geminiService';
import { compressImage } from '../lib/image';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const [activeTab, setActiveTab] = useState<'collection' | 'branding' | 'marketers' | 'assets'>('collection');
  const [products, setProducts] = useState<any[]>([]);
  const [marketers, setMarketers] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [siteAssets, setSiteAssets] = useState<any[]>([]);
  const [branding, setBranding] = useState<any>({ logoUrl: '', heroUrl: '' });
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'FORMAL SERIES',
    image: '',
    description: '',
    tag: 'NEW ARRIVAL'
  });
  const [assetFormData, setAssetFormData] = useState({
    url: '',
    category: 'artisan',
    title: ''
  });
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const isAdmin = u.email === 'fevisfootwears@gmail.com';
        setIsAdminUser(isAdmin);
        
        if (isAdmin) {
          fetchProducts();
          fetchBranding();
          fetchMarketers();
          fetchReferrals();
          fetchAllSiteAssets();
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchMarketers = async () => {
    try {
      const data = await getMarketers();
      setMarketers(data);
    } catch (error) {
      console.error("Fetch marketers error:", error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const data = await getReferralLeads();
      setReferrals(data);
    } catch (error) {
      console.error("Fetch referrals error:", error);
    }
  };

  const fetchAllSiteAssets = async () => {
    try {
      const artisan = await getSiteAssetsLib('artisan');
      const bespoke = await getSiteAssetsLib('bespoke');
      const journal = await getSiteAssetsLib('journal');
      const profile = await getSiteAssetsLib('profile');
      setSiteAssets([...artisan, ...bespoke, ...journal, ...profile]);
    } catch (error) {
      console.error("Fetch assets error:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Fetch products error:", error);
    }
  };

  const fetchBranding = async () => {
    try {
      const data = await getBranding();
      if (data) setBranding(data);
    } catch (error) {
      console.error("Fetch branding error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateProduct(isEditing, { ...formData, price: Number(formData.price) });
      } else {
        await addProduct({ ...formData, price: Number(formData.price) });
      }
      setFormData({ name: '', price: '', category: 'FORMAL SERIES', image: '', description: '', tag: 'NEW ARRIVAL' });
      setIsEditing(null);
      fetchProducts();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error managing product. Ensure you have admin permissions.");
    }
  };

  const handleEdit = (product: any) => {
    setIsEditing(product.id);
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      image: product.image,
      description: product.description || '',
      tag: product.tag || 'NEW ARRIVAL'
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this piece from the collection?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-serif italic uppercase tracking-widest bg-brand-cream">Loading Atelier...</div>;

  if (!user || !isAdminUser) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`luxury-card max-w-md w-full p-12 text-center ${user && !isAdminUser ? 'border-red-900/30' : ''}`}
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 ${user && !isAdminUser ? 'bg-red-900/10' : 'bg-brand-gold/10'}`}>
            <ShieldCheck className={`w-8 h-8 ${user && !isAdminUser ? 'text-red-900 opacity-60' : 'text-brand-gold opacity-60'}`} />
          </div>
          <h2 className="text-3xl mb-8 leading-tight italic">
            {user && !isAdminUser ? 'RESTRICTED ACCESS' : 'ATELIER CONTROL'}
          </h2>
          <p className="text-brand-muted text-sm mb-12 leading-relaxed">
            {user && !isAdminUser 
              ? 'Your account does not have administrative privileges. Access to the Atelier control systems is strictly regulated.'
              : 'Please authenticate your identity to manage the Vourphy\'s Atelier collections and high-security systems.'}
          </p>
          
          {!user ? (
            <Link 
              to="/entry"
              className="btn-primary w-full inline-block"
            >
              GOT TO ENTRY PORTAL
            </Link>
          ) : (
            <div className="space-y-6">
               <div className="p-4 bg-red-900/5 text-red-900/60 text-[10px] font-bold tracking-widest uppercase">
                 Permitted identity required
               </div>
               <button 
                 onClick={() => fbSignOut()}
                 className="text-[10px] font-bold tracking-widest uppercase opacity-40 hover:opacity-100 transition-opacity"
               >
                 SIGN OUT OF {user.email}
               </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  const GALLERY_IMAGES = [
    { name: 'Classic Oxford', url: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=2060' },
    { name: 'Chelsea Boot', url: 'https://images.unsplash.com/photo-1638247025967-b4e38f687b76?q=80&w=1964' },
    { name: 'Luxury Sneaker', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974' },
    { name: 'Monk Strap', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012' },
    { name: 'Suede Derby', url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000' },
    { name: 'Italian Loafer', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=2070' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'product' | 'logo' | 'hero') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setProcessing(true);
      reader.onloadend = async () => {
        try {
          let result = reader.result as string;
          
          // Apply luxury optimization: automatically compress high-res mobile photos
          // to fit within artisan database limits while preserving elegance.
          result = await compressImage(result, 1200, 1200, 0.6);
          
          if (target === 'product') {
            setFormData(prev => ({ ...prev, image: result }));
          } else if (target === 'logo') {
            setBranding((prev: any) => ({ ...prev, logoUrl: result }));
          } else if (target === 'hero') {
            setBranding((prev: any) => ({ ...prev, heroUrl: result }));
          }
        } catch (error) {
          console.error("Optimization failed:", error);
          alert("Failed to optimize the image for the digital atelier.");
        } finally {
          setProcessing(false);
        }
      };
      reader.onerror = () => {
        alert("Failed to process image.");
        setProcessing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const autoIdentifyFootwear = async () => {
    if (!formData.image) return;
    try {
      setProcessing(true);
      const result = await identifyFootwear(formData.image);
      setFormData(prev => ({
        ...prev,
        name: result.name || prev.name,
        description: result.description || prev.description,
        tag: result.suggestedTag || prev.tag
      }));
    } catch (error) {
      console.error("AI Identification failed:", error);
      alert("AI was unable to identify this piece. Please enter details manually.");
    } finally {
      setProcessing(false);
    }
  };

  const handleAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessing(true);
      if (editingAssetId) {
        await updateSiteAsset(editingAssetId, assetFormData);
      } else {
        await addSiteAsset(assetFormData);
      }
      setAssetFormData({ url: '', category: 'artisan', title: '' });
      setEditingAssetId(null);
      fetchAllSiteAssets();
    } catch (error) {
      console.error("Asset submit error:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleAssetDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this visual asset?")) {
      await deleteSiteAsset(id);
      fetchAllSiteAssets();
    }
  };

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      setProcessing(true);
      reader.onloadend = async () => {
        try {
          let result = reader.result as string;
          result = await compressImage(result, 1600, 1600, 0.7);
          setAssetFormData(prev => ({ ...prev, url: result }));
        } catch (error) {
          console.error("Asset optimization failed:", error);
        } finally {
          setProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrandingSave = async () => {
    try {
      setProcessing(true);
      await Promise.all([
        updateBranding('logo', branding.logoUrl),
        updateBranding('hero', branding.heroUrl)
      ]);
      alert("Atelier branding updated successfully.");
    } catch (error) {
      console.error("Branding update error:", error);
      alert("Failed to update branding settings.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl mb-2 italic">ATELIER CONTROL</h1>
            <p className="text-brand-muted text-[10px] tracking-widest uppercase">
              ADMINISTRATOR ACCESS • {user.email}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <a 
              href="/#collections"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-brand-gold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              SHOWROOM MENU
            </a>
            <Link 
              to="/"
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-brand-gold transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              BACK TO HOME
            </Link>
            <button 
              onClick={() => fbSignOut()}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase hover:text-brand-gold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              EXIT PANEL
            </button>
          </div>
        </div>

        <div className="flex gap-8 mb-12 border-b border-brand-obsidian/10">
          <button 
            onClick={() => setActiveTab('collection')}
            className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-all relative ${activeTab === 'collection' ? 'text-brand-gold' : 'opacity-40 hover:opacity-100'}`}
          >
            PRODUCT COLLECTION
            {activeTab === 'collection' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold" />}
          </button>
          <button 
            onClick={() => setActiveTab('branding')}
            className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-all relative ${activeTab === 'branding' ? 'text-brand-gold' : 'opacity-40 hover:opacity-100'}`}
          >
            SITE BRANDING
            {activeTab === 'branding' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold" />}
          </button>
          <button 
            onClick={() => setActiveTab('marketers')}
            className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-all relative ${activeTab === 'marketers' ? 'text-brand-gold' : 'opacity-40 hover:opacity-100'}`}
          >
            MARKETER TALENT
            {activeTab === 'marketers' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold" />}
          </button>
          <button 
            onClick={() => setActiveTab('assets')}
            className={`pb-4 text-[11px] font-bold tracking-[0.3em] uppercase transition-all relative ${activeTab === 'assets' ? 'text-brand-gold' : 'opacity-40 hover:opacity-100'}`}
          >
            SITE ASSET HUB
            {activeTab === 'assets' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-gold" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {activeTab === 'collection' && (
            <>
              {/* Management Form */}
              <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="luxury-card p-8 sticky top-32"
            >
              <h2 className="text-2xl mb-8 flex items-center gap-3 italic">
                {isEditing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {isEditing ? 'REFINING PIECE' : 'NEW ACQUISITION'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">PIECE NAME</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm"
                    placeholder="e.g. The Sovereign Oxford"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">PRICE (₦)</label>
                    <input 
                      required
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm"
                      placeholder="675000"
                    />
                    {formData.price && !isNaN(Number(formData.price)) && (
                      <p className="text-[9px] font-bold text-brand-gold mt-2 uppercase tracking-widest">
                        Approx. {formatPrice(Number(formData.price)).usd}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">TAG</label>
                    <input 
                      value={formData.tag}
                      onChange={e => setFormData({...formData, tag: e.target.value})}
                      className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm"
                      placeholder="NEW ARRIVAL"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">COLLECTION CATEGORY</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm appearance-none"
                  >
                    <option value="FORMAL SERIES">FORMAL SERIES</option>
                    <option value="JOURNEY COLLECTION">JOURNEY COLLECTION</option>
                    <option value="CASUAL LUXURY">CASUAL LUXURY</option>
                    <option value="CRAFT SERIES">CRAFT SERIES</option>
                  </select>
                </div>                {/* Artisan Image Manager */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">ARTISAN IMAGE MANAGER</label>
                    {formData.image && (
                      <button 
                        type="button" 
                        onClick={autoIdentifyFootwear}
                        disabled={processing}
                        className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-brand-gold hover:opacity-70 transition-opacity border border-brand-gold/20 px-2 py-0.5 rounded-full bg-brand-gold/5"
                      >
                        {processing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        AI SOURCE: Artisan Detect
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {formData.image ? (
                      <div className="relative aspect-[4/3] rounded overflow-hidden group">
                        <img src={formData.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-brand-obsidian/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, image: ''})}
                            className="text-white text-[10px] font-bold tracking-widest uppercase"
                          >
                            Change Heritage Shot
                          </button>
                        </div>
                        {processing && (
                          <div className="absolute inset-0 bg-brand-obsidian/40 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-brand-obsidian/10 rounded-lg p-6 hover:border-brand-gold transition-colors cursor-pointer group overflow-hidden">
                          <ImageIcon className="w-6 h-6 mb-2 opacity-20 group-hover:text-brand-gold group-hover:opacity-100 transition-all" />
                          <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">Upload New Shot</span>
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'product')} 
                          />
                        </label>
                        <button 
                          type="button"
                          onClick={() => setFormData({...formData, image: GALLERY_IMAGES[0].url})}
                          className="flex flex-col items-center justify-center border border-brand-obsidian/10 rounded-lg p-6 hover:border-brand-gold transition-colors group"
                        >
                          <Plus className="w-6 h-6 mb-2 opacity-20 group-hover:text-brand-gold group-hover:opacity-100 transition-all" />
                          <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">Gallery Pick</span>
                        </button>
                      </div>
                    )}
                    
                    {/* Gallery Carousel (Simplified) */}
                    {!formData.image && (
                      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {GALLERY_IMAGES.map((img) => (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setFormData({...formData, image: img.url})}
                            className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-brand-obsidian/10 hover:border-brand-gold transition-all"
                          >
                            <img src={img.url} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">DESCRIPTION</label>
                  <textarea 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm min-h-[100px] resize-none"
                    placeholder="Describe the artisan techniques used..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={!formData.image} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                    <Save className="w-4 h-4" />
                    {isEditing ? 'COMMIT CHANGES' : 'ADD TO ATELIER'}
                  </button>
                  {isEditing && (
                    <button 
                      type="button"
                      onClick={() => setIsEditing(null)}
                      className="p-3 border border-brand-obsidian/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            <h2 className="text-[11px] font-bold tracking-[0.4em] uppercase opacity-40 mb-8">ACTIVE COLLECTION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  layout
                  className="luxury-card p-6 flex gap-6 items-center group"
                >
                  <div className="w-24 h-32 bg-brand-obsidian/5 overflow-hidden flex-shrink-0">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[9px] font-bold tracking-widest text-brand-gold mb-1 block">{product.category}</span>
                    <h3 className="text-lg leading-tight mb-1">{product.name}</h3>
                    <div className="mb-4">
                      <p className="text-serif italic">{formatPrice(product.price).ngn}</p>
                      <p className="text-[9px] font-bold opacity-30 mt-0.5 uppercase tracking-widest">{formatPrice(product.price).usd}</p>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleEdit(product)}
                        className="text-[10px] font-bold tracking-widest uppercase hover:text-brand-gold transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> EDIT
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-[10px] font-bold tracking-widest uppercase text-red-800 hover:opacity-70 transition-opacity flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> REMOVE
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
          )}

          {activeTab === 'branding' && (
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-16"
              >
            {/* Logo Branding */}
            <div className="luxury-card p-12 relative overflow-hidden">
              <h3 className="text-2xl mb-8 italic">Atelier Logo Signature</h3>
              <div className="space-y-8">
                <div className="bg-brand-obsidian p-12 flex items-center justify-center rounded-lg min-h-[200px] relative">
                  {branding.logoUrl ? (
                    <img src={branding.logoUrl} className="max-h-32 w-auto object-contain" />
                  ) : (
                    <div className="text-white/20 text-[10px] font-bold tracking-widest uppercase">No Signature Set</div>
                  )}
                  {processing && activeTab === 'branding' && (
                    <div className="absolute inset-0 bg-brand-obsidian/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className={`btn-primary w-full flex items-center justify-center gap-2 cursor-pointer ${processing ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ImageIcon className="w-4 h-4" />
                  {branding.logoUrl ? 'Update Logo Shot' : 'Upload Logo Signature'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} disabled={processing} />
                </label>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest text-center leading-relaxed">
                  Recommended: PNG with transparent background. This appears in the Navbar and Hero cover.
                </p>
              </div>
            </div>

            {/* Hero Branding */}
            <div className="luxury-card p-12 relative overflow-hidden">
              <h3 className="text-2xl mb-8 italic">Atelier Cover Image</h3>
              <div className="space-y-8">
                <div className="relative aspect-video bg-brand-obsidian rounded-lg overflow-hidden flex items-center justify-center">
                  {branding.heroUrl ? (
                    <img src={branding.heroUrl} className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <div className="text-white/20 text-[10px] font-bold tracking-widest uppercase">No Cover Shot Set</div>
                  )}
                  {processing && activeTab === 'branding' && (
                    <div className="absolute inset-0 bg-brand-obsidian/60 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <label className={`relative btn-primary w-full flex items-center justify-center gap-2 cursor-pointer overflow-hidden ${processing ? 'opacity-50 pointer-events-none' : ''}`}>
                  <ImageIcon className="w-4 h-4" />
                  {branding.heroUrl ? 'Update Cover Shot' : 'Upload Cover Shot'}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                    accept="image/*" 
                    onChange={(e) => handleImageUpload(e, 'hero')} 
                    disabled={processing} 
                  />
                </label>
                <p className="text-[10px] text-brand-muted uppercase tracking-widest text-center leading-relaxed">
                  Recommended: High resolution landscape image. This creates the primary atmosphere of your digital atelier.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center pt-8">
              <button 
                onClick={handleBrandingSave}
                className="btn-primary px-24 py-4 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                COMMIT BRANDING CHANGES
              </button>
            </div>
          </motion.div>
        </div>
          )}

          {activeTab === 'marketers' && (
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                  <div>
                    <span className="text-brand-gold text-[10px] font-bold tracking-[0.4em] uppercase block mb-4">Talent Management</span>
                    <h2 className="text-4xl md:text-5xl italic leading-tight">Registered Artisans</h2>
                    <p className="text-brand-muted text-sm mt-4 opacity-70">Overseeing the Vourphy's creative and marketing network.</p>
                  </div>
                  <div className="bg-brand-gold/5 p-6 border border-brand-gold/10">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-1 opacity-60">Total Force</p>
                    <p className="text-3xl font-serif text-brand-gold">{marketers.length}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {marketers.length > 0 ? marketers.map((m) => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="luxury-card group"
                    >
                      <div className="p-8 flex items-center gap-6">
                        <div className="w-16 h-16 bg-brand-obsidian/5 rounded-full overflow-hidden flex-shrink-0 border border-brand-obsidian/10 transition-transform duration-500 group-hover:scale-110">
                          {m.photoURL ? (
                            <img src={m.photoURL} alt={m.displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <UserIcon className="w-6 h-6 opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl italic truncate mb-1 group-hover:text-brand-gold transition-colors">{m.displayName || 'Anonymous Artisan'}</h4>
                          <div className="space-y-1.5">
                            <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                              <Mail className="w-3 h-3 text-brand-gold" /> {m.email}
                            </p>
                            <p className="text-[9px] uppercase tracking-[0.2em] opacity-40 flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-brand-gold" /> Registered {m.registeredAt?.toDate ? new Date(m.registeredAt.toDate()).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="h-px w-full bg-brand-obsidian/5" />
                      <div className="px-8 py-3 bg-brand-cream/40 flex justify-between items-center">
                        <span className="text-[8px] font-bold tracking-[0.3em] uppercase opacity-40">Status: Verified</span>
                        <div className="flex gap-1">
                          {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-brand-gold/40" />)}
                        </div>
                      </div>
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-32 text-center border-2 border-dashed border-brand-obsidian/5">
                      <Briefcase className="w-12 h-12 opacity-5 mx-auto mb-6" />
                      <p className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-40">No markters have registered through the portal yet.</p>
                      <p className="text-xs italic mt-4 opacity-30">The Artisan network is awaiting its first members.</p>
                    </div>
                  )}
                </div>

                {/* Referral Logs Section */}
                <div className="mt-24">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="h-px flex-1 bg-brand-obsidian/10" />
                    <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40">Client Referral Logs</h3>
                    <div className="h-px flex-1 bg-brand-obsidian/10" />
                  </div>

                  <div className="luxury-card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-brand-obsidian/10 bg-brand-obsidian/[0.02]">
                            <th className="px-8 py-6 text-[9px] font-bold tracking-widest uppercase opacity-40">Timestamp</th>
                            <th className="px-8 py-6 text-[9px] font-bold tracking-widest uppercase opacity-40">Type</th>
                            <th className="px-8 py-6 text-[9px] font-bold tracking-widest uppercase opacity-40">Referral Attribution</th>
                            <th className="px-8 py-6 text-[9px] font-bold tracking-widest uppercase opacity-40">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-obsidian/5">
                          {referrals.length > 0 ? referrals.map((ref) => (
                            <tr key={ref.id} className="group hover:bg-brand-gold/[0.02] transition-colors">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <Clock className="w-3.5 h-3.5 text-brand-gold opacity-40" />
                                  <span className="text-xs opacity-60">
                                    {ref.timestamp?.toDate ? new Date(ref.timestamp.toDate()).toLocaleString() : 'Recent'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`text-[8px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${ref.type === 'no_marketer' ? 'bg-brand-obsidian/5 opacity-40' : 'bg-brand-gold/10 text-brand-gold'}`}>
                                  {ref.type === 'no_marketer' ? 'DIRECT VISIT' : 'MARKETER REFERRAL'}
                                </span>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  {ref.type === 'with_marketer' ? (
                                    <>
                                      <UserPlus className="w-3.5 h-3.5 text-brand-gold" />
                                      <span className="text-xs font-bold uppercase tracking-widest">{ref.marketerUsername}</span>
                                    </>
                                  ) : (
                                    <span className="text-xs opacity-20 uppercase tracking-widest italic leading-none">Organic Entrance</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                                  <span className="text-[9px] font-bold tracking-widest uppercase opacity-40">Contact Linked</span>
                                </div>
                              </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={4} className="px-8 py-24 text-center">
                                <p className="text-[9px] font-bold tracking-[0.4em] uppercase opacity-40 italic">Sequential inquiry history is currently empty.</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-16"
              >
                <div className="lg:col-span-1">
                  <div className="luxury-card p-8 sticky top-32">
                    <h3 className="text-2xl mb-8 italic flex items-center gap-3">
                      <Layers className="w-5 h-5 text-brand-gold" />
                      {editingAssetId ? 'REFINING ASSET' : 'NEW VISUAL ASSET'}
                    </h3>
                    <form onSubmit={handleAssetSubmit} className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">TARGET SECTION</label>
                        <select 
                          value={assetFormData.category}
                          onChange={e => setAssetFormData({...assetFormData, category: e.target.value})}
                          className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm appearance-none"
                        >
                          <option value="profile">VISION HOLDER (SOLE ADMIN PHOTO)</option>
                          <option value="artisan">MASTER ARTISAN WORK</option>
                          <option value="bespoke">BESPOKE INQUIRY</option>
                          <option value="journal">ATELIER JOURNAL</option>
                        </select>
                        {assetFormData.category === 'profile' && (
                          <div className="mt-4 p-4 bg-brand-gold/5 border border-brand-gold/20">
                            <p className="text-[10px] text-brand-gold font-bold tracking-[0.2em] uppercase mb-1">
                              Artisan Space Anchor
                            </p>
                            <p className="text-[9px] text-brand-muted italic opacity-80 leading-relaxed uppercase">
                              This portrait represents the Vision Holder & Architect. Only one portrait can be active at the pinnacle of the atelier archive.
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40">ASSET TITLE (NARRATIVE)</label>
                        {assetFormData.url && (
                          <button 
                            type="button"
                            onClick={async () => {
                              try {
                                setProcessing(true);
                                const result = await identifyFootwear(assetFormData.url);
                                setAssetFormData(prev => ({ ...prev, title: result.name }));
                              } catch (e) {
                                console.error("Asset AI fail:", e);
                                alert("AI source unable to identify asset details.");
                              } finally {
                                setProcessing(false);
                              }
                            }}
                            disabled={processing}
                            className="text-[8px] font-bold tracking-widest uppercase text-brand-gold flex items-center gap-1 hover:opacity-70 transition-opacity border border-brand-gold/10 px-2 py-0.5 rounded-full bg-brand-gold/5 shadow-sm"
                          >
                            {processing ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Sparkles className="w-2.5 h-2.5" />}
                            AI ANALYZE & CONNECT
                          </button>
                        )}
                      </div>
                      <input 
                        required
                        value={assetFormData.title}
                        onChange={e => setAssetFormData({...assetFormData, title: e.target.value})}
                        className="w-full bg-transparent border-b border-brand-obsidian/20 py-2 outline-none focus:border-brand-gold transition-colors text-sm"
                        placeholder="e.g. Sculpting the Sole"
                      />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-40 block mb-2">VISUAL ASSET</label>
                        <div className="space-y-4">
                          {assetFormData.url ? (
                            <div className="relative aspect-video rounded overflow-hidden group">
                              <img src={assetFormData.url} className="w-full h-full object-cover" />
                              <button 
                                type="button"
                                onClick={() => setAssetFormData({...assetFormData, url: ''})}
                                className="absolute inset-0 bg-brand-obsidian/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold tracking-widest uppercase"
                              >
                                Replace Asset
                              </button>
                            </div>
                          ) : (
                            <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-brand-obsidian/10 rounded-lg p-12 hover:border-brand-gold transition-colors cursor-pointer group overflow-hidden">
                              <ImageIcon className="w-8 h-8 mb-4 opacity-20 group-hover:text-brand-gold group-hover:opacity-100 transition-all" />
                              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40 text-center">Click to Transmit Asset</span>
                              <input 
                                type="file" 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                                accept="image/*" 
                                onChange={(e) => handleAssetUpload(e)} 
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={!assetFormData.url || processing} className="btn-primary flex-1 flex items-center justify-center gap-2">
                          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          {editingAssetId ? 'COMMIT ASSET' : 'PUBLISH ASSET'}
                        </button>
                        {editingAssetId && (
                          <button 
                            type="button"
                            onClick={() => {
                              setEditingAssetId(null);
                              setAssetFormData({ url: '', category: 'artisan', title: '' });
                            }}
                            className="p-3 border border-brand-obsidian/10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-16">
                  {['profile', 'artisan', 'bespoke', 'journal'].map((cat) => (
                    <div key={cat}>
                      <h4 className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40 mb-8 border-b border-brand-obsidian/10 pb-4 flex justify-between items-center">
                        <span>{cat === 'profile' ? 'VISION HOLDER & ARCHITECT' : cat} LIBRARY</span>
                        {cat === 'profile' && <ShieldCheck className="w-4 h-4 text-brand-gold" />}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {siteAssets.filter(a => a.category === cat).length > 0 ? (
                          siteAssets.filter(a => a.category === cat).map((asset) => (
                            <div key={asset.id} className="luxury-card overflow-hidden group">
                              <div className="aspect-video relative overflow-hidden bg-brand-obsidian/5">
                                <img src={asset.url} alt={asset.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-brand-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                  <button 
                                    onClick={() => {
                                      setEditingAssetId(asset.id);
                                      setAssetFormData({ url: asset.url, category: asset.category, title: asset.title });
                                    }}
                                    className="w-10 h-10 bg-white text-brand-obsidian rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-white transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleAssetDelete(asset.id)}
                                    className="w-10 h-10 bg-white text-red-900 rounded-full flex items-center justify-center hover:bg-red-900 hover:text-white transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="p-4 flex justify-between items-center">
                                <p className="text-sm italic opacity-80">{asset.title}</p>
                                <span className="text-[8px] font-bold tracking-widest uppercase opacity-30">
                                  {asset.updatedAt?.toDate ? new Date(asset.updatedAt.toDate()).toLocaleDateString() : 'Active'}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-1 md:col-span-2 py-12 text-center border border-dashed border-brand-obsidian/5 rounded-lg">
                            <p className="text-[9px] font-bold tracking-widest uppercase opacity-20">No assets published in this archive.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
