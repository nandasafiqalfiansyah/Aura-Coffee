/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, Coffee, RefreshCw, Trash2, ChevronRight, Check } from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { PRODUCTS } from '../data';

interface AIBaristaProps {
  onAddProductDirectly: (productId: string) => void;
}

const STARTER_SUGGESTIONS = [
  { text: 'Kopi yang manis, creamy, tapi tidak bikin kembung.', label: '⚡ Kopi Creamy Manis' },
  { text: 'Sedang mengantuk berat tapi lambung sensitif.', label: '☕ Kopi Kuat Rendah Asam' },
  { text: 'Rekomendasi croissant dan minuman pendampingnya.', label: '🥐 Pairing Pastry Spesial' },
  { text: 'Manual brew segar rasa buah teh bunga hangat.', label: '🌸 Manual Brew Unik' }
];

export default function AIBarista({ onAddProductDirectly }: AIBaristaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Halo! Selamat datang di Aura Coffee & Brew. Saya Barista Aura, penasihat kopimu hari ini. Sedang ingin menikmati suasana seperti apa? Beritahu saya seleramu, suasana hatimu, atau rasa kantukmu, biar saya racikkan paduan kopi paling sempurna untukmu.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Gather previous messages for chat context (truncate to last 4 messages to stay performant)
      const chatHistory = messages.slice(-4).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await fetch('/api/ai-barista', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi Barista AI Aura. Pastikan GEMINI_API_KEY terpasang.');
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Maaf, saya sedang kesusahan menuang kopi. Silakan coba sesaat lagi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: `⚠️ Maaf, Barista sedang sibuk di balik mesin espresso: ${err.message || 'Koneksi bermasalah'}. Sambil menunggu, silakan langsung memesan manual lewat galeri menu kami di bawah ya.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: 'Halo! Saya kembali bersiap di Bar Seduh Aura. Beritahu saya apa rasa kopi impianmu hari ini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  // Helper code to scan messages for recommended products to expose "Add to Cart" directly
  const detectRecommendedProducts = (text: string) => {
    const list: Product[] = [];
    const lowerText = text.toLowerCase();
    
    PRODUCTS.forEach(p => {
      // Match by full name, tags, or id
      if (
        lowerText.includes(p.name.toLowerCase()) || 
        lowerText.includes(p.indonesianName.toLowerCase()) ||
        lowerText.includes(p.id) ||
        (p.id === 's1' && lowerText.includes('susu aren')) ||
        (p.id === 's2' && lowerText.includes('koko pandan')) ||
        (p.id === 's3' && lowerText.includes('avocado')) ||
        (p.id === 'c1' && lowerText.includes('latte')) ||
        (p.id === 'c2' && lowerText.includes('cappuccino')) ||
        (p.id === 'b1' && lowerText.includes('v60')) ||
        (p.id === 'p1' && lowerText.includes('croissant')) ||
        (p.id === 'p2' && lowerText.includes('pain'))
      ) {
        if (!list.find(x => x.id === p.id)) {
          list.push(p);
        }
      }
    });
    return list;
  };

  return (
    <div id="ai-barista-assistant" className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl flex flex-col h-[520px] shadow-2xl relative overflow-hidden">
      
      {/* Coffee Barista Header */}
      <div className="bg-black/30 border-b border-white/10 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d4a373] to-[#8d623d] flex items-center justify-center text-black shadow-md relative">
            <Coffee className="w-5 h-5" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-sans font-bold text-sm text-white">Barista Aura</h3>
              <Sparkles className="w-3.5 h-3.5 text-[#d4a373] animate-pulse" />
            </div>
            <span className="text-[11px] font-mono text-gray-400">Coffee Artisan GPT Assistant</span>
          </div>
        </div>
        
        <button
          id="btn-clear-chat"
          onClick={handleClearChat}
          title="Reset Percakapan"
          className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-white/5 transition-all cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Bubble Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          const detectedItems = isBot ? detectRecommendedProducts(msg.text) : [];
          
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col max-w-[85%] ${isBot ? 'self-start items-start' : 'self-end items-end'}`}
            >
              {/* Bubble */}
              <div 
                className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isBot 
                    ? 'bg-white/5 text-gray-100 rounded-tl-none border border-white/10 backdrop-blur-sm' 
                    : 'bg-[#d4a373] text-black font-semibold rounded-tr-none shadow-md shadow-[#d4a373]/15'
                }`}
              >
                {msg.text}
              </div>

              {/* Time Indicator */}
              <span className="text-[9px] font-mono text-gray-505 mt-1 px-1">{msg.timestamp}</span>

              {/* Smart Product recommendation integrations if detected standard coffee elements */}
              {isBot && detectedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {detectedItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onAddProductDirectly(item.id)}
                      className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#d4a373] hover:text-white text-[11px] rounded-xl border border-[#d4a373]/20 hover:border-[#d4a373]/50 flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Masukan {item.name.replace('Kalandra', '')}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="self-start flex flex-col items-start max-w-[80%]">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d4a373] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#d4a373] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-[#d4a373] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[9px] font-mono text-gray-500 mt-1">Barista Aura sedang menuang kopi...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Recommended startermates inside the prompt editor if length is minimal */}
      {messages.length === 1 && (
        <div className="p-3 bg-black/20 border-t border-white/10 flex flex-col gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase">SUGESTI TOPIK KONSULTASI</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {STARTER_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(sug.text)}
                className="text-left text-xs text-gray-300 hover:text-[#d4a373] bg-white/5 hover:bg-white/10 p-2.5 rounded-2xl transition-all border border-white/10 hover:border-[#d4a373]/20 flex flex-col gap-0.5 justify-center cursor-pointer"
              >
                <span className="font-bold text-[11px] text-[#d4a373]">{sug.label}</span>
                <span className="text-[10px] text-gray-400 truncate w-full">{sug.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input container */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tanyakan rekomendasi rasa kopi yang tepat..."
          disabled={isLoading}
          className="flex-1 bg-white/5 border border-white/10 focus:border-[#d4a373] text-white text-xs sm:text-sm px-4.5 py-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d4a373] transition-all disabled:opacity-50 placeholder:text-gray-500"
        />
        <button
          type="submit"
          id="btn-chat-submit"
          disabled={!inputValue.trim() || isLoading}
          className="p-3.5 bg-[#d4a373] hover:bg-[#c29262] text-black rounded-xl transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
