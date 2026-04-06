// NOFU COFFEE - Centralized Mock Data Storage

export const INITIAL_ACTIVITY = [
  { id: 1, time: '13:42', text: 'Pesanan #204 selesai', type: 'success' },
  { id: 2, time: '13:30', text: 'Pesanan #205 diterima', type: 'info' },
  { id: 3, time: '13:15', text: 'Stok Espresso habis', type: 'warning' },
];

export const INITIAL_INVENTORY = [
  { id: 1, name: 'Espresso Single', current: 20, max: 50, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 2, name: 'Americano Ice', current: 15, max: 40, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 3, name: 'Cafe Latte', current: 10, max: 30, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 4, name: 'Cappuccino', current: 12, max: 30, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 5, name: 'Choco Classic', current: 18, max: 40, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 6, name: 'Dark Hazelnut', current: 8, max: 20, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 7, name: 'Earl Grey Tea', current: 25, max: 50, unit: 'Cup', step: 1, quickStep: 10 },
  { id: 8, name: 'Matcha Latte', current: 14, max: 30, unit: 'Cup', step: 1, quickStep: 5 },
  { id: 9, name: 'Mineral Water', current: 40, max: 100, unit: 'Btl', step: 1, quickStep: 10 },
];

export const DRINK_MENU = [
  { id: 1, category: 'KOPI', name: 'Espresso Single', price: 15000 },
  { id: 2, category: 'KOPI', name: 'Americano Ice', price: 22000 },
  { id: 3, category: 'KOPI', name: 'Cafe Latte', price: 28000 },
  { id: 4, category: 'KOPI', name: 'Cappuccino', price: 28000 },
  { id: 5, category: 'COKELAT', name: 'Choco Classic', price: 25000 },
  { id: 6, category: 'COKELAT', name: 'Dark Hazelnut', price: 32000 },
  { id: 7, category: 'TEH', name: 'Earl Grey Tea', price: 18000 },
  { id: 8, category: 'TEH', name: 'Matcha Latte', price: 25000 },
  { id: 9, category: 'LAINNYA', name: 'Mineral Water', price: 5000 },
];
