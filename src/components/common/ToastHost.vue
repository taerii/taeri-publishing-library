<template>
  <div v-if="toasts.length" class="toast" aria-live="polite">
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast-box"
      :class="t.variant"
      role="alert"
    >
      <BaseIcon :name="iconName(t.variant)" :size="18" class="toast-i" />
      <span class="toast-txt">{{ t.message }}</span>
      <button
        type="button"
        class="toast-btn"
        aria-label="알림 닫기"
        @click="dismiss(t.id)"
      >
        <BaseIcon name="close" :size="15" />
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import BaseIcon from './BaseIcon.vue';

const ICON_BY_VARIANT = {
  success: 'check-circle',
  error: 'alert-circle',
  info: 'info',
  warning: 'alert-triangle',
};

export default {
  name: 'ToastHost',
  components: { BaseIcon },
  data() {
    return { timers: {} };
  },
  computed: {
    ...mapState('ui', ['toasts']),
  },
  watch: {
    toasts: {
      handler(list) {
        list.forEach((t) => {
          if (this.timers[t.id] || t.duration <= 0) return;
          this.timers[t.id] = window.setTimeout(() => {
            this.dismiss(t.id);
          }, t.duration);
        });
      },
      deep: true,
    },
  },
  beforeDestroy() {
    Object.values(this.timers).forEach((id) => window.clearTimeout(id));
  },
  methods: {
    iconName(variant) {
      return ICON_BY_VARIANT[variant] || 'info';
    },
    dismiss(id) {
      if (this.timers[id]) {
        window.clearTimeout(this.timers[id]);
        delete this.timers[id];
      }
      this.$store.dispatch('ui/dismissToast', id);
    },
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 360px;
}
.toast-box {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-left-width: 4px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  animation: slideIn var(--transition-base);
}
@keyframes slideIn {
  from {
    transform: translateX(12px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.toast-i {
  flex-shrink: 0;
}
.toast-txt {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}
.toast-btn {
  flex-shrink: 0;
  display: inline-flex;
  padding: 2px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}
.toast-btn:hover {
  color: var(--text-primary);
  background: var(--surface-sunken);
}
/* 종류별 색 */
.toast-box.success {
  border-left-color: var(--color-success);
}
.toast-box.success .toast-i {
  color: var(--color-success);
}
.toast-box.error {
  border-left-color: var(--color-danger);
}
.toast-box.error .toast-i {
  color: var(--color-danger);
}
.toast-box.info {
  border-left-color: var(--color-info);
}
.toast-box.info .toast-i {
  color: var(--color-info);
}
.toast-box.warning {
  border-left-color: var(--color-warning);
}
.toast-box.warning .toast-i {
  color: var(--color-warning);
}
</style>
