<template>
  <span :class="[$style.tag, $style[variant], $style[size]]">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'BaseTag',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (v) =>
        ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
    },
    size: {
      type: String,
      default: 'sm',
      validator: (v) => ['sm', 'md'].includes(v),
    },
  },
};
</script>

<style module>
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  border-radius: var(--radius-full);
  font-weight: var(--font-weight-medium);
  line-height: 1;
  white-space: nowrap;
}
.sm {
  padding: 4px 8px;
  font-size: var(--font-size-xs);
}
.md {
  padding: 5px 10px;
  font-size: var(--font-size-sm);
}
.default {
  background: var(--surface-sunken);
  color: var(--text-secondary);
}
.brand {
  background: var(--color-brand-50);
  color: var(--color-brand-700);
}
.success {
  background: var(--color-success-bg);
  color: var(--color-success);
}
.warning {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}
.danger {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}
.info {
  background: var(--color-info-bg);
  color: var(--color-info);
}
</style>
