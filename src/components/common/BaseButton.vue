<template>
  <button
    :type="type"
    :class="[
      $style.button,
      $style[variant],
      $style[size],
      fullWidth && $style.fullWidth,
      iconOnly && $style.iconOnly,
    ]"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="left" />
    <slot />
    <slot name="right" />
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  inheritAttrs: false,
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (v) => ['primary', 'secondary', 'ghost', 'danger'].includes(v),
    },
    size: {
      type: String,
      default: 'md',
      validator: (v) => ['sm', 'md', 'lg'].includes(v),
    },
    type: { type: String, default: 'button' },
    fullWidth: { type: Boolean, default: false },
    iconOnly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
};
</script>

<style module>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--transition-fast), border-color var(--transition-fast),
    color var(--transition-fast), box-shadow var(--transition-fast);
  user-select: none;
}
.button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.sm {
  height: 32px;
  padding: 0 var(--space-3);
  font-size: var(--font-size-sm);
}
.md {
  height: 38px;
  padding: 0 var(--space-4);
  font-size: var(--font-size-md);
}
.lg {
  height: 44px;
  padding: 0 var(--space-5);
  font-size: var(--font-size-lg);
}

.iconOnly.sm {
  width: 32px;
  padding: 0;
}
.iconOnly.md {
  width: 38px;
  padding: 0;
}
.iconOnly.lg {
  width: 44px;
  padding: 0;
}

.primary {
  background: var(--gradient-brand);
  color: var(--text-inverse);
  box-shadow: var(--shadow-brand);
}
.primary:hover:not(:disabled) {
  filter: brightness(1.06);
  box-shadow: 0 10px 24px -6px rgba(244, 63, 94, 0.55);
}
.primary:active:not(:disabled) {
  transform: translateY(1px);
}

.secondary {
  background: var(--surface-raised);
  color: var(--text-primary);
  border-color: var(--border-default);
}
.secondary:hover:not(:disabled) {
  background: var(--surface-sunken);
}

.ghost {
  background: transparent;
  color: var(--text-secondary);
}
.ghost:hover:not(:disabled) {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.danger {
  background: var(--color-danger);
  color: var(--text-inverse);
}
.danger:hover:not(:disabled) {
  background: #b91c1c;
}

.fullWidth {
  width: 100%;
}
</style>
