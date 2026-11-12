<template>
  <BaseModal :open="open" :title="title" size="sm" @close="$emit('cancel')">
    <p class="confirm-txt">{{ message }}</p>
    <slot />
    <template #footer>
      <BaseButton variant="secondary" @click="$emit('cancel')">
        {{ cancelText }}
      </BaseButton>
      <BaseButton :variant="danger ? 'danger' : 'primary'" @click="$emit('confirm')">
        {{ confirmText }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script>
import BaseModal from './BaseModal.vue';
import BaseButton from './BaseButton.vue';

export default {
  name: 'ConfirmDialog',
  components: { BaseModal, BaseButton },
  props: {
    open: { type: Boolean, default: false },
    title: { type: String, default: '확인' },
    message: { type: String, default: '' },
    confirmText: { type: String, default: '확인' },
    cancelText: { type: String, default: '취소' },
    danger: { type: Boolean, default: false },
  },
};
</script>

<style scoped>
.confirm-txt {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}
</style>
