<template>
  <nav class="bottom-nav">
    <button class="nav-item " :class="{ active: currentTab === 'home' }" @click="selectTab('home')">
      <div class="nav-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
      </div>
      <span class="nav-label">BERANDA</span>
      <div v-if="currentTab === 'home'" class="active-dot"></div>
    </button>
    <button class="nav-item" :class="{ active: currentTab === 'orders' }" @click="selectTab('orders')">
      <div class="nav-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
      </div>
      <span class="nav-label">PESANAN</span>
      <div v-if="currentTab === 'orders'" class="active-dot"></div>
    </button>
    <button class="nav-item" :class="{ active: currentTab === 'menu' }" @click="selectTab('menu')">
      <div class="nav-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
      </div>
      <span class="nav-label">STOK</span>
      <div v-if="currentTab === 'menu'" class="active-dot"></div>
    </button>
    <button class="nav-item" :class="{ active: currentTab === 'stats' }" @click="selectTab('stats')">
      <div class="nav-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
      </div>
      <span class="nav-label">STATISTIK</span>
      <div v-if="currentTab === 'stats'" class="active-dot"></div>
    </button>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'home'
  }
});

const emit = defineEmits(['update:modelValue']);
const currentTab = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  currentTab.value = newVal;
});

const selectTab = (tab) => {
  currentTab.value = tab;
  emit('update:modelValue', tab);
};
</script>

<style scoped>
.bottom-nav {
  width: 100%;
  background: var(--surface);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  border-top: 1px solid var(--border);
  z-index: 9999;
  padding-top: 10px;
  padding-bottom: calc(env(safe-area-inset-bottom, 15px) + 15px);
  flex-shrink: 0;
}

.nav-item {
  background: none;
  color: var(--text-muted);
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.nav-icon-wrapper { transition: transform 0.2s ease; }
.nav-label { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.05em; }

.active { color: var(--primary); }
.active .nav-icon-wrapper { transform: translateY(-2px); }

.active-dot {
  width: 14px;
  height: 3px;
  background: var(--primary);
  border-radius: 99px;
  position: absolute;
  top: -4px;
}

.nav-item:active { opacity: 0.6; }
</style>
