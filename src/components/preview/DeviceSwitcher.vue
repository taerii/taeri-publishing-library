<template>
  <div :class="$style.switcher" role="group" aria-label="미리보기 화면 크기">
    <button
      v-for="d in devices"
      :key="d.value"
      type="button"
      :class="[$style.btn, value === d.value && $style.active]"
      :aria-pressed="String(value === d.value)"
      :title="d.title"
      @click="$emit('input', d.value)"
    >
      {{ d.label }}
    </button>
  </div>
</template>

<script>
/** PC / Tablet / Mobile 전환 토글 (표시 전용, v-model) */
export default {
  name: 'DeviceSwitcher',
  props: {
    value: { type: String, default: 'pc' },
  },
  data() {
    return {
      devices: [
        { value: 'pc', label: 'PC', title: '데스크톱 (100%)' },
        { value: 'tablet', label: 'Tablet', title: '태블릿 (768px)' },
        { value: 'mobile', label: 'Mobile', title: '모바일 (375px)' },
      ],
    };
  },
};
</script>

<style module>
.switcher {
  display: inline-flex;
  padding: 3px;
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
  gap: 2px;
}
.btn {
  padding: var(--space-1) var(--space-3);
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background var(--transition-fast), color var(--transition-fast);
}
.btn:hover {
  color: var(--text-primary);
}
.active {
  background: var(--surface-raised);
  color: var(--text-brand);
  box-shadow: var(--shadow-xs);
}
</style>
