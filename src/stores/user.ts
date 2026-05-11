import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'
import { storage } from '@/utils/storage'
import { generateId } from '@/utils/helpers'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)

  // 计算属性
  const isLoggedIn = computed(() => !!user.value && !!token.value)
  const hasProfile = computed(() => {
    if (!user.value) return false
    return user.value.smokingAge > 0 && 
           user.value.dailySmoking > 0 && 
           user.value.cigarettePrice > 0
  })

  // 初始化
  function init() {
    const savedUser = storage.get<User>('user')
    const savedToken = storage.get<string>('token')
    if (savedUser) {
      user.value = savedUser
      token.value = savedToken
    }
  }

  // 注册
  function register(phone: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      // 检查手机号是否已注册
      const existingUser = storage.get<User>(`user_${phone}`)
      if (existingUser) {
        reject(new Error('该手机号已注册'))
        return
      }

      const newUser: User = {
        id: generateId(),
        phone,
        password,
        nickname: `戒烟者${Math.floor(Math.random() * 9000) + 1000}`,
        smokingAge: 0,
        dailySmoking: 0,
        cigarettePrice: 0,
        quitReasons: [],
        quitGoal: 'quit_completely',
        quitStartDate: '',
        privacySetting: true,
        accountStatus: 'normal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      storage.set(`user_${phone}`, newUser)
      user.value = newUser
      token.value = newUser.id
      storage.set('user', newUser)
      storage.set('token', token.value)

      resolve(newUser)
    })
  }

  // 登录
  function login(phone: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const savedUser = storage.get<User>(`user_${phone}`)
      if (!savedUser) {
        reject(new Error('用户不存在'))
        return
      }
      if (savedUser.password !== password) {
        reject(new Error('密码错误'))
        return
      }
      if (savedUser.accountStatus === 'cancelled') {
        reject(new Error('账号已注销'))
        return
      }

      user.value = savedUser
      token.value = savedUser.id
      storage.set('user', savedUser)
      storage.set('token', token.value)

      resolve(savedUser)
    })
  }

  // 更新用户信息
  function updateProfile(updates: Partial<User>): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!user.value) {
        reject(new Error('请先登录'))
        return
      }

      const updatedUser = {
        ...user.value,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      storage.set(`user_${user.value.phone}`, updatedUser)
      storage.set('user', updatedUser)
      user.value = updatedUser

      resolve()
    })
  }

  // 登出
  function logout() {
    user.value = null
    token.value = null
    storage.remove('user')
    storage.remove('token')
  }

  return {
    user,
    token,
    isLoggedIn,
    hasProfile,
    init,
    register,
    login,
    updateProfile,
    logout
  }
})
