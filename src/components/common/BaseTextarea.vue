<template>
  <div class="field">
    <label v-if="label" class="field-label" :for="inputId">{{ label }}</label>
    <textarea
      :id="inputId"
      class="field-ctrl textarea-ctrl"
      :class="{ mono: mono, 'is-error': error }"
      :value="value"
      :rows="rows"
      :placeholder="placeholder"
      :spellcheck="mono ? 'false' : 'true'"
      v-bind="$attrs"
      @input="$emit('input', $event.target.value)"
    />
    <p v-if="error" class="field-error">{{ error }}</p>
    <p v-else-if="hint" class="field-hint">{{ hint }}</p>
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

<!-- field / field-label / field-ctrl / field-hint / field-error 는 styles/common.css -->
<style scoped>
.textarea-ctrl {
  height: auto;
  padding: var(--space-3);
  resize: vertical;
  line-height: var(--line-height-normal);
}
.textarea-ctrl.mono {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  tab-size: 2;
}
</style>
