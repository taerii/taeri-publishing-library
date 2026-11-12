<template>
  <div class="phase-box">
    <span class="phase-badge">{{ phase }}</span>
    <p><slot /></p>
  </div>
</template>

<script>
export default {
  name: 'PhasePlaceholder',
  props: {
    phase: { type: String, default: 'Phase 2 예정' },
  },
};
</script>

<style scoped>
.phase-box {
  padding: var(--space-6);
  background: var(--surface-raised);
  border: 1px dashed var(--border-default);
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-size: var(--font-size-md);
}
.phase-badge {
  display: inline-block;
  margin-bottom: var(--space-2);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}
</style>
