<template>
  <div class="manager">
    <PageHeader :title="typeMeta.label + 's'" :description="description">
      <template #actions>
        <BaseButton variant="primary" @click="openCreate">
          <template #left><BaseIcon name="plus" :size="16" /></template>
          새 {{ typeMeta.noun }}
        </BaseButton>
      </template>
    </PageHeader>

    <!-- 필터 바 -->
    <div class="manager-filter">
      <div class="manager-search">
        <BaseInput v-model="query" type="search" placeholder="이름, 설명, 태그 검색">
          <template #left><BaseIcon name="search" :size="16" /></template>
        </BaseInput>
      </div>
      <BaseSelect v-model="categoryFilter" :options="categoryFilterOptions" />
      <BaseSelect v-model="tech" :options="techOptions" />
      <BaseSelect v-model="sort" :options="sortOptions" />
      <label class="manager-chk">
        <input v-model="favoriteOnly" type="checkbox" />
        <span>즐겨찾기만</span>
      </label>
    </div>

    <p class="manager-cnt">{{ filtered.length }}개 항목</p>

    <!-- 목록 -->
    <div v-if="filtered.length" class="manager-grp">
      <TemplateCard
        v-for="t in filtered"
        :key="t.id"
        :template="t"
        :category-name="categoryMap[t.categoryId] || '미분류'"
        @open="openDetail"
        @toggle-favorite="onToggleFavorite"
      />
    </div>
    <EmptyState
      v-else
      :title="emptyTitle"
      :description="emptyDescription"
    >
      <template #action>
        <BaseButton v-if="!hasAny" variant="primary" @click="openCreate">
          첫 {{ typeMeta.noun }} 등록하기
        </BaseButton>
      </template>
    </EmptyState>

    <!-- 등록/수정 모달 -->
    <BaseModal
      :open="formOpen"
      :title="editing ? typeMeta.noun + ' 수정' : '새 ' + typeMeta.noun"
      size="xl"
      @close="closeForm"
    >
      <TemplateForm
        v-if="formOpen"
        :key="editing ? editing.id : 'new'"
        :value="editing"
        :type="type"
        :categories="categories"
        :is-edit="!!editing"
        @submit="onSubmit"
        @cancel="closeForm"
      />
    </BaseModal>

    <!-- 상세 모달 -->
    <BaseModal :open="detailOpen" size="xl" @close="closeDetail">
      <TemplateDetail
        v-if="detailOpen && detailTemplate"
        :template="detailTemplate"
        :category-name="categoryMap[detailTemplate.categoryId] || '미분류'"
        @edit="openEditFromDetail"
        @delete="askDelete"
        @toggle-favorite="onToggleFavorite"
        @save="onInlineSave"
      />
    </BaseModal>

    <!-- 삭제 확인 -->
    <ConfirmDialog
      :open="confirmOpen"
      danger
      title="템플릿 삭제"
      :message="confirmMessage"
      confirm-text="삭제"
      @confirm="confirmDelete"
      @cancel="confirmOpen = false"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import EmptyState from '@/components/common/EmptyState.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import TemplateCard from './TemplateCard.vue';
import TemplateForm from './TemplateForm.vue';
import TemplateDetail from './TemplateDetail.vue';
import { TEMPLATE_TYPES } from '@/constants/templateTypes';
import { filterTemplates, SORT_OPTIONS, TECH_OPTIONS } from '@/services/search';

/**
 * 유형별 템플릿 관리 화면 (Component/Page/Snippet 공통 재사용).
 * 목록·검색·필터·등록·수정·삭제·상세·즐겨찾기를 조율하고,
 * 실제 데이터 변경은 Vuex data 액션으로 위임한다.
 */
