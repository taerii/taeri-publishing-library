<template>
  <div>
    <PageHeader title="Favorites" description="즐겨찾기한 템플릿을 모아봅니다." />

    <div :class="$style.filters">
      <button
        v-for="opt in typeFilters"
        :key="opt.value"
        type="button"
        :class="[$style.chip, typeFilter === opt.value && $style.chipActive]"
        @click="typeFilter = opt.value"
      >
        {{ opt.label }}
        <span :class="$style.badge">{{ countFor(opt.value) }}</span>
      </button>
    </div>

    <div v-if="filtered.length" :class="$style.grid">
      <TemplateCard
        v-for="t in filtered"
        :key="t.id"
        :template="t"
        :category-name="categoryMap[t.categoryId] || '미분류'"
        @open="goToType(t)"
        @toggle-favorite="onToggleFavorite"
      />
    </div>
    <EmptyState
      v-else
      title="즐겨찾기가 없습니다"
      description="템플릿 카드의 별 아이콘을 눌러 즐겨찾기에 추가하세요."
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import TemplateCard from '@/components/template/TemplateCard.vue';
import { TEMPLATE_TYPES } from '@/constants/templateTypes';

export default {
  name: 'FavoritesView',
  components: { PageHeader, EmptyState, TemplateCard },
  data() {
    return {
      typeFilter: 'all',
      typeFilters: [
        { value: 'all', label: '전체' },
        { value: 'component', label: 'Component' },
        { value: 'page', label: 'Page' },
        { value: 'snippet', label: 'Snippet' },
      ],
    };
  },
  computed: {
    ...mapGetters('data', ['favorites', 'categoryMap']),
    filtered() {
      const list =
        this.typeFilter === 'all'
          ? this.favorites
          : this.favorites.filter((t) => t.type === this.typeFilter);
      return list.slice().sort((a, b) => b.updatedAt - a.updatedAt);
    },
  },
  methods: {
    ...mapActions('data', ['toggleFavorite']),
    countFor(value) {
      return value === 'all'
        ? this.favorites.length
        : this.favorites.filter((t) => t.type === value).length;
    },
    goToType(template) {
      // 해당 유형 관리 화면으로 이동 (상세는 각 화면에서 열람)
      const route = TEMPLATE_TYPES[template.type].route;
      this.$router.push(route);
    },
    async onToggleFavorite(id) {
      await this.toggleFavorite(id);
    },
  },
};
</script>

<style module>
.filters {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border-default);
  background: var(--surface-raised);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.chip:hover {
  border-color: var(--color-brand-300);
}
.chipActive {
  background: var(--gradient-brand);
  border-color: transparent;
  color: var(--text-inverse);
  box-shadow: var(--shadow-brand);
}
.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: var(--radius-full);
  background: var(--surface-sunken);
  color: var(--text-secondary);
  font-size: 11px;
}
.chipActive .badge {
  background: rgba(255, 255, 255, 0.2);
  color: var(--text-inverse);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}
</style>
