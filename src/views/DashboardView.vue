<template>
  <div>
    <PageHeader title="Dashboard" description="등록된 템플릿 현황을 한눈에 확인합니다." />

    <!-- 통계 카드 -->
    <div :class="$style.stats">
      <BaseCard v-for="s in stats" :key="s.key" :class="$style.stat">
        <span :class="$style.statValue">{{ s.value }}</span>
        <span :class="$style.statLabel">{{ s.label }}</span>
      </BaseCard>
    </div>

    <div :class="$style.columns">
      <!-- 최근 등록 -->
      <BaseCard :class="$style.panel">
        <h2 :class="$style.panelTitle">최근 등록한 템플릿</h2>
        <ul v-if="recentCreated.length" :class="$style.list">
          <li v-for="t in recentCreated" :key="t.id" :class="$style.item" @click="go(t)">
            <span :class="$style.itemTitle">{{ t.title }}</span>
            <span :class="$style.itemMeta">{{ categoryMap[t.categoryId] || '미분류' }} · {{ rel(t.createdAt) }}</span>
          </li>
        </ul>
        <p v-else :class="$style.emptyText">아직 등록된 템플릿이 없습니다.</p>
      </BaseCard>

      <!-- 최근 수정 -->
      <BaseCard :class="$style.panel">
        <h2 :class="$style.panelTitle">최근 수정한 템플릿</h2>
        <ul v-if="recentUpdated.length" :class="$style.list">
          <li v-for="t in recentUpdated" :key="t.id" :class="$style.item" @click="go(t)">
            <span :class="$style.itemTitle">{{ t.title }}</span>
            <span :class="$style.itemMeta">{{ categoryMap[t.categoryId] || '미분류' }} · {{ rel(t.updatedAt) }}</span>
          </li>
        </ul>
        <p v-else :class="$style.emptyText">아직 수정 내역이 없습니다.</p>
      </BaseCard>

      <!-- 자주 쓰는 카테고리 -->
      <BaseCard :class="$style.panel">
        <h2 :class="$style.panelTitle">자주 사용하는 카테고리</h2>
        <ul v-if="topCategories.length" :class="$style.list">
          <li v-for="c in topCategories" :key="c.id" :class="$style.catItem">
            <span>{{ c.name }}</span>
            <BaseTag variant="brand">{{ c.count }}</BaseTag>
          </li>
        </ul>
        <p v-else :class="$style.emptyText">사용 중인 카테고리가 없습니다.</p>
      </BaseCard>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import BaseTag from '@/components/common/BaseTag.vue';
import { formatRelative } from '@/utils/date';
import { TEMPLATE_TYPES } from '@/constants/templateTypes';

export default {
  name: 'DashboardView',
  components: { PageHeader, BaseCard, BaseTag },
  computed: {
    ...mapState('data', ['templates']),
    ...mapGetters('data', ['favorites', 'categoryMap', 'categoryCounts']),
    stats() {
      const byType = (type) => this.templates.filter((t) => t.type === type).length;
      return [
        { key: 'all', label: '전체 템플릿', value: this.templates.length },
        { key: 'component', label: 'UI Components', value: byType('component') },
        { key: 'page', label: 'Page Templates', value: byType('page') },
        { key: 'snippet', label: 'Code Snippets', value: byType('snippet') },
        { key: 'fav', label: '즐겨찾기', value: this.favorites.length },
      ];
    },
    recentCreated() {
      return this.templates
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5);
    },
    recentUpdated() {
      return this.templates
        .slice()
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .slice(0, 5);
    },
    topCategories() {
      const counts = this.categoryCounts;
      return Object.keys(counts)
        .map((id) => ({ id, name: this.categoryMap[id] || '미분류', count: counts[id] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);
    },
  },
  methods: {
    rel(ts) {
      return formatRelative(ts);
    },
    go(t) {
      this.$router.push(TEMPLATE_TYPES[t.type].route);
    },
  },
};
</script>

<style module>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}
.stat {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  overflow: hidden;
}
.stat::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: var(--gradient-brand);
  opacity: 0.85;
}
.statValue {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
}
.statLabel {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}
.columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
}
.panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.panelTitle {
  font-size: var(--font-size-lg);
}
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  cursor: pointer;
}
.item:hover {
  background: var(--surface-sunken);
}
.itemTitle {
  font-weight: var(--font-weight-medium);
}
.itemMeta {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.catItem {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
}
.emptyText {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-4) 0;
}
</style>
