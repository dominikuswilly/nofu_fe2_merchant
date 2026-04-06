<script setup>
import { ref } from 'vue';
import TopNav from './components/TopNav.vue';
import BottomNav from './components/BottomNav.vue';
import LoginPage from './components/LoginPage.vue';

// Authentication State
const isAuthenticated = ref(false);

const currentTab = ref('home');
const isOnline = ref(true);
const salesToday = ref('RP 2.540.000');
const todayBalance = ref('RP 12.850.000');

const recentActivity = ref([
  { time: '13:42', text: 'Pesanan #204 selesai', type: 'success' },
  { time: '13:30', text: 'Pesanan #205 diterima', type: 'info' },
  { time: '13:15', text: 'Stok Espresso habis', type: 'warning' },
]);

const handleLoginSuccess = () => {
  isAuthenticated.value = true;
};
</script>

<template>
  <template v-if="isAuthenticated">
    <!-- Persistent Top Navigation -->
    <TopNav :is-online="isOnline" />

    <!-- Main structural components -->
    <div class="scroll-container" id="main-scroll">
      <div class="page-container animate-slide-up">
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
            <button class="btn btn-primary lg">PESANAN BARU</button>
            <button class="btn btn-secondary lg">KELOLA STOK</button>
          </div>
        </section>

        <!-- Visual Activity Feed Section -->
        <section class="activity-section">
          <div class="section-header">
            <h3 class="small-title">AKTIVITAS TERBARU</h3>
            <a href="#" class="view-all">LIHAT SEMUA</a>
          </div>
          <div class="activity-list">
            <div v-for="item in recentActivity" :key="item.time" class="activity-card" :class="item.type">
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
    </div>

    <!-- Persistent Bottom Navigation -->
    <BottomNav v-model="currentTab" />
  </template>

  <!-- Login View -->
  <template v-else>
    <LoginPage @login-success="handleLoginSuccess" />
  </template>
</template>

<style scoped>
.page-container {
  padding: 24px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Dashboard Summary Boxes */
.dashboard-summary {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-card {
  padding: 24px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 12px;
}

.main-highlight {
  border-left: 6px solid var(--primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-label {
  font-size: 0.7rem;
  font-weight: 900;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

.main-value {
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.sub-detail {
  display: block;
  font-size: 0.65rem;
  font-weight: 900;
  color: var(--primary);
  margin-top: 8px;
}

.secondary-value {
  display: block;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--white);
  margin-top: 4px;
}

/* Quick Actions Control Section */
.control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.main-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn.lg {
  padding: 20px;
  font-size: 1.1rem;
}

/* Visual Activity Feed Overhaul */
.activity-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.small-title {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.view-all {
  font-size: 0.7rem;
  font-weight: 900;
  color: var(--primary);
  text-decoration: none;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  align-items: center;
}

.activity-icon-container {
  padding: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.success .activity-icon-container { color: var(--primary); background: rgba(204, 255, 0, 0.1); }
.info .activity-icon-container { color: #3B82F6; background: rgba(59, 130, 246, 0.1); }
.warning .activity-icon-container { color: #EF4444; background: rgba(239, 68, 68, 0.1); }

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-text {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--white);
}

.activity-time {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
}
</style>
