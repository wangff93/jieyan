<script setup lang="ts">
import { onMounted, ref } from 'vue'

const props = defineProps<{
  milestone: string
}>()

const emit = defineEmits<{
  close: []
}>()

const show = ref(false)

onMounted(() => {
  setTimeout(() => {
    show.value = true
  }, 100)
  
  // 3秒后自动关闭
  setTimeout(() => {
    emit('close')
  }, 5000)
})

const milestones = {
  '1天': { emoji: '🌱', message: '好的开始！继续保持！' },
  '7天': { emoji: '🌿', message: '一周无烟，你做得很好！' },
  '30天': { emoji: '🌳', message: '一个月！肺部正在恢复！' },
  '100天': { emoji: '🏆', message: '百日里程碑，致敬坚持！' },
  '1年': { emoji: '🎉', message: '一年无烟，重获新生！' }
}

const current = milestones[props.milestone as keyof typeof milestones] || { emoji: '⭐', message: '恭喜达成里程碑！' }
</script>

<template>
  <div class="milestone-overlay" :class="{ show }" @click="emit('close')">
    <div class="milestone-card" @click.stop>
      <div class="confetti"></div>
      <div class="emoji">{{ current.emoji }}</div>
      <h2 class="title">恭喜达成</h2>
      <p class="milestone-name">{{ milestone }}无烟</p>
      <p class="message">{{ current.message }}</p>
      <button class="share-btn">分享里程碑</button>
      <button class="close-text" @click="emit('close')">继续加油</button>
    </div>
  </div>
</template>

<style scoped>
.milestone-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  opacity: 0;
  transition: opacity 0.3s;
}

.milestone-overlay.show {
  opacity: 1;
}

.milestone-card {
  width: 300px;
  background: linear-gradient(180deg, #10B981 0%, #059669 100%);
  border-radius: 24px;
  padding: 40px 32px;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  animation: scaleIn 0.4s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.confetti {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 2px, transparent 2px),
    radial-gradient(circle at 80% 30%, rgba(255,255,255,0.2) 3px, transparent 3px),
    radial-gradient(circle at 40% 70%, rgba(255,255,255,0.25) 2px, transparent 2px),
    radial-gradient(circle at 70% 80%, rgba(255,255,255,0.3) 2px, transparent 2px);
  animation: confettiFall 2s linear infinite;
}

@keyframes confettiFall {
  from {
    transform: translateY(-10px);
  }
  to {
    transform: translateY(10px);
  }
}

.emoji {
  font-size: 64px;
  margin-bottom: 16px;
  animation: bounce 0.6s ease infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-10px);
  }
}

.title {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 8px;
}

.milestone-name {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.message {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.share-btn {
  width: 100%;
  height: 48px;
  background: white;
  color: #10B981;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 12px;
}

.close-text {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
}
</style>
