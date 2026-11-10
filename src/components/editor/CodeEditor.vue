<template>
  <div :class="$style.wrap">
    <div v-if="loadingEditor" :class="$style.loading">
      <BaseSpinner :size="18" /> 에디터 불러오는 중...
    </div>
    <div ref="host" :class="$style.host"></div>
  </div>
</template>

<script>
/**
 * CodeMirror 6 래퍼 (독립 재사용 컴포넌트, Phase 3).
 *
 * Vue 2 호환 설계:
 * - EditorView 인스턴스는 Vue 반응형이 감싸지 않도록 data() 가 아닌
 *   컴포넌트 인스턴스 필드(this.view)로 보관한다. (반응성 충돌/성능 문제 방지)
 * - v-model 로는 "코드 문자열" 만 양방향 바인딩한다.
 * - 외부에서 value 가 바뀌면 에디터 내용과 다를 때만 dispatch 로 동기화
 *   (사용자 입력 중 커서 튐 방지).
 *
 * 확장성:
 * - lang/readOnly prop 으로 동작을 조절하며, 추가 확장은 setup 모듈에서 관리.
 */
import BaseSpinner from '@/components/common/BaseSpinner.vue';

export default {
  name: 'CodeEditor',
  components: { BaseSpinner },
  props: {
    value: { type: String, default: '' },
    lang: {
      type: String,
      default: 'html',
      validator: (v) => ['html', 'css', 'js', 'javascript'].includes(v),
    },
    readOnly: { type: Boolean, default: false },
  },
  data() {
    return { loadingEditor: true };
  },
  watch: {
    value(newVal) {
      if (!this.view) return;
      const current = this.view.state.doc.toString();
      if (newVal !== current) {
        this.view.dispatch({
          changes: { from: 0, to: current.length, insert: newVal || '' },
        });
      }
    },
    lang() {
      // 언어 변경 시 에디터 재구성
      this.recreate();
    },
    readOnly() {
      this.recreate();
    },
  },
  mounted() {
    this.createView();
  },
  beforeDestroy() {
    this.destroyView();
  },
  methods: {
    async createView() {
      this.loadingEditor = true;
      // CodeMirror 를 지연 로딩해 초기 번들에서 분리 (코드 스플리팅)
      const cm =
        this.cm ||
        (this.cm = await import('./codemirror-setup.js'));
      // 비동기 로드 중 컴포넌트가 사라졌으면 중단
      if (this._isDestroyed || this._isBeingDestroyed || !this.$refs.host) return;
      const state = cm.EditorState.create({
        doc: this.value || '',
        extensions: cm.buildExtensions({
          lang: this.lang,
          readOnly: this.readOnly,
          onChange: (val) => this.$emit('input', val),
        }),
      });
      // 비반응 인스턴스 필드로 보관 (Vue reactivity 로 감싸지 않음)
      this.view = new cm.EditorView({ state, parent: this.$refs.host });
      this.loadingEditor = false;
    },
    destroyView() {
      if (this.view) {
        this.view.destroy();
        this.view = null;
      }
    },
    recreate() {
      this.destroyView();
      this.$nextTick(() => this.createView());
    },
    /** 외부에서 포커스 주기 */
    focus() {
      if (this.view) this.view.focus();
    },
  },
};
</script>

<style module>
.wrap {
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-raised);
}
.loading {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}
.host {
  max-height: 420px;
  overflow: auto;
}
.host :global(.cm-editor) {
  min-height: 160px;
}
</style>
