<template>
  <header class="top-nav">
    <div class="logo-area">
      <h1 class="logo-text">NOFU <span class="accent-text">COFFEE</span></h1>
    </div>
    
    <div class="right-actions">
      <!-- Status Indicator -->
      <div class="status-indicator">
        <div class="status-dot" :class="{ 'pulse pulse-outline': isOnline }"></div>
        <span class="status-label">{{ isOnline ? 'AKTIF' : 'OFFLINE' }}</span>
      </div>
      
      <!-- Profile Action -->
      <button class="profile-btn" aria-label="Profil">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  isOnline: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
.top-nav {
  height: 70px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: var(--surface);
  border-bottom: 2px solid var(--border);
  flex-shrink: 0;
  z-index: 1000;
}

.logo-text {
  font-size: 1.4rem;
  letter-spacing: -1px;
  font-weight: 900;
  color: var(--white);
  line-height: 1;
}

.accent-text {
  color: var(--primary);
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 99px;
  border: 1px solid var(--border);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
}

.pulse-outline {
  animation: pulse 2s infinite;
}

.status-label {
  font-weight: 900;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  color: var(--white);
}

.profile-btn {
  background: none;
  border: none;
  color: var(--white);
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.profile-btn:active {
  opacity: 0.6;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(204, 255, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0); }
}
</style>
