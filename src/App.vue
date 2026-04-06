<script setup>
import { ref, computed, watch } from 'vue';
import TopNav from './components/TopNav.vue';
import BottomNav from './components/BottomNav.vue';
import LoginPage from './components/LoginPage.vue';
import OrderPage from './components/OrderPage.vue';
import StockPage from './components/StockPage.vue';

// Import Centralized Mock Data
import { INITIAL_ACTIVITY, INITIAL_INVENTORY } from './data/mockData';

// Authentication State
const isAuthenticated = ref(false);

const currentTab = ref('home');
const isOnline = ref(true);
const salesToday = ref('RP 2.540.000');
const todayBalance = ref('RP 12.850.000');

// Use Centralized Data for initialization
const recentActivity = ref([...INITIAL_ACTIVITY]);

// CENTRALIZED ORDER STATE
const cart = ref([]);
const showCheckout = ref(false);
const processing = ref(false);
const checkoutStep = ref('summary'); // 'summary' | 'payment' | 'confirmation'
const selectedPaymentMethod = ref(null);

// Assets
const qrisMockup = 'src/assets/qris_mockup.png'; // Handled via system-generated path in final implementation or direct reference

// Reset checkout step when overlay closes
watch(showCheckout, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
        checkoutStep.value = 'summary';
        selectedPaymentMethod.value = null;
    }, 300);
  }
});

const cartCount = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.qty, 0);
});

const cartTotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0);
});

const addToCart = (item) => {
  const existing = cart.value.find(i => i.id === item.id);
  if (existing) {
    existing.qty++;
  } else {
    cart.value.push({ ...item, qty: 1 });
  }
};

const removeFromCart = (item) => {
  const index = cart.value.findIndex(i => i.id === item.id);
  if (index > -1) {
    if (cart.value[index].qty > 1) {
      cart.value[index].qty--;
    } else {
      cart.value.splice(index, 1);
    }
  }
};

const startPayment = (method) => {
  selectedPaymentMethod.value = method;
  checkoutStep.value = 'confirmation';
};

const handleFinalize = () => {
    processCheckout();
};

const processCheckout = () => {
  processing.value = true;
  setTimeout(() => {
    processing.value = false;
    showCheckout.value = false;
    
    // Success flow
    recentActivity.value.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Pesanan #${Math.floor(Math.random() * 900) + 100} (${selectedPaymentMethod.value}) berhasil`,
      type: 'success'
    });
    
    cart.value = [];
    currentTab.value = 'home';
  }, 1500);
};

// INVENTORY ACTIONS
const updateStock = (id, amount) => {
    const item = inventory.value.find(i => i.id === id);
    if (item) {
        item.current = Math.max(0, Math.min(item.max, Number((item.current + amount).toFixed(2))));
    }
};

const refillDailyKit = () => {
    inventory.value.forEach(item => {
        item.current = item.max;
    });
    recentActivity.value.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: 'Stok Harian (Daily Kit) telah diisi ulang',
      type: 'info'
    });
};

const handleRequestRestock = ({ item, qty }) => {
    recentActivity.value.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Permintaan ${qty} ${item.unit} ${item.name} dikirim ke gudang`,
      type: 'info'
    });
};

const handleReportInvalid = ({ item, qty, reason }) => {
    // Deduct stock
    updateStock(item.id, -qty);
    
    recentActivity.value.unshift({
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Laporan: ${qty} ${item.unit} ${item.name} rusak (${reason})`,
      type: 'warning'
    });
};

const handleLoginSuccess = () => {
  isAuthenticated.value = true;
};

const handleLogout = () => {
  isAuthenticated.value = false;
  currentTab.value = 'home';
  cart.value = []; // Clear cart on logout
};

// CENTRALIZED INVENTORY STATE (Coffee Cart Specific)
const inventory = ref([...INITIAL_INVENTORY]);
</script>

