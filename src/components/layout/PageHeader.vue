<template>
  <div :class="$style.header">
    <div :class="$style.titles">
      <h1 :class="$style.title">{{ title }}</h1>
      <p v-if="description" :class="$style.description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" :class="$style.actions">
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

<style module>
.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
  flex-wrap: wrap;
}
.titles {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.01em;
}
.description {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}
.actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
}
</style>
