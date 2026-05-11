<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import HeaderBar from '@/components/HeaderBar.vue'

const activeTab = ref<'breathing' | 'emotion' | '替代'>('breathing')

// 呼吸练习状态
const breathingState = ref<'idle' | 'inhale' | 'hold' | 'exhale'>('idle')
const breathingCount = ref(0)
const breathingTimer = ref<number | null>(null)
const totalBreaths = ref(0)

const breathingGuide = [
  { text: '吸气', duration: 4000, next: 'hold' },
  { text: '屏气', duration: 7000, next: 'exhale' },
  { text: '呼气', duration: 8000, next: 'inhale' }
]

let currentStep = 0

const startBreathing = () => {
  if (breathingTimer.value) return
  breathingState.value = 'inhale'
  currentStep = 0
  runBreathingCycle()
}

const runBreathingCycle = () => {
  const step = breathingGuide[currentStep]
  breathingState.value = step.next as any
  breathingCount.value++
  
  if (breathingCount.value % 3 === 0) {
    totalBreaths.value++
  }
  
  breathingTimer.value = window.setTimeout(() => {
    currentStep = (currentStep + 1) % breathingGuide.length
    runBreathingCycle()
  }, step.duration)
}

const stopBreathing = () => {
  if (breathingTimer.value) {
    clearTimeout(breathingTimer.value)
    breathingTimer.value = null
  }
  breathingState.value = 'idle'
  breathingCount.value = 0
}

onUnmounted(() => {
  stopBreathing()
})

const emotionTools = [
  { name: '舒缓音乐', icon: '🎵', desc: '播放轻松音乐' },
  { name: '正念冥想', icon: '🧘', desc: '5分钟冥想引导' },
  { name: '放松训练', icon: '💆', desc: '渐进式肌肉放松' }
]

const alternativeBehaviors = [
  {
    category: '饭后',
    tips: ['散步10分钟', '刷牙', '喝茶', '嚼无糖口香糖']
  },
  {
    category: '压力大',
    tips: ['深呼吸5次', '做运动', '倾诉聊天', '写日记']
  },
  {
    category: '社交场合',
    tips: ['找借口离开', '喝茶代烟', '转移话题', '提前离场']
  }
]
</script>

