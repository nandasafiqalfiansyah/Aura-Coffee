/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, FloorSection, TableStatus } from './types';

export const EXPLICIT_CATEGORIES = [
  { id: 'all', name: 'Semua Menu', nameEn: 'All Menu' },
  { id: 'signature', name: 'Signature Kalandra', nameEn: 'Kalandra Signatures' },
  { id: 'coffee', name: 'Espresso Bar', nameEn: 'Espresso Beverages' },
  { id: 'brew', name: 'Manual Brew', nameEn: 'Artisanal Filter' },
  { id: 'pastry', name: 'Fresh Pastry', nameEn: 'Daily Baked Goods' }
];

export const PRODUCTS: Product[] = [
  {
    id: 's1',
    name: 'Es Kopi Susu Aren Kalandra',
    indonesianName: 'Es Kopi Susu Aren Kalandra',
    description: 'Special arabica double shot combined with chilled creamy milk, premium organic single-origin palm sugar, and a hint of fresh pandan leaf extract.',
    indonesianDescription: 'Double shot espresso arabika pilihan berpadu susu segar creamy, sirup gula aren organik premium dari Sukabumi, dan sedikit infus daun pandan wangi.',
    price: 28000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    tags: ['Best Seller', 'Signature', 'Sweet'],
    isHotAvailable: true,
    isIceAvailable: true
  },
  {
    id: 's2',
    name: 'Koko Pandan Cold Brew',
    indonesianName: 'Koko Pandan Cold Brew',
    description: 'Refreshing pure coconut water layer topped with slow-steeped 18-hour cold brew coffee, lightly infused with sweet pandan.',
    indonesianDescription: 'Air kelapa muda segar alami disajikan berlapis dengan cold brew kopi arabika murni hasil kurator 18 jam, diberi aroma wangi pandan manis.',
    price: 32000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    tags: ['Fresh', 'Single Origin', 'Low Acid'],
    isHotAvailable: false,
    isIceAvailable: true
  },
  {
    id: 's3',
    name: 'Avocado Espresso Float',
    indonesianName: 'Avocado Espresso Float',
    description: 'Blended organic Hass avocado puree served under rich vanilla ice cream, drowned spectacularly with a hot arabica espresso double shot.',
    indonesianDescription: 'Puree alpukat mentega segar diblender lembut, diberi topping satu scoop gelato vanilla bean premium, lalu disiram double espresso panas.',
    price: 35000,
    category: 'signature',
    image: 'https://images.unsplash.com/photo-1594911774802-8822a707c9f5?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    tags: ['Dessert', 'Creamy', 'Indulgent'],
    isHotAvailable: false,
    isIceAvailable: true
  },
  {
    id: 'c1',
    name: 'Caffe Latte Artisti',
    indonesianName: 'Caffe Latte Artsti',
    description: 'Silky texturized steamed microfoam poured gracefully over our signature medium-dark roast espresso blend.',
    indonesianDescription: 'Susu segar yang di-steam microfoam sehalus sutra, dituangkan melingkar membentuk karya seni latte di atas espresso house blend kami.',
    price: 30000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    tags: ['Espresso Bar', 'Latte Art'],
    isHotAvailable: true,
    isIceAvailable: true
  },
  {
    id: 'c2',
    name: 'Specialty Cappuccino',
    indonesianName: 'Specialty Cappuccino',
    description: 'Classic ratio of strong double espresso shot, velvety steamed milk, and heavy velvety foam dusted with cocoa powder.',
    indonesianDescription: 'Rasio klasik double shot espresso arabika, susu hangat, dan busa susu tebal nan lembut, ditaburi bubuk cokelat organik premium di atasnya.',
    price: 30000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    tags: ['Classic', 'Strong Coffee'],
    isHotAvailable: true,
    isIceAvailable: true
  },
  {
    id: 'c3',
    name: 'Espresso Arabica Solo',
    indonesianName: 'Espresso Arabica Solo',
    description: 'Pure, concentrated double shot of our single-origin arabica beans, extracting notes of chocolate, stonefruit, and a thick hazelnut-colored crema.',
    indonesianDescription: 'Double shot espresso konsentrat murni buah arabika terbaik, mengeluarkan rasa cokelat premium, sedikit asam buah, dengan crema keemasan yang tebal.',
    price: 20000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-eaec21143394?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    tags: ['Intense', 'Unsweetened'],
    isHotAvailable: true,
    isIceAvailable: false
  },
  {
    id: 'b1',
    name: 'Artisanal V60 Pour Over',
    indonesianName: 'Artisanal V60 Pour Over',
    description: 'Precision poured specialty filter coffee using chosen seasonal micro-lots. Clean cup, brilliant clarity, complex undertones.',
    indonesianDescription: 'Kopi filter manual dengan metode tetes V60 presisi menggunakan biji pilihan musiman. Rasa sangat bersih, jernih, dan kaya akan cita rasa buah.',
    price: 35000,
    category: 'brew',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    tags: ['Filter', 'Barista Selection', 'Origin-focused'],
    isHotAvailable: true,
    isIceAvailable: true
  },
  {
    id: 'p1',
    name: 'Croissant au Beurre (French Butter)',
    indonesianName: 'Croissant au Beurre Perancis',
    description: 'Crisp flaky layers with golden caramelization, prepared with imported premium Normandy AOP butter, baked fresh every morning.',
    indonesianDescription: 'Roti mentega khas Perancis dengan lapisan renyah garing di luar namun sangat lembut dan berongga di dalam, dipanggang segar tiap fajar.',
    price: 25000,
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    tags: ['Freshly Baked', 'Pastry', 'Normandy Butter'],
    isHotAvailable: true,
    isIceAvailable: false
  },
  {
    id: 'p2',
    name: 'Almond Chocolate Pain',
    indonesianName: 'Almond Chocolate Pain',
    description: 'Buttery flaky pastry roll filled with bittersweet premium dark chocolate chips, topped with loads of sliced roasted almonds and icing sugar.',
    indonesianDescription: 'Pastry mentega berlapis isi potongan cokelat hitam berkualitas, diberi topping cacahan almond panggang garing dan taburan gula halus salju.',
    price: 29000,
    category: 'pastry',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    tags: ['Sweet', 'Nutty', 'Warm Baked'],
    isHotAvailable: true,
    isIceAvailable: false
  }
];

