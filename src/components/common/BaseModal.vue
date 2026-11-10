<template>
  <div
    v-if="open"
    :class="$style.overlay"
    @mousedown.self="onOverlay"
  >
    <div
      ref="panel"
      :class="[$style.panel, $style[size]]"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      tabindex="-1"
    >
      <header v-if="title" :class="$style.header">
        <h2 :class="$style.title">{{ title }}</h2>
        <BaseButton variant="ghost" size="sm" icon-only aria-label="닫기" @click="close">
          <BaseIcon name="close" :size="18" />
        </BaseButton>
      </header>
      <div :class="$style.body">
        <slot />
      </div>
      <footer v-if="$slots.footer" :class="$style.footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import BaseIcon from './BaseIcon.vue';

// 열려 있는 모달의 스택(맨 뒤가 가장 위). 겹친 모달에서 맨 위 모달만 키 입력에 반응시킨다.
const openStack = [];
let modalSeq = 0;

export default {
  name: 'BaseModal',
  components: { BaseButton, BaseIcon },
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '' },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v),
    },
    closeOnOverlay: { type: Boolean, default: true },
  },
  created() {
    modalSeq += 1;
    this.modalUid = modalSeq;
  },
  watch: {
    open(v) {
      if (v) {
        if (!openStack.includes(this.modalUid)) openStack.push(this.modalUid);
        document.addEventListener('keydown', this.onKey);
        document.body.style.overflow = 'hidden';
        this.$nextTick(() => {
          if (this.$refs.panel) this.$refs.panel.focus();
        });
      } else {
        this.teardown();
      }
    },
  },
  beforeDestroy() {
    this.teardown();
  },
  methods: {
    onKey(e) {
      // 겹쳐 열린 경우 가장 위에 있는 모달만 처리
      if (openStack[openStack.length - 1] !== this.modalUid) return;
      if (e.key === 'Escape') {
        this.close();
        return;
      }
      if (e.key === 'Tab') this.trapFocus(e);
    },
    trapFocus(e) {
      const panel = this.$refs.panel;
      if (!panel) return;
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    onOverlay() {
      if (this.closeOnOverlay) this.close();
    },
    close() {
      this.$emit('close');
    },
    teardown() {
      document.removeEventListener('keydown', this.onKey);
      const i = openStack.indexOf(this.modalUid);
      if (i !== -1) openStack.splice(i, 1);
      // 아래에 다른 모달이 아직 열려 있으면 배경 스크롤 잠금을 유지
      if (openStack.length === 0) document.body.style.overflow = '';
    },
  },
};
</script>

<style module>
.overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: var(--surface-overlay);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: var(--space-12) var(--space-4);
  overflow-y: auto;
}
.panel {
  width: 100%;
  background: var(--surface-raised);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--space-16));
  animation: pop var(--transition-base);
}
@keyframes pop {
  from {
    transform: translateY(8px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.sm {
  max-width: 420px;
}
.md {
  max-width: 560px;
}
.lg {
  max-width: 760px;
}
.xl {
  max-width: 1040px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--border-subtle);
}
.title {
  font-size: var(--font-size-xl);
}
.body {
  padding: var(--space-6);
  overflow-y: auto;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-subtle);
}
</style>
