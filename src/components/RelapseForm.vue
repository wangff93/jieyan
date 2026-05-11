<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCheckInStore } from '@/stores/checkin'
import { useAppStore } from '@/stores/app'
import { RELAPSE_TRIGGERS } from '@/types'

const checkInStore = useCheckInStore()
const appStore = useAppStore()

const form = reactive({
  smokingCount: 1,
  triggers: [] as string[],
  time: new Date().toTimeString().slice(0, 5),
  location: '',
  note: ''
})

const loading = ref(false)

const toggleTrigger = (value: string) => {
  const index = form.triggers.indexOf(value)
  if (index === -1) {
    form.triggers.push(value)
  } else {
    form.triggers.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (form.triggers.length === 0) {
    alert('请至少选择一个复吸诱因')
    return
  }

  loading.value = true
  try {
    await checkInStore.relapseCheckIn({
      smokingCount: form.smokingCount,
      triggers: form.triggers,
      time: form.time,
      location: form.location,
      note: form.note
    })
    appStore.hideRelapse()
  } catch (e: any) {
    alert(e.message)
  } finally {
    loading.value = false
  }
}

const close = () => {
  appStore.hideRelapse()
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>记录复吸</h3>
        <button class="close-btn" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <p class="tip">复吸不代表失败，分析原因，继续努力！</p>

        <div class="form-item">
          <label>吸烟支数</label>
          <div class="number-input">
            <button @click="form.smokingCount = Math.max(1, form.smokingCount - 1)">-</button>
            <input type="number" v-model.number="form.smokingCount" min="1" max="50" />
            <button @click="form.smokingCount = Math.min(50, form.smokingCount + 1)">+</button>
          </div>
        </div>

        <div class="form-item">
          <label>复吸诱因（可多选）</label>
          <div class="trigger-grid">
            <button
              v-for="trigger in RELAPSE_TRIGGERS"
              :key="trigger.value"
              class="trigger-btn"
              :class="{ active: form.triggers.includes(trigger.value) }"
              @click="toggleTrigger(trigger.value)"
            >
              {{ trigger.label }}
            </button>
          </div>
        </div>

        <div class="form-item">
          <label>复吸时间</label>
          <input type="time" v-model="form.time" />
        </div>

        <div class="form-item">
          <label>复吸地点</label>
          <input type="text" v-model="form.location" placeholder="在哪里复吸了？" />
        </div>

        <div class="form-item">
          <label>备注</label>
          <textarea v-model="form.note" placeholder="记录一下当时的感受..." rows="3"></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="close">取消</button>
        <button class="submit-btn" :disabled="loading" @click="handleSubmit">
          {{ loading ? '提交中...' : '确认提交' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
  padding: 0 16px;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.modal-content {
  width: 100%;
  max-width: 420px;
  max-height: 85vh;
  background: white;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #E5E7EB;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  border: none;
  border-radius: 50%;
  color: #6B7280;
  cursor: pointer;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(85vh - 140px);
}

.tip {
  font-size: 14px;
  color: #EF4444;
  background: #FEF2F2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
  background: white;
}

.form-item input:focus,
.form-item textarea:focus {
  border-color: #10B981;
}

.form-item textarea {
  resize: none;
}

.number-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.number-input button {
  width: 44px;
  height: 44px;
  background: #F3F4F6;
  border: none;
  border-radius: 10px;
  font-size: 20px;
  color: #374151;
  cursor: pointer;
}

.number-input button:active {
  background: #E5E7EB;
}

.number-input input {
  flex: 1;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}

.trigger-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trigger-btn {
  padding: 8px 16px;
  background: #F3F4F6;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.trigger-btn.active {
  background: #FEE2E2;
  border-color: #EF4444;
  color: #EF4444;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 16px 20px 24px;
  border-top: 1px solid #E5E7EB;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #F3F4F6;
  color: #6B7280;
}

.submit-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
