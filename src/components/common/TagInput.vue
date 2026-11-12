<template>
  <div class="field">
    <label v-if="label" class="field-label">{{ label }}</label>
    <div class="tagin-box" @click="focusInput">
      <span v-for="(tag, i) in value" :key="tag + i" class="tagin-chip">
        {{ tag }}
        <button
          type="button"
          class="tagin-btn"
          :aria-label="tag + ' 태그 제거'"
          @click.stop="removeTag(i)"
        >
          <BaseIcon name="close" :size="12" />
        </button>
      </span>
      <input
        ref="input"
        v-model="draft"
        class="tagin-input"
        :placeholder="value.length ? '' : placeholder"
        @keydown.enter.prevent="commit"
        @keydown.188.prevent="commit"
        @keydown.delete="onBackspace"
        @blur="commit"
      />
    </div>
    <p class="field-hint">{{ hint }}</p>
  </div>
</template>

<script>
import BaseIcon from './BaseIcon.vue';

export default {
  name: 'TagInput',
  components: { BaseIcon },
  props: {
    value: { type: Array, default: () => [] },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '태그 입력 후 Enter' },
    hint: { type: String, default: 'Enter 또는 쉼표(,)로 태그를 추가합니다.' },
  },
  data() {
    return { draft: '' };
  },
  methods: {
    focusInput() {
      this.$refs.input.focus();
    },
    commit() {
      const raw = this.draft.trim().replace(/,$/, '').trim();
      if (!raw) {
        this.draft = '';
        return;
      }
      if (!this.value.includes(raw)) {
        this.$emit('input', [...this.value, raw]);
      }
      this.draft = '';
    },
    removeTag(index) {
      const next = this.value.slice();
      next.splice(index, 1);
      this.$emit('input', next);
    },
    onBackspace() {
      if (this.draft === '' && this.value.length) {
        this.removeTag(this.value.length - 1);
      }
    },
  },
};
</script>

<!-- field / field-label / field-hint 는 styles/common.css -->
<style scoped>
.tagin-box {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
  min-height: 38px;
  padding: var(--space-1) var(--space-2);
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  cursor: text;
}
.tagin-box:focus-within {
  border-color: var(--color-brand-500);
  box-shadow: var(--focus-ring);
}
.tagin-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 3px 6px 3px 10px;
  background: var(--color-brand-50);
  color: var(--color-brand-700);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}
.tagin-btn {
  display: inline-flex;
  align-items: center;
  border: none;
  background: transparent;
  color: var(--color-brand-600);
  cursor: pointer;
  padding: 0;
}
.tagin-btn:hover {
  color: var(--color-brand-800);
}
.tagin-input {
  flex: 1;
  min-width: 120px;
  height: 28px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-primary);
}
</style>
