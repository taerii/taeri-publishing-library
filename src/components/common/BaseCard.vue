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
  border: none;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}
.padded {
  padding: var(--space-5);
}
.interactive {
  cursor: pointer;
  transition: box-shadow var(--transition-fast), transform var(--transition-fast);
}
.interactive:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
</style>
