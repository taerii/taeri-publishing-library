<template>
  <div>
    <PageHeader title="Categories" description="카테고리를 추가, 수정, 삭제합니다.">
      <template #actions>
        <BaseButton variant="primary" @click="openCreate">
          <template #left><BaseIcon name="plus" :size="16" /></template>
          새 카테고리
        </BaseButton>
      </template>
    </PageHeader>

    <section v-for="group in groups" :key="group.type" :class="$style.group">
      <h2 :class="$style.groupTitle">
        {{ group.label }}
        <span :class="$style.groupCount">{{ group.items.length }}</span>
      </h2>

      <div v-if="group.items.length" :class="$style.list">
        <div v-for="cat in group.items" :key="cat.id" :class="$style.row">
          <div :class="$style.rowMain">
            <BaseIcon name="folder" :size="16" :class="$style.folderIcon" />
            <span :class="$style.name">{{ cat.name }}</span>
            <BaseTag v-if="cat.isDefault" size="sm">기본</BaseTag>
          </div>
          <div :class="$style.rowRight">
            <span :class="$style.usage">{{ countMap[cat.id] || 0 }}개 템플릿</span>
            <BaseButton
              variant="ghost"
              size="sm"
              icon-only
              aria-label="카테고리 수정"
              @click="openEdit(cat)"
            >
              <BaseIcon name="edit" :size="15" />
            </BaseButton>
            <BaseButton
              variant="ghost"
              size="sm"
              icon-only
              aria-label="카테고리 삭제"
              @click="askDelete(cat)"
            >
              <BaseIcon name="trash" :size="15" />
            </BaseButton>
          </div>
        </div>
      </div>
      <p v-else :class="$style.empty">이 유형에는 카테고리가 없습니다.</p>
    </section>

    <!-- 생성/수정 모달 -->
    <BaseModal
      :open="formOpen"
      :title="editing ? '카테고리 수정' : '새 카테고리'"
      size="sm"
      @close="closeForm"
    >
      <form :class="$style.form" @submit.prevent="submitForm">
        <BaseInput
          v-model="form.name"
          label="이름 *"
          placeholder="카테고리 이름"
          :error="formError"
        />
        <BaseSelect
          v-if="!editing"
          v-model="form.type"
          label="유형 *"
          :options="typeOptions"
        />
      </form>
      <template #footer>
        <BaseButton variant="secondary" @click="closeForm">취소</BaseButton>
        <BaseButton variant="primary" @click="submitForm">
          {{ editing ? '저장' : '추가' }}
        </BaseButton>
      </template>
    </BaseModal>

    <!-- 삭제 모달 (사용 중이면 재할당) -->
    <BaseModal
      :open="deleteOpen"
      title="카테고리 삭제"
      size="sm"
      @close="deleteOpen = false"
    >
      <p :class="$style.delMsg">
        "{{ deleteTarget && deleteTarget.name }}" 카테고리를 삭제합니다.
      </p>
      <div v-if="deleteUsage > 0" :class="$style.reassign">
        <p :class="$style.warn">
          이 카테고리를 사용하는 템플릿이 {{ deleteUsage }}개 있습니다.
          삭제 전에 다른 카테고리로 이동해 주세요.
        </p>
        <BaseSelect
          v-if="reassignOptions.length"
          v-model="reassignToId"
          label="이동할 카테고리"
          :options="reassignOptions"
        />
        <p v-else :class="$style.warn">
          이동할 다른 카테고리가 없습니다. 먼저 같은 유형의 카테고리를 추가해 주세요.
        </p>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="deleteOpen = false">취소</BaseButton>
        <BaseButton variant="danger" :disabled="!canDelete" @click="confirmDelete">
          삭제
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import PageHeader from '@/components/layout/PageHeader.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import BaseModal from '@/components/common/BaseModal.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import BaseTag from '@/components/common/BaseTag.vue';
import { TEMPLATE_TYPES } from '@/constants/templateTypes';

