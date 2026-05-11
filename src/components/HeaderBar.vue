<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  title: string
  showBack?: boolean
}>()

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <header class="header-bar">
    <div class="header-content">
      <button v-if="showBack" class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <h1 class="title">{{ title }}</h1>
      <div v-if="showBack" class="placeholder"></div>
    </div>
  </header>
</template>

<style scoped>
.header-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(16, 185, 129, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #1F2937;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(16, 185, 129, 0.1);
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  text-align: center;
}

.placeholder {
  width: 40px;
}
</style>
