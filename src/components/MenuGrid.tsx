/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Coffee, Trash2, Plus, Minus, Settings, Check, X, ShieldAlert } from 'lucide-react';
import { PRODUCTS, EXPLICIT_CATEGORIES } from '../data';
import { Product, CustomizationOptions } from '../types';

interface MenuGridProps {
  onAddToCart: (product: Product, customization: CustomizationOptions, quantity: number) => void;
  directAddProductId: string | null;
  resetDirectAddProductId: () => void;
}

export default function MenuGrid({
  onAddToCart,
  directAddProductId,
  resetDirectAddProductId,
}: MenuGridProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Default customization state for the modal dialog
  const [customTemp, setCustomTemp] = useState<'ice' | 'hot'>('ice');
  const [customSweet, setCustomSweet] = useState<'normal' | 'less' | 'no'>('normal');
  const [customIce, setCustomIce] = useState<'normal' | 'less' | 'no_ice'>('normal');
  const [customExtraShot, setCustomExtraShot] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);

  // Directly handle recommendations triggered from AI Chatbot
  React.useEffect(() => {
    if (directAddProductId) {
      const prod = PRODUCTS.find((p) => p.id === directAddProductId);
      if (prod) {
        handleOpenCustomizer(prod);
      }
      resetDirectAddProductId();
    }
  }, [directAddProductId]);

  const handleOpenCustomizer = (product: Product) => {
    setSelectedProduct(product);
    // Initialize default matching tags and availabilities
    setCustomTemp(product.isIceAvailable ? 'ice' : 'hot');
    setCustomSweet('normal');
    setCustomIce('normal');
    setCustomExtraShot(false);
    setCustomQuantity(1);
  };

  const handleCloseCustomizer = () => {
    setSelectedProduct(null);
  };

  const handleConfirmAdd = () => {
    if (!selectedProduct) return;
    onAddToCart(
      selectedProduct,
      {
        temp: customTemp,
        sweetness: customSweet,
        iceLevel: customIce,
        extraShot: customExtraShot,
      },
      customQuantity
    );
    handleCloseCustomizer();
  };

  // Filter products by category & search query
  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.indonesianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="cafe-menu-catalog" className="flex flex-col gap-6">
      
      {/* Search & Categories Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-xs font-mono text-[#d4a373] uppercase tracking-widest font-bold">Aura Fresh Brews</span>
          <h2 className="font-sans font-bold text-2xl text-white tracking-tight mt-1 uppercase italic">Daftar Menu Aura</h2>
        </div>

        {/* Beautiful Search input with glassmorphism */}
        <div className="relative w-full md:w-80">
          <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kopi, artisanal brew, croissant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-[#d4a373] focus:ring-1 focus:ring-[#d4a373] rounded-2xl py-2.5 pl-11 pr-4 text-xs sm:text-sm text-white outline-none transition-all placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EXPLICIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            id={`btn-cat-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex-shrink-0 flex items-center gap-1.5 backdrop-blur-sm cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#d4a373] text-black border-[#d4a373] shadow-md'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{cat.name}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeCategory === cat.id ? 'bg-[#b88c5f]/30 text-black' : 'bg-black/40 text-stone-500'
            }`}>
              {cat.id === 'all' 
                ? PRODUCTS.length 
                : PRODUCTS.filter(p => p.category === cat.id).length
              }
            </span>
          </button>
        ))}
      </div>

      {/* Products Grid in 3D perspective simulated tilt hover cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-[#d4a373]/30 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-[#d4a373]/5 transition-all duration-300 flex flex-col group relative"
            >
              {/* Product Thumbnail with slow hover scale */}
              <div className="relative aspect-video overflow-hidden bg-black/40">
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                />

                {/* Left Floating Rating */}
                <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-lg px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1 text-[11px] font-bold text-[#d4a373]">
                  <Star className="w-3.5 h-3.5 fill-[#d4a373] text-[#d4a373]" />
                  <span>{p.rating}</span>
                </div>

                {/* Right Special Badges */}
                <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
                  {p.tags.map((tag, i) => (
                    <span 
                      key={i} 
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        tag === 'Best Seller' 
                          ? 'bg-[#d4a373] text-black' 
                          : tag === 'Signature'
                          ? 'bg-indigo-600 text-indigo-100'
                          : 'bg-black/60 text-stone-300 border border-white/10'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Details info block */}
              <div className="p-4.5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#d4a373] tracking-widest font-bold">{p.category}</span>
                  <h3 className="font-sans font-bold text-base text-white group-hover:text-[#d4a373] transition-colors">
                    {p.indonesianName}
                  </h3>
                  <p className="text-gray-300 text-xs line-clamp-2 leading-relaxed">
                    {p.indonesianDescription}
                  </p>
                </div>

                {/* Product Purchase row */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-1">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 block">HARGA</span>
                    <span className="text-sm font-bold font-mono text-white">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <button
                    id={`btn-add-menu-${p.id}`}
                    onClick={() => handleOpenCustomizer(p)}
                    className="p-2.5 bg-[#d4a373] hover:bg-[#c29262] text-black rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 font-bold text-xs cursor-pointer group-hover:px-4"
                  >
                    <Plus className="w-4.5 h-4.5" />
                    <span className="hidden group-hover:inline transition-all duration-300">Pesan</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white/5 backdrop-blur-md rounded-3xl border border-dashed border-white/10">
          <Coffee className="w-8 h-8 text-stone-500 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-stone-300">Menu tidak ditemukan</h3>
          <p className="text-stone-500 text-xs mt-1">Silakan coba ganti filter kategori atau kata kunci pencarian Anda.</p>
        </div>
      )}

      {/* PopUp Customization Modal Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="backdrop-blur-xl bg-[#0c0908]/95 border border-white/10 rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative"
            >
              {/* Modal close icon */}
              <button
                id="btn-close-modal"
                onClick={handleCloseCustomizer}
                className="absolute top-4 right-4 p-2 bg-black/55 hover:bg-black text-gray-400 hover:text-white rounded-full transition-all border border-white/10 z-20 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Modal visual hero */}
              <div className="relative h-44 bg-black/40">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0908] to-transparent" />
                
                {/* Visual Title Details floating */}
                <div className="absolute bottom-4 left-5 pr-12">
                  <span className="text-[10px] font-mono text-[#d4a373] uppercase tracking-widest font-extrabold">{selectedProduct.category}</span>
                  <h3 className="text-white font-sans text-xl font-bold mt-0.5 leading-tight">{selectedProduct.indonesianName}</h3>
                </div>
              </div>

              {/* Modal customizations body */}
              <div className="p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-white/10 text-xs sm:text-sm">
                
                {/* English original description */}
                <p className="text-gray-300 text-xs italic leading-relaxed border-l-2 border-white/15 pl-3">
                  "{selectedProduct.indonesianDescription}"
                </p>

                {/* Section Temp options */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Tipe Penyajian</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      id="opt-temp-hot"
                      disabled={!selectedProduct.isHotAvailable}
                      onClick={() => setCustomTemp('hot')}
                      className={`py-2 p-3 rounded-2xl border text-center font-bold transition-all relative cursor-pointer ${
                        customTemp === 'hot'
                          ? 'bg-red-500/15 text-red-405 border-red-500/50 shadow-md shadow-red-500/10'
                          : selectedProduct.isHotAvailable
                          ? 'bg-black/35 border-white/5 text-gray-400 hover:bg-black/50'
                          : 'bg-black/10 border-white/5 text-gray-700 cursor-not-allowed'
                      }`}
                    >
                      🔥 Hangat (Hot)
                      {customTemp === 'hot' && <Check className="w-3.5 h-3.5 absolute top-2 right-2 text-red-400" />}
                    </button>
                    <button
                      id="opt-temp-ice"
                      disabled={!selectedProduct.isIceAvailable}
                      onClick={() => setCustomTemp('ice')}
                      className={`py-2 p-3 rounded-2xl border text-center font-bold transition-all relative cursor-pointer ${
                        customTemp === 'ice'
                          ? 'bg-blue-500/15 text-blue-405 border-blue-500/50 shadow-md shadow-blue-500/10'
                          : selectedProduct.isIceAvailable
                          ? 'bg-black/35 border-white/5 text-gray-400 hover:bg-black/50'
                          : 'bg-black/10 border-white/5 text-gray-700 cursor-not-allowed'
                      }`}
                    >
                      ❄️ Dingin (Ice)
                      {customTemp === 'ice' && <Check className="w-3.5 h-3.5 absolute top-2 right-2 text-blue-400" />}
                    </button>
                  </div>
                </div>

                {/* Customizations only applicable if category matches drinks */}
                {selectedProduct.category !== 'pastry' && (
                  <div className="flex flex-col gap-4 border-t border-white/10 pt-4">
                    
                    {/* Sweetness Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-gray-550 uppercase tracking-wider font-bold">
                        <span>Tingkat Kemanisan</span>
                        <span className="text-[#d4a373] font-bold capitalize">{customSweet} Sweet</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['normal', 'less', 'no'].map((sw) => (
                          <button
                            key={sw}
                            onClick={() => setCustomSweet(sw as any)}
                            className={`py-2 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                              customSweet === sw
                                ? 'bg-[#d4a373] text-black border-[#d4a373]'
                                : 'bg-black/40 border-white/5 text-gray-400 hover:bg-black/60'
                            }`}
                          >
                            {sw === 'normal' ? 'Normal' : sw === 'less' ? 'Less Sweet' : 'No Sugar'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ice Level Slider */}
                    {customTemp === 'ice' && (
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-mono text-gray-550 uppercase tracking-wider font-bold">
                          <span>Kuantitas Es</span>
                          <span className="text-blue-400 font-bold capitalize">{customIce === 'no_ice' ? 'No Ice' : customIce}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['normal', 'less', 'no_ice'].map((ice) => (
                            <button
                              key={ice}
                              onClick={() => setCustomIce(ice as any)}
                              className={`py-2 text-xs rounded-xl border font-bold transition-all cursor-pointer ${
                                customIce === ice
                                  ? 'bg-blue-500 text-black border-blue-400'
                                  : 'bg-black/40 border-white/5 text-gray-400 hover:bg-black/60'
                              }`}
                            >
                              {ice === 'normal' ? 'Normal Es' : ice === 'less' ? 'Less Ice' : 'Tanpa Es'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Extra Shot checkbox */}
                    <div className="flex items-center justify-between bg-black/30 p-3.5 rounded-2xl border border-white/5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-200">Extra Espresso Shot (+Rp 5.000)</span>
                        <span className="text-[10px] text-gray-500">Menambah ketebalan dan intensitas kepahitan kopi</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCustomExtraShot(!customExtraShot)}
                        className={`w-11 h-6.5 rounded-full p-1 transition-colors duration-200 outline-none flex items-center cursor-pointer ${
                          customExtraShot ? 'bg-[#d4a373] justify-end' : 'bg-white/10 justify-start'
                        }`}
                      >
                        <motion.div 
                          layout
                          className="w-4.5 h-4.5 rounded-full bg-white shadow" 
                        />
                      </button>
                    </div>

                  </div>
                )}

                {/* Product quantitive selection counter */}
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-550 uppercase tracking-wider font-bold">Kuantitas</span>
                  <div className="flex items-center gap-3 bg-black/50 px-2 py-1.5 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setCustomQuantity(Math.max(1, customQuantity - 1))}
                      className="p-1 px-2.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-white">{customQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setCustomQuantity(customQuantity + 1)}
                      className="p-1 px-2.5 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Modal controls summary footpanel */}
              <div className="bg-black/65 p-5 mt-auto border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 block">SUBTOTAL</span>
                  <span className="text-base font-bold font-mono text-[#d4a373]">
                    Rp {((selectedProduct.price + (customExtraShot && selectedProduct.category !== 'pastry' ? 5000 : 0)) * customQuantity).toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  id="btn-confirm-add"
                  onClick={handleConfirmAdd}
                  className="px-6 py-3 bg-[#d4a373] hover:bg-[#c29262] text-black rounded-2xl transition-all shadow-lg active:scale-95 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  Tambahkan ke Keranjang
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
