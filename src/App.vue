<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCheckInStore } from '@/stores/checkin'
import { useAppStore } from '@/stores/app'
import BottomNav from '@/components/BottomNav.vue'

const route = useRoute()
const userStore = useUserStore()
const checkInStore = useCheckInStore()
const appStore = useAppStore()

onMounted(() => {
  userStore.init()
  checkInStore.init()
  appStore.init()
})
</script>

<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <BottomNav v-if="userStore.isLoggedIn" />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
