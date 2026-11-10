<template>
  <div :class="$style.field">
    <label v-if="label" :class="$style.label" :for="inputId">{{ label }}</label>
    <div :class="$style.wrap">
      <select
        :id="inputId"
        :class="[$style.select, error && $style.hasError]"
        :value="value"
        v-bind="$attrs"
        @change="$emit('input', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <BaseIcon name="code" :size="14" :class="$style.caret" />
    </div>
    <p v-if="error" :class="$style.error">{{ error }}</p>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue';

let uid = 0;

export default {
  name: 'BaseSelect',
  components: { BaseIcon },
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    error: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    /** [{value,label}] 또는 ['a','b'] */
    options: { type: Array, default: () => [] },
    id: { type: String, default: '' },
  },
  data() {
    uid += 1;
    return { generatedId: `base-select-${uid}` };
  },
  computed: {
    inputId() {
      return this.id || this.generatedId;
    },
    normalizedOptions() {
      return this.options.map((o) =>
        typeof o === 'object' ? o : { value: o, label: o }
      );
    },
  },
};
</script>

<style module>
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
}
.wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.select {
  width: 100%;
  height: 38px;
  padding: 0 var(--space-6) 0 var(--space-3);
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  appearance: none;
  cursor: pointer;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.select:focus {
  outline: none;
  border-color: var(--color-brand-500);
  box-shadow: var(--focus-ring);
}
.hasError {
  border-color: var(--color-danger);
}
.caret {
  position: absolute;
  right: var(--space-3);
  color: var(--text-muted);
  pointer-events: none;
  transform: rotate(90deg);
}
.error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}
</style>