export const FLOOR_SECTIONS: FloorSection[] = [
  {
    id: 'brewbar',
    name: 'Specialty Brew Bar',
    indonesianName: 'Bar Seduh Utama',
    description: 'Watch our baristas extract single origins up close. Sit on high bar stools with standard access to aroma cups.',
    indonesianDescription: 'Saksikan barista kami menyeduh single origin secara langsung di depan mata Anda. Duduk santai di kursi bar tinggi yang modern.',
    position3D: { x: -2.5, y: -1.2, z: 1 },
    color: '#D4AF37',
    icon: 'Coffee',
    items: ['b1', 'c3', 's2']
  },
  {
    id: 'cozy',
    name: 'Quiet Study & Work Cocoon',
    indonesianName: 'Sudut Kerja Hening',
    description: 'Fully optimized with ergonomic tall-back chairs, noise-canceling acoustics, and multi-port charging outlets under warm soft lights.',
    indonesianDescription: 'Dioptimalkan untuk konsentrasi tinggi: meja berpartisi, colokan listrik melimpah, kursi ergonomis, serta iringan musik lofi ambient yang damai.',
    position3D: { x: 2.5, y: -1.2, z: -1 },
    color: '#8D6E63',
    icon: 'Laptop',
    items: ['c1', 'p1', 's1']
  },
  {
    id: 'lounge',
    name: 'The Central Lounge Oasis',
    indonesianName: 'Ruang Tengah Kalandra',
    description: 'Relaxed leather sofa clusters centered around low oak tables. Excellent location for slow reunions or team talks.',
    indonesianDescription: 'Sofa kulit mewah melingkar mengitari meja kayu oak rendah. Sudut ternyaman untuk berbincang santai, reuni manis, atau diskusi kelompok.',
    position3D: { x: 0, y: 0.5, z: 0 },
    color: '#10B981',
    icon: 'Sofa',
    items: ['s3', 'c2', 'p2']
  },
  {
    id: 'outdoor',
    name: 'Garden Veranda Canopy',
    indonesianName: 'Veranda Taman Luar',
    description: 'Sip under climbing passionflower greens and gentle mist fans. Best enjoyed for fresh evening breeze.',
    indonesianDescription: 'Menikmati hembusan angin segar berpayung rimbunan tanaman hijau rambat dan kipas embun sejuk. Sangat pas untuk bersantai di sore atau malam hari.',
    position3D: { x: -1, y: 2.2, z: -2 },
    color: '#3B82F6',
    icon: 'Wind',
    items: ['s2', 's1', 'p1']
  }
];

export const TABLES: TableStatus[] = [
  { id: 1, sectionId: 'brewbar', status: 'available', seats: 2 },
  { id: 2, sectionId: 'brewbar', status: 'occupied', seats: 2 },
  { id: 3, sectionId: 'cozy', status: 'available', seats: 1 },
  { id: 4, sectionId: 'cozy', status: 'available', seats: 2 },
  { id: 5, sectionId: 'lounge', status: 'occupied', seats: 4 },
  { id: 6, sectionId: 'lounge', status: 'available', seats: 6 },
  { id: 7, sectionId: 'outdoor', status: 'available', seats: 4 },
  { id: 8, sectionId: 'outdoor', status: 'occupied', seats: 2 }
];
