<template>
  <div class="page-head">
    <div class="page-info">
      <h1 class="page-ttl">{{ title }}</h1>
      <p v-if="description" class="page-desc">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="page-act">
      <slot name="actions" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
};
</script>

<style scoped>
.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.page-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.page-ttl {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
}
.page-desc {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}
.page-act {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
</style>
