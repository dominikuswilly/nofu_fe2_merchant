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

        <!-- Secondary Action Bar -->
        <div class="secondary-actions">
            <button class="action-btn request" @click="openRestockModal(item)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                MINTA
            </button>
            <button class="action-btn report" @click="openReportModal(item)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                LAPOR
            </button>
        </div>
      </div>
    </div>

    <!-- Restock Modal -->
    <Transition name="fade">
        <div v-if="activeModal === 'restock'" class="modal-overlay">
            <div class="modal-sheet">
                <h2 class="modal-title">MINTA STOK: {{ selectedItem.name.toUpperCase() }}</h2>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">JUMLAH DIBUTUHKAN ({{ selectedItem.unit }})</label>
                        <input type="number" v-model="modalQty" class="form-input" placeholder="0">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeModal">BATAL</button>
                    <button class="btn btn-primary" @click="submitRestockRequest">KIRIM PERMINTAAN</button>
                </div>
            </div>
        </div>
    </Transition>

    <!-- Report Invalid Modal -->
    <Transition name="fade">
        <div v-if="activeModal === 'report'" class="modal-overlay">
            <div class="modal-sheet report-sheet">
                <h2 class="modal-title">LAPOR RUSAK: {{ selectedItem.name.toUpperCase() }}</h2>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">JUMLAH RUSAK/EXP ({{ selectedItem.unit }})</label>
                        <input type="number" v-model="modalQty" class="form-input" placeholder="0">
                    </div>
                    <div class="form-group">
                        <label class="form-label">ALASAN</label>
                        <select v-model="modalReason" class="form-input">
                            <option value="Expired">Kadaluarsa (Expired)</option>
                            <option value="Broken">Rusak Fisik</option>
                            <option value="Spilled">Tumpah/Terbuang</option>
                            <option value="Inaccurate">Stok Tidak Akurat</option>
                        </select>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeModal">BATAL</button>
                    <button class="btn btn-primary danger" @click="submitReport">LAPOR & KURANGI STOK</button>
                </div>
            </div>
        </div>
    </Transition>

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

const emit = defineEmits(['update', 'refill-kit', 'request-restock', 'report-invalid']);

const isWastageMode = ref(false);
const activeModal = ref(null);
const selectedItem = ref(null);
const modalQty = ref(null);
const modalReason = ref('Expired');

const getStockPercentage = (item) => {
  return Math.round((item.current / item.max) * 100);
};

const getStatusColor = (percent) => {
  if (percent < 10) return '#EF4444'; // Red
  if (percent < 25) return '#FFFF00'; // Yellow
  return '#CCFF00'; // Lime
};

const handleUpdate = (item, amount) => {
  if (isWastageMode.value && amount > 0) return;
  emit('update', item.id, amount);
};

// Modal Logic
const openRestockModal = (item) => {
    selectedItem.value = item;
    modalQty.value = 1;
    activeModal.value = 'restock';
};

const openReportModal = (item) => {
    selectedItem.value = item;
    modalQty.value = 0.5;
    modalReason.value = 'Expired';
    activeModal.value = 'report';
};

const closeModal = () => {
    activeModal.value = null;
    selectedItem.value = null;
};

const submitRestockRequest = () => {
    if (modalQty.value > 0) {
        emit('request-restock', { item: selectedItem.value, qty: modalQty.value });
        closeModal();
    }
};

const submitReport = () => {
    if (modalQty.value > 0) {
        emit('report-invalid', { item: selectedItem.value, qty: modalQty.value, reason: modalReason.value });
        closeModal();
    }
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

/* Wastage Toggle */
.wastage-toggle-container { display: flex; justify-content: center; }
.hidden-check { display: none; }
.custom-toggle { background: var(--surface); border: 1px solid var(--border); padding: 12px 24px; border-radius: 99px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.3s; }
.toggle-dot { width: 12px; height: 12px; background: var(--border); border-radius: 50%; transition: all 0.3s; }
.toggle-text { font-size: 0.8rem; font-weight: 900; color: var(--text-muted); }
.wastage-active { border-color: #EF4444; background: rgba(239, 68, 68, 0.1); }
.wastage-active .toggle-dot { background: #EF4444; box-shadow: 0 0 10px #EF4444; }
.wastage-active .toggle-text { color: #EF4444; }

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

/* Controls */
.stock-controls { display: flex; gap: 12px; align-items: center; }
.ctrl-btn { flex: 1; height: 64px; background: var(--bg-mobile); border: 1px solid var(--border); color: var(--white); font-size: 1.8rem; font-weight: 900; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.quick-steps { flex: 2; display: flex; }
.quick-btn { width: 100%; height: 64px; background: rgba(204, 255, 0, 0.1); border: 1px solid var(--primary); color: var(--primary); font-size: 1rem; font-weight: 900; cursor: pointer; }

/* Secondary Action Bar */
.secondary-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid var(--border);
}

.action-btn {
    height: 48px;
    background: var(--bg-mobile);
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 0.75rem;
    font-weight: 900;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.action-btn:active { background: var(--border); color: var(--white); }

/* Modal Overlays */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px);
    z-index: 12000;
    display: flex;
    align-items: flex-end;
}

.modal-sheet {
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    background: var(--bg-mobile);
    border-top: 4px solid var(--primary);
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.report-sheet { border-top-color: #EF4444; }

.modal-title { font-size: 1.1rem; font-weight: 900; letter-spacing: -0.5px; }

.modal-body { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 10px; }
.form-label { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); }
.form-input { 
    background: var(--surface); 
    border: 1px solid var(--border); 
    padding: 18px; 
    color: var(--white); 
    font-size: 1.2rem; 
    font-weight: 900; 
}

.modal-footer { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; margin-top: 12px; }
.btn.danger { background: #EF4444; border-color: #EF4444; }

.wastage-toast { position: fixed; bottom: 110px; left: 20px; right: 20px; background: #EF4444; color: white; padding: 12px; text-align: center; font-size: 0.7rem; font-weight: 900; z-index: 100; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
