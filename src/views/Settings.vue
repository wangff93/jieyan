<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import HeaderBar from '@/components/HeaderBar.vue'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()

const settings = reactive({
  checkInReminder: appStore.settings.checkInReminder,
  planReminder: appStore.settings.planReminder,
  urgeWarning: appStore.settings.urgeWarning,
  theme: appStore.settings.theme,
  displayUnit: appStore.settings.displayUnit
})

const updateSetting = (key: keyof typeof settings, value: any) => {
  (settings as any)[key] = value
  appStore.updateSettings({ [key]: value })
}

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<template>
  <div class="settings-page">
    <HeaderBar title="个人设置" showBack />

    <div class="page-content">
      <!-- 用户信息 -->
      <div class="user-card" @click="router.push('/profile')">
        <div class="avatar">
          {{ userStore.user?.nickname?.charAt(0) || '戒' }}
        </div>
        <div class="user-info">
          <span class="nickname">{{ userStore.user?.nickname }}</span>
          <span class="phone">{{ userStore.user?.phone }}</span>
        </div>
        <div class="arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      </div>

      <!-- 提醒设置 -->
      <div class="settings-section">
        <h3 class="section-title">提醒设置</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">每日打卡提醒</span>
            <span class="setting-desc">每天提醒您打卡记录</span>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="settings.checkInReminder"
              @change="updateSetting('checkInReminder', !settings.checkInReminder)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">计划节点提醒</span>
            <span class="setting-desc">计划关键节点提醒</span>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="settings.planReminder"
              @change="updateSetting('planReminder', !settings.planReminder)"
            />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">烟瘾高发时段预警</span>
            <span class="setting-desc">在易诱发烟瘾时段提醒</span>
          </div>
          <label class="switch">
            <input 
              type="checkbox" 
              :checked="settings.urgeWarning"
              @change="updateSetting('urgeWarning', !settings.urgeWarning)"
            />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- 偏好设置 -->
      <div class="settings-section">
        <h3 class="section-title">偏好设置</h3>
        
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">界面主题</span>
          </div>
          <div class="theme-options">
            <button 
              class="theme-btn" 
              :class="{ active: settings.theme === 'green' }"
              @click="updateSetting('theme', 'green')"
            >
              清新绿
            </button>
            <button 
              class="theme-btn" 
              :class="{ active: settings.theme === 'white' }"
              @click="updateSetting('theme', 'white')"
            >
              简约白
            </button>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-label">时长显示单位</span>
          </div>
          <div class="theme-options">
            <button 
              class="theme-btn" 
              :class="{ active: settings.displayUnit === 'day' }"
              @click="updateSetting('displayUnit', 'day')"
            >
              天
            </button>
            <button 
              class="theme-btn" 
              :class="{ active: settings.displayUnit === 'hour' }"
              @click="updateSetting('displayUnit', 'hour')"
            >
              小时
            </button>
          </div>
        </div>
      </div>

      <!-- 关于我们 -->
      <div class="settings-section">
        <h3 class="section-title">关于我们</h3>
        
        <div class="setting-item clickable">
          <span class="setting-label">使用协议</span>
          <div class="arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <div class="setting-item clickable">
          <span class="setting-label">隐私政策</span>
          <div class="arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        <div class="setting-item">
          <span class="setting-label">版本号</span>
          <span class="version">v1.0.0</span>
        </div>
      </div>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="logout">
        退出登录
      </button>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.user-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
  cursor: pointer;
}

.avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.nickname {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
}

.phone {
  font-size: 14px;
  color: #6B7280;
}

.arrow {
  color: #D1D5DB;
}

.settings-section {
  background: white;
  border-radius: 16px;
  padding: 8px 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #6B7280;
  padding: 12px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid #F3F4F6;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.clickable {
  cursor: pointer;
}

.setting-info {
  display: flex;
  flex-direction: column;
}

.setting-label {
  font-size: 15px;
  color: #1F2937;
}

.setting-desc {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 2px;
}

.switch {
  position: relative;
  width: 48px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #E5E7EB;
  border-radius: 14px;
  transition: 0.3s;
}

.slider::before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

.switch input:checked + .slider {
  background: #10B981;
}

.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.theme-options {
  display: flex;
  gap: 8px;
}

.theme-btn {
  padding: 6px 14px;
  background: #F3F4F6;
  border: none;
  border-radius: 16px;
  font-size: 13px;
  color: #6B7280;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-btn.active {
  background: #10B981;
  color: white;
}

.version {
  font-size: 14px;
  color: #9CA3AF;
}

.logout-btn {
  width: 100%;
  height: 48px;
  background: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: #EF4444;
  cursor: pointer;
  margin-top: 8px;
}
</style>
