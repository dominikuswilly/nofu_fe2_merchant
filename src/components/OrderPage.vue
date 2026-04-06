<template>
  <div class="order-page">
    <!-- Category Selection Tabs -->
    <div class="category-tabs">
      <button 
        v-for="cat in categories" 
        :key="cat" 
        class="tab-btn" 
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Item Grid Area -->
    <div class="item-grid">
      <div v-for="item in filteredItems" :key="item.id" class="item-card">
        <div class="item-info">
          <h3 class="item-name">{{ item.name }}</h3>
          <p class="item-price">RP {{ item.price.toLocaleString('id-ID') }}</p>
        </div>
        
        <div class="item-controls">
          <button @click="emit('remove', item)" class="ctrl-btn minus" :disabled="!getQty(item.id)">-</button>
          <span class="item-qty">{{ getQty(item.id) }}</span>
          <button @click="emit('add', item)" class="ctrl-btn plus">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  cart: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['add', 'remove']);

const categories = ['KOPI', 'COKELAT', 'TEH', 'LAINNYA'];
const activeCategory = ref('KOPI');

const mockItems = [
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

const filteredItems = computed(() => {
  return mockItems.filter(item => item.category === activeCategory.value);
});

const getQty = (id) => {
  const item = props.cart.find(i => i.id === id);
  return item ? item.qty : 0;
};
</script>

<style scoped>
.order-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Tabs Styling */
.category-tabs {
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.category-tabs::-webkit-scrollbar { display: none; }

.tab-btn {
  padding: 10px 24px;
  background: var(--surface);
  color: var(--text-muted);
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  white-space: nowrap;
  border: 1px solid var(--border);
  transition: all 0.2s;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--primary);
  color: black;
  border-color: var(--primary);
}

/* Item Grid */
.item-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
}

.item-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--white);
  margin-bottom: 4px;
}

.item-price {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 700;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(0,0,0,0.2);
  padding: 6px;
  border-radius: 4px;
}

.ctrl-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--border);
  color: var(--white);
  font-weight: 900;
  border-radius: 4px;
  transition: all 0.1s;
  cursor: pointer;
  border: none;
}

.ctrl-btn:active { transform: scale(0.9); }
.ctrl-btn:disabled { opacity: 0.3; cursor: default; }

.item-qty {
  font-weight: 900;
  min-width: 20px;
  text-align: center;
  color: var(--white);
}
</style>
