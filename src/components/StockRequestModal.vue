<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="modal-overlay">
                <div class="modal-sheet">
                    <h2 class="modal-title">MINTA STOK: {{ item?.name?.toUpperCase() }}</h2>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">JUMLAH DIBUTUHKAN ({{ item?.unit }})</label>
                            <input type="number" v-model="modalQty" class="form-input" placeholder="0">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" @click="emit('close')">BATAL</button>
                        <button class="btn btn-primary" @click="submit">KIRIM PERMINTAAN</button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    show: Boolean,
    item: Object
});

const emit = defineEmits(['close', 'submit']);
const modalQty = ref(1);

// Reset qty when opened
watch(() => props.show, (newVal) => {
    if (newVal) modalQty.value = 1;
});

const submit = () => {
    if (modalQty.value > 0) {
        emit('submit', modalQty.value);
    }
};
</script>

<style scoped>
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
    width: 100%;
}

.modal-footer { display: grid; grid-template-columns: 1fr 2fr; gap: 12px; margin-top: 12px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
