<template>
  <div class="stock-page">
    <!-- Daily Kit Refill Section -->
    <div class="kit-refill-area">
      <button class="btn btn-primary lg full-width refill-btn" @click="emit('refill-kit')">
        REFILL DAILY KIT (HARIAN)
      </button>
      <p class="kit-hint">Isi ulang semua stok ke standar pagi hari dalam satu klik.</p>
    </div>

    <!-- Inventory List -->
    <div class="inventory-list">
      <div v-for="item in inventory" :key="item.id" class="stock-card" :class="{ 'low-stock': getStockPercentage(item) < 10 }">
        <div class="stock-info">
          <div class="item-meta">
            <h3 class="item-name">{{ item.name }}</h3>
            <span class="item-qty-text">{{ item.current }} / {{ item.max }} {{ item.unit }}</span>
          </div>
          
          <!-- Progress Bar -->
          <div class="progress-container">
            <div 
              class="progress-bar" 
              :style="{ width: `${getStockPercentage(item)}%`, backgroundColor: getStatusColor(getStockPercentage(item)) }"
            ></div>
          </div>
        </div>

        <!-- Secondary Action Bar -->
        <div class="secondary-actions">
            <button class="action-btn request" @click="openRestockModal(item)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                <span>MINTA</span>
            </button>
            <button class="action-btn report" @click="openReportModal(item)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span>LAPOR</span>
            </button>
        </div>
      </div>
    </div>

    <!-- Modular Modals -->
    <StockRequestModal 
        :show="activeModal === 'restock'" 
        :item="selectedItem" 
        @close="closeModal" 
        @submit="handleRestockSubmit" 
    />

    <StockReportModal 
        :show="activeModal === 'report'" 
        :item="selectedItem" 
        @close="closeModal" 
        @submit="handleReportSubmit" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StockRequestModal from './StockRequestModal.vue';
import StockReportModal from './StockReportModal.vue';

const props = defineProps({
  inventory: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update', 'refill-kit', 'request-restock', 'report-invalid']);

const activeModal = ref(null);
const selectedItem = ref(null);

const getStockPercentage = (item) => {
  return Math.round((item.current / item.max) * 100);
};

const getStatusColor = (percent) => {
  if (percent < 10) return '#EF4444'; // Red
  if (percent < 25) return '#FFFF00'; // Yellow
  return '#CCFF00'; // Lime
};

// Modal Logic
const openRestockModal = (item) => {
    selectedItem.value = item;
    activeModal.value = 'restock';
};

const openReportModal = (item) => {
    selectedItem.value = item;
    activeModal.value = 'report';
};

const closeModal = () => {
    activeModal.value = null;
    selectedItem.value = null;
};

const handleRestockSubmit = (qty) => {
    emit('request-restock', { item: selectedItem.value, qty });
    closeModal();
};

const handleReportSubmit = (qty, reason) => {
    emit('report-invalid', { item: selectedItem.value, qty, reason });
    closeModal();
};
</script>

<style scoped>
.stock-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Kit Refill Area */
.kit-refill-area { background: var(--surface); border: 2px dashed var(--border); padding: 24px; border-radius: 12px; text-align: center; }
.refill-btn { margin-bottom: 12px; font-size: 1.2rem; }
.kit-hint { font-size: 0.7rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

/* Inventory Cards */
.inventory-list { display: flex; flex-direction: column; gap: 16px; }
.stock-card { background: var(--surface); border: 1px solid var(--border); padding: 24px; border-radius: 12px; display: flex; flex-direction: column; gap: 20px; transition: border-color 0.3s; }
.low-stock { border-color: #EF4444; }
.item-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.item-name { font-size: 1.2rem; font-weight: 900; color: var(--white); }
.item-qty-text { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }

/* Progress Bar */
.progress-container { height: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 99px; overflow: hidden; }
.progress-bar { height: 100%; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

/* Secondary Action Bar - FIXED HIGH CONTRAST */
.secondary-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding-top: 16px;
    border-top: 2px solid var(--border);
}

.action-btn {
    height: 54px;
    background: rgba(255, 255, 255, 0.05); /* Lighter surface */
    border: 1px solid var(--border);
    color: var(--white); /* High contrast */
    font-size: 0.8rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    -webkit-tap-highlight-color: transparent;
    border-radius: 8px;
}

.action-btn svg { opacity: 0.9; }

.action-btn.request:active { background: rgba(59, 130, 246, 0.2); border-color: #3B82F6; color: #3B82F6; transform: scale(0.96); }
.action-btn.report:active { background: rgba(239, 68, 68, 0.2); border-color: #EF4444; color: #EF4444; transform: scale(0.96); }

/* Visibility Improvements for retail environment */
.stock-card:active { border-color: var(--primary); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