export default {
  name: 'CategoriesView',
  components: {
    PageHeader,
    BaseButton,
    BaseInput,
    BaseSelect,
    BaseModal,
    BaseIcon,
    BaseTag,
  },
  data() {
    return {
      formOpen: false,
      editing: null,
      form: { name: '', type: 'component' },
      formError: '',
      deleteOpen: false,
      deleteTarget: null,
      reassignToId: '',
      typeOptions: [
        { value: 'component', label: 'UI Component' },
        { value: 'page', label: 'Page Template' },
        { value: 'snippet', label: 'Code Snippet' },
      ],
    };
  },
  computed: {
    ...mapState('data', ['categories']),
    ...mapGetters('data', ['categoryCounts']),
    countMap() {
      return this.categoryCounts;
    },
    groups() {
      return Object.keys(TEMPLATE_TYPES).map((type) => ({
        type,
        label: TEMPLATE_TYPES[type].label,
        items: this.categories
          .filter((c) => c.type === type)
          .sort((a, b) => a.order - b.order),
      }));
    },
    deleteUsage() {
      return this.deleteTarget ? this.countMap[this.deleteTarget.id] || 0 : 0;
    },
    reassignOptions() {
      if (!this.deleteTarget) return [];
      return this.categories
        .filter(
          (c) =>
            c.type === this.deleteTarget.type && c.id !== this.deleteTarget.id
        )
        .map((c) => ({ value: c.id, label: c.name }));
    },
    canDelete() {
      if (this.deleteUsage === 0) return true;
      return !!this.reassignToId;
    },
  },
  methods: {
    ...mapActions('data', ['createCategory', 'updateCategory', 'deleteCategory']),
    openCreate() {
      this.editing = null;
      this.form = { name: '', type: 'component' };
      this.formError = '';
      this.formOpen = true;
    },
    openEdit(cat) {
      this.editing = cat;
      this.form = { name: cat.name, type: cat.type };
      this.formError = '';
      this.formOpen = true;
    },
    closeForm() {
      this.formOpen = false;
      this.editing = null;
    },
    async submitForm() {
      const name = this.form.name.trim();
      if (!name) {
        this.formError = '이름을 입력해 주세요.';
        return;
      }
      try {
        if (this.editing) {
          await this.updateCategory({ id: this.editing.id, patch: { name } });
          this.toast('카테고리를 수정했습니다.', 'success');
        } else {
          await this.createCategory({ name, type: this.form.type });
          this.toast('카테고리를 추가했습니다.', 'success');
        }
        this.closeForm();
      } catch (e) {
        this.toast('저장 실패: ' + (e && e.message), 'error');
      }
    },
    askDelete(cat) {
      this.deleteTarget = cat;
      this.reassignToId = '';
      this.deleteOpen = true;
    },
    async confirmDelete() {
      if (!this.canDelete || !this.deleteTarget) return;
      try {
        await this.deleteCategory({
          id: this.deleteTarget.id,
          reassignToId: this.deleteUsage > 0 ? this.reassignToId : undefined,
        });
        this.toast('카테고리를 삭제했습니다.', 'success');
        this.deleteOpen = false;
        this.deleteTarget = null;
      } catch (e) {
        this.toast('삭제 실패: ' + (e && e.message), 'error');
      }
    },
    toast(message, variant) {
      this.$store.dispatch('ui/pushToast', { message, variant });
    },
  },
};
</script>

<style module>
.group {
  margin-bottom: var(--space-8);
}
.groupTitle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-3);
}
.groupCount {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: var(--radius-full);
  background: var(--surface-sunken);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
}
.rowMain {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.folderIcon {
  color: var(--text-muted);
}
.name {
  font-weight: var(--font-weight-medium);
}
.rowRight {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.usage {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
}
.empty {
  padding: var(--space-4);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.delMsg {
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}
.reassign {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.warn {
  font-size: var(--font-size-sm);
  color: var(--color-warning);
  background: var(--color-warning-bg);
  padding: var(--space-3);
  border-radius: var(--radius-md);
}
</style>
