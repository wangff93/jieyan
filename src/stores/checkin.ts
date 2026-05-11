import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CheckIn, Statistics } from '@/types'
import { storage } from '@/utils/storage'
import { generateId, getToday } from '@/utils/helpers'
import { useUserStore } from './user'

export const useCheckInStore = defineStore('checkin', () => {
  const userStore = useUserStore()
  const checkIns = ref<CheckIn[]>([])

  // 计算统计数据
  const statistics = computed<Statistics>(() => {
    const user = userStore.user
    if (!user || !user.quitStartDate) {
      return {
        totalSmokeFreeDays: 0,
        totalSavedMoney: 0,
        avoidedNicotine: 0,
        avoidedTar: 0,
        healthScore: 60,
        totalRelapseCount: 0,
        relapseTriggerDistribution: {},
        relapseTimePattern: {}
      }
    }

    // 计算累计无烟天数
    const startDate = new Date(user.quitStartDate)
    const today = new Date()
    const totalDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // 计算复吸天数
    const relapseDays = checkIns.value
      .filter(c => c.type === 'relapse')
      .reduce((sum, c) => sum + (c.smokingCount || 0) / (user.dailySmoking || 1), 0)

    const actualSmokeFreeDays = Math.max(0, totalDays - Math.floor(relapseDays))
    const totalSmokeFreeDays = parseFloat(actualSmokeFreeDays.toFixed(1))

    // 计算节省金额
    const totalSavedMoney = parseFloat(
      ((user.dailySmoking || 0) * (user.cigarettePrice || 0) * totalSmokeFreeDays).toFixed(1)
    )

    // 计算避免摄入量
    const totalSmoked = checkIns.value.reduce((sum, c) => {
      return sum + (c.type === 'relapse' ? (c.smokingCount || 0) : 0)
    }, 0)
    const avoidedNicotine = totalSmoked * 0.8
    const avoidedTar = totalSmoked * 12

    // 计算健康评分
    const baseScore = 60
    const smokeFreeBonus = Math.min(totalSmokeFreeDays, 20)
    const relapsePenalty = checkIns.value.filter(c => c.type === 'relapse').length * 5
    const healthScore = Math.max(0, Math.min(100, baseScore + smokeFreeBonus - relapsePenalty))

    // 复吸诱因分布
    const relapseTriggerDistribution: Record<string, number> = {}
    checkIns.value
      .filter(c => c.type === 'relapse' && c.relapseTriggers)
      .forEach(c => {
        c.relapseTriggers?.forEach(trigger => {
          relapseTriggerDistribution[trigger] = (relapseTriggerDistribution[trigger] || 0) + 1
        })
      })

    // 复吸时间规律
    const relapseTimePattern: Record<string, number> = {}
    checkIns.value
      .filter(c => c.type === 'relapse' && c.relapseTime)
      .forEach(c => {
        const hour = parseInt(c.relapseTime?.split(':')[0] || '0')
        let period = ''
        if (hour >= 6 && hour < 9) period = '早晨'
        else if (hour >= 9 && hour < 12) period = '上午'
        else if (hour >= 12 && hour < 14) period = '中午'
        else if (hour >= 14 && hour < 18) period = '下午'
        else if (hour >= 18 && hour < 22) period = '晚间'
        else period = '深夜'
        relapseTimePattern[period] = (relapseTimePattern[period] || 0) + 1
      })

    return {
      totalSmokeFreeDays,
      totalSavedMoney,
      avoidedNicotine,
      avoidedTar,
      healthScore,
      totalRelapseCount: checkIns.value.filter(c => c.type === 'relapse').length,
      relapseTriggerDistribution,
      relapseTimePattern
    }
  })

  // 获取今日打卡记录
  const todayCheckIn = computed(() => {
    const today = getToday()
    return checkIns.value.find(c => c.checkInDate === today)
  })

  // 连续打卡天数
  const consecutiveDays = computed(() => {
    if (checkIns.value.length === 0) return 0
    const sorted = [...checkIns.value]
      .filter(c => c.type === 'normal')
      .sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())
    
    if (sorted.length === 0) return 0
    if (sorted[0].checkInDate !== getToday()) return 0
    
    return sorted[0].consecutiveDays
  })

  // 获取当前无烟时长（秒）
  const currentSmokeFreeSeconds = computed(() => {
    const user = userStore.user
    if (!user || !user.quitStartDate) return 0
    
    const startDate = new Date(user.quitStartDate)
    const now = new Date()
    return Math.max(0, Math.floor((now.getTime() - startDate.getTime()) / 1000))
  })

  // 初始化
  function init() {
    if (userStore.user) {
      const saved = storage.get<CheckIn[]>(`checkins_${userStore.user.id}`)
      checkIns.value = saved || []
    }
  }

  // 保存数据
  function save() {
    if (userStore.user) {
      storage.set(`checkins_${userStore.user.id}`, checkIns.value)
    }
  }

  // 正常打卡
  function normalCheckIn(): Promise<CheckIn> {
    return new Promise((resolve) => {
      const user = userStore.user
      if (!user) throw new Error('请先登录')

      const today = getToday()
      const existing = checkIns.value.find(c => c.checkInDate === today)
      if (existing) {
        throw new Error('今日已打卡')
      }

      // 计算连续天数
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      const yesterdayCheckIn = checkIns.value.find(c => c.checkInDate === yesterdayStr && c.type === 'normal')
      const newConsecutiveDays = yesterdayCheckIn ? yesterdayCheckIn.consecutiveDays + 1 : 1

      // 检查里程碑
      const milestones: string[] = []
      if (newConsecutiveDays === 1) milestones.push('1天')
      if (newConsecutiveDays === 7) milestones.push('7天')
      if (newConsecutiveDays === 30) milestones.push('30天')
      if (newConsecutiveDays === 100) milestones.push('100天')
      if (newConsecutiveDays === 365) milestones.push('1年')

      const newCheckIn: CheckIn = {
        id: generateId(),
        userId: user.id,
        checkInDate: today,
        type: 'normal',
        consecutiveDays: newConsecutiveDays,
        smokeFreeSeconds: currentSmokeFreeSeconds.value,
        milestones,
        createdAt: new Date().toISOString()
      }

      checkIns.value.push(newCheckIn)
      save()
      resolve(newCheckIn)
    })
  }

  // 复吸打卡
  function relapseCheckIn(data: {
    smokingCount: number
    triggers: string[]
    time?: string
    location?: string
    note?: string
  }): Promise<CheckIn> {
    return new Promise((resolve) => {
      const user = userStore.user
      if (!user) throw new Error('请先登录')

      const today = getToday()
      const existing = checkIns.value.find(c => c.checkInDate === today)
      if (existing) {
        throw new Error('今日已打卡')
      }

      const newCheckIn: CheckIn = {
        id: generateId(),
        userId: user.id,
        checkInDate: today,
        type: 'relapse',
        smokingCount: data.smokingCount,
        relapseTriggers: data.triggers,
        relapseTime: data.time || new Date().toTimeString().slice(0, 5),
        relapseLocation: data.location,
        note: data.note,
        consecutiveDays: 0,
        smokeFreeSeconds: 0,
        milestones: [],
        createdAt: new Date().toISOString()
      }

      checkIns.value.push(newCheckIn)
      save()
      resolve(newCheckIn)
    })
  }

  return {
    checkIns,
    statistics,
    todayCheckIn,
    consecutiveDays,
    currentSmokeFreeSeconds,
    init,
    normalCheckIn,
    relapseCheckIn
  }
})
