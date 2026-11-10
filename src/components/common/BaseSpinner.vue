<template>
  <span
    :class="$style.spinner"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="status"
    :aria-label="label"
  />
</template>

<script>
export default {
  name: 'BaseSpinner',
  props: {
    size: { type: [Number, String], default: 20 },
    label: { type: String, default: '로딩 중' },
  },
};
</script>

<style module>
.spinner {
  display: inline-block;
  border: 2px solid var(--color-neutral-200);
  border-top-color: var(--color-brand-500);
  border-radius: var(--radius-full);
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