<template>
  <template v-if="isAuthenticated">
    <!-- Persistent Top Navigation -->
    <TopNav :is-online="isOnline" @logout="handleLogout" />

    <!-- Main structural components -->
    <div class="scroll-container" id="main-scroll">
      
      <!-- DASHBOARD TAB -->
      <div v-if="currentTab === 'home'" class="page-container animate-slide-up">
        <!-- Grouped Sales & Balance Summary -->
        <section class="dashboard-summary">
          <div class="summary-card main-highlight">
            <div class="card-header">
              <span class="card-label">PENJUALAN HARI INI</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            </div>
            <div class="card-body">
              <span class="main-value">{{ salesToday }}</span>
              <span class="sub-detail">+12.5% MINGGU INI</span>
            </div>
          </div>
          
          <div class="summary-card secondary-highlight">
            <span class="card-label">SALDO DOMPET</span>
            <span class="secondary-value">{{ todayBalance }}</span>
          </div>
        </section>

        <!-- Quick Actions Control Section -->
        <section class="control-section">
          <h2 class="section-title">KONTROL TRANSAKSI</h2>
          <div class="main-actions">
            <button @click="currentTab = 'orders'" class="btn btn-primary lg">PESANAN BARU</button>
            <button @click="currentTab = 'menu'" class="btn btn-secondary lg">KELOLA STOK</button>
          </div>
        </section>

        <!-- Visual Activity Feed Section -->
        <section class="activity-section">
          <div class="section-header">
            <h3 class="small-title">AKTIVITAS TERBARU</h3>
            <a href="#" class="view-all">LIHAT SEMUA</a>
          </div>
          <div class="activity-list">
            <div v-for="item in recentActivity" :key="item.id" class="activity-card" :class="item.type">
              <div class="activity-icon-container">
                <svg v-if="item.type === 'success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <svg v-if="item.type === 'info'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <svg v-if="item.type === 'warning'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div class="activity-content">
                <span class="activity-text">{{ item.text }}</span>
                <span class="activity-time">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ORDERS TAB -->
      <div v-else-if="currentTab === 'orders'" class="page-container animate-slide-up">
        <OrderPage 
          :cart="cart" 
          @add="addToCart" 
          @remove="removeFromCart"
        />
      </div>

      <!-- STOCK TAB -->
      <div v-else-if="currentTab === 'menu'" class="page-container animate-slide-up">
          <StockPage 
            :inventory="inventory" 
            @update="updateStock" 
            @refill-kit="refillDailyKit"
            @request-restock="handleRequestRestock"
            @report-invalid="handleReportInvalid"
          />
      </div>

      <!-- OTHER TABS (Placeholders) -->
      <div v-else class="page-container animate-slide-up">
        <section class="placeholder-section">
          <h2>FITUR {{ currentTab.toUpperCase() }} SEGERA DATANG</h2>
          <button @click="currentTab = 'home'" class="btn btn-secondary">KEMBALI KE BERANDA</button>
        </section>
      </div>
    </div>

    <!-- FLOATING CART -->
    <Transition name="cart-slide">
      <div v-if="cartCount > 0 && currentTab === 'orders'" class="floating-cart-wrapper" @click="showCheckout = true">
        <div class="floating-cart">
            <div class="cart-details">
              <span class="total-qty">{{ cartCount }} ITEM</span>
              <span class="total-price">RP {{ cartTotal.toLocaleString('id-ID') }}</span>
            </div>
            <button class="checkout-now-btn">CEK OUT →</button>
        </div>
      </div>
    </Transition>

    <!-- Persistent Bottom Navigation -->
    <BottomNav v-model="currentTab" />

    <!-- Global Checkout Overlay -->
    <Transition name="fade">
      <div v-if="showCheckout" class="checkout-overlay">
        <div class="checkout-sheet">
          
          <!-- STEP 1: SUMMARY -->
          <template v-if="checkoutStep === 'summary'">
            <div class="sheet-header">
              <h2 class="sheet-title">RINGKASAN PESANAN</h2>
              <button @click="showCheckout = false" class="close-sheet">TUTUP</button>
            </div>
            
            <div class="order-summary-list">
              <div v-for="item in cart" :key="item.id" class="receipt-item">
                <span class="r-qty">{{ item.qty }}x</span>
                <span class="r-name">{{ item.name }}</span>
                <span class="r-price">RP {{ (item.price * item.qty).toLocaleString('id-ID') }}</span>
              </div>
            </div>

            <div class="final-checkout-section">
              <div class="total-row">
                <span class="label">TOTAL BAYAR</span>
                <span class="value">RP {{ cartTotal.toLocaleString('id-ID') }}</span>
              </div>
              <button class="btn btn-primary lg full-width" @click="checkoutStep = 'payment'">
                BAYAR SEKARANG
              </button>
            </div>
          </template>

          <!-- STEP 2: PAYMENT METHOD SELECTION -->
          <template v-else-if="checkoutStep === 'payment'">
            <div class="sheet-header">
              <h2 class="sheet-title">PILIH PEMBAYARAN</h2>
              <button @click="checkoutStep = 'summary'" class="close-sheet" :disabled="processing">KEMBALI</button>
            </div>

            <div class="payment-selection-area">
              <button class="pm-btn cash" @click="startPayment('TUNAI')" :disabled="processing">
                <div class="pm-icon">💵</div>
                <div class="pm-info">
                    <span class="pm-name">TUNAI / CASH</span>
                    <span class="pm-desc">Terima uang kertas/koin</span>
                </div>
              </button>

              <button class="pm-btn qris" @click="startPayment('QRIS')" :disabled="processing">
                <div class="pm-icon">📱</div>
                <div class="pm-info">
                    <span class="pm-name">QRIS DANA/OVO/DLL</span>
                    <span class="pm-desc">Scan kode QR dinamis</span>
                </div>
              </button>
            </div>
          </template>

          <!-- STEP 3: PAYMENT CONFIRMATION (REFINED FLOW) -->
          <template v-else-if="checkoutStep === 'confirmation'">
            <div class="sheet-header">
                <h2 class="sheet-title">KONFIRMASI: {{ selectedPaymentMethod }}</h2>
                <button @click="checkoutStep = 'payment'" class="close-sheet" :disabled="processing">GANTI METODE</button>
            </div>

            <div class="confirmation-flow-content">
                <!-- TOTAL DISPLAY -->
                <div class="payment-final-total">
                    <span class="label">TOTAL TAGIHAN</span>
                    <span class="value">RP {{ cartTotal.toLocaleString('id-ID') }}</span>
                </div>

                <!-- CASH FLOW -->
                <div v-if="selectedPaymentMethod === 'TUNAI'" class="cash-flow">
                    <div class="cash-instruction">
                        <p>Silakan terima uang tunai dari pelanggan sebesar total tagihan di atas.</p>
                        <p class="highlight">Pastikan jumlah uang sudah sesuai.</p>
                    </div>
                </div>

                <!-- QRIS FLOW -->
                <div v-if="selectedPaymentMethod === 'QRIS'" class="qris-flow">
                    <div class="qris-mockup-container">
                        <img src="./assets/qris_mockup.png" alt="QRIS NOFU" class="qris-img">
                    </div>
                    <p class="qris-hint">Scan QR di atas untuk membayar melalui aplikasi E-Wallet apa pun.</p>
                </div>
            </div>

            <div class="final-checkout-section">
                <button class="btn btn-primary lg full-width" @click="handleFinalize" :disabled="processing">
                    {{ processing ? 'MEMPROSES...' : (selectedPaymentMethod === 'TUNAI' ? 'KONFIRMASI TERIMA UANG' : 'SAYASUDAH SCAN') }}
                </button>
            </div>

            <div v-if="processing" class="payment-processing-status">
                <div class="spinner"></div>
                <span>MENYELESAIKAN PESANAN...</span>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </template>

  <!-- Login View -->
  <template v-else>
    <LoginPage @login-success="handleLoginSuccess" />
  </template>
