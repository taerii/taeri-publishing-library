<template>
  <div class="field">
    <label v-if="label" class="field-label" :for="inputId">{{ label }}</label>
    <div class="input-wrap">
      <span v-if="$slots.left" class="input-i"><slot name="left" /></span>
      <input
        :id="inputId"
        class="field-ctrl"
        :class="{ 'has-i': $slots.left, 'is-error': error }"
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
    <p v-if="error" :id="inputId + '-error'" class="field-error">{{ error }}</p>
    <p v-else-if="hint" :id="inputId + '-hint'" class="field-hint">{{ hint }}</p>
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

<!-- field / field-label / field-ctrl / field-hint / field-error 는 styles/common.css -->
<style scoped>
.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-i {
  position: absolute;
  left: var(--space-3);
  display: inline-flex;
  color: var(--text-muted);
  pointer-events: none;
}
.field-ctrl.has-i {
  padding-left: calc(var(--space-3) * 2 + 16px);
}
</style>
