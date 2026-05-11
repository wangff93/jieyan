<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { QUIT_REASONS } from '@/types'
import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  nickname: userStore.user?.nickname || '',
  smokingAge: userStore.user?.smokingAge || 0,
  dailySmoking: userStore.user?.dailySmoking || 0,
  cigarettePrice: userStore.user?.cigarettePrice || 0,
  quitReasons: userStore.user?.quitReasons || [],
  quitGoal: userStore.user?.quitGoal || 'quit_completely',
  quitStartDate: userStore.user?.quitStartDate || '',
  reduceTarget: 0
})

const loading = ref(false)
const error = ref('')

const isValid = computed(() => {
  return form.smokingAge > 0 && 
         form.dailySmoking > 0 && 
         form.cigarettePrice > 0 &&
         form.quitReasons.length > 0 &&
         form.quitStartDate
})

const toggleReason = (value: string) => {
  const index = form.quitReasons.indexOf(value)
  if (index === -1) {
    form.quitReasons.push(value)
  } else {
    form.quitReasons.splice(index, 1)
  }
}

const handleSubmit = async () => {
  error.value = ''
  
  if (!isValid.value) {
    error.value = '请完善所有必填信息'
    return
  }

  loading.value = true
  try {
    await userStore.updateProfile({
      nickname: form.nickname || `戒烟者${Math.floor(Math.random() * 9000) + 1000}`,
      smokingAge: form.smokingAge,
      dailySmoking: form.dailySmoking,
      cigarettePrice: form.cigarettePrice,
      quitReasons: form.quitReasons,
      quitGoal: form.quitGoal,
      quitStartDate: form.quitStartDate
    })
    router.push('/')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="profile-page">
    <HeaderBar title="完善戒烟档案" showBack />

    <div class="page-content">
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>
        
        <div class="form-item">
          <label>昵称（选填）</label>
          <input 
            v-model="form.nickname"
            type="text"
            placeholder="给自己起个名字"
            maxlength="10"
          />
        </div>

        <div class="form-item">
          <label>烟龄</label>
          <div class="input-with-unit">
            <input 
              v-model.number="form.smokingAge"
              type="number"
              placeholder="0"
              min="0.5"
              max="50"
              step="0.5"
            />
            <span class="unit">年</span>
          </div>
          <p class="hint">从开始吸烟到现在多少年了</p>
        </div>

        <div class="form-item">
          <label>日均吸烟量</label>
          <div class="input-with-unit">
            <input 
              v-model.number="form.dailySmoking"
              type="number"
              placeholder="0"
              min="1"
              max="50"
            />
            <span class="unit">支/天</span>
          </div>
          <p class="hint">平均每天吸多少支烟</p>
        </div>

        <div class="form-item">
          <label>香烟单价</label>
          <div class="input-with-unit">
            <input 
              v-model.number="form.cigarettePrice"
              type="number"
              placeholder="0"
              min="5"
              max="200"
              step="0.1"
            />
            <span class="unit">元/包</span>
          </div>
          <p class="hint">通常购买的香烟价格</p>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">戒烟信息</h3>

        <div class="form-item">
          <label>戒烟原因（可多选）</label>
          <div class="reason-grid">
            <button
              v-for="reason in QUIT_REASONS"
              :key="reason.value"
              class="reason-btn"
              :class="{ active: form.quitReasons.includes(reason.value) }"
              @click="toggleReason(reason.value)"
            >
              {{ reason.label }}
            </button>
          </div>
        </div>

        <div class="form-item">
          <label>戒烟目标</label>
          <div class="goal-options">
            <button
              class="goal-btn"
              :class="{ active: form.quitGoal === 'quit_completely' }"
              @click="form.quitGoal = 'quit_completely'"
            >
              <div class="goal-icon">🚭</div>
              <div class="goal-text">
                <span class="goal-title">完全戒烟</span>
                <span class="goal-desc">彻底告别香烟</span>
              </div>
            </button>
            <button
              class="goal-btn"
              :class="{ active: form.quitGoal === 'reduce_gradually' }"
              @click="form.quitGoal = 'reduce_gradually'"
            >
              <div class="goal-icon">📉</div>
              <div class="goal-text">
                <span class="goal-title">逐渐减量</span>
                <span class="goal-desc">循序渐进减少</span>
              </div>
            </button>
          </div>
        </div>

        <div class="form-item">
          <label>戒烟起始日期</label>
          <input 
            v-model="form.quitStartDate"
            type="date"
            :max="new Date().toISOString().split('T')[0]"
          />
          <p class="hint">从哪天开始戒烟的</p>
        </div>
      </div>

      <div v-if="error" class="error-tip">
        {{ error }}
      </div>

      <button 
        class="submit-btn" 
        :disabled="loading || !isValid"
        @click="handleSubmit"
      >
        {{ loading ? '保存中...' : '保存档案' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 20px 16px 40px;
}

.form-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #E5E7EB;
}

.form-item {
  margin-bottom: 20px;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-item input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
  font-size: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
  background: white;
}

.form-item input:focus {
  border-color: #10B981;
}

.input-with-unit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-with-unit input {
  flex: 1;
}

.unit {
  font-size: 14px;
  color: #6B7280;
  min-width: 50px;
}

.hint {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 6px;
}

.reason-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.reason-btn {
  padding: 8px 16px;
  background: #F3F4F6;
  border: 2px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.reason-btn.active {
  background: #D1FAE5;
  border-color: #10B981;
  color: #059669;
}

.goal-options {
  display: flex;
  gap: 12px;
}

.goal-btn {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #F9FAFB;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.goal-btn.active {
  background: #D1FAE5;
  border-color: #10B981;
}

.goal-icon {
  font-size: 24px;
}

.goal-text {
  display: flex;
  flex-direction: column;
}

.goal-title {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
}

.goal-desc {
  font-size: 12px;
  color: #6B7280;
}

.error-tip {
  color: #EF4444;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: #FEF2F2;
  border-radius: 8px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
