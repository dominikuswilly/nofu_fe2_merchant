<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="modal-overlay">
                <div class="modal-sheet report-sheet">
                    <h2 class="modal-title">LAPOR RUSAK: {{ item?.name?.toUpperCase() }}</h2>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">JUMLAH RUSAK/EXP ({{ item?.unit }})</label>
                            <input type="number" v-model="modalQty" class="form-input" placeholder="0" step="1">
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
                        <button class="btn btn-secondary" @click="emit('close')">BATAL</button>
                        <button class="btn btn-primary danger" @click="submit">LAPOR & KURANGI STOK</button>
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
const modalReason = ref('Expired');

watch(() => props.show, (newVal) => {
    if (newVal) {
        modalQty.value = 1;
        modalReason.value = 'Expired';
    }
});

const submit = () => {
    if (modalQty.value > 0) {
        emit('submit', modalQty.value, modalReason.value);
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
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

.report-sheet {
    border-top-color: #EF4444;
}

.modal-title {
    font-size: 1.1rem;
    font-weight: 900;
    letter-spacing: -0.5px;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-label {
    font-size: 0.7rem;
    font-weight: 900;
    color: var(--text-muted);
}

.form-input {
    background: var(--surface);
    border: 1px solid var(--border);
    padding: 18px;
    color: var(--white);
    font-size: 1.2rem;
    font-weight: 900;
    width: 100%;
}

.modal-footer {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 12px;
    margin-top: 12px;
}

.btn.danger {
    background: #EF4444;
    border-color: #EF4444;
    border: 1px solid #EF4444;
    color: white;
    padding: 12px;
    font-weight: 900;
    font-size: 0.8rem;
    cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
