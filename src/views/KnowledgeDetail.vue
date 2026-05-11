<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'
import { getArticleById, categories } from '@/data/knowledge'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const articleId = route.params.id as string

const article = computed(() => getArticleById(articleId))

const categoryName = computed(() => {
  if (!article.value) return ''
  return categories.find(c => c.id === article.value?.category)?.name
})

const renderedContent = computed(() => {
  if (!article.value) return ''
  return marked(article.value.content)
})
</script>


<template>
  <div class="knowledge-detail-page">
    <HeaderBar title="文章详情" showBack />

    <div class="page-content" v-if="article">
      <article class="article">
        <div class="article-header">
          <span class="category-tag">{{ categoryName }}</span>
          <span v-if="article.readTime" class="read-time">{{ article.readTime }}分钟阅读</span>
        </div>

        <h1 class="article-title">{{ article.title }}</h1>

        <div class="article-info">
          <span class="author">{{ article.author }}</span>
          <span class="date">{{ article.date }}</span>
        </div>

        <div class="article-body" v-html="renderedContent"></div>
      </article>

      <div class="article-footer">
        <button class="back-btn" @click="router.back()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          返回列表
        </button>
        <button class="share-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          分享
        </button>
      </div>
    </div>

    <div class="page-content" v-else>
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <h3>文章不存在</h3>
        <p>该文章可能已被删除或移动</p>
        <button class="back-btn" @click="router.push('/knowledge')">
          返回知识库
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.knowledge-detail-page {
  min-height: 100vh;
  background: white;
}

.page-content {
  padding: 16px;
  padding-bottom: 100px;
}

.article {
  max-width: 100%;
}

.article-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.category-tag {
  padding: 4px 10px;
  background: #D1FAE5;
  color: #059669;
  font-size: 12px;
  border-radius: 4px;
}

.read-time {
  font-size: 12px;
  color: #9CA3AF;
}

.article-title {
  font-size: 22px;
  font-weight: 700;
  color: #1F2937;
  margin-bottom: 12px;
  line-height: 1.4;
}

.article-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6B7280;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E7EB;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #374151;
}

.article-body :deep(h2) {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #10B981;
}

.article-body :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin: 20px 0 10px;
}

.article-body :deep(p) {
  margin-bottom: 16px;
}

.article-body :deep(strong) {
  color: #1F2937;
  font-weight: 600;
}

.article-body :deep(blockquote) {
  background: #F0FDF4;
  border-left: 4px solid #10B981;
  padding: 16px;
  margin: 16px 0;
  border-radius: 0 8px 8px 0;
}

.article-body :deep(blockquote p) {
  margin: 0;
  color: #059669;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 16px 0;
  padding-left: 20px;
}

.article-body :deep(li) {
  margin-bottom: 8px;
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

.article-body :deep(th),
.article-body :deep(td) {
  padding: 10px;
  border: 1px solid #E5E7EB;
  text-align: left;
}

.article-body :deep(th) {
  background: #F9FAFB;
  font-weight: 600;
  color: #1F2937;
}

.article-footer {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #E5E7EB;
}

.back-btn,
.share-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn {
  background: #F3F4F6;
  color: #6B7280;
  border: none;
}

.share-btn {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: white;
  border: none;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: #6B7280;
  margin-bottom: 24px;
}

.empty-state .back-btn {
  display: inline-flex;
  padding: 12px 24px;
}
</style>
