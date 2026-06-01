/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Trash2, CheckCircle, CreditCard, Receipt, Printer, RefreshCw } from 'lucide-react';
import { CartItem, ReceiptData } from '../types';

interface CartAndCheckoutProps {
  cart: CartItem[];
  tableId: number | null;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onSelectTable: (tableId: number | null) => void;
}

export default function CartAndCheckout({
  cart,
  tableId,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  onSelectTable
}: CartAndCheckoutProps) {
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('QRIS E-Wallet');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  // Math totals
  const subtotal = cart.reduce((acc, item) => {
    const extraCharge = item.customization.extraShot ? 5000 : 0;
    return acc + ((item.product.price + extraCharge) * item.quantity);
  }, 0);
  const tax = Math.round(subtotal * 0.10);
  const serviceCharge = Math.round(subtotal * 0.05);
  const totalBill = subtotal + tax + serviceCharge;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          tableNumber: tableId || 'Takeaway',
          items: cart,
          paymentMethod,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses transaksi checkout.');
      }

      const receiptData = await response.json();
      setReceipt(receiptData);
      onClearCart(); // empty cart upon receipt generation
    } catch (err) {
      console.error(err);
      alert('Terdapat kesalahan sambungan kasir. Silakan coba sesaat lagi.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleCloseReceipt = () => {
    setReceipt(null);
    setCustomerName('');
  };

  return (
    <div id="cart-pos-sidebar" className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-5 relative min-h-[400px] flex flex-col justify-between">
      
      {/* Dynamic Header */}
      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#d4a373]" />
          <h3 className="font-sans font-bold text-base text-white">Keranjang Belanja</h3>
        </div>
        <span className="font-mono text-xs text-stone-400">
          {cart.reduce((s, i) => s + i.quantity, 0)} Item
        </span>
      </div>

      {/* Cart Content lists */}
      <div className="flex-1 overflow-y-auto max-h-[300px] sm:max-h-[350px] my-4 scrollbar-thin scrollbar-thumb-white/10 flex flex-col gap-3 pr-1 text-xs">
        {cart.length > 0 ? (
          cart.map((item) => {
            const extShotCost = item.customization.extraShot ? 5000 : 0;
            const singleCost = item.product.price + extShotCost;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-black/25 border border-white/5 p-3 rounded-2xl flex items-start gap-2.5 justify-between animate-fadeIn"
              >
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-stone-100 font-bold">{item.product.indonesianName}</span>
                  
                  {/* Detailed descriptions tags representing user customization choices */}
                  <div className="flex flex-wrap gap-1 mt-0.5 text-[9px] font-mono">
                    <span className={`px-1.5 py-0.2 rounded font-extrabold ${
                      item.customization.temp === 'ice' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {item.customization.temp === 'ice' ? '❄️ Ice' : '🔥 Hot'}
                    </span>
                    <span className="bg-white/5 px-1.5 py-0.2 text-stone-300 rounded">
                      🍯 {item.customization.sweetness} manis
                    </span>
                    {item.customization.temp === 'ice' && (
                      <span className="bg-white/5 px-1.5 py-0.2 text-stone-300 rounded">
                        🧊 {item.customization.iceLevel.replace('_', ' ')}
                      </span>
                    )}
                    {item.customization.extraShot && (
                      <span className="bg-[#d4a373]/10 text-[#d4a373] px-1.5 py-0.2 font-extrabold rounded">
                        ⚡ Extra Shot
                      </span>
                    )}
                  </div>

                  <span className="text-stone-400 text-[10px] font-mono mt-1 block">
                    Rp {singleCost.toLocaleString('id-ID')} × {item.quantity}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2 text-right">
                  <span className="font-mono text-white font-bold">
                    Rp {(singleCost * item.quantity).toLocaleString('id-ID')}
                  </span>

                  {/* Quantity and deletion buttons combo */}
                  <div className="flex items-center gap-1.5 bg-white/5 rounded-xl p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="p-1 px-1.5 text-stone-400 hover:text-white rounded hover:bg-white/10 cursor-pointer font-bold text-[10px]"
                    >
                      X
                    </button>
                    <span className="font-mono px-1 font-bold text-white">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="p-1 px-1.5 text-stone-400 hover:text-white rounded hover:bg-white/10 cursor-pointer font-bold text-[10px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-10 text-stone-500 text-center">
            <ShoppingBag className="w-10 h-10 text-stone-700 stroke-1 mb-2.5 mx-auto" />
            <p className="font-bold text-stone-400">Keranjang Kosong</p>
            <p className="text-[11px] text-stone-500 mt-0.5 max-w-[200px] leading-relaxed">
              Silakan cari minuman atau ajak Barista AI mencari ramuan terbaik untuk dimasukkan.
            </p>
          </div>
        )}
      </div>

      {/* Pricing / Table and checkout Form */}
      {cart.length > 0 && (
        <form onSubmit={handleCheckoutSubmit} className="border-t border-white/10 pt-3 flex flex-col gap-3">
          
          {/* Seating Table Context Banner */}
          <div className="flex justify-between items-center bg-black/35 p-2.5 rounded-2xl border border-white/10 text-xs">
            <span className="text-gray-400">Nomor Meja:</span>
            <span className={`font-extrabold ${tableId ? 'text-[#d4a373] animate-pulse' : 'text-gray-400 font-mono'}`}>
              {tableId ? `Meja #${tableId} (Sit-in)` : 'Takeaway (Bawa Pulang)'}
            </span>
          </div>

          {/* Form input details */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Nama Pemesan</span>
            <input
              type="text"
              required
              placeholder="Masukkan nama pemesan..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-[#d4a373] text-white text-xs rounded-xl py-2.5 px-3.5 outline-none transition-all placeholder:text-gray-500 focus:ring-1 focus:ring-[#d4a373]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider font-bold">Metode Pembayaran</span>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-neutral-950 border border-white/10 focus:border-[#d4a373] text-white text-xs rounded-xl py-2.5 px-3.5 outline-none transition-all cursor-pointer"
            >
              <option value="QRIS E-Wallet GoPay/OVO">Digital QRIS (GoPay/Shopee/OVO)</option>
              <option value="Debit Card ATM Mandiri">Kartu Debit Direct</option>
              <option value="Bayar di Kasir Aura">Bayar di Mesin Kasir Aura (Tunai)</option>
            </select>
          </div>

          {/* Checkout Bill calculation lines */}
          <div className="flex flex-col gap-1.5 text-xs font-mono text-gray-400 bg-black/30 p-3 rounded-2xl border border-white/5 my-1 leading-normal">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal:</span>
              <span>Rp {subtotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Pajak (PB1) 10%:</span>
              <span>Rp {tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-stone-400">
              <span>Service Charge 5%:</span>
              <span>Rp {serviceCharge.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-stone-200 border-t border-dashed border-white/10 pt-1.5 font-bold mt-1 text-sm">
              <span className="text-stone-300 font-sans">Total Belanja:</span>
              <span className="text-[#d4a373] font-extrabold">Rp {totalBill.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="submit"
            id="btn-cart-checkout"
            disabled={isCheckingOut}
            className="w-full py-3 bg-[#d4a373] hover:bg-[#c29262] disabled:opacity-50 text-black rounded-xl transition-all shadow-lg active:scale-[0.98] font-bold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {isCheckingOut ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            <span>Checkout Sekarang ({tableId ? 'Sajikan Ke Meja' : 'Bawa Pulang'})</span>
          </button>
        </form>
      )}

      {/* Beautiful cash register pop out thermal receipt paper roll dialog */}
      <AnimatePresence>
        {receipt && (
          <div className="fixed inset-0 bg-black/8 w-full h-full backdrop-blur-lg z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white text-stone-950 rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative px-6 py-6 border border-stone-300 flex flex-col font-mono"
              style={{
                backgroundImage: 'radial-gradient(ellipse at bottom, rgba(0,0,0,0.02) 0%, transparent 100%)',
              }}
            >
              {/* Receipts tear visual representation on thermal printer paper edge */}
              <div className="absolute top-0 inset-x-0 h-3 bg-stone-105 flex overflow-hidden self-start">
                {Array.from({ length: 44 }).map((_, i) => (
                  <div key={i} className="flex-1 h-3 bg-stone-900 border-b border-stone-800" style={{ transform: 'skewY(45deg)' }} />
                ))}
              </div>

              {/* Receipt Header logo */}
              <div className="text-center flex flex-col gap-1 items-center mt-4">
                <h3 className="font-sans font-bold text-lg tracking-wider text-stone-900">AURA COFFEE & BREW</h3>
                <span className="text-[10px] text-stone-500">JL. PAHLAWAN NO. 45, BANDUNG, INDONESIA</span>
                <span className="text-[10px] text-stone-400">TELP: (022) 1122-3344</span>
                <div className="border-b border-dashed border-stone-400 w-full my-2.5" />
              </div>

              {/* Receipt details meta */}
              <div className="text-[11px] text-stone-600 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>TRANS ID:</span>
                  <span className="font-semibold text-stone-900">{receipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span className="font-semibold text-stone-900 uppercase">{receipt.customerName}</span>
                </div>
                <div className="flex justify-between flex-wrap">
                  <span>TABLE/SIT:</span>
                  <span className="font-semibold text-stone-900">
                    {receipt.tableNumber === 'Takeaway' ? 'TAKEAWAY (Bawa Pulang)' : `MEJA #${receipt.tableNumber}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>DATE/TIME:</span>
                  <span className="font-semibold text-stone-900">
                    {new Date(receipt.timestamp).toLocaleDateString()} {new Date(receipt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="border-b border-dashed border-stone-400 w-full my-2.5" />
              </div>

              {/* Item lists */}
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto text-[11px] text-stone-700">
                {receipt.items.map((it, idx) => {
                  const itemShotPrice = it.customization.extraShot ? 5000 : 0;
                  const itemBasePrice = it.product.price + itemShotPrice;
                  return (
                    <div key={idx} className="flex flex-col gap-0.5 leading-normal">
                      <div className="flex justify-between font-semibold text-stone-950">
                        <span>{it.product.indonesianName}</span>
                        <span>Rp {(itemBasePrice * it.quantity).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="text-[10px] text-stone-400 flex flex-wrap gap-1 leading-none pl-1">
                        <span>{it.customization.temp === 'ice' ? 'Ice' : 'Hot'}</span>•
                        <span>{it.customization.sweetness} sweet</span>
                        {it.customization.extraShot && <span>(+Extra Shot)</span>}
                        <span className="ml-auto font-mono text-stone-500">Rp {itemBasePrice.toLocaleString('id-ID')} × {it.quantity}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-b border-dashed border-stone-400 w-full my-2.5" />
              </div>

              {/* Pricing breakdown */}
              <div className="text-[11px] text-[#2c2c2c] flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>Rp {receipt.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>PB1 Pajak (10%):</span>
                  <span>Rp {receipt.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge (5%):</span>
                  <span>Rp {receipt.serviceCharge.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-dashed border-stone-400 pt-1.5 flex justify-between font-bold text-stone-900 text-sm mt-1">
                  <span>TOTAL BILL:</span>
                  <span>Rp {receipt.total.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-b border-dashed border-stone-400 w-full my-2" />
                <div className="text-center font-mono my-1 font-semibold text-stone-850">
                  METODE: {receipt.paymentMethod}
                </div>
              </div>

              {/* Digital receipt graphic footer stamp */}
              <div className="flex flex-col items-center gap-1.5 mt-3.5">
                {/* Visual Barcode pattern */}
                <div className="w-56 h-8 bg-stone-900 flex items-center justify-between px-1 opacity-75">
                  {Array.from({ length: 44 }).map((_, i) => (
                    <div 
                      key={i} 
                      className="h-full bg-white transition-all" 
                      style={{ 
                        width: `${Math.floor(Math.sin(i * 123) * 3) + 2}px`,
                        opacity: i % 4 === 0 ? 0.3 : 1
                      }} 
                    />
                  ))}
                </div>
                <span className="text-[9px] text-stone-500 font-mono tracking-widest uppercase">TERIMA KASIH - MATUR NUHUN</span>
              </div>

              {/* Checkout Close control button */}
              <div className="mt-5 flex gap-2 w-full">
                <button
                  id="btn-print-receipt"
                  onClick={() => window.print()}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-sans font-bold py-2 rounded-xl border border-stone-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF</span>
                </button>
                <button
                  id="btn-receipt-dismiss"
                  onClick={handleCloseReceipt}
                  className="flex-shrink-0 px-5 bg-black hover:bg-stone-900 text-white text-[11px] font-sans font-bold py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
