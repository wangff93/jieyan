<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCheckInStore } from '@/stores/checkin'
import { useAppStore } from '@/stores/app'
import { formatDurationShort } from '@/utils/helpers'
import RelapseForm from '@/components/RelapseForm.vue'
import MilestoneCard from '@/components/MilestoneCard.vue'

const router = useRouter()
const userStore = useUserStore()
const checkInStore = useCheckInStore()
const appStore = useAppStore()

// 检查是否需要完善档案
const needProfile = computed(() => userStore.isLoggedIn && !userStore.hasProfile)

// 实时无烟时长
const displaySeconds = ref(checkInStore.currentSmokeFreeSeconds)
let timer: number | null = null

onMounted(() => {
  timer = window.setInterval(() => {
    displaySeconds.value = checkInStore.currentSmokeFreeSeconds
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 打卡处理
const checkInLoading = ref(false)

const handleNormalCheckIn = async () => {
  checkInLoading.value = true
  try {
    const result = await checkInStore.normalCheckIn()
    if (result.milestones && result.milestones.length > 0) {
      appStore.showMilestone(result.milestones[0])
    }
  } catch (e: any) {
    alert(e.message)
  } finally {
    checkInLoading.value = false
  }
}

// 快捷入口
const quickActions = [
  { icon: 'heart', label: '烟瘾急救', path: '/emergency', color: '#EF4444' },
  { icon: 'book', label: '知识库', path: '/knowledge', color: '#6366F1' },
  { icon: 'plan', label: '戒烟计划', path: '/plan', color: '#F59E0B' }
]
</script>

<template>
  <div class="home-page">
    <!-- 完善档案提示 -->
    <div v-if="needProfile" class="profile-tip">
      <div class="tip-content">
        <span>完善戒烟档案，获得更精准的服务</span>
        <button @click="router.push('/profile')">去完善</button>
      </div>
    </div>

    <!-- 顶部欢迎 -->
    <div class="welcome-section">
      <div class="user-info">
        <div class="avatar">
          {{ userStore.user?.nickname?.charAt(0) || '戒' }}
        </div>
        <div class="greeting">
          <h2>你好，{{ userStore.user?.nickname || '戒烟者' }}</h2>
          <p>今天是戒烟的第 <span class="highlight">{{ checkInStore.statistics.totalSmokeFreeDays }}</span> 天</p>
        </div>
      </div>
    </div>

    <!-- 核心数据卡片 -->
    <div class="stats-section">
      <div class="timer-card">
        <div class="timer-ring">
          <div class="ring-bg"></div>
          <div class="ring-progress"></div>
          <div class="timer-content">
            <div class="timer-value">{{ formatDurationShort(displaySeconds) }}</div>
            <div class="timer-label">无烟时长</div>
          </div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-item">
          <div class="stat-value">{{ checkInStore.consecutiveDays }}</div>
          <div class="stat-label">连续打卡</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ checkInStore.statistics.totalSavedMoney }}</div>
          <div class="stat-label">节省金额(元)</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ checkInStore.statistics.healthScore }}</div>
          <div class="stat-label">健康评分</div>
        </div>
      </div>
    </div>

    <!-- 打卡区域 -->
    <div class="checkin-section">
      <h3 class="section-title">今日打卡</h3>
      
      <div v-if="!checkInStore.todayCheckIn" class="checkin-buttons">
        <button 
          class="checkin-btn normal"
          :class="{ loading: checkInLoading }"
          :disabled="checkInLoading"
          @click="handleNormalCheckIn"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>今日无烟</span>
        </button>
        <button class="checkin-btn relapse" @click="appStore.showRelapse">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span>记录复吸</span>
        </button>
      </div>

      <div v-else class="checkin-result">
        <div class="result-badge" :class="checkInStore.todayCheckIn.type">
          <svg v-if="checkInStore.todayCheckIn.type === 'normal'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span>{{ checkInStore.todayCheckIn.type === 'normal' ? '已打卡' : '已记录复吸' }}</span>
        </div>
        <p class="result-text">{{ checkInStore.todayCheckIn.checkInDate }} · 连续 {{ checkInStore.consecutiveDays }} 天</p>
      </div>
    </div>

    <!-- 快捷入口 -->
    <div class="quick-actions">
      <h3 class="section-title">快捷工具</h3>
      <div class="actions-grid">
        <div 
          v-for="action in quickActions" 
          :key="action.path"
          class="action-item"
          @click="router.push(action.path)"
        >
          <div class="action-icon" :style="{ background: action.color + '20', color: action.color }">
            <svg v-if="action.icon === 'heart'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <svg v-else-if="action.icon === 'book'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <svg v-else-if="action.icon === 'plan'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <span class="action-label">{{ action.label }}</span>
        </div>
      </div>
    </div>

    <!-- 复吸表单弹窗 -->
    <RelapseForm v-if="appStore.showRelapseModal" />

    <!-- 里程碑弹窗 -->
    <MilestoneCard 
      v-if="appStore.showMilestoneModal"
      :milestone="appStore.showMilestoneModal"
      @close="appStore.hideMilestone"
    />
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  padding: 20px 16px 100px;
}

.profile-tip {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
}

.tip-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-size: 14px;
}

.tip-content button {
  background: white;
  color: #10B981;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.welcome-section {
  margin-bottom: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.greeting h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.greeting p {
  font-size: 14px;
  color: #6B7280;
}

.highlight {
  color: #10B981;
  font-weight: 600;
}

.stats-section {
  margin-bottom: 24px;
}

.timer-card {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 16px;
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.3);
}

.timer-ring {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.ring-bg {
  position: absolute;
  inset: 0;
  border: 8px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.ring-progress {
  position: absolute;
  inset: 0;
  border: 8px solid transparent;
  border-top-color: white;
  border-right-color: white;
  border-radius: 50%;
  transform: rotate(45deg);
}

.timer-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.timer-value {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.timer-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}

.stats-row {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.stat-item {
  text-align: center;
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
}

.stat-label {
  font-size: 12px;
  color: #6B7280;
  margin-top: 4px;
}

.stat-divider {
  width: 1px;
  background: #E5E7EB;
  margin: 0 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.checkin-section {
  margin-bottom: 24px;
}

.checkin-buttons {
  display: flex;
  gap: 12px;
}

.checkin-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.checkin-btn.normal {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.checkin-btn.relapse {
  background: white;
  color: #EF4444;
  border: 2px solid #FEE2E2;
}

.checkin-btn span {
  font-size: 16px;
  font-weight: 600;
}

.checkin-btn.loading {
  opacity: 0.7;
}

.checkin-result {
  background: white;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.result-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.result-badge.normal {
  background: #D1FAE5;
  color: #059669;
}

.result-badge.relapse {
  background: #FEE2E2;
  color: #DC2626;
}

.result-text {
  font-size: 14px;
  color: #6B7280;
}

.quick-actions {
  margin-bottom: 24px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.action-item {
  background: white;
  border-radius: 16px;
  padding: 20px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.action-item:hover {
  transform: translateY(-4px);
}

.action-item:active {
  transform: translateY(0);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}

.action-label {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}
</style>