</template>

<style scoped>
/* Scoped Styles for App.vue deriving from global mobile aesthetics */
.page-container {
  padding: 24px 20px 120px; /* Increased bottom padding for nav clearance */
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.placeholder-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 50vh;
  text-align: center;
}

.floating-cart-wrapper {
  padding: 10px 20px;
  background: var(--bg-mobile);
  border-top: 2px solid var(--border);
  flex-shrink: 0;
}

.floating-cart {
  background: var(--primary);
  color: black;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 4px 20px rgba(204, 255, 0, 0.4);
  cursor: pointer;
  border-radius: 8px;
}

.cart-details { display: flex; flex-direction: column; }
.total-qty { font-size: 0.65rem; font-weight: 900; opacity: 0.7; }
.total-price { font-size: 1.2rem; font-weight: 900; }
.checkout-now-btn { font-size: 0.9rem; font-weight: 900; letter-spacing: 0.05em; background: none; color: black; border: none; padding: 0; }

.cart-slide-enter-active, .cart-slide-leave-active { transition: all 0.3s ease-out; }
.cart-slide-enter-from, .cart-slide-leave-to { transform: translateY(100%); opacity: 0; }

.checkout-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 11000;
  display: flex;
  align-items: flex-end;
}

.checkout-sheet {
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

.sheet-header { display: flex; justify-content: space-between; align-items: center; }
.sheet-title { font-size: 1.2rem; }
.close-sheet { background: none; color: var(--text-muted); font-size: 0.75rem; font-weight: 900; }

.order-summary-list { display: flex; flex-direction: column; gap: 16px; max-height: 40vh; overflow-y: auto; }
.receipt-item { display: flex; gap: 12px; align-items: center; font-weight: 700; color: var(--white); }
.r-qty { color: var(--primary); width: 30px; }
.r-name { flex: 1; }
.r-price { opacity: 0.8; }

.final-checkout-section { display: flex; flex-direction: column; gap: 20px; border-top: 1px solid var(--border); padding-top: 24px; }
.total-row { display: flex; justify-content: space-between; align-items: center; }
.total-row .label { font-size: 0.8rem; font-weight: 900; color: var(--text-muted); }
.total-row .value { font-size: 1.8rem; font-weight: 900; color: var(--white); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Dashboard UI Part */
.dashboard-summary { display: flex; flex-direction: column; gap: 16px; }
.summary-card { padding: 24px; border: 1px solid var(--border); background: var(--surface); border-radius: 12px; }
.main-highlight { border-left: 6px solid var(--primary); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.card-label { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.1em; }
.main-value { font-size: 2.2rem; font-weight: 900; color: var(--white); line-height: 1; }
.sub-detail { display: block; font-size: 0.65rem; font-weight: 900; color: var(--primary); margin-top: 8px; }
.secondary-value { display: block; font-size: 1.4rem; font-weight: 900; color: var(--white); margin-top: 4px; }

.control-section { display: flex; flex-direction: column; gap: 16px; }
.section-title { font-size: 0.8rem; color: var(--text-muted); }
.main-actions { display: flex; flex-direction: column; gap: 12px; }
.btn.lg { padding: 20px; font-size: 1.1rem; }

.activity-section { display: flex; flex-direction: column; gap: 20px; }
.section-header { display: flex; justify-content: space-between; align-items: center; }
.small-title { font-size: 0.8rem; color: var(--text-muted); }
.view-all { font-size: 0.7rem; font-weight: 900; color: var(--primary); text-decoration: none; }

.activity-list { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  max-height: 400px; 
  overflow-y: auto; 
  padding-right: 8px;
}

/* Scoped Scrollbar for Activity List */
.activity-list::-webkit-scrollbar { width: 4px; }
.activity-list::-webkit-scrollbar-track { background: transparent; }
.activity-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }

.activity-card { display: flex; gap: 16px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; align-items: center; }
.activity-icon-container { padding: 10px; border-radius: 50%; background: rgba(255, 255, 255, 0.05); }
.success .activity-icon-container { color: var(--primary); background: rgba(204, 255, 0, 0.1); }
.info .activity-icon-container { color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
.warning .activity-icon-container { color: #EF4444; background: rgba(239, 68, 68, 0.1); }
.activity-content { display: flex; flex-direction: column; gap: 4px; }
.activity-text { font-size: 0.9rem; font-weight: 700; color: var(--white); }
.activity-time { font-size: 0.7rem; font-weight: 600; color: var(--text-muted); }

/* PAYMENT SELECTION STYLING */
.payment-selection-area { display: flex; flex-direction: column; gap: 16px; }
.pm-btn { width: 100%; display: flex; align-items: center; gap: 20px; padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; transition: all 0.2s; }
.pm-btn:active { transform: scale(0.98); border-color: var(--primary); }
.pm-btn:disabled { opacity: 0.5; cursor: wait; }
.pm-icon { font-size: 2rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 8px; }
.pm-info { display: flex; flex-direction: column; align-items: flex-start; }
.pm-name { font-size: 1.1rem; font-weight: 900; color: var(--white); }
.pm-desc { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

.pm-btn.cash:active { background: rgba(204, 255, 0, 0.1); }
.pm-btn.qris:active { background: rgba(59, 130, 246, 0.1); border-color: #3B82F6; }

.payment-processing-status { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px; text-align: center; font-weight: 900; color: var(--primary); font-size: 0.8rem; letter-spacing: 0.05em; }
.spinner { width: 30px; height: 30px; border: 4px solid rgba(204, 255, 0, 0.2); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }

/* REFINED CONFIRMATION STYLES */
.confirmation-flow-content { display: flex; flex-direction: column; gap: 24px; }
.payment-final-total { background: var(--surface); border: 1px solid var(--border); padding: 20px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.payment-final-total .label { font-size: 0.7rem; font-weight: 900; color: var(--text-muted); letter-spacing: 0.1em; }
.payment-final-total .value { font-size: 2.2rem; font-weight: 900; color: var(--primary); }

.cash-instruction { text-align: center; color: var(--white); font-weight: 700; line-height: 1.6; padding: 0 20px; }
.cash-instruction .highlight { color: var(--primary); margin-top: 10px; font-size: 0.9rem; }

.qris-mockup-container { width: 100%; display: flex; justify-content: center; }
.qris-img { width: 100%; max-width: 240px; border-radius: 12px; border: 4px solid var(--white); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.qris-hint { text-align: center; font-size: 0.7rem; font-weight: 700; color: var(--text-muted); padding: 0 30px; line-height: 1.4; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
