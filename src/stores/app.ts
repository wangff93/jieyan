import { defineStore } from 'pinia'
import { ref } from 'vue'
import { storage } from '@/utils/storage'

export interface AppSettings {
  checkInReminder: boolean
  planReminder: boolean
  urgeWarning: boolean
  theme: 'green' | 'white'
  displayUnit: 'day' | 'hour'
  shareStyle: 'style1' | 'style2' | 'style3'
}

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>({
    checkInReminder: true,
    planReminder: true,
    urgeWarning: false,
    theme: 'green',
    displayUnit: 'day',
    shareStyle: 'style1'
  })

  const showRelapseModal = ref(false)
  const showMilestoneModal = ref<string | null>(null)

  function init() {
    const saved = storage.get<AppSettings>('app_settings')
    if (saved) {
      settings.value = saved
    }
  }

  function updateSettings(updates: Partial<AppSettings>) {
    settings.value = { ...settings.value, ...updates }
    storage.set('app_settings', settings.value)
  }

  function showRelapse() {
    showRelapseModal.value = true
  }

  function hideRelapse() {
    showRelapseModal.value = false
  }

  function showMilestone(milestone: string) {
    showMilestoneModal.value = milestone
  }

  function hideMilestone() {
    showMilestoneModal.value = null
  }

  return {
    settings,
    showRelapseModal,
    showMilestoneModal,
    init,
    updateSettings,
    showRelapse,
    hideRelapse,
    showMilestone,
    hideMilestone
  }
})
