<template>
  <form class="form" @submit.prevent="requestSubmit">
    <div class="form-grp">
      <BaseInput
        v-model="draft.title"
        label="제목 *"
        placeholder="템플릿 이름"
        :error="errors.title"
      />
      <BaseSelect
        v-model="draft.categoryId"
        label="카테고리 *"
        placeholder="카테고리 선택"
        :options="categoryOptions"
        :error="errors.categoryId"
      />
    </div>

    <BaseTextarea
      v-model="draft.description"
      label="설명"
      :rows="2"
      placeholder="이 템플릿에 대한 설명"
    />

    <TagInput v-model="draft.tags" label="태그" />

    <!-- 스니펫 전용 메타 -->
    <template v-if="draft.type === 'snippet'">
      <div class="form-grp">
        <BaseSelect
          v-model="draft.meta.lang"
          label="주 언어"
          :options="snippetLangs"
        />
        <BaseInput
          v-model="draft.meta.trigger"
          label="실행 조건"
          placeholder="예: DOMContentLoaded 이후"
        />
      </div>
      <BaseTextarea
        v-model="draft.meta.usage"
        label="사용 방법"
        :rows="2"
        placeholder="사용 방법 설명"
      />
    </template>

    <!-- 반응형 토글 (component/page) -->
    <label v-if="draft.type !== 'snippet'" class="form-chk">
      <input v-model="draft.responsive" type="checkbox" />
      <span>반응형(Responsive) 지원</span>
    </label>

    <!-- 외부 의존성 (미리보기에서 로드) -->
    <div class="form-box">
      <div class="form-head">
        <span class="form-label">외부 라이브러리 (CDN)</span>
        <BaseButton variant="ghost" size="sm" type="button" @click="addDependency">
          <template #left><BaseIcon name="plus" :size="14" /></template>
          추가
        </BaseButton>
      </div>
      <p v-if="!draft.dependencies.length" class="form-hint">
        Swiper 등 외부 라이브러리의 CDN URL을 추가하면 미리보기에서 함께 로드됩니다.
      </p>
      <div
        v-for="(dep, i) in draft.dependencies"
        :key="i"
        class="form-dep"
      >
        <BaseInput v-model="dep.name" placeholder="이름 (예: Swiper)" class="form-cell" />
        <BaseInput v-model="dep.url" placeholder="https://cdn.../lib.js" class="form-cell" />
        <BaseSelect v-model="dep.kind" :options="depKinds" class="form-cell" />
        <BaseButton
          variant="ghost"
          size="sm"
          icon-only
          type="button"
          aria-label="의존성 삭제"
          @click="removeDependency(i)"
        >
          <BaseIcon name="trash" :size="15" />
        </BaseButton>
      </div>
    </div>

    <!-- 썸네일 (component/page) -->
    <div v-if="draft.type !== 'snippet'" class="form-box">
      <span class="form-label">썸네일</span>
      <div class="form-thumb">
        <div v-if="thumbPreview" class="form-thumb-img">
          <img :src="thumbPreview" alt="썸네일 미리보기" />
        </div>
        <div class="form-thumb-act">
          <BaseButton variant="secondary" size="sm" type="button" @click="pickThumbnail">
            이미지 선택
          </BaseButton>
          <BaseButton
            v-if="thumbPreview"
            variant="ghost"
            size="sm"
            type="button"
            @click="clearThumbnail"
          >
            제거
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 코드 입력 -->
    <div class="form-tabs" role="tablist">
      <button
        v-for="tab in codeTabs"
        :key="tab.key"
        type="button"
        role="tab"
        :aria-selected="String(activeTab === tab.key)"
        class="form-tab"
        :class="{ on: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <div v-show="activeTab === 'html'">
      <CodeEditor v-model="draft.html" lang="html" />
    </div>
    <div v-show="activeTab === 'css'">
      <CodeEditor v-model="draft.css" lang="css" />
    </div>
    <div v-show="activeTab === 'js'">
      <CodeEditor v-model="draft.javascript" lang="js" />
    </div>

    <div class="form-foot">
      <BaseButton variant="secondary" type="button" @click="$emit('cancel')">
        취소
      </BaseButton>
      <BaseButton variant="primary" type="submit">
        {{ isEdit ? '변경 저장' : '등록' }}
      </BaseButton>
    </div>

    <!-- 수정 저장 전 확인 (신규 등록에는 표시하지 않음) -->
    <ConfirmDialog
      :open="confirmOpen"
      title="저장 확인"
      message="수정한 내용을 저장하시겠습니까?"
      confirm-text="저장"
      @confirm="confirmSave"
      @cancel="confirmOpen = false"
    />
  </form>
</template>

<script>
import BaseInput from '@/components/common/BaseInput.vue';
import BaseSelect from '@/components/common/BaseSelect.vue';
import BaseTextarea from '@/components/common/BaseTextarea.vue';
import TagInput from '@/components/common/TagInput.vue';
import BaseButton from '@/components/common/BaseButton.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import CodeEditor from '@/components/editor/CodeEditor.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { SNIPPET_LANGS, createEmptyDraft } from '@/constants/templateTypes';
import { assetRepo } from '@/db';
import { pickFile } from '@/utils/download';

/**
 * 템플릿 등록/수정 폼.
 * - value(초기 draft) 를 받아 내부 복제본을 편집하고 submit 시 방출.
 * - 등록/수정 양쪽에서 재사용. 부모가 저장 로직(Vuex 액션)을 담당.
 */
