<template>
  <div :class="$style.field">
    <label v-if="label" :class="$style.label" :for="inputId">{{ label }}</label>
    <div :class="[$style.wrap, error && $style.hasError]">
      <span v-if="$slots.left" :class="$style.leftIcon"><slot name="left" /></span>
      <input
        :id="inputId"
        :class="[$style.input, $slots.left && $style.withLeftIcon]"
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="describedBy"
        v-bind="$attrs"
        @input="$emit('input', $event.target.value)"
        v-on="listenersWithoutInput"
      />
    </div>
    <p v-if="error" :id="inputId + '-error'" :class="$style.error">{{ error }}</p>
    <p v-else-if="hint" :id="inputId + '-hint'" :class="$style.hint">{{ hint }}</p>
  </div>
</template>

<script>
let uid = 0;

export default {
  name: 'BaseInput',
  inheritAttrs: false,
  props: {
    value: { type: [String, Number], default: '' },
    label: { type: String, default: '' },
    hint: { type: String, default: '' },
    error: { type: String, default: '' },
    type: { type: String, default: 'text' },
    placeholder: { type: String, default: '' },
    id: { type: String, default: '' },
  },
  data() {
    uid += 1;
    return { generatedId: `base-input-${uid}` };
  },
  computed: {
    inputId() {
      return this.id || this.generatedId;
    },
    describedBy() {
      if (this.error) return `${this.inputId}-error`;
      if (this.hint) return `${this.inputId}-hint`;
      return undefined;
    },
    listenersWithoutInput() {
      const { input, ...rest } = this.$listeners;
      return rest;
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
.leftIcon {
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  color: var(--text-muted);
  pointer-events: none;
}
.input {
  width: 100%;
  height: 38px;
  padding: 0 var(--space-3);
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.withLeftIcon {
  padding-left: calc(var(--space-3) * 2 + 16px);
}
.input::placeholder {
  color: var(--text-muted);
}
.input:focus {
  outline: none;
  border-color: var(--color-brand-500);
  box-shadow: var(--focus-ring);
}
.hasError .input {
  border-color: var(--color-danger);
}
.hint {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}
.error {
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}
</style>
