<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { path: '/', icon: 'home', label: '首页' },
  { path: '/stats', icon: 'chart', label: '统计' },
  { path: '/record', icon: 'clock', label: '记录' },
  { path: '/settings', icon: 'user', label: '我的' }
]

const activeIndex = computed(() => {
  const index = navItems.findIndex(item => item.path === route.path)
  return index >= 0 ? index : 0
})
</script>

<template>
  <nav class="bottom-nav">
    <div
      v-for="(item, index) in navItems"
      :key="item.path"
      class="nav-item"
      :class="{ active: activeIndex === index }"
      @click="router.push(item.path)"
    >
      <div class="nav-icon">
        <svg v-if="item.icon === 'home'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <svg v-else-if="item.icon === 'chart'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="20" x2="18" y2="10"></line>
          <line x1="12" y1="20" x2="12" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
        <svg v-else-if="item.icon === 'clock'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <svg v-else-if="item.icon === 'user'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <span class="nav-label">{{ item.label }}</span>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
  padding-bottom: env(safe-area-inset-bottom, 0);
  box-shadow: 0 -4px 30px rgba(16, 185, 129, 0.1);
  border-top: 1px solid rgba(16, 185, 129, 0.1);
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 8px 16px;
  border-radius: 16px;
}

.nav-item.active {
  transform: scale(1.1);
}

.nav-item.active .nav-icon {
  color: #10B981;
}

.nav-item.active .nav-label {
  color: #10B981;
  font-weight: 600;
}

.nav-icon {
  color: #9CA3AF;
  transition: all 0.3s ease;
}

.nav-label {
  font-size: 11px;
  color: #9CA3AF;
  transition: all 0.3s ease;
}
</style>