export default {
  name: 'TemplateForm',
  components: {
    BaseInput,
    BaseSelect,
    BaseTextarea,
    TagInput,
    BaseButton,
    BaseIcon,
    CodeEditor,
    ConfirmDialog,
  },
  props: {
    /** 편집 대상 (없으면 신규) */
    value: { type: Object, default: null },
    type: { type: String, required: true },
    categories: { type: Array, default: () => [] },
    isEdit: { type: Boolean, default: false },
  },
  data() {
    return {
      draft: this.buildDraft(),
      activeTab: 'html',
      errors: {},
      snippetLangs: SNIPPET_LANGS,
      depKinds: [
        { value: 'js', label: 'JS' },
        { value: 'css', label: 'CSS' },
      ],
      // 썸네일: 신규 선택 파일(임시) / 기존 asset objectURL / 제거 여부
      thumbFile: null,
      thumbObjectUrl: '',
      existingThumbUrl: '',
      confirmOpen: false,
    };
  },
  computed: {
    categoryOptions() {
      return this.categories.map((c) => ({ value: c.id, label: c.name }));
    },
    codeTabs() {
      return [
        { key: 'html', label: 'HTML' },
        { key: 'css', label: 'CSS' },
        { key: 'js', label: 'JavaScript' },
      ];
    },
    thumbPreview() {
      return this.thumbObjectUrl || this.existingThumbUrl || '';
    },
  },
  async created() {
    // 기존 썸네일 asset 을 미리보기로 로드
    if (this.draft.thumbnailAssetId) {
      try {
        const asset = await assetRepo.getById(this.draft.thumbnailAssetId);
        if (asset && asset.blob) {
          this.existingThumbUrl = URL.createObjectURL(asset.blob);
        }
      } catch {
        /* 썸네일 로드 실패는 무시 */
      }
    }
  },
  beforeDestroy() {
    if (this.thumbObjectUrl) URL.revokeObjectURL(this.thumbObjectUrl);
    if (this.existingThumbUrl) URL.revokeObjectURL(this.existingThumbUrl);
  },
  methods: {
    addDependency() {
      this.draft.dependencies.push({ name: '', url: '', kind: 'js' });
    },
    removeDependency(index) {
      this.draft.dependencies.splice(index, 1);
    },
    async pickThumbnail() {
      const file = await pickFile('image/*');
      if (!file) return;
      if (this.thumbObjectUrl) URL.revokeObjectURL(this.thumbObjectUrl);
      this.thumbFile = file;
      this.thumbObjectUrl = URL.createObjectURL(file);
    },
    clearThumbnail() {
      if (this.thumbObjectUrl) URL.revokeObjectURL(this.thumbObjectUrl);
      this.thumbFile = null;
      this.thumbObjectUrl = '';
      this.existingThumbUrl = '';
      this.draft.thumbnailAssetId = undefined;
    },
    buildDraft() {
      if (this.value) {
        // 깊은 복제로 원본 불변 유지
        const clone = JSON.parse(JSON.stringify(this.value));
        if (!clone.meta) {
          clone.meta =
            clone.type === 'snippet'
              ? { kind: 'snippet', usage: '', trigger: '', lang: 'js' }
              : clone.type === 'page'
              ? { kind: 'page', usedComponents: [] }
              : { kind: 'component', variant: '' };
        }
        return clone;
      }
      return createEmptyDraft(this.type);
    },
    validate() {
      const errors = {};
      if (!this.draft.title.trim()) errors.title = '제목을 입력해 주세요.';
      if (!this.draft.categoryId) errors.categoryId = '카테고리를 선택해 주세요.';
      this.errors = errors;
      return Object.keys(errors).length === 0;
    },
    /** 저장 버튼/Enter: 검증 후, 수정이면 확인 창을 먼저 띄운다 */
    requestSubmit() {
      if (!this.validate()) return;
      if (this.isEdit) {
        this.confirmOpen = true;
      } else {
        this.submit();
      }
    },
    confirmSave() {
      this.confirmOpen = false;
      this.submit();
    },
    async submit() {
      if (!this.validate()) return;

      // 새 썸네일 파일이 있으면 asset 으로 저장하고 id 참조
      if (this.thumbFile) {
        try {
          const asset = await assetRepo.create(this.thumbFile);
          this.draft.thumbnailAssetId = asset.id;
        } catch (e) {
          this.$store.dispatch('ui/pushToast', {
            message: '썸네일 저장에 실패했습니다: ' + (e && e.message),
            variant: 'error',
          });
          return;
        }
      }

      const payload = JSON.parse(JSON.stringify(this.draft));
      payload.title = payload.title.trim();
      payload.description = payload.description.trim();
      // 빈 의존성 행 제거 (URL 없는 것)
      payload.dependencies = (payload.dependencies || []).filter(
        (d) => d.url && d.url.trim()
      );
      this.$emit('submit', payload);
    },
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.form-grp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}
.form-chk {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
}
.form-tabs {
  display: flex;
  gap: var(--space-1);
  border-bottom: 1px solid var(--border-subtle);
}
.form-tab {
  padding: var(--space-2) var(--space-4);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
}
.form-tab:hover {
  color: var(--text-primary);
}
.form-tab.on {
  color: var(--text-brand);
  border-bottom-color: var(--color-brand-500);
}
.form-foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  padding-top: var(--space-2);
}
.form-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
}
.form-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.form-hint {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.form-dep {
  display: grid;
  grid-template-columns: 1fr 2fr auto auto;
  gap: var(--space-2);
  align-items: start;
}
.form-cell {
  min-width: 0;
}
.form-thumb {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}
.form-thumb-img {
  width: 96px;
  height: 64px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  background: var(--surface-raised);
}
.form-thumb-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.form-thumb-act {
  display: flex;
  gap: var(--space-2);
}
@media (max-width: 640px) {
  .form-grp {
    grid-template-columns: 1fr;
  }
  .form-dep {
    grid-template-columns: 1fr;
  }
}
</style>
