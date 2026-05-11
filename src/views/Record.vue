<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCheckInStore } from '@/stores/checkin'
import HeaderBar from '@/components/HeaderBar.vue'
import { formatDate } from '@/utils/helpers'
import { RELAPSE_TRIGGERS } from '@/types'

const checkInStore = useCheckInStore()

const sortedRecords = computed(() => {
  return [...checkInStore.checkIns].sort(
    (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
  )
})

const triggerLabels: Record<string, string> = {
  stress: '压力',
  emotion: '情绪',
  social: '应酬',
  boredom: '无聊',
  other: '其他'
}
</script>

<template>
  <div class="record-page">
    <HeaderBar title="戒烟记录" showBack />

    <div class="page-content">
      <div v-if="sortedRecords.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h3>暂无记录</h3>
        <p>开始您的戒烟之旅，记录每一天的坚持</p>
      </div>

      <div v-else class="record-list">
        <div 
          v-for="record in sortedRecords" 
          :key="record.id"
          class="record-card"
          :class="record.type"
        >
          <div class="record-header">
            <div class="record-date">
              {{ formatDate(record.checkInDate, 'MM月DD日') }}
              <span class="weekday">{{ formatDate(record.checkInDate, 'WW') }}</span>
            </div>
            <div class="record-badge" :class="record.type">
              {{ record.type === 'normal' ? '正常打卡' : '复吸记录' }}
            </div>
          </div>

          <div class="record-body">
            <div v-if="record.type === 'normal'" class="record-info">
              <div class="info-item">
                <span class="info-label">连续打卡</span>
                <span class="info-value">{{ record.consecutiveDays }} 天</span>
              </div>
              <div class="info-item">
                <span class="info-label">无烟时长</span>
                <span class="info-value">{{ Math.floor(record.smokeFreeSeconds / 86400) }} 天</span>
              </div>
              <div v-if="record.milestones.length > 0" class="milestone-tags">
                <span v-for="m in record.milestones" :key="m" class="milestone-tag">
                  {{ m }}
                </span>
              </div>
            </div>

            <div v-else class="relapse-info">
              <div class="info-item">
                <span class="info-label">吸烟支数</span>
                <span class="info-value danger">{{ record.smokingCount }} 支</span>
              </div>
              <div v-if="record.relapseTriggers?.length" class="trigger-tags">
                <span v-for="t in record.relapseTriggers" :key="t" class="trigger-tag">
                  {{ triggerLabels[t] || t }}
                </span>
              </div>
              <div v-if="record.relapseTime" class="info-item">
                <span class="info-label">复吸时间</span>
                <span class="info-value">{{ record.relapseTime }}</span>
              </div>
              <div v-if="record.relapseLocation" class="info-item">
                <span class="info-label">复吸地点</span>
                <span class="info-value">{{ record.relapseLocation }}</span>
              </div>
              <div v-if="record.note" class="note">
                {{ record.note }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.record-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #6B7280;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
  border-left: 4px solid #10B981;
}

.record-card.relapse {
  border-left-color: #EF4444;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.record-date {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
}

.record-date .weekday {
  font-size: 12px;
  color: #6B7280;
  font-weight: normal;
  margin-left: 8px;
}

.record-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.record-badge.normal {
  background: #D1FAE5;
  color: #059669;
}

.record-badge.relapse {
  background: #FEE2E2;
  color: #DC2626;
}

.record-info,
.relapse-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 13px;
  color: #6B7280;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
}

.info-value.danger {
  color: #EF4444;
}

.milestone-tags,
.trigger-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.milestone-tag {
  padding: 4px 8px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  font-size: 11px;
  border-radius: 6px;
}

.trigger-tag {
  padding: 4px 8px;
  background: #FEE2E2;
  color: #EF4444;
  font-size: 11px;
  border-radius: 6px;
}

.note {
  font-size: 13px;
  color: #6B7280;
  padding: 8px;
  background: #F9FAFB;
  border-radius: 8px;
  margin-top: 4px;
}
</style>
