/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, Clock, Music, Volume2, VolumeX, Flame, Store, 
  MapPin, Heart, Share2, Sparkles, Send, Calendar, CheckSquare
} from 'lucide-react';

import { PRODUCTS, FLOOR_SECTIONS } from './data';
import { Product, CustomizationOptions, CartItem } from './types';

// Importing subcomponents
import ThreeDView from './components/ThreeDView';
import AIBarista from './components/AIBarista';
import MenuGrid from './components/MenuGrid';
import CartAndCheckout from './components/CartAndCheckout';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSection, setSelectedSection] = useState('brewbar');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [directAddProductId, setDirectAddProductId] = useState<string | null>(null);
  
  // Realtime clock and date
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Custom Ambient cafe audio loop
  const [isMuted, setIsMuted] = useState(true);
  const [audioTrack, setAudioTrack] = useState<'lofi' | 'chatter'>('lofi');
  const lofiAudioRef = useRef<HTMLAudioElement | null>(null);

  // Time ticker update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync ambient audio mute setting
  useEffect(() => {
    if (lofiAudioRef.current) {
      lofiAudioRef.current.muted = isMuted;
      if (!isMuted) {
        lofiAudioRef.current.play().catch(err => {
          console.log("Audio autoplay prevented by standard browser sandboxing constraints:", err);
        });
      }
    }
  }, [isMuted, audioTrack]);

  // Audio track source mapping
  const activeAudioUrl = audioTrack === 'lofi'
    ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' // Pleasant acoustic lofi tune
    : 'https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav'; // Soft coffee shop rain visual loop

  // Basket Management Functions
  const handleAddToCart = (product: Product, customization: CustomizationOptions, quantity: number) => {
    const configKey = `${product.id}-${customization.temp}-${customization.sweetness}-${customization.iceLevel}-${customization.extraShot ? 'yes' : 'no'}`;
    
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === configKey);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      } else {
        return [...prev, {
          id: configKey,
          product,
          quantity,
          customization,
        }];
      }
    });

    // Automatically transition 3D perspective seating to the matched category section to increase visual feedback
    const matchedSection = FLOOR_SECTIONS.find(sec => sec.items.includes(product.id));
    if (matchedSection) {
      setSelectedSection(matchedSection.id);
    }
  };

  const handleRemoveCartItem = (idToDel: string) => {
    setCart((prev) => prev.filter((item) => item.id !== idToDel));
  };

  const handleUpdateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.id === itemId) {
          const nextQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: nextQty };
        }
        return item;
      })
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Add recommend product automatically trigger from chatbot
  const handleAddProductDirectly = (productId: string) => {
    setDirectAddProductId(productId);
    // Smooth scroll down inline to product customizer modal grid
    const target = document.getElementById('cafe-menu-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculate local timezone for Bandung WIB (GMT+7)
  const getBandungTimeStr = () => {
    return currentTime.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Jakarta',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getBandungCloseStatus = () => {
    // Kalandra open hours: 07:00 to 23:00 (WIB)
    const jakartaDate = new Date(currentTime.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const hrs = jakartaDate.getHours();
    return hrs >= 7 && hrs < 23 
      ? { text: 'BUKA', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
      : { text: 'TUTUP', color: 'bg-red-500/10 text-red-500 border-red-500/20' };
  };

  const openStatus = getBandungCloseStatus();

  return (
    <div className="bg-coffee-dark min-h-screen text-white font-sans selection:bg-amber-gold/35 selection:text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] md:w-[50%] aspect-square bg-[#4a2c1d] rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] md:w-[60%] aspect-square bg-[#b07d62] rounded-full blur-[150px] opacity-20"></div>
        <div className="absolute top-[30%] right-[10%] w-[40%] md:w-[30%] aspect-square bg-[#2d1b14] rounded-full blur-[100px] opacity-35"></div>
      </div>

      {/* Hidden acoustic tags */}
      <audio
        ref={lofiAudioRef}
        src={activeAudioUrl}
        loop
        muted={isMuted}
      />

      {/* Elegant Header and utility toolbar */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-4.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4a373] to-[#8b5e34] font-bold flex items-center justify-center text-xl shadow-lg rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              ☕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans font-bold text-lg text-white tracking-tight leading-none">Aura <span className="text-[#d4a373]">Coffee</span></span>
                <span className="text-[9px] font-mono text-[#d4a373] border border-[#d4a373]/30 bg-[#d4a373]/10 px-1.5 py-0.5 rounded uppercase font-semibold">Specialty</span>
              </div>
              <span className="text-xs text-gray-400 font-mono mt-1 block">Artisanal Brew & Seating Point</span>
            </div>
          </div>

          {/* Right Live statistics widgets representing realistic parameters */}
          <div className="flex flex-wrap items-center gap-3.5 mt-1 sm:mt-0 text-xs font-mono text-gray-300">
            {/* Location marker */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 p-2 px-3 rounded-xl backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>Dago, Bandung</span>
            </div>

            {/* Simulated Live time representing WIB time zone */}
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 px-3 rounded-xl backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-[#d4a373]" />
              <span className="text-gray-200 font-semibold">{getBandungTimeStr()} WIB</span>
            </div>

            {/* Buka status bullet */}
            <div className={`p-2 px-3 rounded-xl border flex items-center gap-1.5 backdrop-blur-sm font-bold ${
              openStatus.text === 'BUKA' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              <span className="w-2 h-2 rounded-full bg-current animate-ping" />
              <span>{openStatus.text} (07:00 - 23:00)</span>
            </div>

            {/* Floating Ambient Acoustical toggle widget */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 px-2.5 rounded-xl backdrop-blur-sm">
              <button
                id="btn-toggle-playlist"
                onClick={() => setAudioTrack(audioTrack === 'lofi' ? 'chatter' : 'lofi')}
                title="Ganti Musik Lofi / Hujan"
                className="p-1 px-2 hover:bg-white/10 text-gray-300 hover:text-white rounded text-[10px] transition-all capitalize"
              >
                🎵 {audioTrack}
              </button>
              <button
                id="btn-toggle-mute"
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1 rounded-lg transition-colors ${
                  isMuted ? 'text-gray-500 hover:text-gray-300' : 'text-[#d4a373] hover:text-[#e4b383] bg-[#d4a373]/10'
                }`}
                title={isMuted ? 'Mainkan Musik Kafe' : 'Senyapkan Musik'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-8 relative">
        
        {/* Dynamic High-End Coffee Shop Hero Banner Area */}
        <div id="hero-banner-glass" className="relative rounded-[32px] overflow-hidden shadow-2xl h-[260px] sm:h-[320px] backdrop-blur-md bg-white/5 border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200"
            alt="Kalandra Cafe Front Desk"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-30 filter brightness-90 animate-fade"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark via-coffee-dark/65 to-transparent z-0" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 z-10">
            <div className="max-w-2xl flex flex-col gap-2">
              <div className="flex items-center gap-1 bg-[#d4a373]/15 text-[#d4a373] border border-[#d4a373]/30 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold self-start tracking-wider uppercase mb-1">
                <Flame className="w-3.5 h-3.5 animate-pulse text-[#d4a373]" />
                <span>Modern 3D Aura Cafe Concept</span>
              </div>
              <h2 className="text-3xl sm:text-5xl text-white font-black tracking-tight leading-none italic uppercase">
                PURE <span className="text-[#d4a373]">AWAKENING.</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-normal max-w-xl">
                Nikmati perpaduan rasa kopi arabika nusantara murni, racikan modern signature syrup wangi, dan hidangan pastri hangat buatan pengerajin kami, langsung bersanding dengan asisten Barista AI cerdas.
              </p>
            </div>

            {/* Quick Stats block */}
            <div className="flex gap-4 border-t border-white/10 md:border-0 pt-3 md:pt-0 font-mono text-xs text-gray-400">
              <div className="flex flex-col">
                <span className="text-gray-500 block text-[9px] uppercase">RATING</span>
                <div className="flex items-center text-[#d4a373] gap-1">
                  <span>★★★★★</span>
                  <span className="text-white font-bold text-sm">4.9</span>
                </div>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <span className="text-gray-500 block text-[9px] uppercase">BREW TECHNIQUE</span>
                <span className="text-gray-200 font-bold text-sm">V60, Coldbrew</span>
              </div>
              <div className="flex flex-col border-l border-white/10 pl-4">
                <span className="text-gray-500 block text-[9px] uppercase">BAKERY ORIGIN</span>
                <span className="text-gray-200 font-bold text-sm">Normandy AOP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Seating Plan Visualizer (The absolute main "3D Website Store" request) */}
        <section id="plan-section" className="scroll-mt-24 relative z-10">
          <ThreeDView
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
          />
        </section>

        {/* Section 2: Conversational Smart Barista Assist Advice Column */}
        <section id="barista-advisor" className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch relative z-10">
          <div className="md:col-span-4 flex flex-col justify-center gap-3.5 backdrop-blur-md bg-white/5 border border-white/10 p-6 sm:p-7 rounded-[28px] shadow-xl">
            <span className="text-[10px] font-mono text-[#d4a373] font-bold tracking-widest uppercase">CONCIERGE CORNER</span>
            <h3 className="font-sans font-medium text-xl leading-snug tracking-tight text-white">Rekomendasi instan dari Barista Aura</h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-1">
              Pusing memilih menu minuman atau pastry? Butuh rekomendasi rasa manis atau intensitas kopi yang tidak menakuti lambung sensitif?
            </p>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Tanyakan suasana hatimu di kolom chat Barista AI. Model canggih kami akan mengenali produk kami secara optimal dan memberikan menu terbaik!
            </p>
            <div className="border-t border-white/10 pt-4 mt-2 flex items-center gap-1.5 text-[11px] font-mono text-gray-500">
              <CheckSquare className="w-3.5 h-3.5 text-[#d4a373]" />
              <span>Full-stack integration powered by Gemini AI</span>
            </div>
          </div>
          <div className="md:col-span-8">
            <AIBarista onAddProductDirectly={handleAddProductDirectly} />
          </div>
        </section>

        {/* Section 3: Full dual grid columns for catalog and invoice checking */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24 relative z-10">
          {/* Main menu gallery (7 columns) */}
          <div className="lg:col-span-8">
            <MenuGrid
              onAddToCart={handleAddToCart}
              directAddProductId={directAddProductId}
              resetDirectAddProductId={() => setDirectAddProductId(null)}
            />
          </div>

          {/* Active side cart shopping basket (4 columns) */}
          <div className="lg:col-span-4 sticky top-24">
            <CartAndCheckout
              cart={cart}
              tableId={selectedTable}
              onRemoveItem={handleRemoveCartItem}
              onUpdateQuantity={handleUpdateCartQuantity}
              onClearCart={handleClearCart}
              onSelectTable={setSelectedTable}
            />
          </div>
        </section>

      </main>

      {/* Immersive Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-md px-4 sm:px-6 py-8 mt-12 text-xs font-mono text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Store className="w-4 h-4 text-gray-300" />
              <span className="font-semibold text-white text-sm">Aura Coffee Bandung</span>
            </div>
            <p className="text-gray-500 text-[11px]">© 2026 Aura Specialty Coffee. Designed with high-contrast glassmorphic projection.</p>
          </div>

          {/* Slogans */}
          <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap justify-center">
            <span>Aura POS Design</span>•
            <span>Clean Arabica Roast</span>•
            <span>Frosted Glass Theme</span>•
            <span>Kopi Bandung Juara</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
