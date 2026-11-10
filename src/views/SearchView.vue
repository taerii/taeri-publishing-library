<template>
  <div>
    <PageHeader title="통합 검색" :description="headerDesc" />

    <div :class="$style.filters">
      <div :class="$style.search">
        <BaseInput
          v-model="query"
          type="search"
          placeholder="모든 템플릿에서 이름, 설명, 태그 검색"
          aria-label="통합 검색"
        >
          <template #left><BaseIcon name="search" :size="16" /></template>
        </BaseInput>
      </div>
      <BaseSelect v-model="type" :options="typeOptions" />
      <BaseSelect v-model="tech" :options="techOptions" />
      <BaseSelect v-model="sort" :options="sortOptions" />
      <label :class="$style.favFilter">
        <input v-model="favoriteOnly" type="checkbox" />
        <span>즐겨찾기만</span>
      </label>
    </div>

    <p :class="$style.count">{{ results.length }}개 결과</p>

    <div v-if="results.length" :class="$style.grid">
      <TemplateCard
        v-for="t in results"
        :key="t.id"
        :template="t"
        :category-name="categoryMap[t.categoryId] || '미분류'"
        @open="openDetail"
        @toggle-favorite="onToggleFavorite"
      />
    </div>
    <EmptyState
      v-else
      :title="query ? '검색 결과가 없습니다' : '검색어를 입력하세요'"
      :description="query ? '다른 검색어나 필터를 시도해 보세요.' : '이름, 설명, 태그로 전체 템플릿을 검색합니다.'"
    >
      <template #icon><BaseIcon name="search" :size="28" /></template>
    </EmptyState>

    <BaseModal :open="detailOpen" size="xl" @close="closeDetail">
      <TemplateDetail
        v-if="detailOpen && detailTemplate"
        :template="detailTemplate"
        :category-name="categoryMap[detailTemplate.categoryId] || '미분류'"
        @edit="onEdit"
        @delete="onDelete"
        @toggle-favorite="onToggleFavorite"
        @save="onInlineSave"
      />
    </BaseModal>

    <ConfirmDialog
      :open="confirmOpen"
      danger
      title="템플릿 삭제"
      message="이 템플릿을 삭제합니다. 되돌릴 수 없습니다."
      confirm-text="삭제"
      @confirm="confirmDelete"
      @cancel="confirmOpen = false"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import TemplateCard from '@/components/template/TemplateCard.vue';
import TemplateDetail from '@/components/template/TemplateDetail.vue';
import { filterTemplates, SORT_OPTIONS, TECH_OPTIONS } from '@/services/search';
import { TEMPLATE_TYPES } from '@/constants/templateTypes';

/**
 * 통합 검색 화면.
 * Topbar 검색 → /search?q=... 로 진입. 전체 유형 교차 검색 + 다중 필터.
 * 공유 search 서비스로 TemplateManager 와 동일한 필터/정렬 규칙 사용.
 */
export default {
  name: 'SearchView',
  components: {
    PageHeader,
    BaseInput,
    BaseSelect,
    BaseIcon,
    BaseModal,
    EmptyState,
    ConfirmDialog,
    TemplateCard,
    TemplateDetail,
  },
  data() {
    return {
      query: this.$route.query.q || '',
      type: '',
      tech: '',
      sort: 'updated',
      favoriteOnly: false,
      sortOptions: SORT_OPTIONS,
      techOptions: TECH_OPTIONS,
      typeOptions: [
        { value: '', label: '전체 유형' },
        { value: 'component', label: 'UI Component' },
        { value: 'page', label: 'Page Template' },
        { value: 'snippet', label: 'Code Snippet' },
      ],
      detailOpen: false,
      detailId: null,
      confirmOpen: false,
      pendingDeleteId: null,
    };
  },
  computed: {
    ...mapState('data', ['templates']),
    ...mapGetters('data', ['categoryMap']),
    headerDesc() {
      return '모든 템플릿을 한 번에 검색합니다.';
    },
    results() {
      return filterTemplates(this.templates, {
        query: this.query,
        type: this.type,
        tech: this.tech,
        favoriteOnly: this.favoriteOnly,
        sort: this.sort,
      });
    },
    detailTemplate() {
      return this.templates.find((t) => t.id === this.detailId) || null;
    },
  },
  watch: {
    // 주소창 q 변경(Topbar 재검색) 동기화
    '$route.query.q'(q) {
      this.query = q || '';
    },
  },
  methods: {
    ...mapActions('data', ['updateTemplate', 'deleteTemplate', 'toggleFavorite']),
    openDetail(id) {
      this.detailId = id;
      this.detailOpen = true;
    },
    closeDetail() {
      this.detailOpen = false;
      this.detailId = null;
    },
    onEdit(id) {
      // 전체 수정은 해당 유형 관리 화면에서 (검색 화면은 조회/인라인 편집 중심)
      const t = this.templates.find((x) => x.id === id);
      if (t) this.$router.push(TEMPLATE_TYPES[t.type].route);
    },
    onDelete(id) {
      this.pendingDeleteId = id;
      this.confirmOpen = true;
    },
    async confirmDelete() {
      const id = this.pendingDeleteId;
      this.confirmOpen = false;
      if (!id) return;
      try {
        await this.deleteTemplate(id);
        if (this.detailId === id) this.closeDetail();
        this.toast('삭제되었습니다.', 'success');
      } catch (e) {
        this.toast('삭제 실패: ' + (e && e.message), 'error');
      } finally {
        this.pendingDeleteId = null;
      }
    },
    async onToggleFavorite(id) {
      await this.toggleFavorite(id);
    },
    async onInlineSave({ id, patch }) {
      try {
        await this.updateTemplate({ id, patch });
        this.toast('코드가 저장되었습니다.', 'success');
      } catch (e) {
        this.toast('저장 실패: ' + (e && e.message), 'error');
      }
    },
    toast(message, variant) {
      this.$store.dispatch('ui/pushToast', { message, variant });
    },
  },
};
</script>

<style module>
.filters {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.search {
  flex: 1;
  min-width: 240px;
}
.favFilter {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
}
.count {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}
</style>