<template>
  <div class="emergency-page">
    <HeaderBar title="烟瘾急救" showBack />

    <div class="page-content">
      <div class="tabs">
        <button 
          class="tab" 
          :class="{ active: activeTab === 'breathing' }"
          @click="activeTab = 'breathing'"
        >
          呼吸引导
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === 'emotion' }"
          @click="activeTab = 'emotion'"
        >
          情绪管理
        </button>
        <button 
          class="tab" 
          :class="{ active: activeTab === '替代' }"
          @click="activeTab = '替代'"
        >
          替代行为
        </button>
      </div>

      <!-- 呼吸引导 -->
      <div v-if="activeTab === 'breathing'" class="tab-content breathing-content">
        <div class="breathing-intro">
          <h2>4-7-8 呼吸法</h2>
          <p>科学的呼吸技巧，帮助您平静下来，缓解烟瘾</p>
        </div>

        <div class="breathing-circle" :class="breathingState">
          <div class="circle-ring"></div>
          <div class="circle-inner">
            <div v-if="breathingState === 'idle'" class="breathing-text">
              <p>准备开始</p>
              <p class="sub-text">吸气4秒 · 屏气7秒 · 呼气8秒</p>
            </div>
            <div v-else class="breathing-text">
              <p class="action-text">{{ breathingGuide[currentStep].text }}</p>
              <p class="sub-text">第 {{ breathingCount }} 次</p>
            </div>
          </div>
        </div>

        <div class="breathing-actions">
          <button v-if="breathingState === 'idle'" class="start-btn" @click="startBreathing">
            开始练习
          </button>
          <button v-else class="stop-btn" @click="stopBreathing">
            停止
          </button>
        </div>

        <div class="breathing-tips">
          <h4>小贴士</h4>
          <ul>
            <li>保持坐姿，背部挺直</li>
            <li>用鼻子吸气，嘴巴呼气</li>
            <li>每天练习3-5个循环效果最佳</li>
          </ul>
        </div>
      </div>

      <!-- 情绪管理 -->
      <div v-if="activeTab === 'emotion'" class="tab-content">
        <div class="emotion-grid">
          <div v-for="tool in emotionTools" :key="tool.name" class="emotion-card">
            <div class="tool-icon">{{ tool.icon }}</div>
            <h4>{{ tool.name }}</h4>
            <p>{{ tool.desc }}</p>
          </div>
        </div>
        
        <div class="coming-soon">
          <span>更多功能即将上线...</span>
        </div>
      </div>

      <!-- 替代行为 -->
      <div v-if="activeTab === '替代'" class="tab-content">
        <div v-for="category in alternativeBehaviors" :key="category.category" class="behavior-card">
          <h4>{{ category.category }}</h4>
          <div class="behavior-list">
            <span v-for="tip in category.tips" :key="tip" class="behavior-tag">
              {{ tip }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.emergency-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.tabs {
  display: flex;
  background: white;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.tab {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: #10B981;
  color: white;
}

.tab-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.breathing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.breathing-intro {
  text-align: center;
  margin-bottom: 32px;
}

.breathing-intro h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.breathing-intro p {
  font-size: 14px;
  color: #6B7280;
}

.breathing-circle {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  position: relative;
  box-shadow: 0 8px 40px rgba(16, 185, 129, 0.15);
}

.circle-ring {
  position: absolute;
  inset: -10px;
  border: 3px solid #10B981;
  border-radius: 50%;
  opacity: 0.3;
}

.breathing-circle.inhale .circle-ring {
  animation: expand 4s ease-in-out infinite;
}

.breathing-circle.hold .circle-ring {
  transform: scale(1.15);
  opacity: 0.6;
}

.breathing-circle.exhale .circle-ring {
  animation: shrink 8s ease-in-out infinite;
}

@keyframes expand {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.15); opacity: 0.6; }
}

@keyframes shrink {
  0%, 100% { transform: scale(1.15); opacity: 0.6; }
  50% { transform: scale(1); opacity: 0.3; }
}

.circle-inner {
  text-align: center;
}

.breathing-text .action-text {
  font-size: 28px;
  font-weight: 600;
  color: #10B981;
  animation: breatheText 4s ease-in-out infinite;
}

@keyframes breatheText {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.breathing-text p {
  font-size: 16px;
  color: #374151;
}

.breathing-text .sub-text {
  font-size: 12px;
  color: #6B7280;
  margin-top: 8px;
}

.breathing-actions {
  margin-bottom: 32px;
}

.start-btn,
.stop-btn {
  padding: 14px 48px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
}

.start-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.stop-btn {
  background: #F3F4F6;
  color: #6B7280;
}

.breathing-tips {
  background: white;
  border-radius: 12px;
  padding: 16px;
  width: 100%;
}

.breathing-tips h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.breathing-tips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.breathing-tips li {
  font-size: 13px;
  color: #6B7280;
  padding: 6px 0;
  position: relative;
  padding-left: 16px;
}

.breathing-tips li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #10B981;
}

.emotion-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.emotion-card {
  background: white;
  border-radius: 16px;
  padding: 20px 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.tool-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.emotion-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.emotion-card p {
  font-size: 11px;
  color: #6B7280;
}

.coming-soon {
  text-align: center;
  padding: 24px;
  color: #9CA3AF;
  font-size: 14px;
}

.behavior-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.behavior-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 12px;
}

.behavior-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.behavior-tag {
  padding: 8px 16px;
  background: #F0FDF4;
  color: #059669;
  font-size: 14px;
  border-radius: 20px;
}
</style>
