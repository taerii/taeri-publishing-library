<template>
  <div class="field">
    <label v-if="label" class="field-label" :for="inputId">{{ label }}</label>
    <div class="select-wrap">
      <select
        :id="inputId"
        class="field-ctrl select-ctrl"
        :class="{ 'is-error': error }"
        :value="value"
        v-bind="$attrs"
        @change="$emit('input', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option v-for="opt in normalizedOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <BaseIcon name="code" :size="14" class="select-i" />
    </div>
    <p v-if="error" class="field-error">{{ error }}</p>
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

<!-- field / field-label / field-ctrl / field-error 는 styles/common.css -->
<style scoped>
.select-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.select-ctrl {
  padding: 0 var(--space-6) 0 var(--space-3);
  appearance: none;
  cursor: pointer;
}
.select-i {
  position: absolute;
  right: var(--space-3);
  color: var(--text-muted);
  pointer-events: none;
  transform: rotate(90deg);
}
</style>
