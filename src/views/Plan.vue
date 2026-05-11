<script setup lang="ts">
import { ref } from 'vue'
import HeaderBar from '@/components/HeaderBar.vue'

const plans = [
  {
    id: 1,
    name: '渐进式戒烟',
    description: '适合烟龄较长、每日吸烟量大的用户',
    stages: [
      { name: '准备期', days: '1-7天', target: '减少30%' },
      { name: '减量期', days: '8-21天', target: '再减30%' },
      { name: '过渡期', days: '22-30天', target: '减至5支/天' },
      { name: '戒烟期', days: '31天+', target: '完全戒断' }
    ],
    suitable: '烟龄5年以上，日均20支以上'
  },
  {
    id: 2,
    name: '快速戒烟法',
    description: '适合决心坚定、意志力强的用户',
    stages: [
      { name: '决心期', days: '1-3天', target: '做好心理准备' },
      { name: '适应期', days: '4-7天', target: '克服戒断反应' },
      { name: '巩固期', days: '8-21天', target: '建立无烟习惯' },
      { name: '稳定期', days: '22天+', target: '保持无烟生活' }
    ],
    suitable: '烟龄3年以内，日均10支左右'
  },
  {
    id: 3,
    name: '轻松戒烟法',
    description: '温和的方式，逐步减少吸烟',
    stages: [
      { name: '第一周', days: '1-7天', target: '每天减2支' },
      { name: '第二周', days: '8-14天', target: '每天减3支' },
      { name: '第三周', days: '15-21天', target: '每天减4支' },
      { name: '第四周', days: '22-28天', target: '完全戒断' }
    ],
    suitable: '适合所有用户，轻松无压力'
  }
]

const selectedPlan = ref<number | null>(null)

const selectPlan = (id: number) => {
  selectedPlan.value = id
}
</script>

<template>
  <div class="plan-page">
    <HeaderBar title="戒烟计划" showBack />

    <div class="page-content">
      <div class="intro">
        <h2>选择适合您的戒烟方案</h2>
        <p>根据您的吸烟习惯，智能推荐最适合您的戒烟计划</p>
      </div>

      <div class="plan-list">
        <div 
          v-for="plan in plans" 
          :key="plan.id"
          class="plan-card"
          :class="{ selected: selectedPlan === plan.id }"
          @click="selectPlan(plan.id)"
        >
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="check-icon" v-if="selectedPlan === plan.id">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          
          <p class="plan-desc">{{ plan.description }}</p>

          <div class="stages">
            <div v-for="(stage, index) in plan.stages" :key="index" class="stage-item">
              <div class="stage-dot"></div>
              <div class="stage-info">
                <span class="stage-name">{{ stage.name }}</span>
                <span class="stage-target">{{ stage.target }}</span>
              </div>
            </div>
          </div>

          <div class="plan-footer">
            <span class="suitable-tag">适合：{{ plan.suitable }}</span>
          </div>
        </div>
      </div>

      <button 
        class="start-btn"
        :disabled="!selectedPlan"
        @click="selectedPlan && alert('计划已启动！')"
      >
        开始执行计划
      </button>
    </div>
  </div>
</template>

<style scoped>
.plan-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.intro {
  text-align: center;
  margin-bottom: 24px;
}

.intro h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.intro p {
  font-size: 14px;
  color: #6B7280;
}

.plan-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.plan-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-card.selected {
  border-color: #10B981;
  background: #F0FDF4;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.plan-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.check-icon {
  width: 28px;
  height: 28px;
  background: #10B981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.plan-desc {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 16px;
}

.stages {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stage-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stage-dot {
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
}

.stage-info {
  display: flex;
  flex-direction: column;
}

.stage-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.stage-target {
  font-size: 11px;
  color: #6B7280;
}

.plan-footer {
  padding-top: 12px;
  border-top: 1px solid #E5E7EB;
}

.suitable-tag {
  font-size: 12px;
  color: #6B7280;
  background: #F3F4F6;
  padding: 4px 8px;
  border-radius: 4px;
}

.start-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
  transition: all 0.3s;
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
