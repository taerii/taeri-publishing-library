<template>
  <div v-if="toasts.length" :class="$style.host" aria-live="polite">
    <div
      v-for="t in toasts"
      :key="t.id"
      :class="[$style.toast, $style[t.variant]]"
      role="alert"
    >
      <BaseIcon :name="iconName(t.variant)" :size="18" :class="$style.icon" />
      <span :class="$style.message">{{ t.message }}</span>
      <button
        type="button"
        :class="$style.close"
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

<style module>
.host {
  position: fixed;
  bottom: var(--space-6);
  right: var(--space-6);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-width: 360px;
}
.toast {
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
.icon {
  flex-shrink: 0;
}
.message {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}
.close {
  flex-shrink: 0;
  display: inline-flex;
  padding: 2px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}
.close:hover {
  color: var(--text-primary);
  background: var(--surface-sunken);
}
.success {
  border-left-color: var(--color-success);
}
.success .icon {
  color: var(--color-success);
}
.error {
  border-left-color: var(--color-danger);
}
.error .icon {
  color: var(--color-danger);
}
.info {
  border-left-color: var(--color-info);
}
.info .icon {
  color: var(--color-info);
}
.warning {
  border-left-color: var(--color-warning);
}
.warning .icon {
  color: var(--color-warning);
}
</style>
