// 用户信息
export interface User {
  id: string
  phone: string
  password: string
  nickname: string
  smokingAge: number
  dailySmoking: number
  cigarettePrice: number
  quitReasons: string[]
  quitGoal: 'quit_completely' | 'reduce_gradually'
  quitStartDate: string
  privacySetting: boolean
  accountStatus: 'normal' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// 打卡记录
export interface CheckIn {
  id: string
  userId: string
  checkInDate: string
  type: 'normal' | 'relapse'
  smokingCount?: number
  relapseTriggers?: string[]
  relapseTime?: string
  relapseLocation?: string
  note?: string
  consecutiveDays: number
  smokeFreeSeconds: number
  milestones: string[]
  createdAt: string
}

// 戒烟原因选项
export const QUIT_REASONS = [
  { value: 'health', label: '健康原因' },
  { value: 'family', label: '家人要求' },
  { value: 'economy', label: '经济压力' },
  { value: 'other', label: '其他原因' }
] as const

// 复吸诱因选项
export const RELAPSE_TRIGGERS = [
  { value: 'stress', label: '压力' },
  { value: 'emotion', label: '情绪' },
  { value: 'social', label: '应酬' },
  { value: 'boredom', label: '无聊' },
  { value: 'other', label: '其他' }
] as const

// 里程碑配置
export const MILESTONES = [
  { days: 1, name: '1天', icon: 'star' },
  { days: 7, name: '7天', icon: 'zap' },
  { days: 30, name: '30天', icon: 'flame' },
  { days: 100, name: '100天', icon: 'trophy' },
  { days: 365, name: '1年', icon: 'award' }
] as const

// 统计数据
export interface Statistics {
  totalSmokeFreeDays: number
  totalSavedMoney: number
  avoidedNicotine: number
  avoidedTar: number
  healthScore: number
  totalRelapseCount: number
  relapseTriggerDistribution: Record<string, number>
  relapseTimePattern: Record<string, number>
}

// 戒烟计划
export interface QuitPlan {
  id: string
  userId: string
  type: 'recommended' | 'custom'
  stage: 'preparation' | 'action' | 'maintenance' | 'stable'
  goal: 'quit_completely' | 'reduce_gradually'
  reduceTarget?: number
  startDate: string
  endDate?: string
  reminders: string[]
  status: 'active' | 'paused' | 'completed' | 'terminated'
  createdAt: string
}

// 知识库文章
export interface KnowledgeArticle {
  id: string
  category: 'principle' | 'health' | 'tips' | 'medical'
  title: string
  cover?: string
  content: string
  author: string
  favorites: number
  resourceUrl?: string
  createdAt: string
}

// 表单验证错误
export interface ValidationError {
  field: string
  message: string
}

// API 响应格式
export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}
