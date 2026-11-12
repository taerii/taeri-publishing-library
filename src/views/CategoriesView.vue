<template>
  <div class="cat">
    <PageHeader title="Categories" description="카테고리를 추가, 수정, 삭제합니다.">
      <template #actions>
        <BaseButton variant="primary" @click="openCreate">
          <template #left><BaseIcon name="plus" :size="16" /></template>
          새 카테고리
        </BaseButton>
      </template>
    </PageHeader>

    <section v-for="group in groups" :key="group.type" class="cat-section">
      <h2 class="cat-ttl">
        {{ group.label }}
        <span class="cat-num">{{ group.items.length }}</span>
      </h2>

      <div v-if="group.items.length" class="cat-list">
        <div v-for="cat in group.items" :key="cat.id" class="cat-item">
          <div class="cat-main">
            <BaseIcon name="folder" :size="16" class="cat-i" />
            <span class="cat-name">{{ cat.name }}</span>
            <BaseTag v-if="cat.isDefault" size="sm">기본</BaseTag>
          </div>
          <div class="cat-side">
            <span class="cat-use">{{ countMap[cat.id] || 0 }}개 템플릿</span>
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
      <p v-else class="cat-empty">이 유형에는 카테고리가 없습니다.</p>
    </section>

    <!-- 생성/수정 모달 -->
    <BaseModal
      :open="formOpen"
      :title="editing ? '카테고리 수정' : '새 카테고리'"
      size="sm"
      @close="closeForm"
    >
      <form class="cat-form" @submit.prevent="submitForm">
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

    <!-- 이름 수정 저장 전 확인 (새 카테고리 추가에는 표시하지 않음) -->
    <ConfirmDialog
      :open="saveConfirmOpen"
      title="저장 확인"
      message="수정한 내용을 저장하시겠습니까?"
      confirm-text="저장"
      @confirm="confirmSave"
      @cancel="saveConfirmOpen = false"
    />

    <!-- 삭제 모달 (사용 중이면 재할당) -->
    <BaseModal
      :open="deleteOpen"
      title="카테고리 삭제"
      size="sm"
      @close="deleteOpen = false"
    >
      <p class="cat-msg">
        "{{ deleteTarget && deleteTarget.name }}" 카테고리를 삭제합니다.
      </p>
      <div v-if="deleteUsage > 0" class="cat-reassign">
        <p class="cat-warn">
          이 카테고리를 사용하는 템플릿이 {{ deleteUsage }}개 있습니다.
          삭제 전에 다른 카테고리로 이동해 주세요.
        </p>
        <BaseSelect
          v-if="reassignOptions.length"
          v-model="reassignToId"
          label="이동할 카테고리"
          :options="reassignOptions"
        />
        <p v-else class="cat-warn">
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
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
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
    ConfirmDialog,
  },
  data() {
    return {
      formOpen: false,
      saveConfirmOpen: false,
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
      // 수정이면 확인 후 저장, 신규 추가는 바로 저장
      if (this.editing) {
        this.saveConfirmOpen = true;
        return;
      }
      await this.persistForm(name);
    },
    async confirmSave() {
      this.saveConfirmOpen = false;
      await this.persistForm(this.form.name.trim());
    },
    async persistForm(name) {
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

<style scoped>
.cat-section {
  margin-bottom: var(--space-8);
}
.cat-ttl {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-3);
}
.cat-num {
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
.cat-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.cat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-raised);
  border: none;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
}
.cat-main {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.cat-i {
  color: var(--text-muted);
}
.cat-name {
  font-weight: var(--font-weight-medium);
}
.cat-side {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.cat-use {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  white-space: nowrap;
}
.cat-empty {
  padding: var(--space-4);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}
.cat-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.cat-msg {
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}
.cat-reassign {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.cat-warn {
  font-size: var(--font-size-sm);
  color: var(--color-warning);
  background: var(--color-warning-bg);
  padding: var(--space-3);
  border-radius: var(--radius-md);
}
</style>
