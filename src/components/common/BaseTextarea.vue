<template>
  <div :class="$style.field">
    <label v-if="label" :class="$style.label" :for="inputId">{{ label }}</label>
    <textarea
      :id="inputId"
      :class="[$style.textarea, mono && $style.mono, error && $style.hasError]"
      :value="value"
      :rows="rows"
      :placeholder="placeholder"
      :spellcheck="mono ? 'false' : 'true'"
      v-bind="$attrs"
      @input="$emit('input', $event.target.value)"
    />
    <p v-if="error" :class="$style.error">{{ error }}</p>
    <p v-else-if="hint" :class="$style.hint">{{ hint }}</p>
  </div>
</template>

<script>
let uid = 0;

export default {
  name: 'BaseTextarea',
  inheritAttrs: false,
  props: {
    value: { type: String, default: '' },
    label: { type: String, default: '' },
    hint: { type: String, default: '' },
    error: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    rows: { type: [Number, String], default: 4 },
    mono: { type: Boolean, default: false },
    id: { type: String, default: '' },
  },
  data() {
    uid += 1;
    return { generatedId: `base-textarea-${uid}` };
  },
  computed: {
    inputId() {
      return this.id || this.generatedId;
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
.textarea {
  width: 100%;
  padding: var(--space-3);
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  resize: vertical;
  line-height: var(--line-height-normal);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.textarea::placeholder {
  color: var(--text-muted);
}
.textarea:focus {
  outline: none;
  border-color: var(--color-brand-500);
  box-shadow: var(--focus-ring);
}
.mono {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  tab-size: 2;
}
.hasError {
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
