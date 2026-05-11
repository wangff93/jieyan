<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'
import { articles, categories, getArticlesByCategory } from '@/data/knowledge'

const router = useRouter()
const activeCategory = ref('all')

const filteredArticles = computed(() => {
  return getArticlesByCategory(activeCategory.value)
})

const navigateToDetail = (id: string) => {
  router.push(`/knowledge/${id}`)
}
</script>


<template>
  <div class="knowledge-page">
    <HeaderBar title="知识库" showBack />

    <div class="page-content">
      <div class="category-tabs">
        <button 
          v-for="cat in categories" 
          :key="cat.id"
          class="category-tab"
          :class="{ active: activeCategory === cat.id }"
          @click="activeCategory = cat.id"
        >
          <span class="cat-icon">{{ cat.icon }}</span>
          <span class="cat-name">{{ cat.name }}</span>
        </button>
      </div>

      <div class="article-list">
        <div 
          v-for="article in filteredArticles" 
          :key="article.id"
          class="article-card"
          @click="navigateToDetail(article.id)"
        >
          <div class="article-content">
            <div class="article-header">
              <span class="category-tag">{{ categories.find(c => c.id === article.category)?.name }}</span>
              <span v-if="article.readTime" class="read-time">{{ article.readTime }}分钟阅读</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            <div class="article-meta">
              <span>{{ article.author }}</span>
              <span>{{ article.date }}</span>
            </div>
          </div>
          <div class="article-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div v-if="filteredArticles.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <p>该分类下暂无文章</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #F0FDF4 0%, #EEF2FF 100%);
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 16px;
  margin-bottom: 16px;
  -webkit-overflow-scrolling: touch;
}

.category-tabs::-webkit-scrollbar {
  display: none;
}

.category-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: white;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  color: #6B7280;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.category-tab.active {
  background: #10B981;
  color: white;
}

.cat-icon {
  font-size: 16px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}

.article-card:active {
  transform: scale(0.98);
}

.article-content {
  flex: 1;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.category-tag {
  padding: 2px 8px;
  background: #D1FAE5;
  color: #059669;
  font-size: 11px;
  border-radius: 4px;
}

.read-time {
  font-size: 11px;
  color: #9CA3AF;
}

.article-content h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 6px;
  line-height: 1.4;
}

.article-content p {
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #9CA3AF;
}

.article-arrow {
  color: #D1D5DB;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 14px;
  color: #6B7280;
}
</style>
