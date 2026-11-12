<template>
  <div class="detail">
    <div class="detail-head">
      <div class="detail-info">
        <div class="detail-row">
          <h2 class="detail-ttl">{{ template.title }}</h2>
          <button
            type="button"
            class="detail-fav"
            :class="{ on: template.favorite }"
            :aria-label="template.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'"
            :aria-pressed="String(template.favorite)"
            @click="$emit('toggle-favorite', template.id)"
          >
            <BaseIcon name="star" :size="20" />
          </button>
        </div>
        <p v-if="template.description" class="detail-desc">
          {{ template.description }}
        </p>
        <div class="detail-tags">
          <BaseTag variant="brand">{{ categoryName }}</BaseTag>
          <BaseTag v-if="template.responsive" variant="success">Responsive</BaseTag>
          <BaseTag v-for="tag in template.tags" :key="tag">#{{ tag }}</BaseTag>
        </div>
      </div>
      <div class="detail-act">
        <BaseButton variant="secondary" size="sm" @click="$emit('edit', template.id)">
          <template #left><BaseIcon name="edit" :size="15" /></template>
          전체 수정
        </BaseButton>
        <BaseButton variant="danger" size="sm" @click="$emit('delete', template.id)">
          <template #left><BaseIcon name="trash" :size="15" /></template>
          삭제
        </BaseButton>
      </div>
    </div>

    <!-- 스니펫 사용 정보 -->
    <div v-if="snippetMeta" class="detail-box">
      <div v-if="snippetMeta.usage">
        <span class="detail-label">사용 방법</span>
        <p>{{ snippetMeta.usage }}</p>
      </div>
      <div v-if="snippetMeta.trigger">
        <span class="detail-label">실행 조건</span>
        <p>{{ snippetMeta.trigger }}</p>
      </div>
    </div>

    <!-- 코드 + 미리보기 분할 -->
    <div class="detail-grp">
      <!-- 코드 패널 -->
      <section class="detail-pane">
        <div class="detail-top">
          <div class="detail-tabs" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              role="tab"
              :aria-selected="String(activeTab === tab.key)"
              class="detail-tab"
              :class="{ on: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <CodeEditor
          :key="activeTab"
          v-model="code[activeTab]"
          :lang="activeTab"
          :read-only="!editMode"
          @input="onCodeInput"
        />

        <div class="detail-foot">
          <div class="detail-btns">
            <BaseButton variant="ghost" size="sm" @click="copyActive">
              <template #left><BaseIcon name="copy" :size="14" /></template>
              현재 탭
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="copyAll">
              <template #left><BaseIcon name="copy" :size="14" /></template>
              전체 복사
            </BaseButton>
          </div>
          <div class="detail-btns">
            <template v-if="editMode">
              <BaseButton variant="secondary" size="sm" @click="cancelEdit">취소</BaseButton>
              <BaseButton variant="primary" size="sm" :disabled="!dirty" @click="saveEdit">
                <template #left><BaseIcon name="check" :size="14" /></template>
                저장
              </BaseButton>
            </template>
            <BaseButton v-else variant="secondary" size="sm" @click="startEdit">
              <template #left><BaseIcon name="edit" :size="14" /></template>
              코드 편집
            </BaseButton>
          </div>
        </div>
      </section>

      <!-- 미리보기 패널 -->
      <section class="detail-pane">
        <PreviewFrame :template="previewTemplate" />
      </section>
    </div>

    <!-- 코드 수정 저장 전 확인 -->
    <ConfirmDialog
      :open="confirmOpen"
      title="저장 확인"
      message="수정한 내용을 저장하시겠습니까?"
      confirm-text="저장"
      @confirm="confirmSave"
      @cancel="confirmOpen = false"
    />
  </div>
</template>

<script>
import BaseButton from '@/components/common/BaseButton.vue';
import BaseTag from '@/components/common/BaseTag.vue';
import BaseIcon from '@/components/common/BaseIcon.vue';
import CodeEditor from '@/components/editor/CodeEditor.vue';
import PreviewFrame from '@/components/preview/PreviewFrame.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import { copyToClipboard } from '@/utils/clipboard';

/**
 * 템플릿 상세: 코드(에디터) + 실시간 미리보기 분할 레이아웃 (Phase 3).
 *
 * - 읽기 모드: CodeEditor read-only 로 하이라이팅·줄번호 표시.
 * - 편집 모드: 인라인으로 코드 수정 후 저장(save 이벤트). 전체 수정은 edit 이벤트.
 * - 미리보기: 편집 중인 code 를 디바운스해서 PreviewFrame 에 반영(실시간).
 * - 상태 변경(save/delete/toggle-favorite)은 부모로 위임.
 */
