/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'coffee' | 'brew' | 'pastry' | 'signature';

export interface Product {
  id: string;
  name: string;
  indonesianName: string;
  description: string;
  indonesianDescription: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  tags: string[];
  isHotAvailable: boolean;
  isIceAvailable: boolean;
}

export interface CustomizationOptions {
  temp: 'ice' | 'hot';
  sweetness: 'normal' | 'less' | 'no';
  iceLevel: 'normal' | 'less' | 'no_ice';
  extraShot: boolean;
}

export interface CartItem {
  id: string; // unique cart item id (product.id + customizations string)
  product: Product;
  quantity: number;
  customization: CustomizationOptions;
}

export interface FloorSection {
  id: string;
  name: string;
  description: string;
  indonesianName: string;
  indonesianDescription: string;
  position3D: { x: number; y: number; z: number };
  color: string;
  icon: string;
  items: string[]; // matching product IDs
}

export interface TableStatus {
  id: number;
  sectionId: string;
  status: 'available' | 'occupied' | 'your-table';
  seats: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ReceiptData {
  id: string;
  customerName: string;
  tableNumber: number | string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  total: number;
  timestamp: string;
  paymentMethod: string;
}
