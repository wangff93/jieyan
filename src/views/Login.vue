<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { validatePhone, validatePassword } from '@/utils/helpers'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  phone: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
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

  loading.value = true
  try {
    await userStore.login(form.phone, form.password)
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (e: any) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-header">
      <div class="logo">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#10B981" stroke-width="4"/>
          <path d="M32 16 L32 32 L44 32" stroke="#10B981" stroke-width="4" stroke-linecap="round"/>
          <circle cx="32" cy="32" r="4" fill="#10B981"/>
        </svg>
      </div>
      <h1 class="title">烟消云散</h1>
      <p class="subtitle">科学戒烟，守护健康</p>
    </div>

    <div class="login-form">
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
          placeholder="请输入密码"
        />
      </div>

      <div v-if="error" class="error-tip">
        {{ error }}
      </div>

      <button 
        class="login-btn" 
        :class="{ loading }"
        :disabled="loading"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <div class="register-link">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 60px 24px 40px;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin-bottom: 48px;
}

.logo {
  margin-bottom: 20px;
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

.login-form {
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

.login-btn {
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

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6B7280;
}

.register-link a {
  color: #10B981;
  font-weight: 600;
  text-decoration: none;
}
</style>