export default {
  name: 'TemplateManager',
  components: {
    PageHeader,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseIcon,
    BaseModal,
    EmptyState,
    ConfirmDialog,
    TemplateCard,
    TemplateForm,
    TemplateDetail,
  },
  props: {
    type: {
      type: String,
      required: true,
      validator: (v) => ['component', 'page', 'snippet'].includes(v),
    },
    description: { type: String, default: '' },
  },
  data() {
    return {
      query: '',
      categoryFilter: '',
      tech: '',
      sort: 'updated',
      favoriteOnly: false,
      sortOptions: SORT_OPTIONS,
      techOptions: TECH_OPTIONS,
      formOpen: false,
      editing: null,
      detailOpen: false,
      detailId: null,
      confirmOpen: false,
      pendingDeleteId: null,
    };
  },
  computed: {
    ...mapState('data', ['templates']),
    ...mapGetters('data', ['categoryMap']),
    typeMeta() {
      return TEMPLATE_TYPES[this.type];
    },
    categories() {
      return this.$store.getters['data/categoriesByType'](this.type);
    },
    items() {
      return this.$store.getters['data/templatesByType'](this.type);
    },
    hasAny() {
      return this.items.length > 0;
    },
    categoryFilterOptions() {
      return [
        { value: '', label: '전체 카테고리' },
        ...this.categories.map((c) => ({ value: c.id, label: c.name })),
      ];
    },
    filtered() {
      return filterTemplates(this.items, {
        query: this.query,
        categoryId: this.categoryFilter,
        tech: this.tech,
        favoriteOnly: this.favoriteOnly,
        sort: this.sort,
      });
    },
    detailTemplate() {
      return this.items.find((t) => t.id === this.detailId) || null;
    },
    emptyTitle() {
      return this.hasAny ? '검색 결과가 없습니다' : `${this.typeMeta.noun}가 없습니다`;
    },
    emptyDescription() {
      return this.hasAny
        ? '검색어나 필터 조건을 조정해 보세요.'
        : `새 ${this.typeMeta.noun}를 등록해 시작하세요.`;
    },
    confirmMessage() {
      const t = this.templates.find((x) => x.id === this.pendingDeleteId);
      return t
        ? `"${t.title}"를 삭제합니다. 이 작업은 되돌릴 수 없습니다.`
        : '이 템플릿을 삭제합니다.';
    },
  },
  methods: {
    ...mapActions('data', [
      'createTemplate',
      'updateTemplate',
      'deleteTemplate',
      'toggleFavorite',
    ]),
    openCreate() {
      this.editing = null;
      this.formOpen = true;
    },
    closeForm() {
      this.formOpen = false;
      this.editing = null;
    },
    openDetail(id) {
      this.detailId = id;
      this.detailOpen = true;
    },
    closeDetail() {
      this.detailOpen = false;
      this.detailId = null;
    },
    openEditFromDetail(id) {
      const t = this.items.find((x) => x.id === id);
      if (!t) return;
      this.editing = t;
      this.detailOpen = false;
      this.formOpen = true;
    },
    async onSubmit(draft) {
      try {
        if (this.editing) {
          await this.updateTemplate({ id: this.editing.id, patch: draft });
          this.toast('수정되었습니다.', 'success');
        } else {
          const created = await this.createTemplate(draft);
          this.toast('등록되었습니다.', 'success');
          this.detailId = created.id;
        }
        this.closeForm();
      } catch (e) {
        this.toast('저장에 실패했습니다: ' + (e && e.message), 'error');
      }
    },
    askDelete(id) {
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
        this.toast('삭제에 실패했습니다: ' + (e && e.message), 'error');
      } finally {
        this.pendingDeleteId = null;
      }
    },
    async onToggleFavorite(id) {
      try {
        await this.toggleFavorite(id);
      } catch (e) {
        this.toast('즐겨찾기 변경 실패: ' + (e && e.message), 'error');
      }
    },
    async onInlineSave({ id, patch }) {
      try {
        await this.updateTemplate({ id, patch });
        this.toast('코드가 저장되었습니다.', 'success');
      } catch (e) {
        this.toast('저장에 실패했습니다: ' + (e && e.message), 'error');
      }
    },
    toast(message, variant) {
      this.$store.dispatch('ui/pushToast', { message, variant });
    },
  },
};
</script>

<style scoped>
.manager-filter {
  display: flex;
  gap: var(--space-3);
  align-items: center;
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
}
.manager-search {
  flex: 1;
  min-width: 220px;
}
.manager-chk {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  white-space: nowrap;
  cursor: pointer;
}
.manager-cnt {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-4);
}
.manager-grp {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-4);
}
</style>