export default {
  name: 'TemplateDetail',
  components: {
    BaseButton,
    BaseTag,
    BaseIcon,
    CodeEditor,
    PreviewFrame,
    ConfirmDialog,
  },
  props: {
    template: { type: Object, required: true },
    categoryName: { type: String, default: '미분류' },
  },
  data() {
    return {
      activeTab: 'html',
      editMode: false,
      confirmOpen: false,
      code: this.snapshot(),
      previewCode: this.snapshot(),
      debounceTimer: null,
      tabs: [
        { key: 'html', label: 'HTML' },
        { key: 'css', label: 'CSS' },
        { key: 'js', label: 'JavaScript' },
      ],
    };
  },
  computed: {
    snippetMeta() {
      const m = this.template.meta;
      return m && m.kind === 'snippet' ? m : null;
    },
    dirty() {
      return (
        this.code.html !== this.template.html ||
        this.code.css !== this.template.css ||
        this.code.js !== this.template.javascript
      );
    },
    /** 미리보기에 넘길 템플릿 (편집 중이면 편집본, 아니면 원본) */
    previewTemplate() {
      return {
        ...this.template,
        html: this.previewCode.html,
        css: this.previewCode.css,
        javascript: this.previewCode.js,
      };
    },
  },
  watch: {
    'template.id'() {
      // 다른 템플릿으로 전환 시 상태 초기화
      this.editMode = false;
      this.activeTab = 'html';
      this.code = this.snapshot();
      this.previewCode = this.snapshot();
    },
  },
  beforeDestroy() {
    if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
  },
  methods: {
    snapshot() {
      return {
        html: this.template.html || '',
        css: this.template.css || '',
        js: this.template.javascript || '',
      };
    },
    startEdit() {
      this.editMode = true;
      this.code = this.snapshot();
    },
    cancelEdit() {
      this.editMode = false;
      this.code = this.snapshot();
      this.previewCode = this.snapshot();
    },
    onCodeInput() {
      // 실시간 미리보기 디바운스 (300ms)
      if (this.debounceTimer) window.clearTimeout(this.debounceTimer);
      this.debounceTimer = window.setTimeout(() => {
        this.previewCode = {
          html: this.code.html,
          css: this.code.css,
          js: this.code.js,
        };
      }, 300);
    },
    /** 저장 버튼: 바로 저장하지 않고 확인 창을 먼저 띄운다 */
    saveEdit() {
      if (!this.dirty) return;
      this.confirmOpen = true;
    },
    confirmSave() {
      this.confirmOpen = false;
      this.$emit('save', {
        id: this.template.id,
        patch: {
          html: this.code.html,
          css: this.code.css,
          javascript: this.code.js,
        },
      });
      this.editMode = false;
    },
    async copyActive() {
      await this.doCopy(this.code[this.activeTab], '현재 탭 코드를 복사했습니다.');
    },
    async copyAll() {
      const parts = [];
      if (this.code.html) parts.push(`<!-- HTML -->\n${this.code.html}`);
      if (this.code.css) parts.push(`/* CSS */\n${this.code.css}`);
      if (this.code.js) parts.push(`// JavaScript\n${this.code.js}`);
      await this.doCopy(parts.join('\n\n'), '전체 코드를 복사했습니다.');
    },
    async doCopy(text, successMsg) {
      if (!text) {
        this.$store.dispatch('ui/pushToast', {
          message: '복사할 코드가 없습니다.',
          variant: 'warning',
        });
        return;
      }
      const ok = await copyToClipboard(text);
      this.$store.dispatch('ui/pushToast', {
        message: ok ? successMsg : '복사에 실패했습니다.',
        variant: ok ? 'success' : 'error',
      });
    },
  },
};
</script>

<style scoped>
.detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}
.detail-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  flex: 1;
  min-width: 240px;
}
.detail-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.detail-ttl {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  word-break: break-all;
}
.detail-fav {
  display: inline-flex;
  padding: 4px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}
.detail-fav:hover {
  color: var(--color-warning);
  background: var(--surface-sunken);
}
.detail-fav.on {
  color: var(--color-warning);
}
.detail-fav.on svg {
  fill: var(--color-warning);
}
.detail-desc {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.detail-act {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}
.detail-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
.detail-label {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-muted);
  margin-bottom: 2px;
}
.detail-grp {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  align-items: start;
}
.detail-pane {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-width: 0;
  min-height: 420px;
}
.detail-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
}
.detail-tabs {
  display: flex;
  gap: var(--space-1);
}
.detail-tab {
  padding: var(--space-2) var(--space-4);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
}
.detail-tab:hover {
  color: var(--text-primary);
}
.detail-tab.on {
  color: var(--text-brand);
  border-bottom-color: var(--color-brand-500);
}
.detail-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  flex-wrap: wrap;
}
.detail-btns {
  display: flex;
  gap: var(--space-2);
}
@media (max-width: 900px) {
  .detail-grp {
    grid-template-columns: 1fr;
  }
}
</style>
