<script setup lang="ts">
import { computed } from 'vue'
import { useCheckInStore } from '@/stores/checkin'
import HeaderBar from '@/components/HeaderBar.vue'

const checkInStore = useCheckInStore()
const stats = computed(() => checkInStore.statistics)

// 饼图数据
const pieData = computed(() => {
  const distribution = stats.value.relapseTriggerDistribution
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)
  if (total === 0) return []
  
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#6366F1', '#EC4899']
  const labels: Record<string, string> = {
    stress: '压力',
    emotion: '情绪',
    social: '应酬',
    boredom: '无聊',
    other: '其他'
  }
  
  let currentAngle = 0
  return Object.entries(distribution).map(([key, value], index) => {
    const percentage = (value / total) * 100
    const startAngle = currentAngle
    currentAngle += percentage
    return {
      key,
      label: labels[key] || key,
      value,
      percentage,
      color: colors[index % colors.length],
      startAngle,
      endAngle: currentAngle
    }
  })
})

// 柱状图数据
const barData = computed(() => {
  const pattern = stats.value.relapseTimePattern
  const periods = ['早晨', '上午', '中午', '下午', '晚间', '深夜']
  const maxValue = Math.max(...Object.values(pattern), 1)
  
  return periods.map(period => ({
    label: period,
    value: pattern[period] || 0,
    height: ((pattern[period] || 0) / maxValue) * 100
  }))
})
</script>

<template>
  <div class="stats-page">
    <HeaderBar title="数据统计" showBack />

    <div class="page-content">
      <!-- 核心数据 -->
      <div class="stats-grid">
        <div class="stat-card highlight">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalSmokeFreeDays }}</div>
            <div class="stat-label">累计无烟天数</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalSavedMoney }}</div>
            <div class="stat-label">节省金额(元)</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">❤️</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.healthScore }}</div>
            <div class="stat-label">健康评分</div>
          </div>
        </div>
      </div>

      <!-- 健康收益 -->
      <div class="card">
        <h3 class="card-title">健康收益</h3>
        <div class="health-list">
          <div class="health-item">
            <div class="health-icon">☠️</div>
            <div class="health-info">
              <span class="health-label">避免尼古丁摄入</span>
              <span class="health-value">{{ stats.avoidedNicotine.toFixed(1) }} mg</span>
            </div>
          </div>
          <div class="health-item">
            <div class="health-icon">🫁</div>
            <div class="health-info">
              <span class="health-label">避免焦油摄入</span>
              <span class="health-value">{{ stats.avoidedTar.toFixed(1) }} mg</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 复吸分析 -->
      <div class="card">
        <h3 class="card-title">复吸分析</h3>
        
        <div class="relapse-summary">
          <div class="relapse-count">{{ stats.totalRelapseCount }}</div>
          <div class="relapse-label">次复吸记录</div>
        </div>

        <div v-if="pieData.length > 0" class="chart-section">
          <h4 class="chart-title">诱因分布</h4>
          <div class="pie-chart">
            <svg viewBox="0 0 100 100" class="pie">
              <circle
                v-for="(item, index) in pieData"
                :key="item.key"
                cx="50"
                cy="50"
                r="30"
                fill="transparent"
                :stroke="item.color"
                stroke-width="20"
                :stroke-dasharray="`${(item.percentage / 100) * 188.5} 188.5`"
                :stroke-dashoffset="-((item.startAngle / 100) * 188.5)"
                :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
              />
            </svg>
            <div class="pie-legend">
              <div v-for="item in pieData" :key="item.key" class="legend-item">
                <span class="legend-dot" :style="{ background: item.color }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-value">{{ item.value }}次</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="barData.some(b => b.value > 0)" class="chart-section">
          <h4 class="chart-title">时间规律</h4>
          <div class="bar-chart">
            <div v-for="item in barData" :key="item.label" class="bar-item">
              <div class="bar-label">{{ item.label }}</div>
              <div class="bar-track">
                <div 
                  class="bar-fill" 
                  :style="{ height: item.height + '%' }"
                ></div>
              </div>
              <div class="bar-value">{{ item.value }}</div>
            </div>
          </div>
        </div>

        <div v-if="stats.totalRelapseCount === 0" class="empty-state">
          <div class="empty-icon">🎉</div>
          <p>太棒了！暂无复吸记录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.stat-card.highlight {
  grid-column: span 2;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
}

.stat-card.highlight .stat-icon,
.stat-card.highlight .stat-value,
.stat-card.highlight .stat-label {
  color: white;
}

.stat-icon {
  font-size: 28px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1F2937;
}

.stat-label {
  font-size: 12px;
  color: #6B7280;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 16px;
}

.health-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F9FAFB;
  border-radius: 12px;
}

.health-icon {
  font-size: 24px;
}

.health-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.health-label {
  font-size: 14px;
  color: #374151;
}

.health-value {
  font-size: 16px;
  font-weight: 600;
  color: #10B981;
}

.relapse-summary {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%);
  border-radius: 12px;
  margin-bottom: 20px;
}

.relapse-count {
  font-size: 48px;
  font-weight: 700;
  color: #EF4444;
}

.relapse-label {
  font-size: 14px;
  color: #DC2626;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  margin-bottom: 12px;
}

.pie-chart {
  display: flex;
  align-items: center;
  gap: 20px;
}

.pie {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.pie-legend {
  flex: 1;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-label {
  flex: 1;
  font-size: 13px;
  color: #374151;
}

.legend-value {
  font-size: 13px;
  color: #6B7280;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  gap: 8px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-label {
  font-size: 11px;
  color: #6B7280;
}

.bar-track {
  width: 100%;
  height: 80px;
  background: #F3F4F6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #EF4444 0%, #F87171 100%);
  border-radius: 4px;
  transition: height 0.3s;
}

.bar-value {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.empty-state {
  text-align: center;
  padding: 32px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 14px;
  color: #6B7280;
}
</style>
