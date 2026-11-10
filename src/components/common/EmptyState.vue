<template>
  <div :class="$style.wrap" role="status">
    <div :class="$style.icon">
      <slot name="icon">
        <BaseIcon name="inbox" :size="28" />
      </slot>
    </div>
    <h3 :class="$style.title">{{ title }}</h3>
    <p v-if="description" :class="$style.description">{{ description }}</p>
    <div v-if="$slots.action" :class="$style.action">
      <slot name="action" />
    </div>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue';

export default {
  name: 'EmptyState',
  components: { BaseIcon },
  props: {
    title: { type: String, required: true },
    description: { type: String, default: '' },
  },
};
</script>

<style module>
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-16) var(--space-6);
  text-align: center;
}
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--surface-sunken);
  color: var(--text-muted);
}
.title {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}
.description {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  max-width: 420px;
}
.action {
  margin-top: var(--space-2);
}
</style>
