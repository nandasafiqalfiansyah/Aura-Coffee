/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GenAI Client Helper to guarantee no startup crashes
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is not defined in system environment secrets. Please set it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// ------------------- API ROUTES -------------------

// AI Barista Chat endpoint
app.post('/api/ai-barista', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();

    // Map user's context of products to help the model make specific, real coffee/tea/pastry recommendations
    const productContext = `
Here is Kalandra Cafe Menu:
1. Es Kopi Susu Aren Kalandra (Rp 28,000) - Espresso, susu segar, aren premium Sukabumi, daun pandan. Best Seller!
2. Koko Pandan Cold Brew (Rp 32,000) - Air kelapa muda segar, cold brew 18 jam arabika mendalam, aroma pandan. Rendah asam.
3. Avocado Espresso Float (Rp 35,000) - Puree alpukat mentega segar, gelato vanilla bean, disiram espresso double shot hancur. Cocok buat dessert manis!
4. Caffe Latte Artisti (Rp 30,000) - Espresso house blend dengan steamed milk berseni latte indah.
5. Specialty Cappuccino (Rp 30,000) - Espresso kuat double shot, susu steamed tebal manis dengan taburan cokelat organik.
6. Espresso Arabica Solo (Rp 20,000) - Double shot espresso murni buah arabika terbaik dengan crema keemasan tebal. Rasa strong, manis kacang, cokelat pekat.
7. Artisanal V60 Pour Over (Rp 35,000) - Filter manual memakai single origin musiman (Kopi Gayo, Kintamani, Flores Bajawa). Bersih, light, buah-buahan cerah.
8. Croissant au Beurre (Rp 25,000) - Roti pastri mentega Perancis, dilaminasi manual, renyah di luar lembut di dalam. Dipanggang baru tiap hari.
9. Almond Chocolate Pain (Rp 29,000) - Pastry cokelat bertabur almond slice renyah dan gula manis salju.

Silakan bantu pelanggan memilih menu kami dalam Bahasa Indonesia yang sangat ramah, hangat, dan profesional selayaknya Barista ahli di kafe mewah Kalandra.
Jangan mengarang menu lain di luar menu di atas! Jika mereka ingin sesuatu yang tidak tercantum, tawarkan produk terdekat atau jelaskan produk kami dengan penuh senyuman.
Berikan rekomendasi spesifik kenapa menu tersebut cocok dengan suasana hati, tingkat kantuk, atau selera rasa (manis, kuat, segar, pahit, dsb) mereka.
Singkat padat, jangan terlalu panjang bertele-tele, pisahkan dengan paragraf rapi atau poin-poin yang elegan.
`;

    const contents = [];
    
    // Convert prior message histories into proper parts
    if (chatHistory && Array.isArray(chatHistory)) {
      for (const msg of chatHistory) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }
    
    // Add current user prompt
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: `You are Barista Kalandra, the master coffee craftsman at Kalandra Cafe & Brew. Warm, aesthetic, and welcoming companion. Offer bespoke pairing recommendations based on user mood, tiredness or tastes. Always respond in Indonesian language. ${productContext}`,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Barista API Error:', error);
    res.status(500).json({ error: error.message || 'Error occurred in AI recommendation' });
  }
});

// Mock checkout success transaction endpoint to return simulated receipt
app.post('/api/checkout', (req, res) => {
  const { customerName, tableNumber, items, total, paymentMethod } = req.body;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Keranjang kera kosong.' });
  }

  const receiptId = `KLD-${Date.now().toString().slice(-8).toUpperCase()}`;
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.10); // 10% tax
  const serviceCharge = Math.round(subtotal * 0.05); // 5% service fee
  const billTotal = subtotal + tax + serviceCharge;

  res.json({
    id: receiptId,
    customerName: customerName || 'Pelanggan Setia Kalandra',
    tableNumber: tableNumber || 'Takeaway',
    items,
    subtotal,
    tax,
    serviceCharge,
    total: billTotal,
    timestamp: new Date().toISOString(),
    paymentMethod: paymentMethod || 'E-Wallet Qris',
  });
});

// ------------------- FRAMEWORK MIDDLEWARE & SPAROUTING -------------------

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    // Integrate Vite development server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production built assets
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kalandra Fullstack Server running at http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
