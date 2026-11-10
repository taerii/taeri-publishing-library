<template>
  <div
    :class="[
      $style.card,
      interactive && $style.interactive,
      padded && $style.padded,
    ]"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BaseCard',
  inheritAttrs: false,
  props: {
    interactive: { type: Boolean, default: false },
    padded: { type: Boolean, default: true },
  },
};
</script>

<style module>
.card {
  background: var(--surface-raised);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
}
.padded {
  padding: var(--space-5);
}
.interactive {
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast),
    transform var(--transition-fast);
}
.interactive:hover {
  border-color: var(--color-brand-200);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
}
</style>
