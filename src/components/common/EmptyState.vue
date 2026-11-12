<template>
  <div class="empty" role="status">
    <div class="empty-i">
      <slot name="icon">
        <BaseIcon name="inbox" :size="28" />
      </slot>
    </div>
    <h3 class="empty-ttl">{{ title }}</h3>
    <p v-if="description" class="empty-desc">{{ description }}</p>
    <div v-if="$slots.action" class="empty-act">
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

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-16) var(--space-6);
  text-align: center;
}
.empty-i {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--surface-sunken);
  color: var(--text-muted);
}
.empty-ttl {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}
.empty-desc {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  max-width: 420px;
}
.empty-act {
  margin-top: var(--space-2);
}
</style>
