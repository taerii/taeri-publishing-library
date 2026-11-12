<template>
  <span class="tag" :class="['tag-' + variant, 'tag-' + size]">
    <slot />
  </span>
</template>

<script>
/** 스타일은 styles/common.css 의 .tag 계열 (tag / tag-brand / tag-sm ...) */
export default {
  name: 'BaseTag',
  props: {
    variant: {
      type: String,
      default: 'default',
      validator: (v) =>
        ['default', 'brand', 'success', 'warning', 'danger', 'info'].includes(v),
    },
    size: {
      type: String,
      default: 'sm',
      validator: (v) => ['sm', 'md'].includes(v),
    },
  },
};
</script>
