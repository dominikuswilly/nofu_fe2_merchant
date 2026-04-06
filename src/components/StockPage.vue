<template>
  <div class="stock-page">
    <!-- Daily Kit Refill Section -->
    <div class="kit-refill-area">
      <button class="btn btn-primary lg full-width refill-btn" @click="emit('refill-kit')">
        REFILL DAILY KIT (HARIAN)
      </button>
      <p class="kit-hint">Isi ulang semua stok ke standar pagi hari dalam satu klik.</p>
    </div>

    <!-- Wastage Mode Toggle -->
    <div class="wastage-toggle-container">
        <label class="wastage-label">
            <input type="checkbox" v-model="isWastageMode" class="hidden-check">
            <div class="custom-toggle" :class="{ 'wastage-active': isWastageMode }">
                <div class="toggle-dot"></div>
                <span class="toggle-text">{{ isWastageMode ? 'MODE WASTAGE: AKTIF' : 'MODE NORMAL' }}</span>
            </div>
        </label>
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

        <!-- Thumb-Zone Controls -->
        <div class="stock-controls">
          <button class="ctrl-btn minus" @click="handleUpdate(item, -item.step)">-</button>
          
          <div class="quick-steps">
            <button class="quick-btn" @click="handleUpdate(item, item.quickStep)">+{{ item.quickStep }}</button>
          </div>

          <button class="ctrl-btn plus" @click="handleUpdate(item, item.step)">+</button>
        </div>
      </div>
    </div>

    <!-- Wastage Warning Toast -->
    <Transition name="fade">
        <div v-if="isWastageMode" class="wastage-toast">
            PENGURANGAN STOK AKAN DICATAT SEBAGAI WASTAGE (SIASA)
        </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  inventory: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update', 'refill-kit']);

const isWastageMode = ref(false);

const getStockPercentage = (item) => {
  return Math.round((item.current / item.max) * 100);
};

const getStatusColor = (percent) => {
  if (percent < 10) return '#EF4444'; // Red
  if (percent < 25) return '#FFFF00'; // Yellow
  return '#CCFF00'; // Lime
};

const handleUpdate = (item, amount) => {
  // If in wastage mode, only allow deductions
  if (isWastageMode.value && amount > 0) return;
  
  emit('update', item.id, amount);
};
</script>

<style scoped>
.stock-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Kit Refill Area */
.kit-refill-area {
  background: var(--surface);
  border: 2px dashed var(--border);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
}

.refill-btn {
    margin-bottom: 12px;
    font-size: 1.2rem;
}

.kit-hint {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Wastage Toggle */
.wastage-toggle-container {
    display: flex;
    justify-content: center;
}

.hidden-check { display: none; }

.custom-toggle {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 12px 24px;
    border-radius: 99px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s;
}

.toggle-dot {
    width: 12px;
    height: 12px;
    background: var(--border);
    border-radius: 50%;
    transition: all 0.3s;
}

.toggle-text {
    font-size: 0.8rem;
    font-weight: 900;
    color: var(--text-muted);
}

.wastage-active {
    border-color: #EF4444;
    background: rgba(239, 68, 68, 0.1);
}

.wastage-active .toggle-dot {
    background: #EF4444;
    box-shadow: 0 0 10px #EF4444;
}

.wastage-active .toggle-text {
    color: #EF4444;
}

/* Inventory Cards */
.inventory-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stock-card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.low-stock {
    border-color: #EF4444;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-name {
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--white);
}

.item-qty-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
}

/* Progress Bar */
.progress-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 99px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Controls */
.stock-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.ctrl-btn {
  flex: 1;
  height: 64px;
  background: var(--bg-mobile);
  border: 1px solid var(--border);
  color: var(--white);
  font-size: 1.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  cursor: pointer;
}

.quick-steps {
    flex: 2;
    display: flex;
}

.quick-btn {
    width: 100%;
    height: 64px;
    background: rgba(204, 255, 0, 0.1);
    border: 1px solid var(--primary);
    color: var(--primary);
    font-size: 1rem;
    font-weight: 900;
    cursor: pointer;
}

.ctrl-btn:active, .quick-btn:active {
  transform: scale(0.95);
  opacity: 0.7;
}

.wastage-toast {
    position: fixed;
    bottom: 110px;
    left: 20px;
    right: 20px;
    background: #EF4444;
    color: white;
    padding: 12px;
    text-align: center;
    font-size: 0.7rem;
    font-weight: 900;
    z-index: 100;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
