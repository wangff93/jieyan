<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { validatePhone, validatePassword } from '@/utils/helpers'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  error.value = ''
  
  if (!form.phone) {
    error.value = '请输入手机号'
    return
  }
  if (!validatePhone(form.phone)) {
    error.value = '手机号格式不正确'
    return
  }
  if (!form.password) {
    error.value = '请输入密码'
    return
  }
  if (!validatePassword(form.password)) {
    error.value = '密码长度需在6-18位之间'
    return
  }
  if (form.password !== form.confirmPassword) {
    error.value = '两次密码输入不一致'
    return
  }

  loading.value = true
  try {
    await userStore.register(form.phone, form.password)
    router.push('/profile')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <button class="back-btn" @click="router.back()">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    <div class="register-header">
      <h1 class="title">欢迎加入</h1>
      <p class="subtitle">开始您的戒烟之旅</p>
    </div>

    <div class="register-form">
      <div class="form-item">
        <label>手机号</label>
        <input 
          v-model="form.phone"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
        />
      </div>

      <div class="form-item">
        <label>密码</label>
        <input 
          v-model="form.password"
          type="password"
          placeholder="6-18位密码"
        />
      </div>

      <div class="form-item">
        <label>确认密码</label>
        <input 
          v-model="form.confirmPassword"
          type="password"
          placeholder="再次输入密码"
        />
      </div>

      <div v-if="error" class="error-tip">
        {{ error }}
      </div>

      <button 
        class="register-btn" 
        :class="{ loading }"
        :disabled="loading"
        @click="handleRegister"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <div class="login-link">
        已有账号？
        <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  padding: 20px 24px 40px;
  display: flex;
  flex-direction: column;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  border: none;
  border-radius: 10px;
  color: #10B981;
  cursor: pointer;
  margin-bottom: 40px;
}

.register-header {
  margin-bottom: 40px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #6B7280;
}

.register-form {
  flex: 1;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-item input {
  width: 100%;
  height: 52px;
  padding: 0 16px;
  font-size: 16px;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  outline: none;
  transition: border-color 0.2s;
  background: white;
}

.form-item input:focus {
  border-color: #10B981;
}

.form-item input::placeholder {
  color: #9CA3AF;
}

.error-tip {
  color: #EF4444;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 12px;
  background: #FEF2F2;
  border-radius: 8px;
}

.register-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6B7280;
}

.login-link a {
  color: #10B981;
  font-weight: 600;
  text-decoration: none;
}
</style>
