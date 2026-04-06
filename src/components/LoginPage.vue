<template>
  <div class="login-page">
    <div class="login-container animate-slide-up">
      <div class="login-branding">
        <h1 class="logo-text">NOFU <span class="accent-text">COFFEE</span></h1>
        <p class="branding-subtitle">Merchant Dashboard Portal</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username" class="form-label">USERNAME</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            placeholder="Username" 
            class="form-input" 
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password" class="form-label">PASSWORD</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="••••••••" 
            class="form-input" 
            required
            autocomplete="current-password"
          />
        </div>

        <!-- Error Notification -->
        <div v-if="error" class="error-notification animate-bounce-in">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span>Username atau password salah.</span>
        </div>

        <button type="submit" class="btn btn-primary lg full-width login-btn" :disabled="loading">
          {{ loading ? 'MENGECEK...' : 'MASUK' }}
        </button>
      </form>

      <footer class="login-footer">
        <p>&copy; 2026 NOFU COFFEE GROUP. SELURUH HAK CIPTA.</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['login-success']);

const username = ref('');
const password = ref('');
const error = ref(false);
const loading = ref(false);

const handleLogin = () => {
  loading.value = true;
  error.value = false;
  
  // Mock authentication logic
  // Simulate network latency
  setTimeout(() => {
    if (username.value === 'admin' && password.value === 'p@ssword') {
      emit('login-success');
    } else {
      error.value = true;
      loading.value = false;
    }
  }, 800);
};
</script>

<style scoped>
.login-page {
  height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: var(--bg-mobile);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.login-branding {
  text-align: center;
}

.logo-text {
  font-size: 3rem;
  letter-spacing: -3px;
  line-height: 1;
  margin-bottom: 8px;
}

.branding-subtitle {
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--text-muted);
  letter-spacing: 0.2em;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--white);
  letter-spacing: 0.1em;
}

.form-input {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 18px;
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: var(--primary);
}

.error-notification {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid #EF4444;
  color: #EF4444;
  padding: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
}

@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-bounce-in {
  animation: bounceIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

.login-btn {
  margin-top: 12px;
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.login-footer p {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-muted);
}
</style>
